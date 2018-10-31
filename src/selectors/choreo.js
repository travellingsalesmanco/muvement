export const getChoreo = (state, choreoId) => state.choreos.byId[choreoId];
export const getFormations = (state, props) => getChoreo(state, props.choreoId).formations
export const getFormation = (state, props) => getFormations(state, props)[props.formationId]
const minTransition = 1000;
export const getDurationFromFormation = formation => formation.transitionBefore.duration < minTransition ? minTransition : formation.transitionBefore.duration;