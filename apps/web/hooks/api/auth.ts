import { trpc } from "../../trpc/client";

export const useGoogleAuthentication = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: authenticationWithGoogleMutateAsync,
    mutate: authenticationWithGoogleMutate,
    error,
    isError,
    isPending,
    isSuccess,
    isIdle,
  } = trpc.auth.authenticationWithGoogle.useMutation({
    onSuccess: async () => {
      await utils.auth.getLoggedInUserInfo.invalidate();
    },
  });
  return {
    authenticationWithGoogleMutateAsync,
    authenticationWithGoogleMutate,
    error,
    isError,
    isPending,
    isSuccess,
    isIdle,
  };
};

export const useGetAuthenticationMethods = () => {
  const {
    data: methods,
    isLoading,
    isError,
    error,
  } = trpc.auth.getAuthenticationMethods.useQuery();

  return {
    methods: methods ?? [],
    isLoading,
    isError,
    error,
  };
};

export const useUser = () => {
  const {
    data: userInfo,
    error,
    isError,
    isPending,
    isSuccess,
    isLoading,
  } = trpc.auth.getLoggedInUserInfo.useQuery();
  return {
    userInfo,
    error,
    isError,
    isPending,
    isSuccess,
    isLoading,
  };
};
