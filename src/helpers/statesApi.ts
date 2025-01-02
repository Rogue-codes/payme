import axios from "axios";

export const getAllStates = async () => {
    const response = await axios.get(`https://nga-states-lga.onrender.com/fetch`);
    return response.data;
}

export const getLocalGovernments = async (state:string) => {
    const response = await axios.get(`https://nga-states-lga.onrender.com/?state=${state}`);
    return response.data;
}