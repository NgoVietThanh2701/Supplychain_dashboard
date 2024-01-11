import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import action from "./actionType";
import { apiLogin, apiRefreshToken } from "../services/authServices";

const initState = {
   isLoggedIn: false,
   token: null,
   error: false,
   msg: "",
}

export const loginThunk = createAsyncThunk(action.AUTH_LOGIN, async (dataLogin: any, thunkAPI) => {
   try {
      const response = await apiLogin(dataLogin);
      return response.data;
   } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
   }
});


export const authSlice = createSlice({
   name: 'auth',
   initialState: initState,
   reducers: {
      resetAuth: (state) => initState
   },
   extraReducers: (builder) => {
      // login
      builder.addCase(loginThunk.fulfilled, (state, action) => {
         state.isLoggedIn = true;
         state.token = action.payload.data;
      });
      builder.addCase(loginThunk.rejected, (state, action: any) => {
         state.msg = action.payload;
         state.error = !state.error;
      });
   }
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;