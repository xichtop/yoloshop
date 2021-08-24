import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import Button from './Button'
import numberWithCommas from '../utils/numberWithCommas'

import { useDispatch, useSelector } from 'react-redux'
import { addProductCart, updateProduct } from '../slice/cartSlice'

import { store } from 'react-notifications-component';

const ProductView = (props) => {

    const productIem = props.product

    const dispatch = useDispatch();

    const products = useSelector(state => state.cart.products);

    const [previewImg, setPreviewImg] = useState(productIem.URLPicture)

    const [descriptionExpand, setDescriptionExpand] = useState(false)

    const [color, setColor] = useState(undefined)

    const [size, setSize] = useState(undefined)

    const [quantity, setQuantity] = useState(1)

    const updateQuantity = (type) => {
        if (type === 'plus') {
            setQuantity(quantity + 1)
        } else {
            setQuantity(quantity - 1 < 1 ? 1 : quantity - 1)
        }
    }

    useEffect(() => {
        setPreviewImg(productIem.URLPicture)
        setQuantity(1)
        setColor(undefined)
        setSize(undefined)
    }, [productIem])

    const check = () => {
        if (color === undefined) {
            alert('Vui lòng chọn màu sắc!')
            return false
        }

        if (size === undefined) {
            alert('Vui lòng chọn kích cỡ!')
            return false
        }

        return true
    }

    const addToCart = () => {
        if (check()) {
            if (productIem.Quantity < quantity) {
                store.addNotification({
                    title: "Số lượng sản phẩm trong kho không đủ!",
                    message: "Vui lòng giảm số lượng",
                    type: "warning",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 2000,
                        onScreen: true
                    }
                });
            }
            else {
                const picture = productIem.colors.find(col => col.Color == color).URLPicture;
                const product = {
                    ...productIem,
                    URLPicture: picture,
                    Color: color,
                    Size: size,
                    Quantity: quantity,
                }
                var checkIndex = -1;
                products.forEach((product, index) => {
                    if (product.ProductId.trim() === productIem.ProductId.trim() && product.Color === color
                        && product.Size === size) {
                        checkIndex = index;
                    }
                })
                if (checkIndex != -1) {
                    const action = updateProduct(product);
                    dispatch(action);
                }
                else {
                    const action = addProductCart(product);
                    dispatch(action);
                }
                store.addNotification({
                    title: "Wonderful!",
                    message: "Thêm vào giỏ hàng thành công!",
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 2000,
                        onScreen: true
                    }
                });
            }

        }
        console.log({ color, size, quantity })
    }

    const goToCart = () => {
        props.history.push('/cart')
    }

    return (
        <div className="product">
            <div className="product__images">
                <div className="product__images__list">
                    <div className="product__images__list__item" onClick={() => setPreviewImg(productIem.URLPicture)}>
                        <img src={productIem.URLPicture} alt="" />
                    </div>
                    <div className="product__images__list__item" onClick={() => setPreviewImg(productIem.colors[0].URLPicture)}>
                        <img src={productIem.colors[0].URLPicture} alt="" />
                    </div>
                </div>
                <div className="product__images__main">
                    <img src={previewImg} alt="" />
                </div>
                <div className={`product-description ${descriptionExpand ? 'expand' : ''}`}>
                    <div className="product-description__title">
                        Chi tiết sản phẩm
                    </div>
                    <div className="product-description__content" dangerouslySetInnerHTML={{ __html: productIem.Description }}></div>
                    <div className="product-description__toggle">
                        <Button size="sm" onClick={() => setDescriptionExpand(!descriptionExpand)}>
                            {
                                descriptionExpand ? 'Thu gọn' : 'Xem thêm'
                            }
                        </Button>
                    </div>
                </div>
            </div>
            <div className="product__info">
                <h1 className="product__info__title">{productIem.Title}</h1>
                <div className="product__info__item">
                    <span className="product__info__item__price">
                        {numberWithCommas(productIem.UnitPrice)}
                    </span>
                </div>
                <div className="product__info__item">
                    <div className="product__info__item__title">
                        Màu sắc
                    </div>
                    <div className="product__info__item__list">
                        {
                            productIem.colors.map((item, index) => (
                                <div key={index} className={`product__info__item__list__item ${color === item.Color ? 'active' : ''}`} onClick={() => setColor(item.Color)}>
                                    <div className={`circle bg-${item.Color.toLowerCase()}`}
                                        onClick={() => setPreviewImg(item.URLPicture)}
                                    ></div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="product__info__item">
                    <div className="product__info__item__title">
                        Kích cỡ
                    </div>
                    <div className="product__info__item__list">
                        {
                            productIem.sizes.map((item, index) => (
                                <div key={index} className={`product__info__item__list__item ${size === item ? 'active' : ''}`} onClick={() => setSize(item)}>
                                    <span className="product__info__item__list__item__size">
                                        {item}
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="product__info__item">
                    <div className="product__info__item__title">
                        Số lượng
                    </div>
                    <div className="product__info__item__quantity">
                        <div className="product__info__item__quantity__btn" onClick={() => updateQuantity('minus')}>
                            <i className="bx bx-minus"></i>
                        </div>
                        <div className="product__info__item__quantity__input">
                            {quantity}
                        </div>
                        <div className="product__info__item__quantity__btn" onClick={() => updateQuantity('plus')}>
                            <i className="bx bx-plus"></i>
                        </div>
                    </div>
                </div>
                <div className="product__info__item">
                    <Button onClick={() => addToCart()}>thêm vào giỏ</Button>
                    <Button onClick={() => goToCart()}>Xem giỏ hàng</Button>
                </div>
            </div>
            <div className={`product-description mobile ${descriptionExpand ? 'expand' : ''}`}>
                <div className="product-description__title">
                    Chi tiết sản phẩm
                </div>
                <div className="product-description__content" dangerouslySetInnerHTML={{ __html: productIem.Description }}></div>
                <div className="product-description__toggle">
                    <Button size="sm" onClick={() => setDescriptionExpand(!descriptionExpand)}>
                        {
                            descriptionExpand ? 'Thu gọn' : 'Xem thêm'
                        }
                    </Button>
                </div>
            </div>
        </div>
    )
}

ProductView.propTypes = {
    product: PropTypes.object.isRequired
}

export default withRouter(ProductView)
