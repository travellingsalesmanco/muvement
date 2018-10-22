import { TIMELINE_JUMP } from "../constants/actionTypes";
import { gotoFrame } from "./danceActions";

const FPS = 30;
const msPerFrame = 1000 / FPS;

export function advanceNextFrame(danceId, formationId, endOfFormationDuration, endOfDanceDuration) {
  return (dispatch, getState) => {
    setTimeout(() => {
      if (getState().UI.isPlaying) {
        const newTime = getState().UI.elapsedTime + msPerFrame;
        dispatch({
          type: TIMELINE_JUMP,
          payload: newTime,
        })
        if (newTime >= endOfFormationDuration && newTime < endOfDanceDuration) {
          gotoFrame(danceId, formationId + 1)
        }
      }
    }, msPerFrame);
  }
}