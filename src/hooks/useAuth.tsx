"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/services/userSessions/saveCookie";
import { putUserSessions } from "@/services/userSessions/functions";
import { getMasterData } from "@/services/masterData/functions";

export const useAuth = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!sessionStorage.getItem("masterData")) {
        await getMasterData();
      }

      const token = await getCookie("token");
      const refreshToken = await getCookie("refreshToken");
      const apikey = await getCookie("apikey");

      const tokenValue = token?.value;
      const refreshTokenValue = refreshToken?.value;
      const apiKeyValue = apikey?.value;

      if (!tokenValue && (!refreshTokenValue || !apiKeyValue)) {
        setIsAuthenticated(false);
        router.replace("/login");
        return;
      }

      if (!tokenValue && refreshTokenValue) {
        const response = await putUserSessions(refreshTokenValue);
        if (!response) {
          setIsAuthenticated(false);
          router.replace("/login");
          return;
        }
      }

      setIsAuthenticated(true);
    };

    checkAuth();
  }, [router]);

  return isAuthenticated;
};