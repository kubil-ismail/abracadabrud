const { createSlice } = require("@reduxjs/toolkit")

const initialState = {
  memberships: [],
  membershipsInfo: []
};

const membershipSlice = createSlice({
  name: 'memberships',
  initialState,
  reducers: {
    setMemberships: (state, action) => {
      state.memberships = action.payload;
    },
    setMembershipsInfo: (state, action) => {
      state.membershipsInfo = action.payload;
    }
  }
});

export const membershipState = (state) => state.memberships;

const membershipReducer = membershipSlice.reducer;

export const { setMemberships, setMembershipsInfo } = membershipSlice.actions;

export default membershipReducer;