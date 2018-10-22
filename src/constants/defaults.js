export const defaultTransition = {
  duration: 0,
  midPoint: 0
}
export const defaultFrame = {
  name: "",
  numSeconds: 30,
  transitionBefore: defaultTransition,
  dancers: []
};
export const defaultStageDim = {
  width: 9.6,
  height: 5.18,
  gridSize: 0.5,
  units: 'm'
};
export const defaultUI = {
  isPlaying: false,
  animated: false,
  elapsedTime: 0,
  activeFrame: 0,
  showLabels: true,
  selectedDancers: []
};