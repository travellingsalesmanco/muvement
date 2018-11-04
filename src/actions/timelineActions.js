import {
  EDIT_FORMATION_DURATION,
  EDIT_FORMATION_TRANSITION,
  TIMELINE_JUMP,
  TIMELINE_PAUSE, TIMELINE_PLAY
} from "../constants/actionTypes";
import { getChoreo } from "../selectors/choreo";
import { minFormationDuration, minTransitionDuration, FPS } from "../constants/defaults";
import { truncToInterval, truncToPrecision } from "../lib/timelineUtils";


let timer = null;
let playOverride = false
export function play(totalDuration) {
  const msPerFrame = 1000 / FPS;
  return (dispatch, getState) => {
    const advanceNextFrame = () => {
      if (getState().UI.isPlaying) {
        if (playOverride) {
          return
        }
        const toAdvance = msPerFrame * getState().UI.playbackRate;
        let newTime = getState().UI.elapsedTime + toAdvance;
        if (newTime >= totalDuration) {
          newTime = totalDuration;
          dispatch({ type: TIMELINE_PAUSE })
        }
        dispatch({
          type: TIMELINE_JUMP,
          payload: newTime,
        })
      } else {
        clearInterval(timer)
      }
    }
    timer = setInterval(advanceNextFrame, msPerFrame);
  }
}

/**
 * Use the wavesurfer audio loop to control animations to ensure the two are in sync
 * @param {*} wavesurfer 
 */
export function overridePlayWithWavesurfer(wavesurfer, choreoEndTime) {
  // Set the flag to pause animation loop
  playOverride = true;
  const msPerFrame = 1000 / FPS;
  const musicDuration = wavesurfer.getDuration() * 1000;
  const stopAudioPlayer = () => {
    wavesurfer.pause()
    wavesurfer.un('audioprocess')
    wavesurfer.un('finish')
    playOverride = false;
    console.log("[Audio] Play control returned");
  }
  return (dispatch, getState) => {
    wavesurfer.on('finish', () => {
      // Audio has finished playing but animation hasn't (animation is longer than audio)
      // Need to restart the animation loop to continue playing animation
      if (getState().UI.elapsedTime !== musicDuration) {
        dispatch({
          type: TIMELINE_JUMP,
          payload: musicDuration
        })
      }
      stopAudioPlayer();
    })
    wavesurfer.on('audioprocess', (t) => {
      if (getState().UI.isPlaying) {
        const audioTime = t * 1000;
        if (audioTime >= choreoEndTime) {
          dispatch({
            type: TIMELINE_JUMP,
            payload: choreoEndTime
          })
          stopAudioPlayer();
          return;
        } else if (audioTime - msPerFrame > getState().UI.elapsedTime) {
        // Limit animation refresh to FPS
          dispatch({
            type: TIMELINE_JUMP,
            payload: audioTime
          })
        }
      } else {
        stopAudioPlayer();
      }
    })
    wavesurfer.setPlaybackRate(getState().UI.playbackRate)
    wavesurfer.play(getState().UI.elapsedTime / 1000)
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