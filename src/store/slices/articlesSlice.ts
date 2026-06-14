import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Article } from '../../types';
import { getArticles, getArticleById } from '../../services/articleService';

export type ArticlesStatus = 'idle' | 'loading' | 'failed';

interface ArticlesState {
  items: Article[];
  status: ArticlesStatus;
  detailStatus: 'idle' | 'loading' | 'failed' | 'notFound';
}

const initialState: ArticlesState = {
  items: [],
  status: 'idle',
  detailStatus: 'idle',
};

export const fetchArticles = createAsyncThunk<Article[]>(
  'articles/fetch',
  async () => getArticles(),
);

export const fetchArticleById = createAsyncThunk<Article, number, { rejectValue: 'notFound' | 'error' }>(
  'articles/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await getArticleById(id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      return rejectWithValue(msg.includes('404') || msg.toLowerCase().includes('not found') ? 'notFound' : 'error');
    }
  },
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    addArticle(state, action: PayloadAction<Article>) {
      state.items.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'idle';
      })
      .addCase(fetchArticles.rejected, (state) => { state.status = 'failed'; })
      .addCase(fetchArticleById.pending, (state) => { state.detailStatus = 'loading'; })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        const exists = state.items.some((a) => a.id === action.payload.id);
        if (!exists) state.items.unshift(action.payload);
        state.detailStatus = 'idle';
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.detailStatus = action.payload === 'notFound' ? 'notFound' : 'failed';
      });
  },
});

export const { addArticle } = articlesSlice.actions;
export default articlesSlice.reducer;
