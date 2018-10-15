import { createSelector } from 'reselect';
import { calculateStageDimensions, generateGrid } from "../components/stageUtils";

// Simple retrieval selectors (no transformations), no need to memoize
const getCanvasWidthFromProp = (_, props) => props.width;
const getCanvasHeightFromProp = (_, props) => props.height;
const getStageDim = (state, props) => state.dances[props.danceId].stageDim;
const getDancers = (state, props) => state.dances[props.danceId].dancers;
const getFrameDancers = (state, props) => state.dances[props.danceId].frames[props.frameId].dancers;

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

export const makeDancerLayoutSelector = () => {
  return createSelector(
    [getDancers, getFrameDancers],
    (dancers, frameDancers) => frameDancers.map(
      (dancer) => {
        return {
          ...dancer,
          id: dancers.indexOf(dancer.name) + 1
        }
      }
    )
  )
}