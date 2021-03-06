import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
import ReactStars from 'react-stars';

import firebase from '../firebase/firebase';

import { Button, FormGroup, Label, Input } from 'reactstrap';
import InputField from './InputField';
import { FastField, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { store } from 'react-notifications-component';

import reviewAPI from '../api/reviewAPI';
import productAPI from '../api/productAPI';

// confirm alert
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


export default function Review(props) {

    const { productId, OrderId, Color, Size } = props.match.params;

    const user = useSelector(state => state.user);

    const history = useHistory();

    const [ vote, setVote ] = useState(5);

    useEffect(() => {
        const fetchVote = async () => {
            try {
                const product = await productAPI.get(productId);
                setVote(product.Vote);
            } catch (error) {
                console.log("Failed to fetch product list: ", error);
            }
        }
        fetchVote();
    }, [productId])

    const initialValues = {
        comment: '',
    }

    const [checkImg, setCheckImg] = useState(false);

    const handleCheckBox = () => {
        setCheckImg(!checkImg);
    }

    const initialImgValues = {
        image: null,
        progress: 0,
        downloadURL: null
    }

    const [img, setImg] = useState(initialImgValues);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImg({
                ...img,
                image: e.target.files[0],
            })
        }
    }

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

    const handleUpload = () => {
        if (img.image === null) {
            alert('Vui l??ng ch???n ???nh tr?????c khi upload!!!');
        } else {
            let file = img.image;
            var storage = firebase.storage();
            var storageRef = storage.ref();
            var uploadTask = storageRef.child('folder/' + file.name).put(file);

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)) * 100
                    setImg({
                        ...img,
                        progress: progress
                    })
                }, (error) => {
                    throw error
                }, () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                        setImg({
                            ...img,
                            downloadURL: url
                        })
                    })
                    document.getElementById("file").value = null;
                    store.addNotification({
                        title: "Wonderfull!",
                        message: `Upload ???nh th??nh c??ng!`,
                        type: "success",
                        ...configNotify
                    });
                }
            )
        }
    }

    const validationSchema = Yup.object().shape({
        comment: Yup.string().required('????nh gi?? kh??ng ???????c b??? tr???ng!.'),
    });

    const [star, setStar] = useState(5);

    const ratingChanged = (newRating) => {
        setStar(newRating);
    }

    const handleSubmit = (values) => {
        if (checkImg === true && img.downloadURL === null) {
            alert("Vui l??ng upload ???nh tr?????c khi x??c nh???n")
        } else {
            confirmAlert({
                title: '????nh Gi?? S???n Ph???m',
                message: 'B???n c?? ch???c ch???c mu???n th??m ????nh gi?? n??y kh??ng?',
                buttons: [
                  {
                    label: 'C??',
                    onClick: () => fetchAddReview()
                  }, 
                  {
                    label: 'Kh??ng',
                    onClick: () => {
                        history.push(`/review/${productId}`);
                    }
                  }
                ],
                closeOnEscape: true,
                closeOnClickOutside: true,
            });
            const fetchAddReview = async () => {
                const newStar = Math.round((star + vote) / 2);
                const item = {
                    OrderId: OrderId,
                    Color: Color,
                    Size: Size,
                    ProductId: productId,
                    Email: user.user.Email,
                    URLEmail: user.user.URLPicture,
                    Vote: star,
                    Star: newStar,
                    comment: values.comment,
                    URLComment: img.downloadURL ? img.downloadURL : null,
                }
                var result = {};
                try {
                    result = await reviewAPI.addItem(item, user.token);
                } catch (error) {
                    console.log("Failed to fetch order list: ", error);
                }
                if (result.successful === true) {
                    store.addNotification({
                        title: "Wonderfull!",
                        message: `????nh gi?? th??nh c??ng!`,
                        type: "success",
                        ...configNotify
                    });
                    // history.push(`/catalog/${productId}`);
                    history.push('/orderlist');
                } else {
                    store.addNotification({
                        title: "Error!",
                        message: `????nh gi?? th???t b???i, vui l??ng th??? l???i sau!`,
                        type: "warning",
                        ...configNotify
                    });
                    // history.push(`/catalog/${productId}`);
                    history.push('/orderlist');
                }
            }
        }
    }

    return (
        <div className="login">
            <div className="box">
                <div className="login-box" >
                    <h2>????nh Gi?? S???n Ph???m</h2>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {formikProps => {
                            // do something here ...
                            const { values, errors, touched } = formikProps;
                            // console.log({ values, errors, touched });

                            return (
                                <Form>
                                    <ReactStars
                                        // className="product-description__content__body__comment__star"
                                        count={5}
                                        value={star}
                                        onChange={ratingChanged}
                                        size={22}
                                        edit={true}
                                        half={false}
                                        color2={'#ffd700'} />
                                    <FastField
                                        name="comment"
                                        component={InputField}

                                        label="????nh gi??"
                                        placeholder="Nh???p ????nh gi?? c???a b???n ..."
                                        type="textarea"
                                    />

                                    <FormGroup check>
                                        <Label check>
                                            <Input type="checkbox" onClick={handleCheckBox} />{' '}
                                            Th??m h??nh ???nh
                                        </Label>
                                    </FormGroup>
                                    {checkImg ?
                                        <div>
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                // padding: "10px 0"
                                            }}>
                                                <Label for="exampleFile" style={{
                                                    paddingRight: 10
                                                }}>H??nh ???nh</Label>
                                                <Input type="file" name="file" id="file" onChange={handleFileChange} />
                                            </div>
                                            <Button color="info" onClick={handleUpload}>Upload</Button>{' '}
                                            <img
                                                className="ref"
                                                src={img.downloadURL || "https://via.placeholder.com/80x80"}
                                                alt="Uploaded Images"
                                                height="80"
                                                width="80"
                                                objectfit="cover"
                                            />
                                        </div>
                                        :
                                        <br />
                                    }

                                    <FormGroup>
                                        <Button type="submit" color='success'>
                                            X??c Nh???n
                                        </Button>
                                    </FormGroup>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </div>

    )
}