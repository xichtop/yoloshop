import React from 'react';
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import userAPI from '../api/userAPI'
import { login } from '../slice/userSlice';

import { Button, FormGroup, Label } from 'reactstrap';
import InputField from './InputField';
import { FastField, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { store } from 'react-notifications-component';

Login.propTypes = {
    onSubmit: PropTypes.func,
};

Login.defaultProps = {
    onSubmit: null,
}

function Login() {

    const dispatch = useDispatch();

    const history = useHistory();

    const initialValues = {
        username: '',
        password: '',
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
            email: values.username,
            password: values.password,
        }
        const fetchLogin = async () => {
            var result = {};
            try {
                result = await userAPI.login(user);
            } catch (error) {
                console.log("Failed to fetch user: ", error);
            }
            console.log(result);
            if (result.successful === false) {
                store.addNotification({
                    title: "Đăng nhập thất bại!",
                    message: result.message,
                    type: "danger",
                    ...configNotify
                });
            } else {
                store.addNotification({
                    title: "Đăng nhập thành công!",
                    message: `Xin chào ${values.username}`,
                    type: "success",
                    ...configNotify
                });

                const user = result.user;
                const token = result.accessToken;
                const action = login({
                    user,
                    token
                })
                dispatch(action);
                history.push('/');
            }
        }
        fetchLogin();
    }

    const handleRegister = () => {
        history.push('/register');
    }


    const validationSchema = Yup.object().shape({
        username: Yup.string().email().required('Email không được bỏ trống!.'),
        password: Yup.string().required('Mật khẩu không được bổ trống'),
    });

    return (
        <div className="login">
            <div className="box">
                <div className="login-box" >
                    <h2>ĐĂNG NHẬP</h2>
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
                                        name="username"
                                        component={InputField}

                                        label="Email"
                                        placeholder="Nhập Email của bạn ..."
                                    />

                                    <FastField
                                        name="password"
                                        component={InputField}

                                        label="Mật khẩu"
                                        placeholder="Nhập mật khẩu của bạn ..."
                                        type="password"
                                    />

                                    <FormGroup>
                                        <Button type="submit" color='success'>
                                            Đăng nhập
                                        </Button>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label >
                                            Chưa có tài khoản?
                                </Label>
                                        <a className="login-link" onClick={handleRegister}>
                                            Đăng ký
                                        </a>
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

export default Login;