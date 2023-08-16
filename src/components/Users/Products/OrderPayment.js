import React, { useEffect, useState } from 'react'
import AddShippingAddress from '../Forms/AddShippingAddress';
import { Dialog, Popover, RadioGroup, Tab, Transition } from '@headlessui/react'
import { CheckCircleIcon, ChevronDownIcon, QuestionMarkCircleIcon, TrashIcon } from '@heroicons/react/20/solid'
import { useDispatch, useSelector } from 'react-redux';
import { cartItemsFromLocalStorageAction, navigateToHomeScreen } from '../../../redux/slices/cart/cartSlices';
import { formatPrice } from '../../../utils/formatCurrency';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserProfileAction } from '../../../redux/slices/users/usersSlice';
import { placeOrderAction } from '../../../redux/slices/orders/ordersSlice';
import { fetchShippingUnitAction } from '../../../redux/slices/shipping-unit/shippingUnitSlice';
import { resetSuccessAction } from '../../../redux/slices/globalActions/globalAction';
import { useTranslation } from 'react-i18next';
import SweetAlert from '../../Playground/SweetAlert';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const deliveryMethods = [
  { id: 1, title: 'Tiêu chuẩn', turnaround: '4–10 ngày', price: 15000 },
  { id: 2, title: 'Nhanh chóng', turnaround: '2–5 ngày', price: 30000 },
]

