import {createSelector} from 'reselect'
import {calculateStageDimensions, generateGrid} from "../components/stageUtils";

// Simple retrieval selectors (no transformations), no need to memoize
const getCanvasWidthFromProp = (_, props) => props.width;
const getCanvasHeightFromProp = (_, props) => props.height;
const getStageDim = (state, props) => state.dances[props.danceId].stageDim;

export const makeStageHeightSelector = () => createSelector(getStageDim, ({height}) => height);
export const makeStageWidthSelector = () => createSelector(getStageDim, ({width}) => width);
export const makeStageGridSizeSelector = () => createSelector(getStageDim, ({gridSize}) => gridSize);

export const makeStageLayoutSelector = () => {
  const getStageWidth = makeStageWidthSelector();
  const getStageHeight = makeStageHeightSelector();
  return createSelector(
    [getCanvasWidthFromProp, getCanvasHeightFromProp, getStageWidth, getStageHeight],
    (canvasWidth, canvasHeight, stageWidth, stageHeight) => {
      return calculateStageDimensions(canvasWidth, canvasHeight, stageWidth, stageHeight, 0.05);
    }
  )
};

export const makeGridLayoutSelector = () => {
  const getGridSize = makeStageGridSizeSelector();
  return createSelector(
    [getCanvasWidthFromProp, getCanvasHeightFromProp, getGridSize],
    (canvasWidth, canvasHeight, gridSize) => {
      return generateGrid(canvasWidth, canvasHeight, gridSize * canvasWidth);
    }
  )
};