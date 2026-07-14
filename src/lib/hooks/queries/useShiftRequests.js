import { useQuery } from "@tanstack/react-query";
import axios from "../../../axios";

// Fetch bartender's own shift/time-off requests
const fetchMyShiftRequests = async ({ page = 1, limit = 10, status = "" } = {}) => {
  const params = { page, limit };
  if (status && status !== "all") {
    params.status = status;
  }

  const { data } = await axios.get("/shift-requests/my", { params });
  return {
    data: data?.data || [],
    pagination: data?.pagination || null,
  };
};

export const useGetMyShiftRequests = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["my-shift-requests", params],
    queryFn: () => fetchMyShiftRequests(params),
    placeholderData: (previousData) => previousData, // keepPreviousData replacement in modern React Query
    ...options,
  });
};
