// features/formSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  password: "",
  dob: "",
  gender: "",
  nationality: "",
  maritialStatus: "",
  country: "",
  city: "",
  coverLetter: "",
  resume: null,
  roleSeeking: "",
  locationPreference: "",
  approvalCertification: "",
  educationQualification: "",
  totalExperience: "",
  companyType: "",
  companyName: "",
  companyLocation: "",
  countryCode: "+91",
};

const formSlice = createSlice({
  name: "registrationForm",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearFormData: () => initialState,
  },
});

export const { setFormData, clearFormData } = formSlice.actions;
export default formSlice.reducer;