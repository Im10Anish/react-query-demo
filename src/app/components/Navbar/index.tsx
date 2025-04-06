"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { postKeys } from "@/app/hooks/usePosts";

const Navbar = () => {
  const pathName = usePathname();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: postKeys.list({ page: 1, limit: 10 }),
      queryFn: () =>
        import("@/app/api").then((apiClient) => apiClient.getPosts(1, 10)),
    });

    queryClient.prefetchQuery({
      queryKey: ["users", "list"],
      queryFn: () =>
        import("@/app/api").then((apiClient) => apiClient.getUsers()),
    });
  }, [queryClient]);

  const isActive = (path: string) => {
    return pathName === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Blog Manager
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/")
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/posts"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/posts") ||
                  (pathName.startsWith("/posts/") &&
                    !pathName.includes("/suspense") &&
                    !pathName.includes("/infinite") &&
                    !pathName.includes("/parallel") &&
                    !pathName.includes("/dependent"))
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Posts
              </Link>
              <Link
                href="/posts/infinite"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathName.includes("/infinite")
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Infinite
              </Link>
              <Link
                href="/posts/suspense"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathName.includes("/suspense")
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Suspense
              </Link>
              <Link
                href="/posts/parallel"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathName.includes("/parallel")
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Parallel
              </Link>
              <Link
                href="/posts/dependent"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathName.includes("/dependent")
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Dependent
              </Link>
              <Link
                href="/users"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/users") || pathName.startsWith("/users/")
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Users
              </Link>
              <Link
                href="/react-query-features"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/react-query-features")
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Features
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
