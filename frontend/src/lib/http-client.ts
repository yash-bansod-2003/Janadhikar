import axios from "axios";
import { configuration } from "@/lib/configuration";

const httpClient = axios.create({
  baseURL: configuration.apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export { httpClient };
