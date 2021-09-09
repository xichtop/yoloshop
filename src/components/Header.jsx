import React, { useRef} from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import logo from '../assets/images/Logo-2.png'

const mainNav = [
    {
        display: "Trang chủ",
        path: "/"
    },
    {
        display: "Sản phẩm",
        path: "/catalog"
    },
]

const Header = () => {

    const history = useHistory();

    const quantity = useSelector(state => state.cart.quantity);

    const user = useSelector(state => state.user.user);

    const { pathname } = useLocation()
    const activeNav = mainNav.findIndex(e => e.path === pathname)

    const menuLeft = useRef(null)

    const menuToggle = () => menuLeft.current.classList.toggle('active')

    const handleProfile = () => {
        history.push('/profile');
    }

    return (
        <div className="header" >
            <div className="container">
                <div className="header__logo">
                    <Link to="/">
                        <img src={logo} alt="" />
                    </Link>
                </div>
                <div className="header__menu">
                    <div className="header__menu__mobile-toggle" onClick={menuToggle}>
                        <i className='bx bx-menu-alt-left'></i>
                    </div>
                    <div className="header__menu__left" ref={menuLeft}>
                        <div className="header__menu__left__close" onClick={menuToggle}>
                            <i className='bx bx-chevron-left'></i>
                        </div>
                        {
                            mainNav.map((item, index) => (
                                <div
                                    key={index}
                                    className={`header__menu__item header__menu__left__item ${index === activeNav ? 'active' : ''}`}
                                    onClick={menuToggle}
                                >
                                    <Link to={item.path}>
                                        <span>{item.display}</span>
                                    </Link>
                                </div>
                            ))
                        }
                    </div>
                    <div className="header__menu__right">
                        <div className="header__menu__item header__menu__right__item">
                            <Link to="/cart">
                                <i className="bx bx-shopping-bag"></i>
                                <span className = "header__menu__right__item__number">{quantity}</span>
                            </Link>
                        </div>
                        {user.Email !== '' ? 
                            <div className="header__menu__item header__menu__right__item">
                                <img className="header__menu__right__item__img" src={user.URLPicture} onClick = {handleProfile}/>
                                <span className="header__menu__right__item__span" onClick = {handleProfile}>Xin Chào: </span>
                                <span className="header__menu__right__item__name" onClick = {handleProfile}>{user.FullName}</span>
                            </div>
                            :
                            <div className="header__menu__item header__menu__right__item">
                                <Link to="/login">
                                    <a className="header__menu__right__item__link">Đăng Nhập</a>
                                </Link>
                                <span className="header__menu__right__item__separate">|</span>
                                <Link to="/register">
                                    <a className="header__menu__right__item__link" href="/register">Đăng Ký</a>
                                </Link>
                            </div>
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
