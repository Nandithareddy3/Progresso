import axios from 'axios';
const API_URL = 'http://localhost:5000/api/households/';

// Create a new household
const createHousehold = async (householdData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, householdData, config);
    return response.data;
};


// Join an existing household
const joinHousehold = async (inviteCodeData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL + 'join', inviteCodeData, config);
    return response.data;
};

// Get the household leaderboard
const getLeaderboard = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + 'leaderboard', config);
    return response.data;
};

const householdService = {
    createHousehold,
    joinHousehold,
    getLeaderboard,
};

export default householdService;