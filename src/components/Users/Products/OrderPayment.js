import React, { useEffect, useState } from 'react'
import AddShippingAddress from '../Forms/AddShippingAddress';
import { Dialog, Popover, RadioGroup, Tab, Transition } from '@headlessui/react'
import { CheckCircleIcon, ChevronDownIcon, TrashIcon } from '@heroicons/react/20/solid'
import { useDispatch, useSelector } from 'react-redux';
import { cartItemsFromLocalStorageAction } from '../../../redux/slices/cart/cartSlices';
import { formatPrice } from '../../../utils/formatCurrency';
import { useLocation } from 'react-router-dom';
import { getUserProfileAction } from '../../../redux/slices/users/usersSlice';
import { placeOrderAction } from '../../../redux/slices/orders/ordersSlice';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const deliveryMethods = [
  { id: 1, title: 'Standard', turnaround: '4–10 business days', price: 5 },
  { id: 2, title: 'Express', turnaround: '2–5 business days', price: 16 },
]

const paymentMethods = [
  { id: 'credit-card', title: 'Credit card' },
  { id: 'paypal', title: 'PayPal' },
  { id: 'etransfer', title: 'eTransfer' },
]
const OrderPayment = () => {
  const location = useLocation();
  const { sumTotalPrice } = location.state;
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0])

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(cartItemsFromLocalStorageAction());
  }, [dispatch])
  const { cartItems } = useSelector(state => state.carts)

  const calculateTotalDiscountedPrice = () => { };

  // get profile user
  useEffect(() => {
    dispatch(getUserProfileAction());
  }, [dispatch])

  const { loading, error, profile } = useSelector(state => state.users);
  const user = profile?.user;

  // place order action
  // get shipping address
  const shippingAddress = user?.shippingAddress;
  //create order submit handler
  const createOrderSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(placeOrderAction({
      shippingAddress,
      orderItems: cartItems,
      totalPrice: sumTotalPrice
    }))
    localStorage.removeItem('cartItems');
  };

  const { loading: loadingOrder, error: errorOrder, order } = useSelector(state => state.orders);
  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="sr-only">Checkout</h1>

          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">Contact information</h2>

                <div className="mt-4">
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input

                      type="email"
                      id="email-address"
                      name="email-address"
                      autoComplete="email"
                      className="block w-full p-2 rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-10 border-t border-gray-200 pt-10">
                {/* shipping Address */}
                <AddShippingAddress />
                <div className="mt-10 border-t border-gray-200 pt-10">
                  <RadioGroup value={selectedDeliveryMethod} onChange={setSelectedDeliveryMethod}>
                    <RadioGroup.Label className="text-lg font-medium text-gray-900">Delivery method</RadioGroup.Label>

                    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      {deliveryMethods.map((deliveryMethod) => (
                        <RadioGroup.Option
                          key={deliveryMethod.id}
                          value={deliveryMethod}
                          className={({ checked, active }) =>
                            classNames(
                              checked ? 'border-transparent' : 'border-gray-300',
                              active ? 'ring-2 ring-indigo-500' : '',
                              'relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none'
                            )
                          }
                        >
                          {({ checked, active }) => (
                            <>
                              <span className="flex flex-1">
                                <span className="flex flex-col">
                                  <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                                    {deliveryMethod.title}
                                  </RadioGroup.Label>
                                  <RadioGroup.Description
                                    as="span"
                                    className="mt-1 flex items-center text-sm text-gray-500"
                                  >
                                    {deliveryMethod.turnaround}
                                  </RadioGroup.Description>
                                  <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-gray-900">
                                    {formatPrice.format(deliveryMethod.price)}
                                  </RadioGroup.Description>
                                </span>
                              </span>
                              {checked ? (
                                <CheckCircleIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                              ) : null}
                              <span
                                className={classNames(
                                  active ? 'border' : 'border-2',
                                  checked ? 'border-indigo-500' : 'border-transparent',
                                  'pointer-events-none absolute -inset-px rounded-lg'
                                )}
                                aria-hidden="true"
                              />
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Payment */}
                <div className="mt-10 border-t border-gray-200 pt-10">
                  <h2 className="text-lg font-medium text-gray-900">Payment</h2>

                  <fieldset className="mt-4">
                    <legend className="sr-only">Payment type</legend>
                    <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                      {paymentMethods.map((paymentMethod, paymentMethodIdx) => (
                        <div key={paymentMethod.id} className="flex items-center">
                          {paymentMethodIdx === 0 ? (
                            <input
                              id={paymentMethod.id}
                              name="payment-type"
                              type="radio"
                              defaultChecked
                              className="p-2 h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          ) : (
                            <input
                              id={paymentMethod.id}
                              name="payment-type"
                              type="radio"
                              className="p-2 h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          )}

                          <label htmlFor={paymentMethod.id} className="ml-3 block text-sm font-medium text-gray-700">
                            {paymentMethod.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>

                  <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
                    <div className="col-span-4">
                      <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                        Card number
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="card-number"
                          name="card-number"
                          autoComplete="cc-number"
                          className="block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="col-span-4">
                      <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700">
                        Name on card
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="name-on-card"
                          name="name-on-card"
                          autoComplete="cc-name"
                          className="block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="col-span-3">
                      <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                        Expiration date (MM/YY)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="expiration-date"
                          id="expiration-date"
                          autoComplete="cc-exp"
                          className="block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                        CVC
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="cvc"
                          id="cvc"
                          autoComplete="csc"
                          className="block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-10 lg:mt-0">
              <h2 className="text-lg font-medium text-gray-900">
                Order summary
              </h2>

              <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                <h3 className="sr-only">Items in your cart</h3>
                <ul role="list" className="divide-y divide-gray-200">
                  {cartItems?.map((product) => (
                    <li key={product._id} className="flex py-6 px-4 sm:px-6">
                      <div className="flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product._id}
                          className="w-20 rounded-md"
                        />
                      </div>

                      <div className="ml-6 flex flex-1 flex-col">
                        <div className="flex">
                          <div className="min-w-0 flex-1">
                            <p className="mt-1 text-sm text-gray-500">
                              {product.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {product.size}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {product.color}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-1 items-end justify-between pt-2">
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            $ {product?.price} X {product?.qty} = {product?.totalPrice}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <dl className="space-y-6 border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm">Taxes</dt>
                    <dd className="text-sm font-medium text-gray-900">{formatPrice.format(+selectedDeliveryMethod.price)}</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <dt className="text-base font-medium">Sub Total</dt>
                    <dd className="text-base font-medium text-gray-900">
                      {formatPrice.format(sumTotalPrice + selectedDeliveryMethod.price)}
                    </dd>
                  </div>
                </dl>

                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  {loadingOrder ? <button
                    className="w-full rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                    Loading ...
                  </button> : <button
                    onClick={createOrderSubmitHandler}
                    className="w-full rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                    Confirm Payment - ${calculateTotalDiscountedPrice()}
                  </button>}

                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default OrderPayment