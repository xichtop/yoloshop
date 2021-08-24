import axiosClient from "./axiosClient";

const ProductSizeAPI = {
  getAll: (params) => {
    const url = '/quantitybysize';
    return axiosClient.get(url, { params });
  },

  get: (id) => {
    const url = `/quantitybysize/${id}`;
    return axiosClient.get(url);
  },
}

export default ProductSizeAPI;