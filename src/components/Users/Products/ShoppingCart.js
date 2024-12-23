import { useEffect, useState } from "react";
import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cartItemsFromLocalStorageAction, changeOrderItemQty, removeOrderItemQty } from "../../../redux/slices/cart/cartSlices";
import { formatPrice } from "../../../utils/formatCurrency";
import { fetchCouponsAction, fetchSingleCouponAction } from "../../../redux/slices/coupons/couponSlice";
import SweetAlert from "../../Playground/SweetAlert";
import { useTranslation } from "react-i18next";

const ShoppingCart = () => {
  const [couponCode, setCouponCode] = useState();
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.carts);
  const { coupon, loading, error, isAdded } = useSelector(state => state.coupons);
  console.log(coupon);
  useEffect(() => {
    dispatch(cartItemsFromLocalStorageAction())
  }, [dispatch])
  const { t } = useTranslation();

  // add to cart handler
  const changeOrderItemQtyHandler = (productID, qty, size, color) => {
    dispatch(changeOrderItemQty({ productID, qty, size, color }))
    // get cart items from local storage after dispatching changeOrderItemQty
    dispatch(cartItemsFromLocalStorageAction())

  }

  const removeOrderItemFromLocalStorageHandler = (productID, size, color) => {
    dispatch(removeOrderItemQty({ productID, size, color }))
    // get cart items from local storage after dispatching removeOrderItemQty
    dispatch(cartItemsFromLocalStorageAction())
  }

  const applyCouponSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchSingleCouponAction(couponCode))
    setCouponCode('')
  }
  // calculate total price
  let sumTotalPrice = 0;
  let couponPrice = 0;
  sumTotalPrice = cartItems?.reduce((acc, item) => acc + item?.totalPrice, 0);
  let totalPrice = cartItems?.reduce((acc, item) => acc + item?.totalPrice, 0);
  // check if coupon is applied
  if (coupon) {
    sumTotalPrice = sumTotalPrice - (sumTotalPrice * coupon?.coupon?.discount) / 100
    couponPrice = totalPrice - sumTotalPrice;
  }
  // let cartItems;
  // let changeOrderItemQtyHandler;
  // let removeOrderItemFromLocalStorageHandler;
  //let calculateTotalDiscountedPrice;
  let couponFound;
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">

        {
          cartItems?.length > 0 ?
            <>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {t('shopping_cart')}
              </h1>
              <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">

                <section aria-labelledby="cart-heading" className="lg:col-span-7">
                  <h2 id="cart-heading" className="sr-only">
                    Items in your shopping cart
                  </h2>

                  <ul
                    role="list"
                    className="divide-y divide-gray-200 border-t border-b border-gray-200">
                    {cartItems?.map((product) => (
                      <li className="flex py-6 sm:py-10">
                        <div className="flex-shrink-0">
                          <img
                            src={product?.image}
                            alt={product?.name}
                            className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                            <div>
                              <div className="flex justify-between">
                                <h3 className="text-sm">
                                  <Link to={`/products/${product?._id}`}
                                    className="font-medium text-gray-700 hover:text-gray-800">
                                    {product.name}
                                  </Link>
                                </h3>
                              </div>
                              <div className="mt-1 flex text-sm">
                                <p className="text-gray-500">{product.color}</p>
                                {product.size ? (
                                  <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                                    {product.size}
                                  </p>
                                ) : null}
                              </div>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {`${formatPrice.format(product?.price)} x ${product?.qty} = ${formatPrice.format(product?.totalPrice)}`}
                              </p>
                            </div>

                            <div className="mt-4 sm:mt-0 sm:pr-9">
                              <label className="sr-only">
                                Quantity, {product.name}
                              </label>
                              <select
                                value={product?.qty}
                                onChange={(e) => changeOrderItemQtyHandler(product?._id, e.target.value, product?.size, product?.color)}
                                className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                {/* use the qty  */}
                                {[...Array(product?.qtyLeft).keys()].map((x) => {
                                  return <option key={x} value={x + 1}>{x + 1}</option>
                                })}

                              </select>
                              {/* remove */}
                              <div className="absolute top-0 right-0">
                                <button
                                  onClick={() =>
                                    removeOrderItemFromLocalStorageHandler(
                                      product?._id, product?.size, product?.color
                                    )
                                  }
                                  className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500">
                                  <span className="sr-only">Remove</span>
                                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Order summary */}
                <section
                  aria-labelledby="summary-heading"
                  className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                  <h2
                    id="summary-heading"
                    className="text-lg font-medium text-gray-900">
                    {t('order_summary')}
                  </h2>

                  <dl className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600">{t('subtotal')}</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {formatPrice.format(totalPrice)}
                        {/* $ {calculateTotalDiscountedPrice().toFixed(2)} */}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600">{t('discount')}</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {formatPrice.format(couponPrice.toFixed(2))}
                        {/* $ {calculateTotalDiscountedPrice().toFixed(2)} */}
                      </dd>
                    </div>

                    {/* <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      
                    </div> */}
                    <div className="flex items-center justify-between border-t border-gray-200"></div>
                    {/* add coupon */}
                    <dt className="flex items-center text-sm text-gray-600">
                      <span>{t('have_coupon_code')}</span>
                    </dt>

                    {/* success */}
                    {isAdded && (SweetAlert({ icon: "success", title: "Success", message: `Congratulation you got ${coupon?.discount}` }))}
                    <form onSubmit={applyCouponSubmit}>
                      <div className="mt-1">
                        <input
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          type="text"
                          className="block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder=""
                        />
                      </div>
                      {loading ? (
                        <button
                          disabled
                          className="inline-flex  text-center mt-4 items-center rounded border border-transparent bg-gray-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          {t('loading_please_wait')}
                        </button>
                      ) : (
                        <button className="inline-flex  text-center mt-4 items-center rounded border border-transparent bg-green-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          {t('apply_coupon')}
                        </button>
                      )}
                    </form>

                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <dt className="text-base font-medium text-gray-900">
                        {t('order_total')}
                      </dt>

                      <dd className=" text-xl font-medium text-gray-900">
                        {formatPrice.format(sumTotalPrice)}
                        {/* $ {calculateTotalDiscountedPrice().toFixed(2)} */}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6">
                    <Link
                      //  pass data to checkout page
                      to="/order-payment"
                      state={
                        {
                          sumTotalPrice,
                          totalPrice,
                          couponPrice
                        }
                      }
                      className="w-full rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                      {t('proceed_to_checkout')}
                    </Link>
                  </div>
                </section>
              </div>
            </>
            :
            <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
              <div className="text-center">
                <p className="text-base font-semibold text-indigo-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                </p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{t('cart_empty')}</h1>
                <p className="mt-6 text-base leading-7 text-gray-600">{t('cart_empty_desc')}</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link
                    to="/"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {t('go_back_home')}
                  </Link>

                </div>
              </div>
            </main>
        }

      </div>
    </div>)
}

export default ShoppingCart