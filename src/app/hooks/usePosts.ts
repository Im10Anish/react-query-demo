export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: {
    page?: number;
    limit?: number;
    search?: string;
    userId?: number;
  }) => [...postKeys.lists(), filters] as const,
};
