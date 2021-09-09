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

  getAll: (email, token) => {
    const url = `/order/all/${email}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  getAllByStatus: (email, status, token) => {
    const url = `/order/all/${email}/${status}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  },

  update: (orderid, token) => {
    const url = `/order/update/${orderid}`;
    return axiosClient.get(url, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
  });
  }

}

export default orderApi;