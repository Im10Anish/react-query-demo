"use client";
import { useOfflineStatus } from "@/app/hooks/useOfflineStatus";
const OfflineIndicator = () => {
  const { isOnline } = useOfflineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 inset-x-0 bg-red-600 text-white py-2 text-center">
      <p className="text-sm font-medium">
        You are currently offline. Some features may be unavailable.
      </p>
    </div>
  );
};

export default OfflineIndicator;
