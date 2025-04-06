import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">React Query Demo Dashboard</h1>
        <p className="mb-4">
          Welcome to this comprehensive demonstration of TanStack Query (React
          Query) with Next.js!
        </p>
        <p>
          This application showcases various React Query features including:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li>Data fetching with pagination, filtering, and search</li>
          <li>Mutations for creating, updating, and deleting data</li>
          <li>Query invalidation and cache management</li>
          <li>Conditional fetching based on dependencies</li>
          <li>Auto-refreshing data with refetchInterval</li>
          <li>Loading and error states</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Server-side rendering with Next.js App Router</li>
            <li>TypeScript for type safety</li>
            <li>Tailwind CSS for styling</li>
            <li>JSONPlaceholder API for demo data</li>
            <li>Responsive design</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Get Started</h2>
          <p className="mb-4">
            Navigate to the Posts page to see React Query in action. You can:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Browse paginated posts</li>
            <li>Filter by user</li>
            <li>Search by title or content</li>
            <li>Create, edit, and delete posts</li>
            <li>View post details and comments</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/posts"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-bold mb-3 text-blue-600">
            Standard Queries
          </h2>
          <p className="text-gray-700">
            Explore basic queries with pagination, filtering, and search
          </p>
        </Link>

        <Link
          href="/posts/infinite"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-bold mb-3 text-blue-600">
            Infinite Queries
          </h2>
          <p className="text-gray-700">
            See infinite scrolling in action with useInfiniteQuery
          </p>
        </Link>

        <Link
          href="/posts/suspense"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-bold mb-3 text-blue-600">
            Suspense Integration
          </h2>
          <p className="text-gray-700">
            Experience React 18 Suspense with React Query
          </p>
        </Link>

        <Link
          href="/posts/parallel"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-bold mb-3 text-blue-600">
            Parallel Queries
          </h2>
          <p className="text-gray-700">
            Load multiple resources simultaneously
          </p>
        </Link>

        <Link
          href="/posts/dependent"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-bold mb-3 text-blue-600">
            Dependent Queries
          </h2>
          <p className="text-gray-700">
            Chain queries that depend on previous results
          </p>
        </Link>

        <Link
          href="/react-query-features"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-bold mb-3 text-blue-600">
            Advanced Features
          </h2>
          <p className="text-gray-700">
            Explore all React Query features in one place
          </p>
        </Link>
      </div>
    </div>
  );
}
