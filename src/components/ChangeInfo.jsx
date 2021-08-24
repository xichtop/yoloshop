import React from 'react';
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import userAPI from '../api/userAPI'
import { update } from '../slice/userSlice';
import { Button, FormGroup } from 'reactstrap';
import InputField from './InputField';
import { FastField, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { store } from 'react-notifications-component';

function ChangeInfo() {

    const user = useSelector(state => state.user.user);

    const token = useSelector(state => state.user.token);

    const history = useHistory();

    const dispatch = useDispatch();

    const initialValues = {
        phone: user.Phone,
        fullname: user.FullName,
        address: user.Address,
        urlpicture: user.URLPicture,
    }

    const handleSubmit = (values) => {
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
        const newUser = {
            email: user.Email,
            phone: values.phone,
            fullname: values.fullname,
            address: values.address,
            urlpicture: values.urlpicture,
        }
        const fetchUpdate = async () => {
            var result = null;
            try {
                result = await userAPI.update(newUser, token);
            } catch (error) {
                console.log("Failed to fetch user: ", error);
            }
            if (result.successful == true) {
                store.addNotification({
                    title: "Wonderful!",
                    message: `Chỉnh sửa tài khoản thành công`,
                    type: "success",
                    ...configNotify
                });
                const userState = {
                    ...user,
                    Phone: values.phone,
                    Fullname: values.fullname,
                    Address: values.address,
                    URLPicture: values.urlpicture,
                }
                const action = update({
                    user: userState,
                    token: token,
                });
                dispatch(action);
                history.push('/profile');
            } else {
                store.addNotification({
                    title: "Chỉnh sửa thất bại!",
                    message: `Đã có lỗi xảy ra, vui lòng thử lại sau!`,
                    type: "danger",
                    ...configNotify
                });
                history.push('/');
            }
        }
        fetchUpdate();
    }

    const validationSchema = Yup.object().shape({
        phone: Yup.string().max(12, "Số điện thoại không được lớn hơn 12 kí tự").required('Số Điện thoại không được bỏ trống!'),
        fullname: Yup.string().required('Họ và Tên không được bỏ trống!'),
        address: Yup.string().required('Địa chỉ không được bỏ trống!'),
        urlpicture: Yup.string().required('Ảnh không được bỏ trống!'),
    });

    return (
        <div className="login">
            <div className="box">
                <div className="login-box" >
                    <h2>CHỈNH SỬA THÔNG TIN</h2>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {formikProps => {
                            // do something here ...
                            const { values, errors, touched } = formikProps;
                            console.log({ values, errors, touched });

                            return (
                                <Form>

                                    <FastField
                                        name="phone"
                                        component={InputField}

                                        label="Số Điện Thoại"
                                        placeholder="Nhập số điện thoại của bạn ..."
                                    />

                                    <FastField
                                        name="fullname"
                                        component={InputField}

                                        label="Họ và Tên"
                                        placeholder="Nhập họ và tên của bạn ..."
                                    />

                                    <FastField
                                        name="address"
                                        component={InputField}

                                        label="Địa chỉ"
                                        placeholder="Nhập địa chỉ của bạn ..."
                                    />

                                    <FastField
                                        name="urlpicture"
                                        component={InputField}

                                        label="Nhập Link Ảnh"
                                        placeholder="Nhập Link ảnh của bạn ..."
                                    />
                                    <FormGroup>
                                        <Button type="submit" color='success'>
                                            Xác Nhận
                                        </Button>
                                    </FormGroup>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
export default ChangeInfo;