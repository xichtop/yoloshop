import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ReactStars from 'react-stars';

export default function ProductReview(props) {

    const review = useSelector(state => state.review);

    const [isToggle, setIsToggle] = useState(false);

    const hanldeToggleReview = () => {
        setIsToggle(!isToggle);
    }

    return (
        <div className="product-description__content">
            <div className="product-description__content__header">
                <ReactStars
                    count={5}
                    value={review.vote}
                    size={35}
                    edit={false}
                    color2={'#ffd700'} />
            </div>
            <span className="product-description__content__span" onClick={hanldeToggleReview}> {review.reviews.length} đánh giá</span>
            {isToggle === true ?
                <div>
                    {review.reviews.map((item, index) => (
                        <div key = {index} className='product-description__content__body'>
                            <img className='product-description__content__body__img' src={item.URLEmail} />
                            <div className='product-description__content__body__comment'>
                                <span className = "product-description__content__body__comment__email">{item.Email}</span>
                            <ReactStars
                                className = "product-description__content__body__comment__star"
                                count={5}
                                value={item.Vote}
                                size={22}
                                edit={false}
                                color2={'#ffd700'} />
                            <span style={{ 
                                fontSize: '1rem',
                                fontWeight: '1rem',
                                marginBottom: '10px',
                                borderBottom: '1px solid black'
                            }}>Màu: <strong>{item.Color}</strong> | Size: <strong>{item.Size}</strong></span>
                            <span >{item.Comment}</span>
                            {item.URLComment !== "null" ? <img src = {item.URLComment}/> : <br/>}
                            <span className = "product-description__content__body__comment__date">{item.ReviewDate.slice(0, 10)}</span>
                            </div>
                        </div>
                    ))}
                </div>
                :
                <br />}
        </div>
    )
}