const paymentMethods = [
  { id: 'cod', title: 'Thanh toán khi nhận hàng' },
  { id: 'credit card', title: 'Thẻ tín dụng' },
  { id: 'zalopay', title: 'Zalopay' },
]
const OrderPayment = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    country: "",
    provinceId: "",
    districtId: "",
    wardId: "",
    province: "",
    district: "",
    ward: "",
    phone: "",
    message: ""
  });


  //onchange
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const location = useLocation();
  const { sumTotalPrice, totalPrice, couponPrice } = location.state;
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0])
  const { isAdded } = useSelector(state => state.orders)
  const [paymentMethod, setPaymentMethod] = useState();
  const [selected, setSelected] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    dispatch(cartItemsFromLocalStorageAction());
    dispatch(fetchShippingUnitAction())

  }, [dispatch])

  useEffect(() => {
    if (isAdded) {
      navigate('success');
      dispatch(resetSuccessAction());
    }
  }, [])
  const { cartItems } = useSelector(state => state.carts)
  const { shippingUnits, loading: loadingShippingUnit } = useSelector(state => state.shippingUnit)
  const [shippingUnitsOptions, setShippingUnitsOptions] = useState([]);
  const calculateTotalDiscountedPrice = () => { };
  // get profile user
  useEffect(() => {
    dispatch(getUserProfileAction());
  }, [dispatch])


  useEffect(() => {
    if (shippingUnits !== undefined) {
      setShippingUnitsOptions(shippingUnits)
    }
  }, [shippingUnits])
  const { loading, error, profile } = useSelector(state => state.users);
  const user = profile?.user;

  // place order action
  // get shipping address
  const shippingAddress = user?.shippingAddress;
  const totalPriceIncludeFee = sumTotalPrice + selectedDeliveryMethod?.price;

  //create order submit handler
  const createOrderSubmitHandler = (e) => {
    e.preventDefault();
    if (!formData.phone.trim() || !formData.fullName.trim() || !formData.address.trim()) {
      SweetAlert({ icon: "error", title: "Error", message: "Quý khách vui lòng nhập đầy đủ thông tin địa chỉ nhận hàng" })

    }
    else if (!selected) {

    }
    else {
      dispatch(placeOrderAction({
        shippingAddress: {
          ...formData
        },
        orderItems: cartItems,
        totalPrice: totalPriceIncludeFee,
        shippingUnit: selected,
        paymentMethod: paymentMethod,
        shipfee: selectedDeliveryMethod?.price
      }))
      // localStorage.removeItem('cartItems');
    }

  };
  const handleOnChange = (e) => {
    setPaymentMethod(e.target.value)
  }
  const { loading: loadingOrder, error: errorOrder, order } = useSelector(state => state.orders);
  const handleSelectDeliveryMethod = (deliveryMethod) => {
    setSelectedDeliveryMethod({
      ...deliveryMethod,
      price: deliveryMethod.price
    })
  };

  const orderItems = localStorage.getItem('cartItems');
  useEffect(() =>{
    if(!orderItems){
      dispatch(navigateToHomeScreen())
    }
  },[dispatch, orderItems])
  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="sr-only">Checkout</h1>

          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <div>
              {/* <div>
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
              </div> */}
              <div>
                {/* shipping Address */}
                <AddShippingAddress formData={formData} setFormData={setFormData} onChange={onChange} />
                <div className="border-t border-gray-200 pt-10">
                  <h2 className="text-lg font-medium text-gray-900">{t('shipping_unit')}</h2>
                  {loadingShippingUnit ? <div className="mt-3">Loading ...</div> :
                    shippingUnits?.shippingUnit?.map((item) => {
                      return (<RadioGroup value={selected} onChange={setSelected}>
                        <RadioGroup.Label className="sr-only"> Server size </RadioGroup.Label>
                        <div className="my-2">
                          <RadioGroup.Option
                            key={item?.name}
                            value={item}
                            className={({ checked, active }) =>
                              classNames(
                                checked ? 'border-transparent' : 'border-gray-300',
                                active ? 'border-indigo-600 ring-2 ring-indigo-600' : '',
                                'relative block cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between'
                              )
                            }
                          >
                            {({ active, checked }) => (
                              <>
                                <span className="flex items-center">
                                  <span className="flex flex-col text-sm">
                                    <RadioGroup.Label as="span" className="font-medium text-gray-900">
                                      {item?.name}
                                    </RadioGroup.Label>

                                  </span>
                                </span>
                                <RadioGroup.Description
                                  as="span"
                                  className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                                >
                                  <img src={item?.image} alt="" className="h-8 w-8 rounded-md object-fill" />
                                  {/* <span className="font-medium text-gray-900">{item?.name}</span>
                                  <span className="ml-1 text-gray-500 sm:ml-0">/mo</span> */}
                                </RadioGroup.Description>
                                <span
                                  className={classNames(
                                    active ? 'border' : 'border-2',
                                    checked ? 'border-indigo-600' : 'border-transparent',
                                    'pointer-events-none absolute -inset-px rounded-lg'
                                  )}
                                  aria-hidden="true"
                                />
                              </>
                            )}
                          </RadioGroup.Option>
                        </div>
                      </RadioGroup>)
                    })
                  }
                </div>
                {/* Payment */}
                <div className="mt-10 border-t border-gray-200 pt-10">
                  <h2 className="text-lg font-medium text-gray-900">{t('payment_method')}</h2>

                  <fieldset className="mt-4">
                    <legend className="sr-only">Payment type</legend>
                    <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                      {paymentMethods.map((paymentMethod, paymentMethodIdx) => (
                        <div key={paymentMethod.id} className="flex items-center">
                          {/* {paymentMethodIdx === 0 ? (
                            <input
                              id={paymentMethod.id}
                              name="payment-type"
                              type="radio"
                              defaultChecked
                              value={paymentMethod.id}
                              onChange={handleOnChange}

                              className="p-2 h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          ) : (
                            <input
                              id={paymentMethod.id}
                              name="payment-type"
                              type="radio"
                              onChange={handleOnChange}

                              className="p-2 h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          )} */}
                          <input
                            id={paymentMethod.id}
                            name="payment-type"
                            type="radio"
                            value={paymentMethod.id}
                            onChange={handleOnChange}
                            className="p-2 h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />

                          <label htmlFor={paymentMethod.id} className="ml-3 block text-sm font-medium text-gray-700">
                            {paymentMethod.title}
                          </label>
                        </div>
                      ))}

                    </div>
                  </fieldset>
                  {/* {
                    paymentMethod === 'zalopay' ? (
                      <>
                        <div className="mt-10 border-t border-gray-200 pt-10">
                          <h3 className="text-base font-semibold leading-6 text-gray-900">Internet Banking</h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
                        </div>
                        <div className="mt-5 border-t border-gray-200">
                          <dl className="divide-y divide-gray-200">
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                              <dt className="text-sm font-medium text-gray-500">Full name</dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <span className="flex-grow">PHAM THANH HUNG</span>

                              </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                              <dt className="text-sm font-medium text-gray-500">Account number</dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <span className="flex-grow">4102901441042460</span>

                              </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                              <dt className="text-sm font-medium text-gray-500">Bank</dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <span className="flex-grow">MB Bank</span>
                              </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                              <dt className="text-sm font-medium text-gray-500">Branch</dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <span className="flex-grow">Số 98, Ngụy Như Kon Tum, PhườngNhân Chính, Quận Thanh Xuân,Thành phố Hà Nội</span>

                              </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                              <dt className="text-sm font-medium text-gray-500">Transfer Contents</dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <span className="flex-grow">
                                  SDT + Họ tên + Mã đơn hàng
                                </span>

                              </dd>
                            </div>

                          </dl>
                        </div>
                      </>
                    ) : ''
                  } */}
                  {
                    paymentMethod === 'cod' ? (
                      <div className="mt-10 border-t border-gray-200 pt-10">
                        <RadioGroup value={selectedDeliveryMethod} onChange={handleSelectDeliveryMethod}>
                          <RadioGroup.Label className="text-lg font-medium text-gray-900">Thời gian vận chuyển</RadioGroup.Label>

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
                    ) : ''
                  }
                  {/* <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
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
                  </div> */}
                </div>

              </div>
            </div>

            {/* Order summary */}
            <div className="mt-10 lg:mt-0">
              <h2 className="text-lg font-medium text-gray-900">
                {t('order_summary')}
              </h2>

              <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                <h3 className="sr-only">Items in your cart</h3>
                <ul role="list" className="divide-y divide-gray-200">
                  {cartItems?.map((product,index) => (
                    <li key={index} className="flex py-6 px-4 sm:px-6">
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
                             {formatPrice.format(+product?.price)} x {product?.qty} = {formatPrice.format(+totalPrice)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <dl className="space-y-6 border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm">{t('subtotal')}</dt>
                    <dd className="text-sm font-medium text-gray-900">{formatPrice.format(+totalPrice)}</dd>
                  </div>
                  <div className="flex items-center justify-between ">
                    <dt className="flex items-center text-sm text-gray-600">
                      <span>{t('shipping_estimate')}</span>
                      {/* <a href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Learn more about how shipping is calculated</span>
                        <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
                      </a> */}
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">{formatPrice.format(+selectedDeliveryMethod?.price)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm">{t('discount')}</dt>
                    <dd className="text-sm font-medium text-gray-900">{couponPrice > 0 && couponPrice !== null ? `-${formatPrice.format(+couponPrice)}` : 0}</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <dt className="text-base font-medium">{t('order_total')}</dt>
                    <dd className="text-base font-medium text-gray-900">
                      {formatPrice.format(+sumTotalPrice + selectedDeliveryMethod?.price)}
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
                    {/* Confirm Payment - ${calculateTotalDiscountedPrice()}
                     */}
                    {t('confirm_payment')}
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