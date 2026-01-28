
import { AxiosIntance} from "../../context/axiosintance"

const API_BASE = '/api/v1/friendship';

export const fetchUserFriends = async () => {
    const response = await AxiosIntance.get(`${API_BASE}/get-friend-list`)
    return response;
}