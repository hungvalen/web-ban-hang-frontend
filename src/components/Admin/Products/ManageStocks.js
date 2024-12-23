import { Link, useSearchParams } from "react-router-dom";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import NoDataFound from "../../NoDataFound/NoDataFound";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllProductAction } from "../../../redux/slices/products/productSlices";
import baseURL from "../../../utils/baseURL";
import Pagination from "../../pagination/Pagination";
import Skeleton from "react-loading-skeleton";
import EditProduct from "./modal/EditProduct";
import { resetSuccessAction } from "../../../redux/slices/globalActions/globalAction";
import DeleteProduct from "./modal/DeleteProduct";
import { limitNumber } from "../../../utils/limitNumber";
import AddProduct from "./modal/AddProduct";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../../utils/formatCurrency";

export default function ManageStocks() {
  const [params] = useSearchParams();
  const [isShowEditProductModal, setIsShowEditProductModal] = useState(false);
  const [isShowDeleteProductModal, setIsShowDeleteProductModal] = useState(false);
  const [isShowAddProductModal, setIsShowAddProductModal] = useState(false);
  const [product, setProduct] = useState('');
  //Selector
  let { products, loading, error, isUpdated, isDeleted } = useSelector(state => state.product);
  let count = products?.count;
  let totalPage = Math.ceil(count / limitNumber);
  let productUrl = `${baseURL}/products`
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const limit = params.get("limit") || 5;
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [isView, setIsView] = useState(false);
  // const [pages, setPages] = useState(totalPage)
  useEffect(() => {
    dispatch(fetchAllProductAction({ url: productUrl, page: page, limit, name: query }))
  }, [dispatch, page, limit, productUrl, query])


  useEffect(() => {
    if (isUpdated) {
      dispatch(fetchAllProductAction({ url: productUrl, page, limit, name: query }))
      dispatch(resetSuccessAction());
    }
  }, [isUpdated, productUrl, page, limit, dispatch, query])

  useEffect(() => {
    if (isDeleted) {
      dispatch(fetchAllProductAction({ url: productUrl, page, limit, name: query }))
      dispatch(resetSuccessAction());
    }
  }, [isDeleted, productUrl, page, limit, dispatch, query])

  const handleShowEditProductModal = (product, isView) => {
    setIsShowEditProductModal(!isShowEditProductModal)
    setProduct(product)
    setIsView(isView)
  };
  const handleShowAddProductModal = () => {
    setIsShowAddProductModal(!isShowAddProductModal)
  };

  const handleShowDeleteProductModal = (product) => {
    setIsShowDeleteProductModal(!isShowDeleteProductModal)
    setProduct(product)
  };
  const { t } = useTranslation();

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-3">
      <div className="sm:flex sm:items-center mb-3">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            {/* Product List- {products?.length} items */}
            {t('manage_stock')}
          </h1>
          {/* <p className="mt-2 text-sm text-gray-700">
            List of all the products in your account including their name,
            title,
          </p> */}
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            // to="/admin/add-product"
            onClick={() => handleShowAddProductModal()}
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
            {t('add_new_product')}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <input
          type="search"
          name="search"
          placeHolder={t('search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {loading ? (
        <LoadingComponent />
      ) : error ? (
        <ErrorMsg message={error?.message} />
      ) : (products?.length <= 0 || products?.products?.length <= 0) ? (
        <NoDataFound />
      ) : (
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        {t('name')}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        {t('category')}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        {t('status')}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        {t('total_qty')}
                      </th>
                      {/* <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        {t('total_sold')}
                      </th> */}

                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        {t('qty_left')}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        {t('price')}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        {t('action')}
                      </th>
                      {/* <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Delete
                      </th> */}

                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {products?.products?.map((product) => (
                      <tr key={product._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={product?.images[0] ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCzs32Uq8r3JrGXjvogJmoMb7h-KW0YU79hg&usqp=CAU'}
                                alt={product?.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {loading ? <Skeleton className="ml-3" width={200} height={30} /> : product.name}

                              </div>
                              <div className="text-gray-500">
                                {product?.brand}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="text-gray-900">
                            {product?.category}
                          </div>
                          <div className="text-gray-500">
                            {product.department}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {product?.qtyLeft < 0 ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              {t('out_of_stock')}
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {t('in_stock')}
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {product?.totalQty}
                        </td>

                        {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {product?.totalSold}
                        </td> */}
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {product?.qtyLeft <= 0 ? 0 : product?.qtyLeft}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatPrice.format(product?.price)}
                        </td>
                        {/* edit */}
                        <td className="relative whitespace-nowrap py-4 px-3 text-sm font-medium sm:pr-6">

                          <button
                            onClick={() => handleShowEditProductModal(product, false)}
                            // to={`/admin/products/edit/${product._id}`}
                            className="text-indigo-600 hover:text-indigo-900 mx-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>

                            <span className="sr-only">, {product.name}</span>
                          </button>
                          <button
                            onClick={() => handleShowDeleteProductModal(product)}
                            className="text-rose-600 hover:text-rose-700 mx-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>

                            <span className="sr-only">, {product.name}</span>
                          </button>

                        </td>
                        {/* delete */}
                        {/* <td className="relative whitespace-nowrap py-4 px-3 text-sm font-medium sm:pr-6">
                        
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination page={page} pages={totalPage} changePage={setPage} count={count} />
              </div>
            </div>
          </div>

          {
            isShowEditProductModal && (
              <EditProduct isShowEditProductModal={isShowEditProductModal} product={product} setIsShowEditProductModal={setIsShowEditProductModal} isView={isView} />
            )
          }
          {
            isShowDeleteProductModal && (
              <DeleteProduct isShowDeleteProductModal={isShowDeleteProductModal} product={product} setIsShowDeleteProductModal={setIsShowDeleteProductModal} />
            )
          }
          {
            isShowAddProductModal && (
              <AddProduct isShowAddProductModal={isShowAddProductModal} setIsShowAddProductModal={setIsShowAddProductModal} />
            )
          }
          {/* <EditProduct isShowEditProductModal={isShowEditProductModal} productId={productId} /> */}

        </div>

      )}


    </div>
  );
}
