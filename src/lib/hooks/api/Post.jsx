import axios from "../../../axios";

// Example: Login Mutation
export const submitLogin = async (credentials) => {
  const { data } = await axios.post("/auth/login", credentials);
  return data;
};

export const requestTimeOff = async (payload) => {
  const { data } = await axios.post("/shift-requests/time-off", payload);
  return data;
};

export const requestShiftSwap = async (payload) => {
  const { data } = await axios.post("/shift-requests/swap", payload);
  return data;
};

export const updateFcmToken = async (payload) => {
  const { data } = await axios.post("/auth/update-fcm", payload);
  return data;
};

export const submitLogout = async () => {
  const { data } = await axios.post("/auth/logout");
  return data;
};

