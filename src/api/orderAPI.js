import axiosClient from "./axiosClient";

const orderApi = {
  addItem: (item, token) => {
    const url = '/order/add';
    return axiosClient.post(url, item, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  getAll: (email) => {
    const url = `/order/all/${email}`;
    return axiosClient.get(url);
  },

  getAllByStatus: (email, status) => {
    const url = `/order/all/${email}/${status}`;
    return axiosClient.get(url);
  },

  update: (orderid) => {
    const url = `/order/update/${orderid}`;
    return axiosClient.get(url);
  }

}

export default orderApi;