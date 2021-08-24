import React, { useState, useEffect } from 'react'

import productAPI from '../api/productAPI'

import Helmet from '../components/Helmet'
import Section, { SectionBody, SectionTitle } from '../components/Section'
import Grid from '../components/Grid'
import ProductCard from '../components/ProductCard'
import ProductView from '../components/ProductView'

const Product = props => {

    const productId = props.match.params.slug;

    const initialProduct = {
        ProductId: "AT01",
        Description: "Sự hiện diện của những chiếc áo thun basic cổ tròn trong tủ đồ của bạn chính là chìa khóa giúp cho bạn có thêm nhiều outfit thú vị mà lại không cần đến quá nhiều món đồ. Áo thun nữ cotton cổ tròn basic chính là vũ khí tiện dụng cho các chị em trong trang phục hàng ngày!",
        CategoryId: "AT",
        URLPicture: "https://storage.googleapis.com/cdn.nhanh.vn/store/7136/ps/20210618/18062021030638_1000_x_1500__Dai_dien.jpg",
        Vote: 5,
        UnitPrice: 185000,
        Sold: 6,
        Title: "ÁO THUN W2ATN2051003",
        Quantity: 89,
        colors: [{
            Color: "White",
            URLPicture: "https://storage.googleapis.com/cdn.nhanh.vn/store/7136/ps/20210618/18062021030638_1000_x_1500__Dai_dien.jpg",
        }],
        sizes: ["S", "M"],
    }

    const [currentProduct, setCurrentProduct] = useState(initialProduct);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await productAPI.get(productId);
                setCurrentProduct(product);
            } catch (error) {
                console.log("Failed to fetch product list: ", error);
            }
        }
        fetchProduct();
    }, [productId])

    useEffect(() => {
        const fetchListProduct = async () => {
            try {
                const products = await productAPI.getAll();
                const relatedProducts =  products.filter(product => product.CategoryId.trim() === currentProduct.CategoryId.trim() 
                                                                    && product.ProductId.trim() !== currentProduct.ProductId.trim());
                setRelatedProducts(relatedProducts);
            } catch (error) {
                console.log("Failed to fetch product list: ", error);
            }
        }
        fetchListProduct();
    }, [currentProduct])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentProduct])

    return (
        <Helmet title={"Chi Tiết Sản Phẩm"}>
            <Section>
                <SectionBody>
                    <ProductView product={currentProduct} />
                </SectionBody>
            </Section>
            <Section>
                <SectionTitle>
                    Khám phá thêm
                </SectionTitle>
                <SectionBody>
                    <Grid
                        col={4}
                        mdCol={2}
                        smCol={1}
                        gap={20}
                    >
                        {relatedProducts.map((item, index) => (
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
        </Helmet>
    )
}

export default Product
