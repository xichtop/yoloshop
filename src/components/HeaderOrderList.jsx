import React, { useRef} from 'react'
import { Link, useLocation } from 'react-router-dom';

const mainNav = [
    {
        display: "Tất Cả",
        path: "/orderlist/"
    },
    {
        display: "Chờ Xác Nhận",
        path: "/orderlist/ordered"
    },
    {
        display: "Đang Giao Hàng",
        path: "/orderlist/delivering"
    },
    {
        display: "Đã Giao Hàng",
        path: "/orderlist/delivered"
    },
    {
        display: "Đã Hủy",
        path: "/orderlist/canceled"
    }
]

const HeaderOrderList = () => {

    const { pathname } = useLocation()
    const activeNav = mainNav.findIndex(e => e.path === pathname)

    const menuLeft = useRef(null)

    const menuToggle = () => menuLeft.current.classList.toggle('active')

    return (
        <div className="header-order" >
            <div className="header-order__container">
                <div className="header-order__menu">
                    <div className="header-order__menu__left" ref={menuLeft}>
                        {
                            mainNav.map((item, index) => (
                                <div
                                    key={index}
                                    className={`header-order__menu__item header-order__menu__left__item ${index === activeNav ? 'active' : ''}`}
                                    onClick={menuToggle}
                                >
                                    <Link to={item.path}>
                                        <span>{item.display}</span>
                                    </Link>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderOrderList
