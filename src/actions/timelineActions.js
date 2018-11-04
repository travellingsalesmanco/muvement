import {
  EDIT_FORMATION_DURATION,
  EDIT_FORMATION_TRANSITION,
  TIMELINE_JUMP,
  TIMELINE_PAUSE, TIMELINE_PLAY
} from "../constants/actionTypes";
import { getChoreo } from "../selectors/choreo";
import { minFormationDuration, minTransitionDuration } from "../constants/defaults";
import { truncToInterval, truncToPrecision } from "../lib/timelineUtils";


export function play(totalDuration, fps, speedup = 1) {
  const msPerFrame = truncToPrecision(1000 / fps);
  const toAdvance = truncToPrecision(msPerFrame * speedup);
  return (dispatch, getState) => {
    const advanceNextFrame = () => {
      if (getState().UI.isPlaying) {
        let newTime = getState().UI.elapsedTime + toAdvance
        if (newTime >= totalDuration) {
          newTime = totalDuration;
          dispatch({ type: TIMELINE_PAUSE })
        }
        dispatch({
          type: TIMELINE_JUMP,
          payload: newTime,
        });
        setTimeout(() => advanceNextFrame(), msPerFrame);
      }
    };
    advanceNextFrame();
  }
}

export function stopPlaying() {
  return (dispatch) => {
    dispatch({ type: TIMELINE_PAUSE });
    dispatch({
      type: TIMELINE_JUMP,
      payload: 0,
    });
  }
}

export function loop(totalDuration, fps, speedup = 1) {
  const msPerFrame = truncToPrecision(1000 / fps);
  const toAdvance = truncToPrecision(msPerFrame * speedup);
  return (dispatch, getState) => {
    dispatch({
      type: TIMELINE_PLAY
    });
    const advanceNextFrame = () => {
      if (getState().UI.isPlaying) {
        let newTime = getState().UI.elapsedTime + toAdvance
        if (newTime > totalDuration) {
          // Loops back to start when completed
          newTime = 0;
        }
        dispatch({
          type: TIMELINE_JUMP,
          payload: newTime,
        });
        setTimeout(() => advanceNextFrame(), msPerFrame);
      }
    };
    advanceNextFrame();
  }
}

export function offsetDuration(choreoId, formationId, offsetDuration) {
  offsetDuration = truncToInterval(offsetDuration)
  return (dispatch, getState) => {
    const oldDuration = getChoreo(getState(), choreoId).formations[formationId].duration;
    let newDuration = oldDuration + offsetDuration;
    if (newDuration < minFormationDuration) {
      newDuration = minFormationDuration
    }
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
  offsetDuration = truncToInterval(offsetDuration)
  return (dispatch, getState) => {
    const oldDuration = getChoreo(getState(), choreoId).formations[formationId].transitionBefore.duration;
    let newDuration = oldDuration + offsetDuration;
    if (newDuration < minTransitionDuration) {
      newDuration = minTransitionDuration
    }
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

export function jumpToTime(t) {
  t = truncToPrecision(t);
  return (dispatch, getState) => {
    if (getState().UI.elapsedTime !== t) {
      dispatch({
        type: TIMELINE_JUMP,
        payload: t
      })
    }
  }
}