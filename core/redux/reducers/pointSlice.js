import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ProfileServices from '../../services/ProfileServices';

const inititalState = {
  loadingGetPointActivity: false,
  dataGetPointActivity: null,
  errorGetPointActivity: null,

  pointActivity: [],
  myPoint: null
};

export const asyncGetPointActivity = createAsyncThunk(
  'point/getPointActivity',
  async ({ pageSize = 10, page = 1 } = { pageSize: 10, page: 1 }) => {
    const { data, pagination } = await ProfileServices.pointActivity({ page, pageSize });
    return { data, pagination };
  }
);

export const pointSlice = createSlice({
  name: 'points',
  initialState: inititalState,
  reducers: {
    resetPointActivity: (state) => {
      state.loadingGetPointActivity = false;
      state.dataGetPointActivity = null;
      state.errorGetPointActivity = null;

      state.pointActivity = [];
    },
    setPoint: (state, { payload }) => {
      state.myPoint = payload;
    },
    resetPoint: (state) => {
      state.myPoint = null;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(asyncGetPointActivity.pending, (state) => {
      state.loadingGetPointActivity = true;
      state.errorGetPointActivity = null;
    });
    addCase(asyncGetPointActivity.fulfilled, (state, { payload }) => {
      state.loadingGetPointActivity = false;
      state.dataGetPointActivity = payload;
      if (payload.pagination?.current_page === 1) {
        state.pointActivity = payload.data;
      } else {
        // state.pointActivity = mergeArray({ oldArray: state.pointActivity, newArray: payload.data, key: 'id' });
        state.pointActivity = [...state.pointActivity, ...payload.data];
      }
    });
    addCase(asyncGetPointActivity.rejected, (state, { payload }) => {
      state.loadingGetPointActivity = false;
      state.errorGetPointActivity = payload;
    });
  }
});

export const pointsState = (state) => state.points;

const pointReducer = pointSlice.reducer;

export const { resetPointActivity, setPoint, resetPoint } = pointSlice.actions;

export default pointReducer;
