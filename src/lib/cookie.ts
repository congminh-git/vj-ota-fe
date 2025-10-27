"use client";
import Cookies from "js-cookie";

export const setCookie = (
  name: string,
  value: string,
  days: number = 7
) => {
  Cookies.set(name, value, {
    expires: days,
    path: "/",
    sameSite: "None",
    secure: true, // nếu dùng HTTPS
  });
};

export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

export const removeCookie = (name: string) => {
  Cookies.remove(name);
};
