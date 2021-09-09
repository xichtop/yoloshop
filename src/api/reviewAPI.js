import axiosClient from "./axiosClient";

const reviewAPI = {
  getAll: (params) => {
    const url = '/reviews';
    return axiosClient.get(url, { params });
  },

  get: (id) => {
    const url = `/reviews/${id}`;
    return axiosClient.get(url);
  },

  addItem: (item, token) => {
    const url = '/reviews/add';
    return axiosClient.post(url, item, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  }
}

export default reviewAPI;