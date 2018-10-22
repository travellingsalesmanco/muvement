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
  [getFrames],
  (frames) => {
    let timeline = {
      totalDuration: 0,
      cumDurations: [],
    }
    frames.forEach((frame) => {
      // Duration calculations
      timeline.totalDuration += frame.transitionBefore.duration + frame.numSeconds * 1000;
      timeline.cumDurations.push(timeline.totalDuration);
    });
    return timeline;
  }
)

export const getAnimatedLayout = createSelector(
  [getFrames, getDancers, getSelectedDancers, getStageRectFromProp],
  (formations, allDancers, selectedDancers, stageRect) => {
    // Dance layout -- array of formation layouts
    let layout = [];
    // Single formation layout -- array of dancer layouts
    let prevFormationLayout = [];
    // Map of dancer name to their respective layout in the previous formation
    let nameToPrevDancerLayout = {};
    formations.forEach((formation) => {
      prevFormationLayout = formation.dancers.map((dancer) => {
        const pos = relativeToAbsolutePoint(dancer.position, stageRect);
        if (nameToPrevDancerLayout[dancer.name]) {
          const prevLayout = nameToPrevDancerLayout[dancer.name];
          return {
            ...prevLayout,
            position: straightLineAnimation(prevLayout.endPos, pos)
          }
        } else {
          // Dancer was not in prev frame, make it appear and stay stationary for whole duration
          return {
            ...dancer,
            position: straightLineAnimation(pos, pos),
            id: allDancers.indexOf(dancer.name) + 1,
            selected: selectedDancers.includes(dancer.name)
          }
        }
      });
      // Save the name-to-layout mapping to avoid O(n) search every time 
      nameToPrevDancerLayout = {};
      prevFormationLayout.forEach((dancerLayout) => {
        nameToPrevDancerLayout[dancerLayout.name] = dancerLayout;
      })
      layout.push(prevFormationLayout);
    });
    return layout;
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