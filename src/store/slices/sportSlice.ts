import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface sportState {
  currentSport: string;
}

const initialState: sportState = {
  currentSport: "", // Значение по умолчанию
};

const sportSlice = createSlice({
  name: "sport",
  initialState,
  reducers: {
    setCurrentSport: (state, action: PayloadAction<string>) => {
      state.currentSport = action.payload;
    },
  },
});

export const { setCurrentSport } = sportSlice.actions;

export default sportSlice.reducer;
