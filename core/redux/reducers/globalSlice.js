import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import GlobalServices from '../../services/GlobalServices';

const initialState = {
  genres: [],

  dataGetGenres: null,
  errorGetGenres: null,
  loadingGetGenres: false,

  lastPageBeforeRegister: null,
  joinAs: null,

  referralCode: null,

  hasUpload: [],
  hasAfterEnrollContestant: [],
  hasAfterEnrollPerformer: [],

  dataHasUpload: null,
  errorHasUpload: false,
  loadingHasUpload: false,

  sponsorPlaying: [],
  required_to_enroll: false,
  allEvents: null
};

export const asyncGetGenres = createAsyncThunk('genres/getGenres', async () => {
  const { genres, message } = await GlobalServices.getGenres({});
  console.log(genres, 'genres');
  return { genres, message };
});

export const asyncHasUpload = createAsyncThunk('events/hasUpload', async ({ eventId }) => {
  const { message, videos } = await GlobalServices.hasUpload({ eventId });
  return { eventId, message, videos };
});

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLastPageBeforeRegister: (state, { payload }) => {
      state.lastPageBeforeRegister = payload;
    },
    setJoinAs: (state, { payload }) => {
      state.joinAs = payload;
    },
    setReferralCode: (state, { payload }) => {
      state.referralCode = payload;
    },
    setHasAfterEnrollContestant: (state, { payload }) => {
      state.hasAfterEnrollContestant = [...state.hasAfterEnrollContestant, payload];
    },
    setHasAfterEnrollPerformer: (state, { payload }) => {
      if (Array.isArray(state.hasAfterEnrollPerformer)) {
        state.hasAfterEnrollPerformer = [...state.hasAfterEnrollPerformer, payload];
      } else {
        state.hasAfterEnrollPerformer = [payload];
      }
    },
    setSponsorPlayed: (state, { payload }) => {
      state.sponsorPlaying = [...state.sponsorPlaying, ...[payload]];
    },
    setMultipleSponsorPlayed: (state, { payload }) => {
      state.sponsorPlaying = [...state.sponsorPlaying, ...payload];
    },
    clearSponsorPlayed: (state) => {
      state.sponsorPlaying = [];
    },
    setRequiredToEnroll: (state, { payload }) => {
      state.required_to_enroll = payload;
    },
    setAllEvents: (state, { payload }) => {
      state.allEvents = payload;
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(asyncGetGenres.pending, (state) => {
      state.loadingGetGenres = true;
    });
    addCase(asyncGetGenres.fulfilled, (state, { payload }) => {
      state.loadingGetGenres = false;
      state.dataGetGenres = payload;
      state.genres = payload.genres;
    });
    addCase(asyncGetGenres.rejected, (state, action) => {
      state.loadingGetGenres = false;
      state.errorGetGenres = action.payload;
    });
    // UPLOAD VIDEO
    addCase(asyncHasUpload.pending, (state) => {
      state.loadingHasUpload = true;
    });
    addCase(asyncHasUpload.fulfilled, (state, { payload }) => {
      state.loadingHasUpload = false;
      if (payload.videos && !state.hasUpload.includes(payload.eventId)) {
        state.hasUpload = [...state.hasUpload, payload.eventId];
      }
      state.dataHasUpload = payload;
    });
    addCase(asyncHasUpload.rejected, (state, action) => {
      state.loadingHasUpload = false;
      state.errorHasUpload = action.payload;
    });
  }
});

export const globalState = (state) => state.global;

export const {
  setLastPageBeforeRegister,
  setJoinAs,
  setReferralCode,
  setHasAfterEnrollContestant,
  setHasAfterEnrollPerformer,
  setSponsorPlayed,
  setMultipleSponsorPlayed,
  clearSponsorPlayed,
  setRequiredToEnroll,
  setAllEvents
} = globalSlice.actions;

const globalReducer = globalSlice.reducer;

export default globalReducer;
