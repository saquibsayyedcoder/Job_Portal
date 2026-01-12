import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    // General loading and error handling
    requestForAllApplications(state) {
      state.loading = true;
      state.error = null;
    },
    successForAllApplications(state, action) {
      state.loading = false;
      state.error = null;
      state.applications = action.payload;
    },
    failureForAllApplications(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    requestForMyApplications(state) {
      state.loading = true;
      state.error = null;
    },
    successForMyApplications(state, action) {
      state.loading = false;
      state.error = null;
      state.applications = action.payload;
    },
    failureForMyApplications(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Post / Update actions
    requestForPostApplication(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForPostApplication(state, action) {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    failureForPostApplication(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    // Delete Application
    requestForDeleteApplication(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForDeleteApplication(state, action) {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    failureForDeleteApplication(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
     requestForRescheduleInterview(state) {
    state.loading = true;
    state.error = null;
    state.message = null;
  },
  successForRescheduleInterview(state, action) {
    state.loading = false;
    state.error = null;
    state.message = action.payload;
  },
  failureForRescheduleInterview(state, action) {
    state.loading = false;
    state.error = action.payload;
    state.message = null;
  },

    // Update application in list after status update
    updateApplicationInState(state, action) {
      const updated = action.payload;
      const index = state.applications.findIndex(app => app._id === updated._id);
      if (index !== -1) {
        state.applications[index] = updated;
      }
    },

    // Utility
    clearAllErrors(state) {
      state.error = null;
    },
    resetApplicationSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});

// Thunks

// Job Seeker Applications
export const fetchJobSeekerApplications = () => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForMyApplications());
  try {
    const response = await axios.get(`${BASE_URL}/v1/application/jobseeker/getall`, {
      withCredentials: true,
    });
    dispatch(applicationSlice.actions.successForMyApplications(response.data.applications));
    dispatch(applicationSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(applicationSlice.actions.failureForMyApplications(error.response.data.message));
  }
};

// Recruiter Applications
export const fetchRecruiterApplications = () => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForAllApplications());
  try {
    const response = await axios.get(`${BASE_URL}/v1/application/employer/getall`, {
      withCredentials: true,
    });
    dispatch(applicationSlice.actions.successForAllApplications(response.data.applications));
    dispatch(applicationSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(applicationSlice.actions.failureForAllApplications(error.response.data.message));
  }
};

// Post new application
// store/slices/applicationSlice.js
export const postApplication = (payload) => async (dispatch) => {
  const { formData, jobId } = payload;

  dispatch(applicationSlice.actions.requestForPostApplication());

  if (!jobId) {
    dispatch(
      applicationSlice.actions.failureForPostApplication("Job ID is missing.")
    );
    return;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/v1/application/apply/${jobId}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch(
      applicationSlice.actions.successForPostApplication(response.data.message)
    );
    dispatch(applicationSlice.actions.clearAllErrors());
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to submit application";
    dispatch(applicationSlice.actions.failureForPostApplication(message));
  }
};

// Delete Application
export const deleteApplication = (id) => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForDeleteApplication());
  try {
    const response = await axios.delete(`${BASE_URL}/v1/application/delete/${id}`, {
      withCredentials: true,
    });
    dispatch(applicationSlice.actions.successForDeleteApplication(response.data.message));
  } catch (error) {
    dispatch(applicationSlice.actions.failureForDeleteApplication(error.response.data.message));
  }
};

// Shortlist Resume
export const shortlistResume = ({ id, interviewDetails }) => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForPostApplication());
  try {
    const response = await axios.put(
      `${BASE_URL}/v1/application/employeer/selectResume/${id}`,
      interviewDetails,
      { withCredentials: true }
    );
    dispatch(applicationSlice.actions.updateApplicationInState(response.data.application));
    dispatch(applicationSlice.actions.successForPostApplication(response.data.message));
  } catch (error) {
    dispatch(applicationSlice.actions.failureForPostApplication(
      error.response?.data?.message || "Failed to shortlist resume"
    ));
  }
};

// Reject Resume
export const rejectResume = ({ id }) => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForPostApplication());
  try {
    const response = await axios.put(
      `${BASE_URL}/v1/application/employeer/rejectResume/${id}`,
      {},
      { withCredentials: true }
    );
    dispatch(applicationSlice.actions.updateApplicationInState(response.data.application));
    dispatch(applicationSlice.actions.successForPostApplication(response.data.message));
  } catch (error) {
    dispatch(applicationSlice.actions.failureForPostApplication(
      error.response?.data?.message || "Failed to reject resume"
    ));
  }
};

// Update Final Status
export const updateFinalStatus = ({ id, status, feedback = "" }) => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForPostApplication());
  try {
    const response = await axios.put(
      `${BASE_URL}/v1/application/employeer/updateFinalStatus/${id}`,
      { status, feedback },
      { withCredentials: true }
    );
    dispatch(applicationSlice.actions.updateApplicationInState(response.data.application));
    dispatch(applicationSlice.actions.successForPostApplication(response.data.message));
  } catch (error) {
    dispatch(applicationSlice.actions.failureForPostApplication(
      error.response?.data?.message || "Failed to update final status"
    ));
  }
};

// Reschedule Interview
export const rescheduleInterview = ({ id, interviewDetails }) => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForRescheduleInterview());
  try {
    const response = await axios.put(
      `${BASE_URL}/v1/application/employeer/rescheduleInterview/${id}`,
      interviewDetails,
      { withCredentials: true }
    );
    dispatch(applicationSlice.actions.updateApplicationInState(response.data.application));
    dispatch(applicationSlice.actions.successForRescheduleInterview(response.data.message));
  } catch (error) {
    dispatch(applicationSlice.actions.failureForRescheduleInterview(
      error.response?.data?.message || "Failed to reschedule interview"
    ));
  }
};

// Clear errors & reset
export const clearAllApplicationErrors = () => (dispatch) => {
  dispatch(applicationSlice.actions.clearAllErrors());
};

export const resetApplicationSlice = () => (dispatch) => {
  dispatch(applicationSlice.actions.resetApplicationSlice());
};

export default applicationSlice.reducer;
