import axiosRoot from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export const axios = axiosRoot.create({ baseURL: baseUrl });

export function setAuthToken(token) {
    if (token) {
        axios.defaults.headers["Authorization"] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers["Authorization"];
    }
}

export async function getAll(url) {
    const response = await axios.get(`${baseUrl}/${url}`);
    return response.data;
}

export async function updateById(url, { arg: body }) {
    const { id, ...values } = body;
    const response = await axios.put(`${baseUrl}/${url}/${id}`, values);
    return response.data;
}

export async function deleteById(url, { arg: id }) {
    await axios.delete(`${baseUrl}/${url}/${id}`);
}

export async function post(url, { arg: body }) {
    const response = await axios.post(`${baseUrl}/${url}`, body);
    return response.data;
}
