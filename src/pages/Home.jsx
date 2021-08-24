import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';

import productAPI from '../api/productAPI'

import Helmet from '../components/Helmet'
import HeroSlider from '../components/HeroSlider'
import Section, { SectionTitle, SectionBody } from '../components/Section'
import PolicyCard from '../components/PolicyCard'
import Grid from '../components/Grid'
import ProductCard from '../components/ProductCard'
import heroSliderData from '../assets/data/hero-slider'
import policy from '../assets/data/policy'
import banner from '../assets/images/banner.png'

// import axios from 'axios';


const Home = () => {

    const [products, setProducts] = useState([]);

    const token = useSelector(state => state.user.token);

    const [bestSellingProducts, setBestSellingProducts] = useState([]);

    const [newProducts, setNewProducts] = useState([]);

    useEffect(() => {
        const fetchListProduct = async () => {
            try {
                const products = await productAPI.getAll(token);
                setProducts(products);
            } catch (error) {
                console.log("Failed to fetch product list: ", error);
            }
        }
        fetchListProduct();
    }, [])

    useEffect(() => {
        function compare(a, b) {
            return b.Sold - a.Sold;
        }
        products.sort(compare);
        const bestSellings = products.slice(0, 4);
        setBestSellingProducts(bestSellings);

        function compare2(a, b) {
            return Date.parse(b.CreatedDate) - Date.parse(a.CreatedDate);
        }
        products.sort(compare2);
        const newProductList = products.slice(0, 8);
        setNewProducts(newProductList);
    }, [products]);

    return (

        <Helmet title="Trang chủ">
            {/* hero slider */}
            <HeroSlider
                data={heroSliderData}
                control={true}
                auto={false}
                timeOut={5000}
            />
            {/* end hero slider */}

            {/* policy section */}
            <Section>
                <SectionBody>
                    <Grid
                        col={4}
                        mdCol={2}
                        smCol={1}
                        gap={20}
                    >
                        {
                            policy.map((item, index) => <Link key={index} to="/policy">
                                <PolicyCard
                                    name={item.name}
                                    description={item.description}
                                    icon={item.icon}
                                />
                            </Link>)
                        }
                    </Grid>
                </SectionBody>
            </Section>
            {/* end policy section */}

            {/* best selling section */}
            <Section>
                <SectionTitle>
                    top sản phẩm bán chạy
                </SectionTitle>
                <SectionBody>
                    <Grid
                        col={4}
                        mdCol={2}
                        smCol={1}
                        gap={20}
                    >
                        {
                            bestSellingProducts.map((item, index) => (
                                <ProductCard
                                    key={index}
                                    img01={item.URLPicture}
                                    img02={item.colors[0].URLPicture}
                                    name={item.Title}
                                    price={Number(item.UnitPrice)}
                                    oldPrice = {Number(item.OldPrice)}
                                    slug={item.ProductId}
                                />
                            ))
                        }
                    </Grid>
                </SectionBody>
            </Section>
            {/* end best selling section */}

            {/* new arrival section */}
            <Section>
                <SectionTitle>
                    sản phẩm mới
                </SectionTitle>
                <SectionBody>
                    <Grid
                        col={4}
                        mdCol={2}
                        smCol={1}
                        gap={20}
                    >
                        {
                            newProducts.map((item, index) => (
                                <ProductCard
                                    key={index}
                                    img01={item.URLPicture}
                                    img02={item.colors[0].URLPicture}
                                    name={item.Title}
                                    price={Number(item.UnitPrice)}
                                    oldPrice = {Number(item.OldPrice)}
                                    slug={item.ProductId}
                                />
                            ))
                        }
                    </Grid>
                </SectionBody>
            </Section>
            {/* end new arrival section */}

            {/* banner */}
            <Section>
                <SectionBody>
                    <Link to="/catalog">
                        <img src={banner} alt="" />
                    </Link>
                </SectionBody>
            </Section>
            {/* end banner */}

            {/* popular product section */}
            <Section>
                <SectionTitle>
                    phổ biến
                </SectionTitle>
                <SectionBody>
                    <Grid
                        col={4}
                        mdCol={2}
                        smCol={1}
                        gap={20}
                    >
                        {
                            products.slice(0, 8).map((item, index) => (
                                <ProductCard
                                    key={index}
                                    img01={item.URLPicture}
                                    img02={item.colors[0].URLPicture}
                                    name={item.Title}
                                    price={Number(item.UnitPrice)}
                                    oldPrice = {Number(item.OldPrice)}
                                    slug={item.ProductId}
                                />
                            ))
                        }
                    </Grid>
                </SectionBody>
            </Section>
            {/* end popular product section */}
        </Helmet>
    )
}

export default Home
