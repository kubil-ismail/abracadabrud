import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ProfileServices from '../../services/ProfileServices';
import mergeArray from '../../utils/mergeArray';

const inititalState = {
  loadingGetVoteActivity: false,
  dataGetVoteActivity: null,
  errorGetVoteActivity: null,

  voteActivity: []
};

export const asyncGetVoteActivity = createAsyncThunk(
  'vote/getVoteActivity',
  async ({ pageSize = 10, page = 1 } = { pageSize: 10, page: 1 }) => {
    const { data, pagination } = await ProfileServices.voteActivity({ page, pageSize });
    return { data, pagination };
  }
);

export const voteSlice = createSlice({
  name: 'votes',
  initialState: inititalState,
  reducers: {
    resetPointActivity: (state) => {
      state.loadingGetVoteActivity = false;
      state.dataGetVoteActivity = null;
      state.errorGetVoteActivity = null;

      state.voteActivity = [];
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(asyncGetVoteActivity.pending, (state) => {
      state.loadingGetVoteActivity = true;
      state.errorGetVoteActivity = null;
    });
    addCase(asyncGetVoteActivity.fulfilled, (state, { payload }) => {
      state.loadingGetVoteActivity = false;
      state.dataGetVoteActivity = payload;
      if (payload.pagination?.current_page === 1) {
        state.voteActivity = payload.data;
      } else {
        // state.voteActivity = mergeArray({ oldArray: state.voteActivity, newArray: payload.data, key: 'id' });
        state.voteActivity = [...state.voteActivity, payload.data];
      }
    });
    addCase(asyncGetVoteActivity.rejected, (state, { payload }) => {
      state.loadingGetVoteActivity = false;
      state.errorGetVoteActivity = payload;
    });
  }
});

export const votesState = (state) => state.votes;

export const { resetPointActivity } = voteSlice.actions;

const voteReducer = voteSlice.reducer;

export default voteReducer;
