import { useQuery } from "@tanstack/react-query";
import axios from "../../../axios";

// Fetch dashboard data for bartender
const fetchDashboard = async () => {
  const { data } = await axios.get("/dashboard");
  return data?.data || null;
};

export const useGetDashboard = (options = {}) => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    ...options,
  });
};
