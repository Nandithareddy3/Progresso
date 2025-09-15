
import axios from 'axios';

const API_URL = 'https://progresso-pobl.onrender.com/api/users/';

const getProfile = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL + 'profile', config);
    return response.data;
};
const getUserStats = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'stats', config);
    return response.data;
};

const userService = {
    getProfile,
    getUserStats,
};
export default userService;