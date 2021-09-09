import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { useSelector } from 'react-redux';

const Home = React.lazy(() => import('../pages/Home'));
const Product = React.lazy(() => import('../pages/Product'));
const Catalog = React.lazy(() => import('../pages/Catalog'));
const Cart = React.lazy(() => import('../pages/Cart'));
const OrderList = React.lazy(() => import('../pages/OrderList'));
const Login = React.lazy(() => import('../components/Login'));
const ChangeInfo = React.lazy(() => import('../components/ChangeInfo'));
const Register = React.lazy(() => import('../components/Register'));
const CheckOut = React.lazy(() => import('../components/CheckOut'));
const NotFound = React.lazy(() => import('../components/NotFound/index'));
const Profile = React.lazy(() => import('../components/Profile/Profile'));

const Routes = () => {

    const user = useSelector(state => state.user.user);

    return (
        <Switch>
            <Route path='/' exact component={Home}/>
            <Route path='/catalog/:slug' component={Product}/>
            <Route path='/catalog' component={Catalog}/>
            <Route path='/cart' component={Cart}/>
            <Route path='/login' component={Login}/>
            <Route path='/register' component={Register}/>
            <Route path='/orderlist' component={user.Email === '' ? Login : OrderList}/>
            <Route path='/checkout' component={user.Email === '' ? Login : CheckOut}/>
            <Route path='/profile' component={user.Email === '' ? Login : Profile}/>
            <Route path='/changeInfo' component={user.Email === '' ? Login : ChangeInfo}/>
            {/* <Route path='/showOrder' component={user.Email === '' ? Login : Profile}/> */}
            <Route component={NotFound} />
        </Switch>
    )
}

export default Routes
