import { TIMELINE_JUMP } from "../constants/actionTypes";
import { gotoFormation } from "./choreoActions";

const FPS = 30;
const msPerFrame = 1000 / FPS;

export function advanceNextFrame(choreoId, formationId, endOfFormationDuration, endOfChoreoDuration) {
  return (dispatch, getState) => {
    setTimeout(() => {
      if (getState().UI.isPlaying) {
        const newTime = getState().UI.elapsedTime + msPerFrame;
        dispatch({
          type: TIMELINE_JUMP,
          payload: newTime,
        })
        if (newTime >= endOfFormationDuration && newTime < endOfChoreoDuration) {
          gotoFormation(choreoId, formationId + 1)
        }
      }
    }, msPerFrame);
  }
}