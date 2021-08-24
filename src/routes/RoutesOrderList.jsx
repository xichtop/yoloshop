import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import InfinityOrder from '../components/InfinityOrder';
import orderAPI from '../api/orderAPI';

const RouteOrderList = () => {

    return (
        <Switch>
            <Route path='/orderlist' exact component={AllOrder}/>
            <Route path='/orderlist/ordered' exact component={Ordered}/>
            <Route path='/orderlist/delivering' exact component={Delivering}/>
            <Route path='/orderlist/delivered' exact component={Delivered}/>
            <Route path='/orderlist/canceled' exact component={Canceled}/>
        </Switch>
    )
}

export default RouteOrderList

function AllOrder() {

    const [ orders, setOrders ] = useState([]);

    const email = useSelector(state => state.user.user.Email);

    useEffect(() => {
        const fetchListOrder = async () => {
            try {
                const orders = await orderAPI.getAll(email);
                setOrders(orders);
                console.log(orders);
            } catch (error) {
                console.log("Failed to fetch order list: ", error);
            }
        }
        fetchListOrder();
    }, [])

    return (
        <div>
            <InfinityOrder orders = {orders}/>
        </div>
    )
}

function Ordered() {
    const [ orders, setOrders ] = useState([]);

    const email = useSelector(state => state.user.user.Email);

    useEffect(() => {
        const fetchListOrder = async () => {
            try {
                const orders = await orderAPI.getAllByStatus(email, 'Ordered');
                setOrders(orders);
                console.log(orders);
            } catch (error) {
                console.log("Failed to fetch order list: ", error);
            }
        }
        fetchListOrder();
    }, [])

    return (
        <div>
            <InfinityOrder orders = {orders}/>
        </div>
    )
}

function Delivering() {
    const [ orders, setOrders ] = useState([]);

    const email = useSelector(state => state.user.user.Email);

    useEffect(() => {
        const fetchListOrder = async () => {
            try {
                const orders = await orderAPI.getAllByStatus(email, 'Confirmed');
                setOrders(orders);
                console.log(orders);
            } catch (error) {
                console.log("Failed to fetch order list: ", error);
            }
        }
        fetchListOrder();
    }, [])

    return (
        <div>
            <InfinityOrder orders = {orders}/>
        </div>
    )
}

function Delivered() {
    const [ orders, setOrders ] = useState([]);

    const email = useSelector(state => state.user.user.Email);

    useEffect(() => {
        const fetchListOrder = async () => {
            try {
                const orders = await orderAPI.getAllByStatus(email, 'Delivered');
                setOrders(orders);
                console.log(orders);
            } catch (error) {
                console.log("Failed to fetch order list: ", error);
            }
        }
        fetchListOrder();
    }, [])

    return (
        <div>
            <InfinityOrder orders = {orders}/>
        </div>
    )
}

function Canceled() {
    const [ orders, setOrders ] = useState([]);

    const email = useSelector(state => state.user.user.Email);

    useEffect(() => {
        const fetchListOrder = async () => {
            try {
                const orders = await orderAPI.getAllByStatus(email, 'Canceled');
                setOrders(orders);
                console.log(orders);
            } catch (error) {
                console.log("Failed to fetch order list: ", error);
            }
        }
        fetchListOrder();
    }, [])

    return (
        <div>
            <InfinityOrder orders = {orders}/>
        </div>
    )
}
