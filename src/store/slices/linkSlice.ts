import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LinkState {
  currentLink: string;
}

const initialState: LinkState = {
  currentLink: "", // Значение по умолчанию
};

const linkSlice = createSlice({
  name: "link",
  initialState,
  reducers: {
    setCurrentLink: (state, action: PayloadAction<string>) => {
      state.currentLink = action.payload;
    },
  },
});

export const { setCurrentLink } = linkSlice.actions;

export default linkSlice.reducer;
