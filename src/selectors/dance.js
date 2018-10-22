export const getDance = (state, danceId) => state.dances.byId[danceId];
export const getFrames = (state, props) => getDance(state, props.danceId).frames
export const getFrame = (state, props) => getFrames(state, props)[props.frameId]