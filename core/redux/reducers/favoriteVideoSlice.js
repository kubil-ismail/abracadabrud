import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ProfileServices from '../../services/ProfileServices';
import mergeArray from '../../utils/mergeArray';

const inititalState = {
  loadingGetFavoriteVideos: false,
  dataGetFavoriteVideos: null,
  errorGetFavoriteVideos: null,

  favoriteVideos: []
};

export const asyncGetFavoriteVideos = createAsyncThunk(
  'favoriteVideos/getFavoriteVideos',
  async ({ pageSize = 10, page = 1 } = { pageSize: 10, page: 1 }) => {
    const { data, pagination } = await ProfileServices.favoriteVideos({ page, pageSize });
    return { data, pagination };
  }
);

export const favoriteVideosSlice = createSlice({
  name: 'favoriteVideos',
  initialState: inititalState,
  reducers: {
    resetFavoriteVideos: (state) => {
      state.favoriteVideos = [];
      state.loadingGetFavoriteVideos = false;
      state.dataGetFavoriteVideos = null;
      state.errorGetFavoriteVideos = null;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(asyncGetFavoriteVideos.pending, (state) => {
      state.loadingGetFavoriteVideos = true;
      state.errorGetFavoriteVideos = null;
    });
    addCase(asyncGetFavoriteVideos.fulfilled, (state, { payload }) => {
      state.loadingGetFavoriteVideos = false;
      state.dataGetFavoriteVideos = payload;
      if (payload.pagination?.current_page === 1) {
        state.favoriteVideos = payload.data;
      } else {
        // state.favoriteVideos = mergeArray({ oldArray: state.favoriteVideos, newArray: payload.data, key: 'id' });
        state.favoriteVideos = [...state.favoriteVideos, ...payload.data];
      }
    });
    addCase(asyncGetFavoriteVideos.rejected, (state, { payload }) => {
      state.loadingGetFavoriteVideos = false;
      state.errorGetFavoriteVideos = payload;
    });
  }
});

export const favoriteVideosState = (state) => state.favoriteVideos;

export const { resetFavoriteVideos } = favoriteVideosSlice.actions;

const favoriteVideosReducer = favoriteVideosSlice.reducer;

export default favoriteVideosReducer;
