import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../../slice/userSlice';
import './Profile.css';

function Profile() {

    const user = useSelector(state => state.user.user);

    const history = useHistory();

    const dispatch = useDispatch();

    const hanleChangeInfo = () => {
        history.push('/changeInfo');
    }

    const hanleShowOrder = () => {
        history.push('/orderlist');
    }

    const hanleLogout = () => {
        dispatch(logout());
    }

    const hanleChangePass = () => {

    }

    return (
        <div className="page-content page-container" id="page-content">
            <div className="padding">
                <div className="row container d-flex justify-content-center">
                    <div className="col-xl-6 col-md-12">
                        <div className="card user-card-full">
                            <div className="row m-l-0 m-r-0">
                                <div className="col-sm-4 bg-c-lite-green user-profile">
                                    <div class="card-block text-center text-white">
                                        <div class="m-b-25"> <img src={user.URLPicture} class="img-radius" alt="User-Profile-Image"/> </div>
                                            <h6 class="f-w-600">{user.FullName}</h6>
                                        </div>
                                    </div>
                                    <div className="col-sm-8">
                                        <div className="card-block">
                                            <h6 className="m-b-20 p-b-5 b-b-default f-w-600">Thông Tin Cá Nhân</h6>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <p className="m-b-10 f-w-600">Email</p>
                                                    <h6 className="text-muted f-w-400">{user.Email}</h6>
                                                </div>
                                                <div className="col-sm-6">
                                                    <p className="m-b-10 f-w-600">Số Điện Thoại</p>
                                                    <h6 className="text-muted f-w-400">{user.Phone}</h6>
                                                </div>
                                            </div>
                                            <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">Địa Chỉ</h6>
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <p className="m-b-10 f-w-600">Địa Chỉ Giao Hàng</p>
                                                    <h6 className="text-muted f-w-400">{user.Address}</h6>
                                                </div>
                                            </div>
                                            <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">Thao Tác</h6>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <button className="btn btn-primary"
                                                        onClick = {hanleChangeInfo}
                                                    >Chỉnh Sửa </button>
                                                </div>
                                                <div className="col-sm-6">
                                                    <button className="btn btn-success"
                                                        onClick = {hanleShowOrder}
                                                    >Xem Đơn Hàng </button>
                                                </div>
                                            </div>
                                            <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600"></h6>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <button className="btn btn-warning"
                                                        onClick = {hanleChangePass}
                                                    >Đổi Mật Khẩu </button>
                                                </div>
                                                <div className="col-sm-6">
                                                    <button className="btn btn-danger"
                                                        onClick = {hanleLogout}
                                                    >Đăng Xuất </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )
        }
        
export default Profile;