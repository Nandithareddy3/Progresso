import axios from 'axios';

const API_URL = 'https://progresso-pobl.onrender.com/api/chores/';

// Create a new chore
const createChore = async (choreData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, choreData, config);
    return response.data;
};

// Get all chores for a household
const getHouseholdChores = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const choreService = {
    createChore,
    getHouseholdChores,
};

export default choreService;