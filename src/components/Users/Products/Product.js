import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import {
  CurrencyDollarIcon,
  GlobeAmericasIcon,
  ReceiptRefundIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import { Link, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProductAction } from "../../../redux/slices/products/productSlices";
import { addOrderToCartAction, cartItemsFromLocalStorageAction, changeOrderItemQty } from "../../../redux/slices/cart/cartSlices";
import SweetAlert from "../../Playground/SweetAlert";
import Skeleton from "react-loading-skeleton";
import { formatPrice } from "../../../utils/formatCurrency";
import { Dialog, Disclosure, Menu, Popover, Tab, Transition } from '@headlessui/react'
import AddReview from "../Reviews/AddReview";
import AddReviewModal from "../Reviews/AddReview";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import { convertHtmlToPlainText, isHtmlText } from "../../../utils/convertHTMLToPlainText"
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from 'react-toastify';
import { resetSuccessAction } from "../../../redux/slices/globalActions/globalAction";
import capitalizeFirstLetter from "../../../utils/capitalizeFirstLetter";
import { getUserProfileAction } from "../../../redux/slices/users/usersSlice";
const product = {
  name: "Basic Tee",
  price: "$35",
  href: "#",
  breadcrumbs: [
    { id: 1, name: "Women", href: "#" },
    { id: 2, name: "Clothing", href: "#" },
  ],
  images: [
    {
      id: 1,
      imageSrc:
        "https://images.pexels.com/photos/14579191/pexels-photo-14579191.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      imageAlt: "Back of women's Basic Tee in black.",
      primary: true,
    },
    {
      id: 2,
      imageSrc:
        "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      imageAlt: "Side profile of women's Basic Tee in black.",
      primary: false,
    },
    {
      id: 3,
      imageSrc:
        "https://images.pexels.com/photos/12257795/pexels-photo-12257795.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      imageAlt: "Front of women's Basic Tee in black.",
      primary: false,
    },
  ],
  colors: [
    { name: "Black", bgColor: "bg-gray-900", selectedColor: "ring-gray-900" },
    {
      name: "Heather Grey",
      bgColor: "bg-gray-400",
      selectedColor: "ring-gray-400",
    },
  ],
  sizes: [
    { name: "XXS", inStock: true },
    { name: "XS", inStock: true },
    { name: "S", inStock: true },
    { name: "M", inStock: true },
    { name: "L", inStock: true },
    { name: "XL", inStock: false },
  ],
  description: `
    <p>The Basic tee is an honest new take on a classic. The tee uses super soft, pre-shrunk cotton for true comfort and a dependable fit. They are hand cut and sewn locally, with a special dye technique that gives each tee it's own look.</p>
    <p>Looking to stock your closet? The Basic tee also comes in a 3-pack or 5-pack at a bundle discount.</p>
  `,
  details: [
    "Only the best materials",
    "Ethically and locally made",
    "Pre-washed and pre-shrunk",
    "Machine wash cold with similar colors",
  ],
};



function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [productQty, setProductQty] = useState(null);
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const policies = [
    {
      name: "International delivery",
      icon: CheckCircleIcon,
      description: "Hoàn tiền 111% nếu hàng giả",
    },
    {
      name: "Loyalty rewards",
      icon: ReceiptRefundIcon,
      description: "Đổi trả trong 7 ngày nếu sản phẩm lỗi.",
    },
  ];
  useEffect(() => {
    dispatch(fetchSingleProductAction(id
    ))

  }, [id])
  const { isAdded } = useSelector(state => state.reviews)

  useEffect(() => {
    if (isAdded) {
      dispatch(fetchSingleProductAction(id
      ))

      dispatch(resetSuccessAction())
    }
  }, [id, isAdded])
  useEffect(() => {
    dispatch(cartItemsFromLocalStorageAction())
  }, [])
  const user = JSON.parse(localStorage.getItem('userInfo'));
  useEffect(() => {
    if (user) {
      dispatch(getUserProfileAction());
    }
  }, [dispatch])

  const handleAddReview = () => {
    setShowAddReviewModal(!showAddReviewModal)
  }

  const { profile } = useSelector(state => state?.users)
  console.log('check profile', profile)
  //Add to cart handler
  const addToCartHandler = () => {
    // check if product is in cart
    // if (productExists) {
    //   return SweetAlert({ icon: "error", title: "Error", message: 'Product already in cart' });
    // }
    // check if color/size selected
    if (selectedColor === "") {
      return SweetAlert({ icon: "error", title: "Oops...", message: 'Vui lòng chọn màu sắc' });

    }
    if (selectedSize === "") {
      return SweetAlert({ icon: "error", title: "Oops...", message: 'Vui lòng chọn kích cỡ' });

    }
    // Check if product is in cart
    const cartItems = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];
    const productExists = cartItems.some((item) => item._id === product._id && item.color === selectedColor && item.size === selectedSize);
    const userLogin = localStorage.getItem("userInfo")

    if (!userLogin) {
      return SweetAlert({ icon: "error", title: "Oops...", message: 'Vui lòng đăng nhập để sử dụng tính năng này' });
    }
    if (productExists) {
      // Product already in cart, update quantity
      const updatedCartItems = cartItems.map((item) =>
        item._id === product._id && item.color === selectedColor && item.size === selectedSize
          ? { ...item, qty: Math.min(item.qty + 1, item.qtyLeft), totalPrice: product?.price * Math.min(item.qty + 1, item.qtyLeft) } // Increment quantity but not exceeding qtyLeft
          : item
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      // SweetAlert({ icon: "success", title: "Success", message: 'Product quantity updated in cart' });
      toast.success(t('add_to_cart_qty'));

    } else {
      // Product not in cart, add to cart
      const newCartItem = {
        _id: product._id,
        name: product.name,
        qty: productQty !== null ? productQty : 1,
        price: product.price,
        description: product.description,
        color: selectedColor,
        size: selectedSize,
        image: product.images.length > 0 ? product.images[0] : '',
        totalPrice: productQty !== null ? product.price * productQty : product.price,
        qtyLeft: product.qtyLeft
      };

      if (newCartItem.qty > newCartItem.qtyLeft) {
        newCartItem.qty = newCartItem.qtyLeft;
      }

      cartItems.push(newCartItem);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      // SweetAlert({ icon: "success", title: "Success", message: 'Product added to cart successfully' });
      toast.success(t('add_to_cart_message'));
    }

    // Reload cart items from localStorage
    return dispatch(cartItemsFromLocalStorageAction());
    // dispatch(addOrderToCartAction({
    //   _id: product?._id,
    //   name: product?.name,
    //   qty: 1,
    //   price: product?.price,
    //   description: product?.description,
    //   color: selectedColor,
    //   size: selectedSize,
    //   image: product?.images?.length > 0 ? product?.images[0] : '',
    //   totalPrice: product?.price,
    //   qtyLeft: product?.qtyLeft
    // }))
    // SweetAlert({ icon: "success", title: "Success", message: 'Product added to cart successfully' });
    // return dispatch(cartItemsFromLocalStorageAction())

  };
  const { cartItems } = useSelector(state => state?.carts)

  const { product: { product }, loading, error } = useSelector(state => state.product)
  const productExists = cartItems?.find((item) => item?._id === product?._id);
  const productPrice = formatPrice.format(+product?.product?.price)
  //Add product to cart
  // const addToCartHandler = () => {
  //   dispatch(addOrderToCartAction({
  //     _id: product?._id,
  //     name: product?.name,
  //     qty: product?.qty,
  //     price: product?.price,
  //     description: product?.description,
  //     color: selectedColor,
  //     size: selectedSize,
  //   }))
  // };
  // Get cart items

  // let cartItems = [];
  const changeOrderItemQtyHandler = (e) => {
    setProductQty(e)
  }
  return (
    <>
      {loading ? <LoadingComponent /> : <div className="bg-white">
        <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="flex justify-between">
                <h1 className="text-xl font-medium text-gray-900 w-3/4">
                  {
                    loading ? <Skeleton className="" width={200} height={30} /> : product?.name
                  }
                </h1>
                <p className="text-xl font-medium text-gray-900">
                  {
                    loading ? <Skeleton className="" width={200} height={30} /> : formatPrice.format(product?.price)
                  }

                </p>
              </div>
              {/* Reviews */}
              <div className="mt-4">
                <h2 className="sr-only">Reviews</h2>
                {
                  loading ? <Skeleton className="" width={200} height={30} /> : <div className="flex items-center">
                    <p className="text-sm text-gray-700">
                      {
                        product?.reviews?.length > 0 ? product?.averageRating : 0
                      }

                    </p>
                    <div className="ml-1 flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={classNames(
                            +product?.averageRating > rating
                              ? "text-yellow-400"
                              : "text-gray-200",
                            "h-5 w-5 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <div
                      aria-hidden="true"
                      className="ml-4 text-sm text-gray-300"></div>
                    <div className="ml-4 flex">
                      <span
                        // href="#"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        {/* {productDetails?.product?.totalReviews}  */}
                        total reviews
                      </span>
                    </div>
                  </div>
                }

                {/* leave a review */}

                <div className="mt-4">
                  <>
                    <button type="button" className="text-sm font-medium text-blue-600 cursor-pointer" onClick={handleAddReview}>
                      {t('leave_a_review')}
                    </button>
                  </>
                </div>
              </div>
            </div>

            {/* Image gallery */}
            <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
              <h2 className="sr-only">Images</h2>

              <>

                {/* {product?.images?.map((image) => (
                <img
                  // key={image.id}
                  src={image}
                  // alt={image.imageAlt}
                  className={classNames(
                    image.primary
                      ? "lg:col-span-2 lg:row-span-2"
                      : "hidden lg:block",
                    "rounded-lg"
                  )}
                />
              ))} */}
                <Tab.Group as="div" className="flex flex-col-reverse">
                  {/* Image selector */}
                  <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                    <Tab.List className="grid grid-cols-4 gap-6">
                      {product?.images?.map((image) => (
                        <Tab
                          key={image?._id}
                          className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                        >
                          {({ selected }) => (
                            <>
                              {/* <span className="sr-only"> {image} </span> */}
                              <span className="absolute inset-0 overflow-hidden rounded-md">
                                <img src={image} alt="" className="h-full w-full object-cover object-center" />
                              </span>
                              <span
                                className={classNames(
                                  selected ? 'ring-indigo-500' : 'ring-transparent',
                                  'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2'
                                )}
                                aria-hidden="true"
                              />
                            </>
                          )}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>

                  <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
                    {product?.images?.map((image) => (
                      <Tab.Panel key={image?._id}>
                        <img
                          src={image}
                          alt={image}
                          className="h-full w-full object-cover object-center sm:rounded-lg"
                        />
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>
              </>
            </div>

            <div className="mt-8 lg:col-span-5">
              <>
                {/* Color picker */}
                <div>
                  <h2 className="text-sm font-medium text-gray-900">{t('select_color')}</h2>
                  <div className="flex items-center space-x-3">
                    <RadioGroup value={selectedColor} onChange={setSelectedColor}>
                      <div className="mt-4 flex items-center space-x-3">
                        {product?.colors?.map((color) => (
                          <RadioGroup.Option
                            key={color}
                            value={color}
                            className={({ active, checked }) =>
                              classNames(
                                active && checked ? "ring ring-offset-1" : "",
                                !active && checked ? "ring-2" : "",
                                "-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                              )
                            }>
                            <RadioGroup.Label as="span" className="sr-only">
                              {color.name}
                            </RadioGroup.Label>
                            <span
                              style={{ backgroundColor: color }}
                              aria-hidden="true"
                              className={classNames(
                                "h-8 w-8 border border-black border-opacity-10 rounded-full"
                              )}
                            />
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* in stock */}
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-gray-900">{t('instock')}: {product?.qtyLeft <= 0 ? t('out_of_stock') : product?.qtyLeft}</h2>
                  </div>

                </div>
                {/* quantity */}
                {
                  product?.qtyLeft > 0 && <div className="mt-8">
                    <div className="flex flex-col items-start">
                      <h2 className="text-sm font-medium text-gray-900 mb-2">{t('quantity')}</h2>
                      <select
                        value={productQty}
                        onChange={(e) => changeOrderItemQtyHandler(e.target.value)}
                        className="max-w-full rounded-md border border-gray-300 py-1.5 px-3 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                        {/* use the qty  */}
                        {[...Array(product?.qtyLeft).keys()].map((x) => {
                          return <option key={x} value={x + 1}>{x + 1}</option>
                        })}

                      </select>
                    </div>

                  </div>
                }

                {/* select size */}
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-gray-900">{t('select_size')}</h2>
                  </div>
                  <RadioGroup
                    value={selectedSize}
                    onChange={setSelectedSize}
                    className="mt-2">
                    {/* Choose size */}
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                      {product?.sizes?.map((size) => (
                        <RadioGroup.Option
                          key={size}
                          value={size}
                          className={({ active, checked }) => {
                            return classNames(
                              checked
                                ? "bg-indigo-600 border-transparent  text-white hover:bg-indigo-700"
                                : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
                              "border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 cursor-pointer"
                            );
                          }}>
                          <RadioGroup.Label as="span">{size}</RadioGroup.Label>
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
                {/* add to cart */}
                {
                  product?.qtyLeft <= 0 ? (
                    <button
                      style={{ cursor: "not-allowed" }}
                      disabled
                      className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-gray-600 py-3 px-8 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      {t('out_of_stock')}
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCartHandler()}
                      className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      {/* Add to cart */}
                      {t('add_to_cart')}
                    </button>
                  )
                }

                {/* proceed to check */}

                {/* {cartItems?.length > 0 && (
                  <Link
                    to="/shopping-cart"
                    className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-green-800 py-3 px-8 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    {/* Proceed to checkout */}
                {/* {t('proceed_to_checkout')}
                  </Link>
                )} */}
              </>

              {/* Product details */}
              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">{t('product_desc')}</h2>
                <div className="prose prose-sm mt-4 text-gray-500" dangerouslySetInnerHTML={{ __html: product?.description }}>
                  {/* {
                    isHtmlText(product?.description) === true ? convertHtmlToPlainText(product?.description) : product?.description
                  } */}
                </div>
              </div>

              {/* Policies */}
              <section aria-labelledby="policies-heading" className="mt-10">
                <h2 id="policies-heading" className="sr-only">
                  Our Policies
                </h2>

                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {policies.map((policy) => (
                    <div
                      key={policy.name}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                      <dt>
                        <policy.icon
                          className="mx-auto h-6 w-6 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <span className="mt-4 text-sm font-medium text-gray-900">
                          {/* {policy.name} */}
                        </span>
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {policy.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </div >

          {/* review summary */}
          <div className="bg-white  divide-y divide-gray-200 border-t border-b border-gray-200 mt-8">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:px-2 lg:py-8">
              <div className="lg:col-span-4">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('customer_review')}</h2>

                <div className="mt-3 flex items-center">
                  <div>
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={classNames(
                            +product?.averageRating > rating ? 'text-yellow-400' : 'text-gray-300',
                            'h-5 w-5 flex-shrink-0'
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="sr-only">{+product?.averageRating} out of 5 stars</p>
                  </div>
                  <p className="ml-2 text-sm text-gray-900">{t('based_on')} {product?.totalCount} đánh giá</p>
                </div>

                <div className="mt-6">
                  <h3 className="sr-only">Review data</h3>

                  <dl className="space-y-3">
                    {product?.counts.map((count) => (
                      <div key={count.rating} className="flex items-center text-sm">
                        <dt className="flex flex-1 items-center">
                          <p className="w-3 font-medium text-gray-900">
                            {count.rating}
                            <span className="sr-only"> star reviews</span>
                          </p>
                          <div aria-hidden="true" className="ml-1 flex flex-1 items-center">
                            <StarIcon
                              className={classNames(
                                count.count > 0 ? 'text-yellow-400' : 'text-gray-300',
                                'h-5 w-5 flex-shrink-0'
                              )}
                              aria-hidden="true"
                            />

                            <div className="relative ml-3 flex-1">
                              <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                              {count.count > 0 ? (
                                <div
                                  className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                                  style={{ width: `calc(${count.count} / ${product?.totalCount} * 100%)` }}
                                />
                              ) : null}
                            </div>
                          </div>
                        </dt>
                        <dd className="ml-3 w-10 text-right text-sm tabular-nums text-gray-900">
                          {Math.round((count.count / product?.totalCount) * 100)}%
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="mt-10">
                  <h3 className="text-lg font-medium text-gray-900">{t('share_your_though')}</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {t('review_message')}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleAddReview()}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:w-auto lg:w-full"
                  >
                    {t('write_a_review')}
                  </button>
                </div>
              </div>

              <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
                <h3 className="sr-only">Recent reviews</h3>

                <div className="flow-root">
                  <div className="-my-12 divide-y divide-gray-200">
                    {product?.reviews?.length > 0 && product?.reviews.map((review) => (
                      <div key={review.id} className="py-12">
                        <div className="flex items-center">
                          <img src={review?.user?.photo} alt={`${review?.author}.`} className="h-12 w-12 rounded-full" />
                          <div className="ml-4">
                            <h4 className="text-sm font-bold text-gray-900">
                              {review?.user?.fullName}

                            </h4>
                            <div className="mt-1 flex items-center">
                              {[0, 1, 2, 3, 4].map((rating) => (
                                <StarIcon
                                  key={rating}
                                  className={classNames(
                                    review.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                                    'h-5 w-5 flex-shrink-0'
                                  )}
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                            <p className="sr-only">{review.rating} out of 5 stars</p>
                          </div>
                        </div>

                        <div
                          className="mt-4 space-y-6 text-base italic text-gray-600"
                          dangerouslySetInnerHTML={{ __html: review.message }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {
            showAddReviewModal && <AddReviewModal showAddReviewModal={showAddReviewModal} setShowAddReviewModal={setShowAddReviewModal} productId={product._id} />
          }
        </main >
      </div >}
    </>
  );
}
