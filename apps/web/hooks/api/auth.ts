import { trpc } from "../../trpc/client";

export const useGoogleAuthentication = () => {
  const {
    mutateAsync: authenticationWithGoogleMutateAsync,
    mutate: authenticationWithGoogleMutate,
    error,
    isError,
    isPending,
    isSuccess,
    isIdle,
  } = trpc.auth.authenticationWithGoogle.useMutation();
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
