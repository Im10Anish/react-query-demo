import { useQueryClient } from "@tanstack/react-query";

export const useQueryCache = () => {
  const queryClient = useQueryClient();

  return {
    getAllQueries: () => {
      return queryClient.getQueryCache().getAll();
    },

    clearCache: () => {
      return queryClient.clear();
    },

    resetQuery: (queryKey: unknown[]) => {
      return queryClient.resetQueries({ queryKey });
    },

    setQueryData: (queryKey: unknown[], data: unknown) => {
      return queryClient.setQueryData(queryKey, data);
    },

    removeQueries: (queryKey: unknown[]) => {
      return queryClient.removeQueries({ queryKey });
    },

    refetchQueries: (queryKey: unknown[]) => {
      return queryClient.refetchQueries({ queryKey });
    },

    getQueryClient: () => {
      return queryClient;
    },
  };
};
