import React from 'react';
import BreadcrumbSection from '../about/SingerPageSection';
import ProductDetail from './ProductDetail';
import RelatedProducts from './RelatedProducts';
import LogoCarousel from '../home/LogoCarousel';

function SingleProduct() {
  return (
    <>
      <BreadcrumbSection />
      <div className="single-product mt-150 mb-150">
        <div className="container">
          <ProductDetail />
        </div>
      </div>
      <RelatedProducts />
      <LogoCarousel />
    </>
  );
}

export default SingleProduct;