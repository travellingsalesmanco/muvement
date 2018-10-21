import { createSelector } from 'reselect';
import { calculateStageDimensions, generateGrid, relativeToAbsolutePoint, straightLineAnimation } from "../lib/stageUtils";
import { getFrames } from './dance';

// Simple retrieval selectors (no transformations), no need to memoize
const getCanvasWidthFromProp = (_, props) => props.width;
const getCanvasHeightFromProp = (_, props) => props.height;
const getStageRectFromProp = (_, props) => props.stageRect;

const getStageDim = (state, props) => state.dances.byId[props.danceId].stageDim;
const getDancers = (state, props) => state.dances.byId[props.danceId].dancers;
const getFrameDancers = (state, props) => state.dances.byId[props.danceId].frames[props.frameId].dancers;
const getSelectedDancers = (state, props) => state.UI.selectedDancers;
const getActiveFrameIdx = (state) => state.UI.activeFrame;
const getElapsedTime = (state) => state.UI.elapsedTime;


export const makeStageLayoutSelector = () => {
  return createSelector(
    [getCanvasWidthFromProp, getCanvasHeightFromProp, getStageDim],
    (canvasWidth, canvasHeight, { width: stageWidth, height: stageHeight, gridSize }) => {
      const stageRect = calculateStageDimensions(canvasWidth, canvasHeight, stageWidth, stageHeight, 0.05);
      return {
        stageRect: stageRect,
        grid: generateGrid(canvasWidth, canvasHeight, gridSize * (stageRect.width / stageWidth)),
      }
    }
  )
};

export const makeDancersLayoutSelector = () => {
  return createSelector(
    [getDancers, getFrameDancers, getSelectedDancers, getStageRectFromProp],
    (dancers, frameDancers, selectedDancers, stageRect) => frameDancers.map(
      (dancer) => {
        return {
          ...dancer,
          position: relativeToAbsolutePoint(dancer.position, stageRect),
          id: dancers.indexOf(dancer.name) + 1,
          selected: selectedDancers.includes(dancer.name)
        }
      }
    )
  )
}

export const getTimeline = createSelector(
  [getFrames, getDancers, getSelectedDancers, getStageRectFromProp],
  (frames, allDancers, selectedDancers, stageRect) => {
    let timeline = {
      totalDuration: 0,
      cumDurations: [],
      layouts: []
    }
    let prevDancerLayouts = [];
    let dancerNameToPrevLayout = {};
    frames.forEach((frame) => {
      // Duration calculations
      timeline.totalDuration += frame.transitionBefore.duration + frame.numSeconds * 1000;
      timeline.cumDurations.push(timeline.totalDuration);
      // Layout calculations
      prevDancerLayouts = frame.dancers.map((dancer) => {
        const pos = relativeToAbsolutePoint(dancer.position, stageRect);
        if (dancerNameToPrevLayout[dancer.name]) {
          const prevLayout = dancerNameToPrevLayout[dancer.name];
          return {
            ...prevLayout,
            position: straightLineAnimation(prevLayout.endPos, pos)
          }
        } else {
          // Dancer is not in prev frame, will just appear and stay stationary for whole duration
          return {
            ...dancer,
            position: straightLineAnimation(pos, pos),
            id: allDancers.indexOf(dancer.name) + 1,
            selected: selectedDancers.includes(dancer.name)
          }
        }
      });
      dancerNameToPrevLayout = {};
      prevDancerLayouts.forEach((dancerLayout) => {
        dancerNameToPrevLayout[dancerLayout.name] = dancerLayout;
      })
      timeline.layouts.push(prevDancerLayouts);
    });
    return timeline;
  }
)

export const getFrameRelativeElapsedTime = (state, props) => {
  const currFrameIdx = getActiveFrameIdx(state);
  if (currFrameIdx === 0) {
    return getElapsedTime(state);
  } else {
    return getElapsedTime(state) - getTimeline(state, props).cumDurations[currFrameIdx - 1];
  }
}