import { trpc } from "../../trpc/client";

export const useHealth = () => {
  const { isError, error, data, isFetching, isLoading, status } = trpc.health.getHealth.useQuery();
  return {
    isError,
    error,
    data,
    isFetching,
    isLoading,
    status,
  };
};
