import { useMutation } from "@tanstack/react-query";
import { requestTimeOff, requestShiftSwap } from "../api/Post";

export const useRequestTimeOff = () => {
  return useMutation({
    mutationFn: requestTimeOff,
  });
};

export const useRequestShiftSwap = () => {
  return useMutation({
    mutationFn: requestShiftSwap,
  });
};
