import { useMutation } from "@tanstack/react-query";
import { submitLogin } from "../api/Post";

export const useLogin = () => {
  return useMutation({
    mutationFn: submitLogin,
  });
};
