import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllProductAction } from "../../redux/slices/products/productSlices";
import baseURL from "../../utils/baseURL";
import LoadingComponent from "../LoadingComp/LoadingComponent";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";
import { formatPrice } from "../../utils/formatCurrency";
import { defaultImage } from "../../utils/defaultImage";

const HomeProductTrending = () => {
  let productUrl = `${baseURL}/products?`
  const dispatch = useDispatch();
  const page = 1;
  const limit = 10;
  useEffect(() => {
    dispatch(fetchAllProductAction({
      url: productUrl,
      page: 1,
      limit: 12
    }));
  }, [dispatch, page, limit])

  const { products, loading, error } = useSelector(state => state.product)
  return (
    <>
      <section aria-labelledby="trending-heading">
        <div className="mx-auto max-w-7xl py-24 px-4 sm:px-6 sm:py-32 lg:px-8 lg:pt-32">
          <div className="md:flex md:items-center md:justify-between">
            <h2
              id="favorites-heading"
              className="text-2xl font-bold tracking-tight text-gray-900">
              Trending Products
            </h2>
            <a
              href="#"
              className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block">
              Shop the collection
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>

          {/* <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
            {
              loading ? <LoadingComponent /> : products?.products?.map((product) => (
                <Link
                  to={`/products/${product.id}`}
                  key={product.id}
                  className="group relative">
                  <div className="h-56 w-full overflow-hidden rounded-md group-hover:opacity-75 lg:h-72 xl:h-80">
                    <img
                      src={product?.images[0]}
                      alt={product?.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">
                    <a href={product?.href ?? ''}>
                      <span className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {product.price}
                  </p>
                </Link>
              ))}
          </div> */}
          <div className="relative mt-8">
            <div className="relative w-full overflow-x-auto">
              <ul
                role="list"
                className="mx-4 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:space-x-0"
              >
                {products?.products?.map((product) => (
                  <li key={product.id} className="inline-flex w-64 flex-col py-6 text-center lg:w-auto">
                    <div className="group relative">
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
                        <Link to={`/products/${product.id}`}
                          key={product.id}>
                          <img
                            src={product?.images[0] ?? defaultImage}
                            alt={product?.imageAlt}
                            className="h-72 w-72 object-cover object-center group-hover:opacity-75"
                          />
                          <div className="mt-6">
                            <p className="text-sm text-gray-500">{capitalizeFirstLetter(product?.colors[0] ?? 'no color')}</p>
                            <h3 className="mt-1 font-semibold text-gray-900">
                              <a href={product?.href}>
                                <span className="absolute inset-0" />
                                {product?.name}
                              </a>
                            </h3>
                            <p className="mt-1 text-gray-900">{formatPrice.format(product?.price)}</p>
                          </div>
                          <h4 className="sr-only">Available colors</h4>
                          <ul role="list" className="mt-auto flex items-center justify-center space-x-3 py-6">
                            {product?.colors?.map((color) => (
                              <li
                                key={color.name}
                                className="h-4 w-4 rounded-full border border-black border-opacity-10"
                                style={{ backgroundColor: color }}
                              >
                                <span className="sr-only"> {color.name} </span>
                              </li>
                            ))}
                          </ul>
                        </Link>
                      </div>

                    </div>


                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* <div className="mt-8 text-sm md:hidden">
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500">
              Shop the collection
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div> */}
          <div className="mt-12 px-4 sm:hidden">
            <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
              See everything
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeProductTrending;
