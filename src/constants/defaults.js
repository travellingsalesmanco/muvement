export const defaultTransition = {
  duration: 2000,
  midPoint: 0
};
export const defaultFormation = {
  name: "",
  duration: 5000,
  transitionBefore: defaultTransition,
  dancers: [{ name: "Performer 1", position: [0.5,0.5] }]
};
export const defaultStageDim = {
  width: 9.6,
  height: 5.18,
  gridSize: 0.5,
  units: 'm'
};
export const defaultDancers = ["Performer 1"];
export const defaultUI = {
  isPlaying: false,
  animated: false,
  elapsedTime: 0,
  playbackRate: 1,
  activeFormation: 0,
  showLabels: true,
  selectedDancers: []
};

export const minFormationDuration = 1000;
export const minTransitionDuration = 1000;
export const timingInterval = 250;
export const timingPrecision = 10;
export const FPS = 30;