import { configureStore } from "@reduxjs/toolkit";
import linkReducer from "./slices/linkSlice";
import statisticsReducer from "./slices/statistics";

export const store = configureStore({
  reducer: {
    link: linkReducer,
    statistics: statisticsReducer,
  },
});

// Типы для использования с TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
