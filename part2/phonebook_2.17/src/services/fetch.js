import axios from "axios";

const baseUrl = "http://localhost:3001/persons";

export const getAll = () => axios.get(baseUrl).then(response => response.data);
export const createItem = newObject => axios.post(baseUrl, newObject).then(response => response.data);
export const deleteItem = id => axios.delete(`${baseUrl}/${id}`).then(response => response.data);
export const updateItem = (id, newObject) => axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data);