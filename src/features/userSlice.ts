import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import action from "./actionType";
import { apiGetCurrentUser } from "../services/userServices";

const initStateUser = {
   currentUser: null,
   msg: ''
}

export const getCurrentUser = createAsyncThunk(action.USER_GET_CURRENT, async (__, thunkAPI) => {
   try {
      const response = await apiGetCurrentUser();
      return response.data;
   } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
   }
})

export const userSlice = createSlice({
   name: 'user',
   initialState: initStateUser,
   reducers: {
      resetCurrentUser: (state) => initStateUser
   },
   extraReducers: (builder) => {
      builder.addCase(getCurrentUser.fulfilled, (state, action) => {
         state.currentUser = action.payload.data;
      });
      builder.addCase(getCurrentUser.rejected, (state, action: any) => {
         state.msg = action.payload;
      })
   }
})

export const { resetCurrentUser } = userSlice.actions;
export default userSlice.reducer;
