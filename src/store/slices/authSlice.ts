import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';
import * as authService from '../../services/authService';
import { getToken } from '../../services/apiClient';

export type SessionStatus = 'idle' | 'loading' | 'failed';

interface AuthState {
  currentUser: User | null;
  error: string | null;
  sessionStatus: SessionStatus;
}

const initialState: AuthState = {
  currentUser: null,
  error: null,
  sessionStatus: getToken() ? 'loading' : 'idle',
};

export const loginThunk = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/loginThunk',
  async (cred, { rejectWithValue }) => {
    try {
      return await authService.login(cred.email, cred.password);
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Gagal login');
    }
  },
);

export const restoreSession = createAsyncThunk<User | null>(
  'auth/restoreSession',
  async () => {
    try {
      return await authService.getCurrentUser();
    } catch {
      return null;
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
      })
      .addCase(restoreSession.pending, (state) => { state.sessionStatus = 'loading'; })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.sessionStatus = 'idle';
      })
      .addCase(restoreSession.rejected, (state) => {
        state.currentUser = null;
        state.sessionStatus = 'failed';
      });
  },
});

export const { loginSuccess, logout, setAuthError } = authSlice.actions;
export default authSlice.reducer;
