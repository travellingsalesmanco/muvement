import { minTransitionDuration } from "../constants/defaults";

export const getChoreo = (state, choreoId) => state.choreos.byId[choreoId];
export const getFormations = (state, props) => getChoreo(state, props.choreoId).formations
export const getFormation = (state, props) => getFormations(state, props)[props.formationId]
export const getDurationFromFormation = formation => formation.transitionBefore.duration < minTransitionDuration ? minTransitionDuration : formation.transitionBefore.duration;