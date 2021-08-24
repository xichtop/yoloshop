import React from 'react';
import { useHistory } from "react-router-dom";
import userAPI from '../api/userAPI'

import { Button, FormGroup, Spinner } from 'reactstrap';
import InputField from './InputField';
import { FastField, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { store } from 'react-notifications-component';

function Register() {

    const history = useHistory();

    const initialValues = {
        email: '',
        password: '',
        rePassword: '',
        phone: '',
        fullname: '',
        address: '',
        urlpicture: '',
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
        const user = {
            email: values.email,
            password: values.password,
            phone: values.phone,
            fullname: values.fullname,
            address: values.address,
            urlpicture: values.urlpicture,
        }
        const fetchRegister = async () => {
            var result = [];
            try {
                result = await userAPI.get(user.email.trim());
            } catch (error) {
                console.log("Failed to fetch user: ", error);
            }
            console.log(result);

            if (result.length != 0) {
                store.addNotification({
                    title: "Đăng ký thất bại!",
                    message: `Email đã tồn tại! ${user.email}`,
                    type: "warning",
                    ...configNotify
                });
                return;
            } else {
                try {
                    result = await userAPI.register(user);
                } catch (error) {
                    console.log("Failed to fetch user: ", error);
                }
                if (result.successful == true) {
                    store.addNotification({
                        title: "Wonderful!",
                        message: `Đăng ký tài khoản thành công`,
                        type: "success",
                        ...configNotify
                    });
                    history.push('/login');
                } else {
                    store.addNotification({
                        title: "Đăng ký thất bại!",
                        message: `Đã có lỗi xảy ra, vui lòng thử lại sau!`,
                        type: "danger",
                        ...configNotify
                    });
                    history.push('/');
                }
            }
        }
        fetchRegister();
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email().required('Email không được bỏ trống!'),
        password: Yup.string().required('Mật khẩu không được bỏ trống!')
            .min(6, 'Mật khẩu phải lớn hơn 6 kí tự'),
        rePassword: Yup.string().required('Mật khẩu không được bỏ trống!')
            .min(6, 'Mật khẩu phải lớn hơn 6 kí tự')
            .oneOf([Yup.ref('password'), null], 'Nhập lại mật khẩu không đúng!'),
        phone: Yup.string().max(12, "Số điện thoại không được lớn hơn 12 kí tự").required('Số Điện thoại không được bỏ trống!'),
        fullname: Yup.string().required('Họ và Tên không được bỏ trống!'),
        address: Yup.string().required('Địa chỉ không được bỏ trống!'),
        urlpicture: Yup.string().required('Ảnh không được bỏ trống!'),
    });

    return (
        <div className="login">
            <div className="box">
                <div className="login-box" >
                    <h2>ĐĂNG KÝ</h2>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {formikProps => {
                            // do something here ...
                            const { values, errors, touched, isSubmitting } = formikProps;
                            console.log({ values, errors, touched });

                            return (
                                <Form>
                                    <FastField
                                        name="email"
                                        component={InputField}

                                        label="Email"
                                        placeholder="Nhập tên đăng nhập của bạn ..."
                                    />

                                    <FastField
                                        name="password"
                                        component={InputField}

                                        label="Mật khẩu"
                                        placeholder="Nhập mật khẩu của bạn ..."
                                        type="password"
                                    />

                                    <FastField
                                        name="rePassword"
                                        component={InputField}

                                        label="Nhập Lại Mật khẩu"
                                        placeholder="Nhập lại mật khẩu của bạn ..."
                                        type="password"
                                    />

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
                                        placeholder="Nhập lại mật khẩu của bạn ..."
                                    />
                                    <FormGroup>
                                        <Button type="submit" color='success'>
                                            {isSubmitting && <Spinner size="sm" />}
                                            Đăng Ký
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

export default Register;