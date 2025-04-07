"use client";
import { useState, useTransition } from "react";
import { useQueryCache } from "@/app/hooks/useQueryCache";

import { usePosts, useDeletePost } from "@/app/hooks/usePosts";
import { useUsers } from "@/app/hooks/useUsers";
import Link from "next/link";
import Spinner from "@/app/components/Spinner";
import Pagination from "@/app/components/Pagination";

const PostListing = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(
    undefined
  );
  const [autoRefresh, setAutoRefresh] = useState(false);

  const [isPending, startTransition] = useTransition();

  const queryCache = useQueryCache();

  const {
    data: postsData,
    isLoading: isLoadingPosts,
    isFetching,
    isRefetching,
    isStale,
    refetch,
    isPreviousData,
    isError: isErrorPosts,
    error: postsError,
  } = usePosts(
    page,
    limit,
    search,
    selectedUserId,
    true,
    autoRefresh ? 1000 : undefined
  );

  const { data: users, isLoading: isLoadingUsers } = useUsers();

  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      setPage(newPage);
    });
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      setLimit(Number(e.target.value));
      setPage(1);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      setSearch(searchInput);
      setPage(1); // Reset to first page when searching
    });
  };

  const handleUserFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    startTransition(() => {
      setSelectedUserId(value === "" ? undefined : Number(value));
      setPage(1); // Reset to first page when filtering
    });
  };

  // Manual refetch handler
  const handleManualRefetch = () => {
    refetch();
  };

  // Manual clear cache handler
  const handleClearCache = () => {
    queryCache.clearCache();
  };

  // Handle delete post
  const handleDeletePost = (id: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(id);
    }
  };

  // Calculate total pages
  const totalPages = postsData?.totalCount
    ? Math.ceil(postsData.totalCount / limit)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">Posts</h1>
        <div className="flex space-x-2">
          <Link href="/posts/infinite" className="btn btn-secondary">
            Infinite Scroll View
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
                disabled={isPending}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPending}
              >
                {isPending ? <Spinner size="small" /> : "Search"}
              </button>
            </form>
          </div>
          <div className="md:w-1/4">
            <select
              value={selectedUserId?.toString() || ""}
              onChange={handleUserFilterChange}
              className="form-select w-full"
              disabled={isLoadingUsers || isPending}
            >
              <option value="">All Users</option>
              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="auto-refresh"
                checked={autoRefresh}
                onChange={() => setAutoRefresh(!autoRefresh)}
                className="mr-2"
              />
              <label htmlFor="auto-refresh" className="text-sm">
                Auto-refresh (10s)
              </label>
            </div>
            <button
              onClick={handleManualRefetch}
              className="btn btn-secondary btn-sm"
              disabled={isRefetching}
            >
              {isRefetching ? <Spinner size="small" /> : "↻ Refresh"}
            </button>
            <button
              onClick={handleClearCache}
              className="btn btn-secondary btn-sm"
              title="Clear the query cache"
            >
              Clear Cache
            </button>
          </div>
        </div>
        {isLoadingPosts && (
          <div className="flex justify-center py-8">
            <Spinner size="large" />
          </div>
        )}

        {isErrorPosts && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md my-4">
            <p>
              Error loading posts:{" "}
              {postsError instanceof Error
                ? postsError.message
                : "Unknown error"}
            </p>
          </div>
        )}

        {!isLoadingPosts && !isErrorPosts && (
          <>
            {isPreviousData && (
              <div className="bg-blue-50 text-blue-600 p-2 rounded-md mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Showing previous data while loading new results...</span>
              </div>
            )}
            {isFetching && !isLoadingPosts && (
              <div className="bg-gray-50 text-gray-600 p-2 rounded-md mb-4 flex items-center">
                <Spinner size="small" />
                <span className="ml-2">Updating data...</span>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {postsData?.data.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <Link
                          href={`/posts/${post.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {post.title}
                        </Link>
                        <p className="text-gray-500 truncate max-w-md">
                          {post.body.substring(0, 100)}...
                        </p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.userId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/posts/${post.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={isDeleting}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {postsData?.data.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No posts found</p>
              </div>
            )}
          </>
        )}

        <div className="mt-6 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <select
              value={limit}
              onChange={handleLimitChange}
              className="form-select"
              disabled={isPending}
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <div className="mt-4 md:mt-0 text-sm text-gray-600">
            {isPending ? (
              <span className="flex items-center">
                <Spinner size="small" />
                <span className="ml-2">Loading...</span>
              </span>
            ) : (
              <span>
                Showing {postsData?.data.length || 0} of{" "}
                {postsData?.totalCount || 0} posts
                {isStale && (
                  <span className="ml-1 text-amber-600">(stale)</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostListing;
