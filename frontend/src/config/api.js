import Axios from "axios";

export const baseURL = process.env.REACT_APP_BASE_URL;

const api = Axios.create({ baseURL });

api.interceptors.request.use(async (request) => {
  // Handle data transformation (optional)
  if (request.data && typeof request.data === "object") {
    request.data = new URLSearchParams(request.data).toString();
  }

  // Add Bearer token if available and valid
  const accessToken = localStorage.getItem("access_token")?.trim();
  if (accessToken) {
    request.headers["Authorization"] = `Bearer ${accessToken}`; // Use template literal for clarity
  }

  request.headers["Content-Type"] = "application/x-www-form-urlencoded";
  return request;
});

api.interceptors.response.use(
  async (response) => {
    // Handle successful responses
    if (response?.status === 201 || response?.status === 200) {
      return response;
    } else if (response?.status === 204) {
      return Promise.reject(""); // No content, consider appropriate handling
    } else {
      return Promise.reject(response?.data ?? "Something Went Wrong");
    }
  },
  async (error) => {
    // Handle errors based on status codes
    if (error?.response?.status === 401) {
      return Promise.reject(error?.response?.data || "Unauthorized");
    } else if (error?.response?.status > 400) {
      return Promise.reject("Server Error"); // Generic error message for other client errors
    }

    return Promise.reject(
      error?.response?.data?.message ??
        error?.toString() ??
        "Something Went Wrong"
    );
  }
);

export default api;
