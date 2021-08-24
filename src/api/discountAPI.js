import axiosClient from "./axiosClient";

const discountApi = {
  getAll: (params) => {
    const url = '/discount';
    return axiosClient.get(url, { params });
  },

  get: (id) => {
    const url = `/discount/${id}`;
    return axiosClient.get(url);
  },
}

export default discountApi;