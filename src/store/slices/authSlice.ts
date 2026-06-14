import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';
import * as authService from '../../services/authService';

interface AuthState {
  currentUser: User | null;
  error: string | null;
}

const initialState: AuthState = {
  currentUser: authService.getCurrentUser(),
  error: null,
};

export const loginThunk = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/loginThunk',
  async (cred, { rejectWithValue }) => {
    try {
      return authService.login(cred.email, cred.password);
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Gagal login');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.error = null;
    },
    logout(state) {
      state.currentUser = null;
      state.error = null;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => { state.error = null; })
      .addCase(loginThunk.fulfilled, (state, action) => { state.currentUser = action.payload; })
      .addCase(loginThunk.rejected, (state, action) => {
        state.error = action.payload ?? 'Gagal login';
      });
  },
});

export const { loginSuccess, logout, setAuthError } = authSlice.actions;
export default authSlice.reducer;
