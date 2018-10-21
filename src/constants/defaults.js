export const defaultTransition = {
  durationBeforeFrame: 0,
  durationAfterFrame: 0,
}
export const defaultFrame = {
  name: "",
  numSeconds: 30,
  transition: defaultTransition,
  dancers: []
};
export const defaultStageDim = {
  width: 9.6,
  height: 5.18,
  gridSize: 0.5,
  units: 'm'
};
export const defaultUI = {
  activeFrame: 0,
  showLabels: true,
  selectedDancers: []
};