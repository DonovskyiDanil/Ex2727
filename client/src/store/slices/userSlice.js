import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as restController from '../../api/rest/restController';
import { controller } from '../../api/ws/socketController';
import { changeEditModeOnUserProfile } from './userProfileSlice';

const USER_SLICE_NAME = 'user';

const initialState = {
  isFetching: false, // ✅ было true — это ломало логику
  error: null,
  data: null,
};

export const getUser = createAsyncThunk(
  `${USER_SLICE_NAME}/getUser`,
  async (navigate, { rejectWithValue }) => {
    try {
      const { data } = await restController.getUser();

      controller.subscribe(data.id);

      if (navigate) {
        navigate('/', { replace: true });
      }

      return data;
    } catch (err) {
      // ✅ если пользователь не авторизован — это нормально
      if (err.response?.status === 401) {
        return rejectWithValue(null);
      }

      return rejectWithValue({
        data: err?.response?.data ?? 'Server Error',
        status: err?.response?.status ?? 500,
      });
    }
  }
);

export const updateUser = createAsyncThunk(
  `${USER_SLICE_NAME}/updateUser`,
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await restController.updateUser(payload);
      dispatch(changeEditModeOnUserProfile(false));
      return data;
    } catch (err) {
      return rejectWithValue({
        data: err?.response?.data ?? 'Server Error',
        status: err?.response?.status ?? 500,
      });
    }
  }
);

const userSlice = createSlice({
  name: USER_SLICE_NAME,
  initialState,
  reducers: {
    clearUserStore: state => {
      state.error = null;
      state.data = null;
      state.isFetching = false;
    },
    clearUserError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(getUser.pending, state => {
      state.isFetching = true;
      state.error = null;
    });

    builder.addCase(getUser.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.data = payload;
    });

    builder.addCase(getUser.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.error = payload;
    });

    builder.addCase(updateUser.fulfilled, (state, { payload }) => {
      state.data = { ...state.data, ...payload };
      state.error = null;
    });

    builder.addCase(updateUser.rejected, (state, { payload }) => {
      state.error = payload;
    });
  },
});

export const { clearUserStore, clearUserError } = userSlice.actions;

export default userSlice.reducer;
