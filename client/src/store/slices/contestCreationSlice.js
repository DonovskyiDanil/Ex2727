import { createSlice } from '@reduxjs/toolkit';

const CONTEST_SAVING_SLICE_NAME = 'contestCreation';

const initialState = {
  contests: {},
};

// Helper function to create a serializable copy of the info object
// File objects are not serializable, so we only store the file name
const createSerializableInfo = (info) => {
  const serializableInfo = { ...info };
  if (serializableInfo.file && typeof serializableInfo.file === 'object') {
    // Store only the file name, not the File object itself
    serializableInfo.file = serializableInfo.file.name || '';
  }
  return serializableInfo;
};

const reducers = {
  saveContestToStore: (state, { payload: { type, info } }) => {
    state.contests = {
      ...state.contests,
      ...{ [type]: createSerializableInfo(info) },
    };
  },
  clearContestStore: () => initialState,
};

const contestSavingSlice = createSlice({
  name: CONTEST_SAVING_SLICE_NAME,
  initialState,
  reducers,
});

const { actions, reducer } = contestSavingSlice;

export const { saveContestToStore, clearContestStore } = actions;

export default reducer;
