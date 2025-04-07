import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/app/api";
import type { User } from "@/app/types";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: () => [...userKeys.lists()] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (userId: number) => [...userKeys.details(), userId] as const,
};

export const useUsers = (enabled: boolean = true) => {
  return useQuery<User[]>({
    queryKey: userKeys.lists(),
    queryFn: getUsers,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};
