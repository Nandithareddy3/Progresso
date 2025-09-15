

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/assignments/';


const getMyAssignments = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL + 'my', config);
    return response.data;
};
const createAssignment = async (assignmentData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, assignmentData, config);
    return response.data;
};

const updateAssignmentStatus = async (assignmentId, isComplete, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + assignmentId, { isComplete }, config);
    return response.data;
};

const getHouseholdAssignments = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'household', config);
    return response.data;
};
const getAssignmentHistory = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'history', config);
    return response.data;
};

const assignmentService = {
    getMyAssignments,
    createAssignment,
    updateAssignmentStatus,
    getHouseholdAssignments,
    getAssignmentHistory,
};
export default assignmentService;