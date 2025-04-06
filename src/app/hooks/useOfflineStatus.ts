import { useState, useEffect } from "react";
import { onlineManager } from "@tanstack/react-query";

export const useOfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(onlineManager.isOnline());

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    onlineManager.setEventListener((setOnline) => {
      setOnline(navigator.onLine);

      window.addEventListener("online", () => setOnline(true));
      window.addEventListener("offline", () => setOnline(false));

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      onlineManager.setEventListener(() => () => {});
    };
  }, []);

  return { isOnline };
};
