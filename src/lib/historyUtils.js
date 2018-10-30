// TODO: add history limit
// TODO: possibly include UI actions in same state

// Maintains a singleton memory state on RAM, needs a unique key for each formation and choreo
let undoableMem = {};

// Attempts to create unique key and entry if mem if not present
const getKey = (choreoId) => {
  let memKey = "" + choreoId;
  if (!undoableMem.hasOwnProperty(memKey)) {
    resetFromMem(memKey);
  }
  return memKey;
};

const undoFromMem = (memKey, present) => {
  let pastLength = undoableMem[memKey].past.length;
  let previous = undoableMem[memKey].past[pastLength - 1];
  let newPast = undoableMem[memKey].past.slice(0, pastLength - 1);
  undoableMem[memKey].future = [present, ...undoableMem[memKey].future];
  undoableMem[memKey].past = newPast;
  return previous;
};

const redoFromMem = (memKey, present) => {
  let next = undoableMem[memKey].future[0];
  let newFuture = undoableMem[memKey].future.slice(1);
  undoableMem[memKey].past = [...undoableMem[memKey].past, present];
  undoableMem[memKey].future = newFuture;
  return next;
};

const resetFromMem = (memKey) => {
  undoableMem[memKey] = {
    past: [],
    future: []
  }
};

const addToMem = (memKey, present) => {
  undoableMem[memKey].past = [...undoableMem[memKey].past, present];
  undoableMem[memKey].future = [];
};

export function canRedo(choreoId) {
  let memKey = getKey(choreoId);
  return undoableMem[memKey].future.length > 0;
}

export function canUndo(choreoId) {
  let memKey = getKey(choreoId);
  return undoableMem[memKey].past.length > 0;
}

export function undoableInMem(reducer, config) {

  // Call the reducer with empty action to populate the initial state
  // Return a reducer that handles undo and redo
  return function (state, action) {
    let memKey = getKey(action.choreoId);
    switch (action.type) {
      case config.undoType: {
        return undoFromMem(memKey, state);
      }
      case config.redoType: {
        return redoFromMem(memKey, state);
      }
      case config.clearHistoryType: {
        resetFromMem(memKey);
        return state;
      }
      default:
        // Delegate handling the action to the passed reducer
        const newState = reducer(state, action);
        if (state === newState) {
          return state;
        }
        if (config.includedTypes.includes(action.type)) {
          addToMem(memKey, state);
          return newState;
        } else {
          resetFromMem(memKey);
          return newState;
        }
    }
  }
}


// UNUSED, REQUIRES A MIGRATION ON LOCALFORAGE AND FIRESTORE TO POPULATE `past`, `present`, `future`
// export function undoable(reducer, config) {
//
//   // Call the reducer with empty action to populate the initial state
//   const initialState = {
//     past: [],
//     present: reducer(null, {}),
//     future: []
//   };
//   // Return a reducer that handles undo and redo
//   return function (state = initialState, action) {
//     const { past, present, future } = state;
//
//     switch (action.type) {
//       case config.undoType: {
//         const previous = past[past.length - 1];
//         const newPast = past.slice(0, past.length - 1);
//         return {
//           past: newPast,
//           present: previous,
//           future: [present, ...future]
//         };
//       }
//       case config.redoType: {
//         const next = future[0];
//         const newFuture = future.slice(1);
//         return {
//           past: [...past, present],
//           present: next,
//           future: newFuture
//         };
//       }
//       case config.clearHistoryType: {
//         return {
//           past: [],
//           present: present,
//           future: []
//         };
//       }
//       default:
//         // Delegate handling the action to the passed reducer
//         const newPresent = reducer(present, action);
//         if (present === newPresent) {
//           return state
//         }
//         if (config.ignoredTypes.includes(action.type)) {
//           return {
//             past: [],
//             present: newPresent,
//             future: []
//           }
//         }
//         return {
//           past: [...past, present],
//           present: newPresent,
//           future: []
//         }
//     }
//   }
// }