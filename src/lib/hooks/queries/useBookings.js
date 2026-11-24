import { useQuery } from "@tanstack/react-query";
import axios from "../../../axios";

// Fetch workforce bookings for bartender's assigned lounge
// Supports: page, limit, status, startDate, endDate, sort
const fetchWorkforceBookings = async ({
  page = 1,
  limit = 10,
  status = "",
  startDate = "",
  endDate = "",
  sort = "",
} = {}) => {
  const params = { page, limit };
  if (status && status !== "all") params.status = status;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (sort) params.sort = sort;

  const { data } = await axios.get("/bookings/workforce", { params });
  return {
    data: data?.data || data?.bookings || [],
    pagination: data?.pagination || null,
    totalRecords:
      data?.pagination?.totalDocs ??
      data?.pagination?.total ??
      data?.pagination?.totalBookings ??
      (data?.data || []).length,
  };
};

export const useGetWorkforceBookings = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["workforce-bookings", params],
    queryFn: () => fetchWorkforceBookings(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

// Fetch single booking detail by ID
const fetchBookingDetail = async (id) => {
  const { data } = await axios.get(`/bookings/${id}`);
  return data?.data || data || null;
};

export const useGetBookingDetail = (id, options = {}) => {
  return useQuery({
    queryKey: ["booking-detail", id],
    queryFn: () => fetchBookingDetail(id),
    enabled: !!id,
    ...options,
  });
};
