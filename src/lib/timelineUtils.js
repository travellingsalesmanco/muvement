import { timingInterval, timingPrecision } from "../constants/defaults";

// Will round down for +ve numbers, round up for -ve numbers
export const truncToInterval = (t) => Math.trunc(t / timingInterval) * timingInterval
export const truncToPrecision = (t) => Math.trunc(t / timingPrecision) * timingPrecision

export const offsetFrom = (t, startTime, endTime) => (t - startTime) / (endTime - startTime)

export const inFocus = (t, startTime, endTime) => {
  const offset = offsetFrom(t, startTime, endTime)
  return offset >= 0 && offset <= 1;
}
