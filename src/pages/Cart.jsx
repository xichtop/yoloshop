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
                title: "M?? gi???m gi??!",
                message: `Vui l??ng nh???p m?? gi???m gi??`,
                type: "warning",
                ...configNotify
            });
        } else {
            try {
                var result = [];
                result = await discountAPI.get(inputDiscount.trim(), token);
                if (result.length === 0) {
                    store.addNotification({
                        title: "M?? gi???m gi?? kh??ng t???n t???i!",
                        message: `B???n Vui l??ng ki???m tra l???i`,
                        type: "warning",
                        ...configNotify
                    });
                } else if (result[0].Quantity === 0) {
                    store.addNotification({
                        title: "M?? gi???m gi?? ???? h???t l?????t s??? d???ng!",
                        message: `B???n Vui l??ng nh???p l???i m?? kh??c`,
                        type: "warning",
                        ...configNotify
                    });
                } else {
                    store.addNotification({
                        title: "Wonderfull!",
                        message: `??p d???ng m?? gi???m gi?? th??nh c??ng!`,
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
                title: "Y??u c???u ????ng nh???p!",
                message: `B???n Vui l??ng ????ng nh???p tr?????c khi ?????t h??ng!`,
                type: "warning",
                ...configNotify
            });
            history.push('/login');
        } else if (products.length === 0) {
            store.addNotification({
                title: "Ch??a c?? s???n ph???m!",
                message: `B???n Vui l??ng th??m s???n ph???m tr?????c khi ?????t h??ng!`,
                type: "warning",
                ...configNotify
            });
            history.push('/catalog');
        } else {
            var check = false;
            products.forEach((product, index) => {
                if (quantities[index] === 0) {
                    store.addNotification({
                        title: `S???n ph???m ${product.Title} ???? h???t h??ng!`,
                        message: "Vui l??ng x??a s???n ph???m!",
                        type: "warning",
                        ...configNotify
                    });
                    check = true;
                } else if (quantities[index] < product.Quantity) {
                    store.addNotification({
                        title: `S??? l?????ng s???n ph???m ${product.Title} trong kho kh??ng ?????!`,
                        message: "Vui l??ng gi???m s??? l?????ng",
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
                <i className="fe-icon-award"></i>&nbsp;&nbsp;<strong>Danh S??ch S???n Ph???m ???? Th??m V??o Gi??? H??ng</strong>
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
                        <div className="cart-item-label">S??? L?????ng</div>
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
                        <div className="cart-item-label">????n Gi??</div>
                        <span className="text-xl font-weight-medium">
                            {numberWithCommas(product.UnitPrice)}
                        </span>
                    </div>
                    <div className="px-3 my-3 text-center">
                        <div className="cart-item-label">Th??nh Ti???n</div>
                        <span className="text-xl font-weight-medium">
                            {numberWithCommas(product.UnitPrice * product.Quantity)}
                        </span>
                    </div>
                    <div className="px-3 my-3 text-center">
                        <div className="cart-item-label">Gi???m Gi??</div>
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
                            <label for="inputPassword2" className="visually-hidden">M?? Gi???m Gi??</label>
                            <input type="text" className="form-control" placeholder="Nh???p m?? gi???m gi?? ..."
                                value={inputDiscount} onChange={handleDiscountChange} />
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-primary mb-3"
                                onClick={handleDiscount}
                            >??p D???ng
                            </button>
                        </div>
                    </form>
                </div>
                <div className="py-2">
                    <span className="d-inline-block align-middle text-sm text-muted font-weight-medium text-uppercase mr-2">T???ng Ti???n:  </span>
                    <span className="d-inline-block align-middle text-xl font-weight-medium">  {numberWithCommas(total)}</span>
                </div>
            </div>
            <hr className="my-2" />
            <div className="row">
                <div className="col-6">
                    <a className="btn btn-style-1 btn-success btn-block"
                        onClick={handleBuyMore}>
                        &nbsp;Ti???p t???c mua h??ng
                    </a>
                </div>
                <div className="col-6">
                    <a className="btn btn-style-1 btn-primary btn-block"
                        onClick={handlePay}>
                        &nbsp;Ti???n h??nh ?????t h??ng
                    </a>
                </div>
            </div>
        </div >
    )
}

export default Cart
