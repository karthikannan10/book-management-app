import axios from "axios";

const API_BASE = "http://localhost:5000";

export const getBooks = async () => {
    const response = await axios.get(`${API_BASE}/books`);
    console.log("Response", response)
    return response?.data;
};

export const createBook = async (book) => {
    const response = await axios.post(`${API_BASE}/books`, book);
    return response?.data;
};

export const updateBook = async (id, book) => {
    const response = await axios.put(`${API_BASE}/books/${id}`, book);
    return response?.data;
};

export const deleteBook = async (id) => {
    await axios.delete(`${API_BASE}/books/${id}`);
    return id;
};
