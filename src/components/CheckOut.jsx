import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import numberWithCommas from '../utils/numberWithCommas';
import { Link } from 'react-router-dom'

import { removeAll } from '../slice/cartSlice';

import { Button, FormGroup } from 'reactstrap';
import SelectField from './SelectField';
import { FastField, Form, Formik } from 'formik';
import * as Yup from 'yup';

import paymentAPI from '../api/paymentAPI';
import shippingAPI from '../api/shippingAPI';
import orderAPI from '../api/orderAPI';

import '../sass/css/cart.css';

import { store } from 'react-notifications-component';

// confirm alert
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import ReactDOM from "react-dom"
const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

const CheckOut = () => {

    const products = useSelector(state => state.cart.products);

    const discount = useSelector(state => state.cart.discount);

    const discountId = useSelector(state => state.cart.discountId);

    const user = useSelector(state => state.user.user);

    const token = useSelector(state => state.user.token);

    const [isPayPal, setIsPayPal] = useState(false);

    const [isPaid, setIsPaid] = useState(false);

    const dispatch = useDispatch();

    const history = useHistory();

    var SHIPPING_OPTIONS = [];

    var PAYMENT_OPTIONS = [];

    useEffect(() => {
        const fetchOptions = async () => {
            var shippings = [];
            var payments = [];
            try {
                shippings = await shippingAPI.getAll(token);
                payments = await paymentAPI.getAll(token);
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            console.log(shippings);
            console.log(payments);
            shippings.forEach(shipping => {
                SHIPPING_OPTIONS.push({
                    value: shipping.ShippingMethodId,
                    label: shipping.Description,
                });
            });
            payments.forEach(payment => {
                PAYMENT_OPTIONS.push({
                    value: payment.PaymentMethodId,
                    label: payment.Description,
                });
            });
        }
        fetchOptions();
    })

    var total = 0;
    products.forEach(product => {
        total += product.UnitPrice * product.Quantity;
    })
    total -= total * discount / 100;
    const totalUSD = (total / 22826.2).toFixed(2);
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

    const initialValues = {
        shippingMethod: '',
        paymentMethod: '',
    }

    const validationSchema = Yup.object().shape({
        shippingMethod: Yup.string().required('Phương thức giao hàng không được bỏ trống!.'),
        paymentMethod: Yup.string().required('Phương thức thanh toán không được bổ trống'),
    });

    const createOrder = (data, actions) => {
        return actions.order.create({
            ContentType: "application/json",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: totalUSD, // 1USD = 22826,2 VND
                    },
                },
            ],

        });
    };

    const onApprove = (data, actions) => {
        return actions.order.capture()
            .then(function (details) {
                // This function shows a transaction success message to your buyer.
                alert('Transaction completed by ' + details.payer.name.given_name);
                console.log(details); //payer_id .payer.email_address
            })
            .then(function () {
                store.addNotification({
                    title: "Wonderful!",
                    message: `Thanh toán thành công!`,
                    type: "success",
                    dismiss: {
                        duration: 6000,
                        onScreen: true
                    },
                    ...configNotify
                });
                setIsPayPal(false);
                setIsPaid(true);
            });
    }

    const handleChangeInfo = () => {
        history.push('/changeInfo');
    }

    const handleSubmit = async (values) => {
        if (user.Email === '') {
            store.addNotification({
                title: "Yêu cầu đăng nhập!",
                message: `Bạn Vui lòng đăng nhập trước khi thanh toán!`,
                type: "warning",
                ...configNotify
            });
            history.push('/login');
        } else {
            if (isPayPal === true && isPaid === false) {
                alert('Vui lòng thanh toán trước khi đặt hàng!');
            }
            else {
                confirmAlert({
                    title: 'Đặt Hàng',
                    message: 'Bạn có chắc chắc muốn đặt đơn hàng này không?',
                    buttons: [
                        {
                            label: 'Có',
                            onClick: () => fetchAddOrder()
                        },
                        {
                            label: 'Không',
                            onClick: () => {
                                history.push(`/checkout`);
                            }
                        }
                    ],
                    closeOnEscape: true,
                    closeOnClickOutside: true,
                });
            }

            const fetchAddOrder = async () => {
                var item = {
                    products: products,
                    shipping: values.shippingMethod,
                    payment: values.paymentMethod,
                    email: user.Email,
                    status: 'Ordered',
                    total: total,
                    discountId: discountId,
                }
                var result = null;
                try {
                    result = await orderAPI.addItem(item, token);

                } catch (error) {
                    console.log("Failed to fetch options: ", error);
                }

                if (result.successful === true) {
                    store.addNotification({
                        title: "Wonderfull!",
                        message: `Đặt hàng thành công!`,
                        type: "success",
                        ...configNotify
                    });
                    dispatch(removeAll());
                    history.push('/orderlist');
                } else {
                    store.addNotification({
                        title: "Error!",
                        message: `Đặt hàng thất bại, vui lòng thử lại sau!`,
                        type: "danger",
                        ...configNotify
                    });
                    history.push('/');
                }
            }
        }
    }

    return (
        <div className="container pb-5 mb-2">
            <div className="alert alert-info alert-dismissible fade show text-center mb-30">
                <span className="alert-close" data-dismiss="alert"></span>
                <i className="fe-icon-award"></i>&nbsp;&nbsp;<strong>Địa chỉ nhận hàng</strong>
            </div>
            <div className="cart-item d-md-flex justify-content-between">
                <div className="px-3 my-3 text-center">
                    <div className="cart-item-label">Khách Hàng</div>
                    <span><strong>{user.FullName}</strong></span>
                </div>
                <div className="px-3 my-3 text-center">
                    <div className="cart-item-label">Số Điện Thoại</div>
                    <span><strong>{user.Phone}</strong></span>
                </div>
                <div className="px-3 my-3 text-center">
                    <div className="cart-item-label">Địa Chỉ</div>
                    <span><strong>{user.Address}</strong></span>
                </div>
                <div className="px-3 my-3 text-center">
                    <a className="btn btn-style-1 btn-primary btn-block"
                        onClick={handleChangeInfo}>
                        &nbsp;Thay Đổi
                    </a>
                </div>
            </div>

            <div className="alert alert-info alert-dismissible fade show text-center mb-30">
                <span className="alert-close" data-dismiss="alert"></span>
                <i className="fe-icon-award"></i>&nbsp;&nbsp;<strong>Danh Sách Sản Phẩm</strong>
            </div>
            {products.map((product, index) => (

                <div key={index} className="cart-item d-md-flex justify-content-between">
                    <div className="px-3 my-3">
                        <div className="cart-item-product" href="#">
                            <div className="cart-item-product-thumb"><img src={product.URLPicture} alt="Product" /></div>
                            <div className="cart-item-product-info">
                                <Link to={`/catalog/${product.ProductId}`}>
                                    <h4 className="cart-item-product-title">{product.Title}</h4>
                                </Link>
                                <span><strong>Color:  </strong>{product.Color}</span>
                                <span>
                                    <strong>Size:  </strong>{product.Size}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="px-3 my-3 text-center">
                        <div className="cart-item-label">Số Lượng</div>
                        <span>{product.Quantity} </span>
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

                </div>
                <div className="py-2">
                    <span className="d-inline-block align-middle text-sm text-muted font-weight-medium text-uppercase mr-2">Tổng Tiền:  </span>
                    <span className="d-inline-block align-middle text-xl font-weight-medium">  {numberWithCommas(total)}</span>
                </div>
            </div>
            <hr className="my-2" />
            <div className="row">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {formikProps => {
                        // do something here ...
                        const { values, errors, touched } = formikProps;
                        if (values.paymentMethod === 'PayPal') {
                            setIsPayPal(true);
                        } else {
                            setIsPayPal(false);
                        }

                        return (
                            <Form>
                                <FastField
                                    name="shippingMethod"
                                    component={SelectField}

                                    label="Phương thức giao hàng"
                                    placeholder="Chọn phương thức giao hàng"
                                    options={SHIPPING_OPTIONS}
                                />
                                <FastField
                                    name="paymentMethod"
                                    component={SelectField}

                                    label="Phương thức thanh toán"
                                    placeholder="Chọn phương thức thanh toán"
                                    options={PAYMENT_OPTIONS}
                                />
                                <FormGroup>
                                    <div style={{
                                        paddingTop: '85px',
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}>
                                        {isPayPal === true ? <PayPalButton
                                            createOrder={(data, actions) => createOrder(data, actions)}
                                            onApprove={(data, actions) => onApprove(data, actions)}
                                        /> :
                                            <br />}
                                        <Button type="submit" color='success'>
                                            Đặt Hàng
                                    </Button>
                                    </div>
                                </FormGroup>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div >
    )
}

export default CheckOut
