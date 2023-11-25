import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import action from "./actionType";
import { apiLogin, apiRefreshToken } from "../services/authServices";

const initState = {
   isLoggedIn: false,
   token: null,
   refreshToken: null,
   refresh_expired: false,
   updateError: false,
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

export const refreshTokenThunk = createAsyncThunk(action.AUTH_REGRESH_TOKEN, async (refreshToken: any, thunkAPI) => {
   try {
      const response = await apiRefreshToken(refreshToken);
      return response.data;
   } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
   }
})

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
         state.token = action.payload.token;
         state.refreshToken = action.payload.refreshToken;
      });
      builder.addCase(loginThunk.rejected, (state, action: any) => {
         state.msg = action.payload;
         state.updateError = !state.updateError;
      });
      // refresh token
      builder.addCase(refreshTokenThunk.fulfilled, (state, action) => {
         state.token = action.payload.data;
         state.isLoggedIn = true
      });
      builder.addCase(refreshTokenThunk.rejected, (state, action) => {
         console.log('reject at refresh token slice')
      })
   }
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;