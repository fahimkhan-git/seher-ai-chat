import axios from "axios";

const buildTimeBaseUrl = import.meta.env.VITE_API_BASE_URL;
const runtimeBaseUrl =
  typeof window !== "undefined" ? window.__HOMESFY_API_BASE_URL : undefined;

export const api = axios.create({
  baseURL:
    runtimeBaseUrl ||
    buildTimeBaseUrl ||
    "https://api-alpha-ten-43-dzidx3jt6-fahimkhan-gits-projects.vercel.app",
});


