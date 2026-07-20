import { useQuery } from "@tanstack/react-query";
import axios from "../../../axios";

// Fetch bartender's shifts
const fetchMyShifts = async ({ page = 1, limit = 10, startDate = "", endDate = "" } = {}) => {
  const params = { page, limit };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const { data } = await axios.get("/shifts/my", { params });
  return {
    data: data?.data || [],
    pagination: data?.pagination || null,
  };
};

export const useGetMyShifts = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["my-shifts", params],
    queryFn: () => fetchMyShifts(params),
    placeholderData: (previousData) => previousData, // keepPreviousData replacement in modern React Query
    ...options,
  });
};

// Fetch single shift details by ID
const fetchMyShiftById = async (id) => {
  const { data } = await axios.get(`/shifts/my/${id}`);
  return data?.data || data || null;
};

export const useGetMyShiftById = (id, options = {}) => {
  return useQuery({
    queryKey: ["my-shift-detail", id],
    queryFn: () => fetchMyShiftById(id),
    enabled: !!id,
    ...options,
  });
};

// Fetch all shifts
const fetchAllShifts = async ({ page = 1, limit = 100, bartenderId = "", startDate = "", endDate = "", date = "" } = {}) => {
  const params = { page, limit };
  if (bartenderId) params.bartenderId = bartenderId;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (date) params.date = date;

  const { data } = await axios.get("/shifts", { params });
  return {
    data: data?.data || [],
    pagination: data?.pagination || null,
  };
};

export const useGetAllShifts = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["all-shifts", params],
    queryFn: () => fetchAllShifts(params),
    ...options,
  });
};

