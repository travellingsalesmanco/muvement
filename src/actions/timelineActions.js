import { EDIT_FORMATION_DURATION, EDIT_FORMATION_TRANSITION, TIMELINE_JUMP, TIMELINE_PAUSE } from "../constants/actionTypes";
import { getChoreo } from "../selectors/choreo";


export function play(totalDuration, fps, speedup = 1) {
  const msPerFrame = 1000 / fps;
  const toAdvance = Math.trunc(msPerFrame * speedup)
  return (dispatch, getState) => {
    const advanceNextFrame = () => {
      if (getState().UI.isPlaying) {
        let newTime = getState().UI.elapsedTime + toAdvance
        if (newTime >= totalDuration) {
          newTime = totalDuration
          dispatch({ type: TIMELINE_PAUSE })
        }
        dispatch({
          type: TIMELINE_JUMP,
          payload: newTime,
        })
        setTimeout(() => advanceNextFrame(), msPerFrame);
      }
    }
    advanceNextFrame();
  }
}

export function offsetDuration(choreoId, formationId, offsetDuration) {
  offsetDuration = Math.trunc(offsetDuration)
  return (dispatch, getState) => {
    const oldDuration = getChoreo(getState(), choreoId).formations[formationId].duration;
    const newDuration = oldDuration + offsetDuration < 2000 ? 2000 : oldDuration + offsetDuration;
    if (oldDuration !== newDuration) {
      dispatch({
        type: EDIT_FORMATION_DURATION,
        choreoId: choreoId,
        formationId: formationId,
        payload: newDuration
      })
    }
  }
}

export function offsetTransitionBeforeDuration(choreoId, formationId, offsetDuration) {
  offsetDuration = Math.trunc(offsetDuration)
  return (dispatch, getState) => {
    const oldDuration = getChoreo(getState(), choreoId).formations[formationId].transitionBefore.duration;
    const newDuration = oldDuration + offsetDuration < 2000 ? 2000 : oldDuration + offsetDuration;
    if (oldDuration !== newDuration) {
      dispatch({
        type: EDIT_FORMATION_TRANSITION,
        choreoId: choreoId,
        formationId: formationId,
        payload: { duration: newDuration }
      })
    }
  }
}