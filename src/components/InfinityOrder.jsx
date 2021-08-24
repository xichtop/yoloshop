import React from 'react';
import '../sass/css/infinityorder.css';

import OrderItem from './OrderItem';

function InfinityOrder(props) {
    const { orders } = props;

    return (
        <div class="container-infinity">
            {orders.map((order) => (
                <OrderItem order = {order} />
            ))}
        </div>
    )
}

export default InfinityOrder;