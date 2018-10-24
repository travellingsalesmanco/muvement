export const defaultTransition = {
  duration: 0,
  midPoint: 0
};
export const defaultFormation = {
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
export const genDummyImage = (name) => {
  return "https://dummyimage.com/300x300/000000/fff.jpg&text=" + name.charAt(0);
};
export const defaultUI = {
  isPlaying: false,
  animated: false,
  elapsedTime: 0,
  activeFormation: 0,
  showLabels: true,
  selectedDancers: []
};