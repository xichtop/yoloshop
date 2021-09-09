import React from 'react';
import numberWithCommas from '../utils/numberWithCommas';
import '../sass/css/infinityorder.css';

import { store } from 'react-notifications-component';
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
import orderAPI from '../api/orderAPI';

// confirm alert
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

function OrderItem(props) {
    const { order } = props;

    const history = useHistory();

    const token = useSelector(state => state.user.token);

    const handleButton = () => {
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
        confirmAlert({
            title: 'Huy Đơn Hàng',
            message: 'Bạn có chắc chắc muốn hủy đơn hàng này không?',
            buttons: [
              {
                label: 'Có',
                onClick: () => fetchUpdateOrder()
              }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
        });
        const fetchUpdateOrder = async () => {
            var result = {};
            try {
                result = await orderAPI.update(order.OrderId, token);
            } catch (error) {
                console.log("Failed to fetch order list: ", error);
            }
            if (result.successful == true) {
                store.addNotification({
                    title: "Wonderfull!",
                    message: `Hủy đơn hàng thành công!`,
                    type: "success",
                    ...configNotify
                });
                history.push('/orderlist/canceled');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Hủy đơn hàng thất bại, vui lòng thử lại sau!`,
                    type: "warning",
                    ...configNotify
                });
                history.push('/orderlist');
            }
        }
    }

    const handleReview = (productId, OrderId, Color, Size) => {
        history.push(`/review/${productId}/${OrderId}/${Color}/${Size}`);
    }

    const hanldeProduct = (ProductId) => {
        history.push(`/catalog/${ProductId}`);
    }

    return (
        <article class="card">
            <header class="card-header">Order ID: {order.OrderId}</header>
            <div class="card-body">
                <article class="card">
                    <div class="card-body row">
                        <div class="col"> <strong>Ngày đặt hàng:</strong> <br />{order.OrderDate.slice(0, 10)}</div>
                        <div class="col"> <strong>Đơn vị giao hàng:</strong> <br />{order.ShippingMethodId}</div>
                        <div class="col"> <strong>Trạng thái:</strong> <br />{order.Status}</div>
                        <div class="col"> <strong>Tổng tiền:</strong> <br />{numberWithCommas(order.Total)}</div>
                    </div>
                </article>
                <hr />
                <ul class="row">
                    {order.products.map((product, productIndex) => (
                        <li key={productIndex} class="col-md-4" >
                            <figure class="itemside mb-3">
                                <div class="aside"><img src={product.URLPicture} class="img-sm border" /></div>
                                <figcaption class="info align-self-center">
                                    <p class="title" style={{
                                        cursor: 'pointer',
                                    }} onClick={() => hanldeProduct(product.ProductId)}>{product.Title}</p>
                                    <span class="text-muted">Màu: <strong>{product.Color}</strong></span>
                                    <br />
                                    <span class="text-muted">Size: {product.Size}</span><br />
                                    <span class="text-muted">Số lượng: {product.Quantity}</span>
                                </figcaption>
                            </figure>
                            {order.Status === 'Delivered' &&  product.Review === 0 ? 
                            <a class="btn btn-success" data-abc="true" onClick={() => handleReview(product.ProductId, order.OrderId, product.Color, product.Size)}>
                            Đánh Giá</a> 
                            : <br />}
                            
                        </li>
                    ))}
                </ul>
                <hr />
                {order.Status === 'Ordered' ? <a class="btn btn-warning" data-abc="true" onClick={handleButton}>Hủy</a> : <br />}
            </div>
        </article>
    )
}

export default OrderItem;