import { AxiosInstance } from "../../context/axiosInstance";

const API_BASE = "/api/v1/messages";

/**
 * Fetch messages between current user and the given partner (other user id).
 * @param {string} partnerId - The other user's _id
 * @returns {Promise<{ data: { data: import("../../types").Message[] } }>}
 */
export const fetchMessages = async (partnerId) => {
  const response = await AxiosInstance.get(
    `${API_BASE}/get-messages/${partnerId}`
  );
  return response;
};
