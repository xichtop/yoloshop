import axiosClient from "./axiosClient";

const productVariantAPI = {
  getAll: (params) => {
    const url = '/productvariants';
    return axiosClient.get(url, { params });
  },

  get: (id) => {
    const url = `/productvariants/${id}`;
    return axiosClient.get(url);
  },
}

export default productVariantAPI;