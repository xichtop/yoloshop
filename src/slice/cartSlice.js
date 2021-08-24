import { createSlice } from '@reduxjs/toolkit';

const initialCarts = {
  products: [],
  quantity: 0,
  discount: 0,
  discountId: '',
};

const cart = createSlice({
  name: 'cart',
  initialState: initialCarts,
  reducers: {
    addProductCart: (state, action) => {
      state.products.push(action.payload);
      state.quantity += action.payload.Quantity;
      state.discount += 0;
      state.discountId += '';
    },

    updateProduct: (state, action) => {
      const temp = [];
      const newProduct = action.payload;
      var check = 0;
      state.products.forEach((product, index) => {
        if (product.ProductId.trim() === newProduct.ProductId.trim() && product.Color === newProduct.Color
          && product.Size === newProduct.Size) {
          check = index;
        }
      })
      state.products.forEach((product, index) => {
        if (index === check) {
          const newQuantity = product.Quantity + action.payload.Quantity < 1 ? 1 : product.Quantity + action.payload.Quantity;
          const addProduct = { ...product, Quantity: newQuantity };
          temp.push(addProduct);
        } else {
          temp.push(product);
        }
      })
      return {
        products: temp,
        quantity: state.quantity + action.payload.Quantity,
        discount: state.discount,
        discountId: state.discountId,
      }
    },

    removeProduct: (state, action) => {
      state.products.splice(action.payload.index, 1);
      state.quantity -= action.payload.quantity;
      state.discount += 0;
      state.discountId += '';
    },

    updateDiscount: (state, action) => {
      return {
        products: state.products,
        quantity: state.quantity,
        discount: action.payload.discount,
        discountId: action.payload.discountId,
      }
    },

    removeAll: () => {
      return {
        products: [],
        quantity: 0,
        discount: 0,
        discountId: '',
      }
    }

  }
});

const { reducer, actions } = cart;
export const { addProductCart, updateProduct, removeProduct, updateDiscount, removeAll } = actions;
export default reducer;