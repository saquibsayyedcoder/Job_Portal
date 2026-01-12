import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const adminSlice = createSlice({
  
  name: "admin",
  initialState: {
    jobSeekers: [],
    recruiter: [],
    jobs: [],
    applications: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    // Users
    requestForAllUsers(state) {
      state.loading = true;
      state.error = null;
    },
    successForAllUsers(state, action) {
      state.loading = false;
      state.jobSeekers = action.payload.jobSeekers;
      state.recruiter = action.payload.recruiter;
    },
    failureForAllUsers(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Jobs
    requestForAllJobs(state) {
      state.loading = true;
      state.error = null;
    },
    successForAllJobs(state, action) {
      state.loading = false;
      state.jobs = action.payload;
    },
    failureForAllJobs(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Applications
    requestForAllApplications(state) {
      state.loading = true;
      state.error = null;
    },
    successForAllApplications(state, action) {
      state.loading = false;
      state.applications = action.payload;
    },
    failureForAllApplications(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    clearAllErrors(state) {
      state.error = null;
    },
    resetAdminSlice(state) {
      state.jobSeekers = [];
      state.recruiter = [];
      state.jobs = [];
      state.applications = [];
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

// ✅ Export actions so they can be used in thunks
export const {
  requestForAllUsers,
  successForAllUsers,
  failureForAllUsers,
  requestForAllJobs,
  successForAllJobs,
  failureForAllJobs,
  requestForAllApplications,
  successForAllApplications,
  failureForAllApplications,
  clearAllErrors,
  resetAdminSlice,
} = adminSlice.actions;

// ✅ Thunks
export const fetchAllUsers = () => async (dispatch) => {
  dispatch(requestForAllUsers());
  try {
    const response = await axios.get(`${BASE_URL}/v1/admin/users`, {
      withCredentials: true,
    });
    dispatch(successForAllUsers(response.data));
    dispatch(clearAllErrors());
  } catch (error) {
    dispatch(failureForAllUsers(error.response?.data?.message || "Failed to load users"));
  }
};

export const fetchAllJobs = () => async (dispatch) => {
  dispatch(requestForAllJobs());
  try {
    const response = await axios.get(`${BASE_URL}/v1/admin/jobs`,  {
      withCredentials: true,
    });
    dispatch(successForAllJobs(response.data));
    dispatch(clearAllErrors());
  } catch (error) {
    dispatch(failureForAllJobs(error.response?.data?.message || "Failed to load jobs"));
  }
};

export const fetchAllApplications = () => async (dispatch) => {
  dispatch(requestForAllApplications());
  try {
    const response = await axios.get(`${BASE_URL}/v1/admin/applications`, {
      withCredentials: true,
    });
    dispatch(successForAllApplications(response.data));
    dispatch(clearAllErrors());
  } catch (error) {
    dispatch(failureForAllApplications(error.response?.data?.message || "Failed to load applications"));
  }
};

export default adminSlice.reducer;
