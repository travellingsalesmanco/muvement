export const getDance = (state, danceId) => state.dances.byId[danceId];
export const getFormations = (state, props) => getDance(state, props.danceId).formations
export const getFormation = (state, props) => getFormations(state, props)[props.formationId]