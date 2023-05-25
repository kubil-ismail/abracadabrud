import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CoachMarkServices from '../../services/CoackMarkServices';

export const asyncGetAllCoachMarks = createAsyncThunk('coachMark/getAllCoachMarks', async () => {
  const coachMarks = await CoachMarkServices.getAll();
  return coachMarks;
});

export const asyncSetCoachMarkByKey = createAsyncThunk(
  'coachMark/setCoachMarkByKey',
  async ({ key, value = 1 }) => {
    const coachMark = await CoachMarkServices.setByKey(key, value);
    return coachMark;
  }
);

export const asyncGetCoachMarkByKey = createAsyncThunk(
  'coachMark/getCoachMarkByKey',
  async ({ key }) => {
    const coachMark = await CoachMarkServices.getCoachMarkByKey(key);
    return coachMark;
  }
);

const coachMarkSlice = createSlice({
  name: 'coachMark',
  initialState: {
    coachMarks: []
  },
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(asyncGetAllCoachMarks.fulfilled, (state, action) => {
      state.coachMarks = action.payload;
    });
    addCase(asyncSetCoachMarkByKey.fulfilled, (state, action) => {
      if (action.payload !== null) {
        if (state.coachMarks?.length === 0) {
          state.coachMarks = [action.payload];
          return;
        }
        state.coachMarks = state.coachMarks.map((coachMark) => {
          if (coachMark.key === action.payload.key) {
            return action.payload;
          }
          return coachMark;
        });
      }
    });
    addCase(asyncGetCoachMarkByKey.fulfilled, (state, action) => {
      if (action.payload !== null) {
        if (state.coachMarks?.length === 0) {
          state.coachMarks = [action.payload];
          return;
        }
        state.coachMarks = state.coachMarks.map((coachMark) => {
          if (coachMark.key === action.payload.key) {
            return action.payload;
          }
          return coachMark;
        });
      }
    });
  }
});

export const coachMarkState = (state) => state.coachMark;

export const coachMarkByKeyState = (state, key) =>
  state.coachMark.coachMarks.find((coachMark) => coachMark.key === key);

const coachMarkReducer = coachMarkSlice.reducer;

export default coachMarkReducer;
