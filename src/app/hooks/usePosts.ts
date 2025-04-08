import type { PaginatedResponse, Post } from "@/app/types";
import { getPosts, deletePost, createPost } from "@/app/api";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: {
    page?: number;
    limit?: number;
    search?: string;
    userId?: number;
  }) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (postId: number) => [...postKeys.details(), postId] as const,
  infinite: () => [...postKeys.all, "infinite"] as const,
  infiniteList: (filters: {
    limit?: number;
    search?: string;
    userId?: number;
  }) => [...postKeys.infinite(), filters] as const,
};

export const usePosts = (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  userId?: number,
  enabled: boolean = true,
  refetchInterval?: number,
  placeholderData?: PaginatedResponse<Post>
) => {
  return useQuery<PaginatedResponse<Post>, Error>({
    queryKey: postKeys.list({ page, limit, search, userId }),
    queryFn: () => getPosts(page, limit, search, userId),
    enabled,
    refetchInterval,
    placeholderData,
    select: (data) => {
      return {
        ...data,
        data: data.data.map((post) => ({
          ...post,
          shortTitle:
            post.title.length > 30
              ? post.title.slice(0, 30) + "..."
              : post.title,
        })),
      };
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onMutate: async (postId: number) => {
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });

      const previousQueriesData = new Map();

      queryClient
        .getQueriesData<PaginatedResponse<Post>>({ queryKey: postKeys.lists() })
        .forEach(([queryKey, queryData]) => {
          if (queryData) {
            previousQueriesData.set(queryKey, queryData);
          }

          queryClient.setQueryData<PaginatedResponse<Post>>(
            queryKey,
            (oldData) => {
              if (oldData) {
                return {
                  ...oldData,
                  data: oldData.data.filter((post) => post.id !== postId),
                };
              }
            }
          );
        });

      return { previousQueriesData };
    },
    onError: (error, postId, context) => {
      if (context?.previousQueriesData) {
        context.previousQueriesData.forEach((queryData, queryKey) => {
          queryClient.setQueryData<PaginatedResponse<Post>>(
            queryKey,
            queryData
          );
        });
      }
    },
    onSuccess: (postId: number) => {
      queryClient.removeQueries({ queryKey: postKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

export const useInfinitePosts = (
  limit: number = 10,
  search: string = "",
  userId?: number,
  enabled: boolean = true
) => {
  return useInfiniteQuery<PaginatedResponse<Post>, Error>({
    queryKey: postKeys.infiniteList({ limit, search, userId }),
    queryFn: ({ pageParam = 1 }) =>
      getPosts(pageParam as number, limit, search, userId),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, limit, totalCount } = lastPage;
      const totalPages = Math.ceil(totalCount / limit);
      return page < totalPages ? page + 1 : undefined;
    },
    enabled,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: Omit<Post, "id">) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};
