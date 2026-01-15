"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/services/userSessions/saveCookie";
import { putUserSessions } from "@/services/userSessions/functions";
import { getMasterData } from "@/services/masterData/functions";

export const useAuth = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<any>();

  useEffect(() => {
    const checkAuth = async () => {
      // Kiểm tra masterData trong sessionStorage
      if (!sessionStorage.getItem("masterData")) {
        await getMasterData();
      }
      const token: any = await getCookie("token");
      const refreshToken: any = await getCookie("refreshToken");
      const apikey: any = await getCookie("apikey");
      if (!token && (!refreshToken || !apikey)) {
        router.push("/login");
        setIsAuthenticated(true)
        return;
      } else if (!token && refreshToken && refreshToken.value) {
        const response = await putUserSessions(refreshToken.value)
        if (!response) {
          router.push("/login");
        }
      }
    };

    checkAuth(); // Gọi hàm async bên trong useEffect
  }, [router]);

  return isAuthenticated;
};
