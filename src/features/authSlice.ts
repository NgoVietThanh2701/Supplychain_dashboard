import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import action from "./actionType";
import { apiLogin } from "../services/authServicer";

const initState = {
   isLoggedIn: false,
   token: null,
   refresh_token: null,
   refresh_expired: false,
   msg: ""
}

export const loginThunk = createAsyncThunk(action.LOGIN_DASHBOARD, async (dataLogin, thunkAPI) => {
   try {
      const response = await apiLogin(dataLogin);
      return response.data;
   } catch (error: any) {
      console.log(error)
      return thunkAPI.rejectWithValue(error.message);
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
         console.log('ok')
      });
      builder.addCase(loginThunk.rejected, (state, action) => {
         console.log('fail')
      })
   }
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;