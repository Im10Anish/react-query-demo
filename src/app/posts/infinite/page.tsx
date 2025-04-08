"use client";

import { useInfinitePosts } from "@/app/hooks/usePosts";
import { useUsers } from "@/app/hooks/useUsers";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Spinner from "@/app/components/Spinner";

export default function InfinitePosts() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<number | undefined>(
    undefined
  );
  const limit = 10;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfinitePosts(limit, search, selectedUser);

  const { data: users, isLoading: isLoadingUsers } = useUsers();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleUserFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value ? parseInt(e.target.value) : undefined;
    setSelectedUser(userId);
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const posts = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">Infinite Posts</h1>
        <div className="flex space-x-2">
          <Link href="/posts" className="btn btn-secondary">
            Standard Pagination
          </Link>
          <Link href="/posts/new" className="btn btn-primary">
            Create New Post
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search form */}
          <div className="flex-1">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="form-input flex-1"
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>
          </div>

          {/* User filter */}
          <div className="md:w-1/4">
            <select
              value={selectedUser?.toString() || ""}
              onChange={handleUserFilterChange}
              className="form-select w-full"
              disabled={isLoadingUsers}
            >
              <option value="">All Users</option>
              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner size="large" />
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md my-4">
            <p>
              Error loading posts:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        )}

        {/* Posts grid with infinite loading */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post, index) => (
              <div
                key={post.id}
                ref={index === posts.length - 1 ? lastPostRef : null}
                className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-5">
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">
                    <Link
                      href={`/posts/${post.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 text-sm mb-3">
                    User ID: {post.userId}
                  </p>
                  <p className="text-gray-700 line-clamp-3 mb-4">{post.body}</p>
                  <div className="flex justify-end">
                    <Link
                      href={`/posts/${post.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom loading indicator */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-8">
            <Spinner />
            <span className="ml-2">Loading more posts...</span>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && posts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No posts found</p>
          </div>
        )}

        {/* Load more button (alternative to intersection observer) */}
        {!isFetchingNextPage && hasNextPage && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchNextPage()}
              className="btn btn-secondary"
              disabled={isFetchingNextPage}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
