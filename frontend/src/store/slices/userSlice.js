import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: {},
    error: null,
    message: null,
  },
  reducers: {
    registerRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
      state.message = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
      state.message = action.payload.message;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
      state.message = null;
    },
    loginRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
      state.message = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
      state.message = action.payload.message;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
      state.message = null;
    },
    fetchUserRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    fetchUserFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },

    //logout
    logoutSuccess(state, action) {
      // state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    logoutFailed(state, action) {
      state.isAuthenticated = state.isAuthenticated;
      state.user = state.user;
      state.error = action.payload;
    },

    clearAllErrors(state, action) {
      state.error = null;
      state.user = state.user;
    },
  },
});

export const register = (data) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest());
  try {
    const response = await axios.post(
      `${BASE_URL}/v1/user/register`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(userSlice.actions.registerSuccess(response.data));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.registerFailed(error.response.data.message));
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const response = await axios.post(
      `${BASE_URL}/v1/user/login`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(userSlice.actions.loginSuccess(response.data));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.loginFailed(error.response.data.message));
  }
};

// export const getUser = () => async (dispatch) => {
//   dispatch(userSlice.actions.fetchUserRequest());
//   try {
//     const response = await axios.get(
//       `${BASE_URL}/v1/user/getuser`,
//       {
//         withCredentials: true,
//       }
//     );
//     dispatch(userSlice.actions.fetchUserSuccess(response.data.user));
//     dispatch(userSlice.actions.clearAllErrors());
//   } catch (error) {
//     dispatch(userSlice.actions.fetchUserFailed(error.response.data.message));
//   }
// };

export const getUser = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchUserRequest());
  try {
    const response = await axios.get(`${BASE_URL}/v1/user/getuser`, {
      withCredentials: true,
    });

    dispatch(userSlice.actions.fetchUserSuccess(response.data.user));
    dispatch(userSlice.actions.clearAllErrors());

  } catch (error) {
    // Only dispatch error if it's not a 401 (Unauthorized)
    if (error.response?.status !== 401) {
      dispatch(
        userSlice.actions.fetchUserFailed(
          error.response?.data?.message || "An error occurred"
        )
      );
    } else {
      // Optionally dispatch a different action if user is unauthenticated
      dispatch(userSlice.actions.fetchUserFailed(null)); // No error message
    }
  }
};

//For Logout
export const logout = () => async (dispatch) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/v1/user/logout`,
      {
        withCredentials: true,
      }
    );
    dispatch(userSlice.actions.logoutSuccess());
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.logoutFailed(error.response.data.message));
  }
};

export const clearAllUserErros = () => (dispatch) => {
  dispatch(userSlice.actions.clearAllErrors())
};

export default userSlice.reducer;