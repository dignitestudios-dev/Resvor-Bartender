import { useMutation } from "@tanstack/react-query";
import { submitLogin, updateFcmToken, submitLogout } from "../api/Post";

export const useLogin = () => {
  return useMutation({
    mutationFn: submitLogin,
  });
};

export const useUpdateFcmToken = () => {
  return useMutation({
    mutationFn: updateFcmToken,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: submitLogout,
  });
};
