import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // report video
    videoId: null,
    reasonId: null,
    description: null,
}

const threeDotsSlice = createSlice({
    name: 'threeDots',
    initialState,
    reducers: {
        setVideoId: (state, { payload }) => {
            state.videoId = payload;
        },
        setReasonId: (state, { payload }) => {
            state.reasonId = payload;
        },
        setDescription: (state, { payload }) => {
            state.description = payload;
        },
    }
})

export const {
    setVideoId,
    setReasonId,
    setDescription
} = threeDotsSlice.actions;

export default threeDotsSlice.reducer;