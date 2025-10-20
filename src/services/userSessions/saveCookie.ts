// Client-side cookie functions for static export compatibility
import Cookies from 'js-cookie';

type Cookie = { name: string; data: string; time: number };

export const saveCookie = async ({ name, data, time }: Cookie) => {
  Cookies.set(name, data, { expires: time / (24 * 60 * 60) }); // Convert seconds to days
};

export const getCookie = async (name: string) => {
  const result = Cookies.get(name);
  return result ? { name, value: result } : null;
};

export const deleteCookie = async (name: string) => {
  Cookies.remove(name);
  return true;
};
