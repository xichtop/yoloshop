import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import numberWithCommas from '../utils/numberWithCommas';
import { Link } from 'react-router-dom'
import { updateProduct, removeProduct, updateDiscount } from '../slice/cartSlice'
import discountAPI from '../api/discountAPI';
import productAPI from '../api/productAPI';

import '../sass/css/cart.css';

import { store } from 'react-notifications-component';

const Cart = () => {

    const products = useSelector(state => state.cart.products);

    const discount = useSelector(state => state.cart.discount);

    const user = useSelector(state => state.user.user);

    const token = useSelector(state => state.user.token);

    const [total, setTotal] = useState(0);

    const [inputDiscount, setInputDiscount] = useState('');

    const [quantities, setQuantities] = useState([]);

    const dispatch = useDispatch();

    const history = useHistory();

    const configNotify = {
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 2000,
            onScreen: true
        }
    }

    const updateQuantity = (type, product) => {
        var newProduct = {};
        if (type === 'plus') {
            newProduct = {
                ...product,
                Quantity: 1,
            };
            const action = updateProduct(newProduct);
            dispatch(action);
        } else {
            const productTemp = products.find(item => item.ProductId === product.ProductId);
            if(productTemp.Quantity === 1) {
                newProduct = {
                    ...product,
                    Quantity: 0,
                };
                const action = updateProduct(newProduct);
                dispatch(action);
            } else {
                newProduct = {
                    ...product,
                    Quantity: -1,
                };
                const action = updateProduct(newProduct);
                dispatch(action);
            }
            
        }
    }

    const handleRemove = (index, quantity) => {
        const item = {
            index,
            quantity,
        };
        const action = removeProduct(item);
        dispatch(action);
    }

    const handleDiscountChange = (e) => {
        e.preventDefault();
        setInputDiscount(e.target.value);
    }

    const handleDiscount = async (e) => {
        e.preventDefault();
        if (inputDiscount.trim() === '') {
            store.addNotification({
                title: "Mã giảm giá!",
                message: `Vui lòng nhập mã giảm giá`,
                type: "warning",
                ...configNotify
            });
        } else {
            try {
                var result = [];
                result = await discountAPI.get(inputDiscount.trim(), token);
                if (result.length === 0) {
                    store.addNotification({
                        title: "Mã giảm giá không tồn tại!",
                        message: `Bạn Vui lòng kiểm tra lại`,
                        type: "warning",
                        ...configNotify
                    });
                } else if (result[0].Quantity === 0) {
                    store.addNotification({
                        title: "Mã giảm giá đã hết lượt sử dụng!",
                        message: `Bạn Vui lòng nhập lại mã khác`,
                        type: "warning",
                        ...configNotify
                    });
                } else {
                    store.addNotification({
                        title: "Wonderfull!",
                        message: `Áp dụng mã giảm giá thành công!`,
                        type: "success",
                        ...configNotify
                    });
                    const action = updateDiscount({
                        discount: result[0].PercentDiscount,
                        discountId: result[0].DiscountId,
                    });
                    dispatch(action);
                }
            } catch (error) {
                console.log("Failed to fetch user: ", error);
            }
        }
    }

    useEffect(() => {
        var temp = [];
        const getQuantities = () => {
            products.forEach( async (product) => {
                try {
                    var result = await productAPI.getQuantity(product.ProductId);
                } catch (error) {
                    console.log('Failed to fetch quantity: ', error);
                }
                temp.push(result.Quantity);
            })
        }
        getQuantities();
        setQuantities(temp);
    }, [products])

    useEffect(() => {
        var total = 0;
        products.forEach(product => {
            total += product.UnitPrice * product.Quantity;
        })
        total -= total * discount / 100;
        setTotal(total);
    }, [products, discount]);

    const handleBuyMore = () => {
        history.push('/catalog');
    }

    const handlePay = () => {
        if (user.Email === '') {
            store.addNotification({
                title: "Yêu cầu đăng nhập!",
                message: `Bạn Vui lòng đăng nhập trước khi đặt hàng!`,
                type: "warning",
                ...configNotify
            });
            history.push('/login');
        } else if (products.length === 0) {
            store.addNotification({
                title: "Chưa có sản phẩm!",
                message: `Bạn Vui lòng thêm sản phẩm trước khi đặt hàng!`,
                type: "warning",
                ...configNotify
            });
            history.push('/catalog');
        } else {
            var check = false;
            products.forEach((product, index) => {
                if (quantities[index] === 0) {
                    store.addNotification({
                        title: `Sản phẩm ${product.Title} đã hết hàng!`,
                        message: "Vui lòng xóa sản phẩm!",
                        type: "warning",
                        ...configNotify
                    });
                    check = true;
                } else if (quantities[index] < product.Quantity) {
                    store.addNotification({
                        title: `Số lượng sản phẩm ${product.Title} trong kho không đủ!`,
                        message: "Vui lòng giảm số lượng",
                        type: "warning",
                        ...configNotify
                    });
                    check = true;
                }
            })
            if (!check) {
                history.push('/checkout');
            }
        }
    }

    return (
        <div className="container pb-5 mb-2">
            <div className="alert alert-info alert-dismissible fade show text-center mb-30">
                <span className="alert-close" data-dismiss="alert"></span>
                <i className="fe-icon-award"></i>&nbsp;&nbsp;<strong>Danh Sách Sản Phẩm Đã Thêm Vào Giỏ Hàng</strong>
            </div>
            {products.map((product, index) => (

                <div key={index} className="cart-item d-md-flex justify-content-between">
                    <span className="remove-item"
                        onClick={() => handleRemove(index, product.Quantity)}    >
                        <i className="fa fa-times"></i></span>
                    <div className="px-3 my-3">
                        <div className="cart-item-product" href="#">
                            <div className="cart-item-product-thumb"><img src={product.URLPicture} alt="Product" /></div>
                            <div className="cart-item-product-info">
                                <Link to={`/catalog/${product.ProductId}`}>
                                    <h4 className="cart-item-product-title">{product.Title}</h4>
                                </Link>
                                <span><strong>Color:  </strong>{product.Color}</span><span>
                                    <strong>Size:  </strong>{product.Size}</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-3 my-3 text-center">
                        <div className="cart-item-label">Số Lượng</div>
                        <div className="product__info__item__quantity">
                            <div className="product__info__item__quantity__btn"
                                onClick={() => updateQuantity('minus', product)}>
                                <i className="bx bx-minus"></i>
                            </div>
                            <div className="product__info__item__quantity__input">
                                {product.Quantity}
                            </div>
                            <div className="product__info__item__quantity__btn"
                                onClick={() => updateQuantity('plus', product)}>
                                <i className="bx bx-plus"></i>
                            </div>
                        </div>
                    </div>
                    <div className="px-3 my-3 text-center">
                        <div className="cart-item-label">Đơn Giá</div>
                        <span className="text-xl font-weight-medium">
                            {numberWithCommas(product.UnitPrice)}
                        </span>
                    </div>
                    <div className="px-3 my-3 text-center">
                        <div className="cart-item-label">Thành Tiền</div>
                        <span className="text-xl font-weight-medium">
                            {numberWithCommas(product.UnitPrice * product.Quantity)}
                        </span>
                    </div>
                    <div className="px-3 my-3 text-center">
                        <div className="cart-item-label">Giảm Giá</div>
                        <span className="text-xl font-weight-medium">
                            {numberWithCommas(discount * product.UnitPrice * product.Quantity / 100)}
                        </span>
                    </div>
                </div>
            ))}
            <div className="d-sm-flex justify-content-between align-items-center text-center text-sm-left">
                <div className="py-2">
                    <form className="row g-3">
                        <div className="col-auto">
                            <label for="inputPassword2" className="visually-hidden">Mã Giảm Giá</label>
                            <input type="text" className="form-control" placeholder="Nhập mã giảm giá ..."
                                value={inputDiscount} onChange={handleDiscountChange} />
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-primary mb-3"
                                onClick={handleDiscount}
                            >Áp Dụng
                            </button>
                        </div>
                    </form>
                </div>
                <div className="py-2">
                    <span className="d-inline-block align-middle text-sm text-muted font-weight-medium text-uppercase mr-2">Tổng Tiền:  </span>
                    <span className="d-inline-block align-middle text-xl font-weight-medium">  {numberWithCommas(total)}</span>
                </div>
            </div>
            <hr className="my-2" />
            <div className="row">
                <div className="col-6">
                    <a className="btn btn-style-1 btn-success btn-block"
                        onClick={handleBuyMore}>
                        &nbsp;Tiếp tục mua hàng
                    </a>
                </div>
                <div className="col-6">
                    <a className="btn btn-style-1 btn-primary btn-block"
                        onClick={handlePay}>
                        &nbsp;Tiến hành đặt hàng
                    </a>
                </div>
            </div>
        </div >
    )
}

export default Cart
