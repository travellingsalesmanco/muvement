/**
 * Utility functions for processing positions, dimensions, grid and canvas related stuff
 */

/**
 * Returns the position of the stage w.r.t the canvas after scaling and centering
 * @param canvasWidth Full canvas width
 * @param canvasHeight Full canvas height
 * @param stageWidth User-defined stage width
 * @param stageHeight User-defined stage height
 * @param padding The (percentage) amount to padding to add to the stage (w.r.t. the canvas)
 */
export function calculateStageDimensions(canvasWidth, canvasHeight, stageWidth, stageHeight, padding) {
  const paddedScale = 1 - 2 * padding; // The scaling to apply on a dimension to achieve padding
  // Aspect ratios
  let canvasAspect = canvasWidth / canvasHeight;
  let stageAspect = stageWidth / stageHeight;

  let scaledStageWidth = canvasWidth * paddedScale;
  let scaledStageHeight = canvasHeight * paddedScale;
  if (canvasAspect > stageAspect) {
    // Canvas is "wider" than stage, so scale stage to canvas height and adjust width accordingly
    scaledStageWidth = stageWidth * (canvasHeight * paddedScale) / stageHeight;
  } else {
    // Stage is "wider" than canvas, so scale stage to canvas width and adjust height accordingly
    scaledStageHeight = stageHeight * (canvasWidth * paddedScale) / stageWidth;
  }
  return {
    width: scaledStageWidth,
    height: scaledStageHeight,
    // Top left corner coordinates
    tl: {
      // Center the stage on the canvas
      x: (canvasWidth - scaledStageWidth) / 2,
      y: (canvasHeight - scaledStageHeight) / 2,
    }
  }
}

/**
 *
 * @param canvasWidth
 * @param canvasHeight
 * @param gridSize grid interval in absolute (canvas) units
 * @returns {Array} of line coordinates
 */
export function generateGrid(canvasWidth, canvasHeight, gridSize) {
  let lines = [];
  let centerX = canvasWidth / 2;
  let centerY = canvasHeight / 2;
  // Draw center lines
  lines.push([centerX, 0, centerX, canvasHeight]);
  lines.push([0, centerY, canvasWidth, centerY]);
  // Draw vertical lines, expanding from center
  for (let i = gridSize; i < centerX; i += gridSize) {
    let xLeft = centerX - i;
    let xRight = centerX + i;
    lines.push([xLeft, 0, xLeft, canvasHeight]);
    lines.push([xRight, 0, xRight, canvasHeight]);

  }
  // Draw horizontal lines, expanding from center
  for (let i = gridSize; i < centerY; i += gridSize) {
    let yLeft = centerY - i;
    let yRight = centerY + i;
    lines.push([0, yRight, canvasWidth, yRight]);
    lines.push([0, yLeft, canvasWidth, yLeft]);
  }
  return lines;
}

export function snapToGrid(x, y, canvasWidth, canvasHeight, gridSize) {
  let centerX = canvasWidth / 2;
  let centerY = canvasHeight / 2;
  let gridLineX = Math.round((x - centerX) / gridSize);
  let gridLineY = Math.round((y - centerY) / gridSize);
  return {x: gridLineX * gridSize + centerX, y: gridLineY * gridSize + centerY}
}