import { createSelector } from 'reselect';
import { calculateStageDimensions, generateGrid, relativeToAbsolutePoint, straightLineAnimation, stationaryAnimation } from "../lib/stageUtils";
import { getFormations, getDurationFromFormation } from './choreo';

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

/**
 * Constructs the timeline of the choreo given the set of formations.
 * Returns an object containing:
 *  (1) the total duration of the choreo (sum of all transition and formation durations, in ms)
 *  (2) an array of the cumulative duration of the transitions and formations, at each formation, in ms
 *      i.e. cumDuration[i] contains the array pair [duration from 0 to start of formation i, duration from 0 to end of formation i]
 */
export const getTimeline = createSelector(
  [getFormations],
  (formations) => {
    let timeline = {
      totalDuration: 0,
      cumDurations: [],
    }
    formations.forEach((formation, idx) => {
      // Limit always have transition
      const transitionDur = idx === 0 ? 0 : getDurationFromFormation(formation)
      timeline.totalDuration += transitionDur + formation.duration;
      timeline.cumDurations.push([timeline.totalDuration - formation.duration, timeline.totalDuration]);
    });
    return timeline;
  }
)

/**
 * Layout the timeline for display
 */
export const getTimelineLayout = createSelector(
  [getTimeline],
  (timeline) => {

  }
)

export const getAnimatedLayout = createSelector(
  [getTimeline, getFormations, getDancers, getSelectedDancers, getStageRectFromProp],
  (timeline, formations, allDancers, selectedDancers, stageRect) => {
    let nameToLayout = {};
    let layout = [];
    // Set metadata
    allDancers.forEach((name, idx) => {
      let dancerLayout = {
        name: name,
        id: idx + 1,
        selected: selectedDancers.includes(name),
        visible: () => false,
        position: () => { return { x: 0, y: 0 } }
      }
      layout.push(dancerLayout)
      nameToLayout[name] = dancerLayout
    })

    let savedTransitionStart = 0;
    let nameToPrevFormationPos = {};
    formations.forEach((formation, idx) => {
      // Copy the variable, otherwise the functions will capture references to it an update when it updates
      const transitionStart = savedTransitionStart;
      const nameToPos = {};
      const [formationStart, formationEnd] = timeline.cumDurations[idx];
      formation.dancers.forEach((dancer) => {
        const pos = relativeToAbsolutePoint(dancer.position, stageRect)
        nameToPos[dancer.name] = pos
        let dancerLayout = nameToLayout[dancer.name]
        // Get existing visibility and position functions
        const { visible: prevVisible, position: prevPosition } = dancerLayout;
        dancerLayout.visible = t => t >= transitionStart && t <= formationEnd ? true : prevVisible(t)
        if (idx !== 0 && transitionStart < formationStart && nameToPrevFormationPos[dancer.name]) {
          // Show animation and frame
          const anim = straightLineAnimation(nameToPrevFormationPos[dancer.name], pos, getDurationFromFormation(formation))
          dancerLayout.position = t => {
            if (t >= transitionStart && t <= formationStart) {
              return anim(t - transitionStart)
            } else if (t >= formationStart && t <= formationEnd) {
              return pos
            } else {
              return prevPosition(t)
            } 
          }
        } else if (transitionStart < formationStart) {
          // Squash trivial animations into frame, show frame
          dancerLayout.position = t => t >= transitionStart && t <= formationEnd ? pos : prevPosition(t)
        } else {
          // Show frame only
          dancerLayout.position = t => t >= formationStart && t <= formationEnd ? pos : prevPosition(t)
        }
      })
      nameToPrevFormationPos = nameToPos;
      savedTransitionStart = formationEnd;
    })
    return layout;
  }
)

export const getFormationRelativeElapsedTime = (state, props) => {
  const currFormationIdx = getActiveFormationIdx(state);
  if (currFormationIdx === 0) {
    return getElapsedTime(state);
  } else {
    return getElapsedTime(state) - getTimeline(state, props).cumDurations[currFormationIdx - 1][1]; // idx 1 to get end of prev formation
  }
}