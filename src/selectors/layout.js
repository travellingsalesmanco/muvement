import { createSelector } from 'reselect';
import { calculateStageDimensions, generateGrid } from "../components/stageUtils";

// Simple retrieval selectors (no transformations), no need to memoize
const getCanvasWidthFromProp = (_, props) => props.width;
const getCanvasHeightFromProp = (_, props) => props.height;
const getStageDim = (state, props) => state.dances[props.danceId].stageDim;
const getStageHeight = (state, props) => getStageDim(state, props).height;
const getStageWidth = (state, props) => getStageDim(state, props).width;
const getGridSize = (state, props) => getStageDim(state, props).gridSize;


export const makeStageLayoutSelector = () => {
  return createSelector(
    [getCanvasWidthFromProp, getCanvasHeightFromProp, getStageWidth, getStageHeight],
    (canvasWidth, canvasHeight, stageWidth, stageHeight) => {
      return calculateStageDimensions(canvasWidth, canvasHeight, stageWidth, stageHeight, 0.05);
    }
  )
};

export const makeGridLayoutSelector = () => {
  return createSelector(
    [getCanvasWidthFromProp, getCanvasHeightFromProp, getGridSize],
    (canvasWidth, canvasHeight, gridSize) => {
      return generateGrid(canvasWidth, canvasHeight, gridSize * canvasWidth);
    }
  )
};