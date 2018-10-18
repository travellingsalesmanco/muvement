import { createSelector } from 'reselect';
import { calculateStageDimensions, generateGrid, relativeToAbsolutePoint } from "../lib/stageUtils";

// Simple retrieval selectors (no transformations), no need to memoize
const getCanvasWidthFromProp = (_, props) => props.width;
const getCanvasHeightFromProp = (_, props) => props.height;
const getStageRectFromProp = (_, props) => props.stageRect;

const getStageDim = (state, props) => state.dances[props.danceId].stageDim;
const getDancers = (state, props) => state.dances[props.danceId].dancers;
const getFrameDancers = (state, props) => state.dances[props.danceId].frames[props.frameId].dancers;
const getSelectedDancers = (state, props) => state.UI.selectedDancers;


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