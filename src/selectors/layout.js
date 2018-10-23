import { createSelector } from 'reselect';
import { calculateStageDimensions, generateGrid, relativeToAbsolutePoint, straightLineAnimation, stationaryAnimation } from "../lib/stageUtils";
import { getFormations } from './choreo';

// Simple retrieval selectors (no transformations), no need to memoize
const getCanvasWidthFromProp = (_, props) => props.width;
const getCanvasHeightFromProp = (_, props) => props.height;
const getStageRectFromProp = (_, props) => props.stageRect;

const getStageDim = (state, props) => state.choreos.byId[props.choreoId].stageDim;
const getDancers = (state, props) => state.choreos.byId[props.choreoId].dancers;
const getFormationDancers = (state, props) => state.choreos.byId[props.choreoId].formations[props.formationId].dancers;
const getSelectedDancers = (state, props) => state.UI.selectedDancers;
const getActiveFormationIdx = (state) => state.UI.activeFormation;
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
    [getDancers, getFormationDancers, getSelectedDancers, getStageRectFromProp],
    (dancers, formationDancers, selectedDancers, stageRect) => formationDancers.map(
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
  [getFormations],
  (formations) => {
    let timeline = {
      totalDuration: 0,
      cumDurations: [],
    }
    formations.forEach((formation) => {
      // Duration calculations
      timeline.totalDuration += formation.transitionBefore.duration + formation.numSeconds * 1000;
      timeline.cumDurations.push(timeline.totalDuration);
    });
    return timeline;
  }
)

export const getAnimatedLayout = createSelector(
  [getFormations, getDancers, getSelectedDancers, getStageRectFromProp],
  (formations, allDancers, selectedDancers, stageRect) => {
    // Choreo layout -- array of formation layouts
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
            // NOTE: straightLineAnimation returns the bounded pos if duration is out of bounds, so we can
            // use this for when the transition has finished and the frame is playing also
            position: straightLineAnimation(prevLayout.endPos, pos, formation.transitionBefore.duration)
          }
        } else {
          // Dancer was not in prev formation, make it appear and stay stationary for whole duration
          return {
            ...dancer,
            position: stationaryAnimation(pos),
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
    console.log(layout);
    return layout;
  }
)

export const getFormationRelativeElapsedTime = (state, props) => {
  const currFormationIdx = getActiveFormationIdx(state);
  if (currFormationIdx === 0) {
    return getElapsedTime(state);
  } else {
    return getElapsedTime(state) - getTimeline(state, props).cumDurations[currFormationIdx - 1];
  }
}