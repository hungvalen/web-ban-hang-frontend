import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../../utils/formatCurrency";
import { useSelector } from "react-redux";
import { defaultImage } from "../../../utils/defaultImage";
import Pagination from "../../pagination/Pagination";
import { StarIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const Products = ({ products, page,
  totalPage,
  setPage,
  count, }) => {
    const { t } = useTranslation();
  return (
    <section aria-labelledby="product-heading" className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3">
      {/* <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:col-span-3 lg:gap-x-8">
        {products?.map((product, index) => (
          <>
            <div key={index} className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
              <div className="relative bg-gray-50">
                <span className="absolute top-0 left-0 ml-6 mt-6 px-2 py-1 text-xs font-bold font-heading bg-white border-2 border-red-500 rounded-full text-red-500">
                  -15%
                </span>
                <Link
                  className="block"
                  to={{
                    pathname: `/products/${product?.id}`,
                  
                  }}>
                  <img
                    className="w-full h-64 object-cover"
                    src={product?.images[0]}
                    alt
                  />
                </Link>
                <div className="px-6 pb-6 mt-8">
                  <a className="block px-6 mb-2" href="#">
                    <h3 className="mb-2 text-xl font-bold font-heading">
                      {product?.name}
                    </h3>
                    <p className="text-lg font-bold font-heading text-blue-500">
                      <span className="mr-2">{formatPrice.format(product?.price)}</span>
                      <span className="text-xs text-gray-500 font-semibold font-heading line-through">
                        $40.99
                      </span>
                    </p>
                  </a>
                  <a
                    className="ml-auto mr-2 flex items-center justify-center w-12 h-12 bg-blue-300 hover:bg-blue-400 rounded-md"
                    href="#">
                    <svg
                      width={12}
                      height={12}
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <rect x={5} width={2} height={12} fill="white" />
                      <rect
                        x={12}
                        y={5}
                        width={2}
                        height={12}
                        transform="rotate(90 12 5)"
                        fill="white"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </>
        ))}
      </div> */}
      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3">
        {products?.map((product) => (
          <div
            key={product?._id}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
          >
            <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-96">
              <img
                src={product?.images[0] ?? defaultImage}
                alt={product?.name}
                className="h-36 w-36 object-cover object-center sm:h-full sm:w-full"
              />
            </div>
            <div className="flex flex-1 flex-col space-y-2 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  <Link to={`/products/${product?._id}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product?.name}
                  </Link>
                </h3>
                {
                  product?.averageRating > 0 ? <div className="flex items-center">
                    <p className="text-sm text-gray-700">
                      {product?.averageRating} 
                    </p>
                    <div className="ml-1 flex items-center">
                      <StarIcon
                        // key={rating}
                        className="text-yellow-400 h-5 w-5 flex-shrink-0"

                        aria-hidden="true"
                      />

                    </div>
                  </div> : <></>
                }

              </div>
              {/* <p className="text-sm text-gray-500">{product?.description}</p> */}
              <div className="flex items-center">
                <div className="mt-3 flex flex-1 flex-col justify-end">
                  <p className="text-sm italic text-gray-500">{product?.colors?.length === 1 ? product?.colors[0] : `${product?.colors?.length} colors`}</p>
                  <p className="text-base font-medium text-gray-900">{formatPrice.format(product?.price)}</p>

                </div>
                <p className="text-sm text-gray-700"> | {t('sold')}{product?.totalSold}</p>
              </div>
             

            </div>
          </div>
        ))}
      </div>
    </section >
  );
};

export default Products;
