import axios from "axios";
import type { Post, User, Comment, PaginatedResponse } from "../types";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Posts API
export const getPosts = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  userId?: number
): Promise<PaginatedResponse<Post>> => {
  const params: { _page: number; _limit: number; userId?: number } = {
    _page: page,
    _limit: limit,
  };

  if (userId) {
    params.userId = userId;
  }
  const response = await apiClient.get<Post[]>(`/posts`, { params });

  // For search functionality, we are filtering the posts on the client side as JSONPlaceholder API does not support search queries.
  let filteredPosts = response.data;
  if (search) {
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.body.toLowerCase().includes(search.toLowerCase())
    );
  }
  return {
    data: filteredPosts,
    totalCount: parseInt(response.headers["x-total-count"] || "0"),
    page,
    limit,
  } as PaginatedResponse<Post>;
};

export const getPostById = async (postId: number): Promise<Post> => {
  const response = await apiClient.get<Post>(`/posts/${postId}`);
  return response.data;
};

export const createPost = async (post: Omit<Post, "id">): Promise<Post> => {
  const response = await apiClient.post<Post>(`/posts`, post);
  return response.data;
};

export const updatePost = async (
  postId: number,
  post: Partial<Post>
): Promise<Post> => {
  const response = await apiClient.put<Post>(`/posts/${postId}`, post);
  return response.data;
};

export const deletePost = async (postId: number): Promise<number> => {
  await apiClient.delete(`/posts/${postId}`);
  return postId;
};

// Users API
export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>(`/users`);
  return response.data;
};

export const getUserById = async (userId: number): Promise<User> => {
  const response = await apiClient.get<User>(`/users/${userId}`);
  return response.data;
};

// Comments API
export const getCommentsByPostId = async (
  postId: number
): Promise<Comment[]> => {
  const response = await apiClient.get<Comment[]>(`/posts/${postId}/comments`);
  return response.data;
};
