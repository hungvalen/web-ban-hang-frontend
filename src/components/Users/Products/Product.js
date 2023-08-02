import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import {
  CurrencyDollarIcon,
  GlobeAmericasIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import { Link, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProductAction } from "../../../redux/slices/products/productSlices";
import { addOrderToCartAction, cartItemsFromLocalStorageAction } from "../../../redux/slices/cart/cartSlices";
import SweetAlert from "../../Playground/SweetAlert";
import Skeleton from "react-loading-skeleton";
import { formatPrice } from "../../../utils/formatCurrency";
import { Dialog, Disclosure, Menu, Popover, Tab, Transition } from '@headlessui/react'
import AddReview from "../Reviews/AddReview";
import AddReviewModal from "../Reviews/AddReview";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import convertHtmlToPlainText from "../../../utils/convertHTMLToPlainText"
import { useTranslation } from "react-i18next";
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

const policies = [
  {
    name: "International delivery",
    icon: GlobeAmericasIcon,
    description: "Get your order in 2 years",
  },
  {
    name: "Loyalty rewards",
    icon: CurrencyDollarIcon,
    description: "Don't look at other tees",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSingleProductAction(id
    ))

  }, [id])

  useEffect(() => {
    dispatch(cartItemsFromLocalStorageAction())
  }, [])

  const handleAddReview = () => {
    setShowAddReviewModal(!showAddReviewModal)
  }

  //Add to cart handler
  const addToCartHandler = () => {
    // check if product is in cart
    if (productExists) {
      return SweetAlert({ icon: "error", title: "Error", message: 'Product already in cart' });
    }
    // check if color/size selected
    if (selectedColor === "") {
      return SweetAlert({ icon: "error", title: "Oops...", message: 'Please select product color' });

    }
    if (selectedSize === "") {
      return SweetAlert({ icon: "error", title: "Oops...", message: 'Please select product size' });

    }
    dispatch(addOrderToCartAction({
      _id: product?._id,
      name: product?.name,
      qty: 1,
      price: product?.price,
      description: product?.description,
      color: selectedColor,
      size: selectedSize,
      image: product?.images?.length > 0 ? product?.images[0] : '',
      totalPrice: product?.price,
      qtyLeft: product?.qtyLeft
    }))
    SweetAlert({ icon: "success", title: "Success", message: 'Product added to cart successfully' });
    return dispatch(cartItemsFromLocalStorageAction())

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
  function isHtmlText(text) {
    const htmlRegex = /<[a-z][\s\S]*>/i;
    return htmlRegex.test(text);
  }
  return (
    <>
      {loading ? <LoadingComponent /> : <div className="bg-white">
        <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="flex justify-between">
                <h1 className="text-xl font-medium text-gray-900">
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
                {/* In stock */}
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
                      Add to cart
                    </button>
                  )
                }

                {/* proceed to check */}

                {cartItems?.length > 0 && (
                  <Link
                    to="/shopping-cart"
                    className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-green-800 py-3 px-8 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Proceed to checkout
                  </Link>
                )}
              </>

              {/* Product details */}
              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">{t('product_desc')}</h2>
                <div className="prose prose-sm mt-4 text-gray-500">
                  {
                    isHtmlText(product?.description) === true ? convertHtmlToPlainText(product?.description) : product?.description
                  }
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
                          {policy.name}
                        </span>
                      </dt>
                      <dd className="mt-1 text-sm text-gray-500">
                        {policy.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </div >

          {/* Reviews */}
          <section aria-labelledby="reviews-heading" className="mt-16 sm:mt-24">
            <h2
              id="reviews-heading"
              className="text-lg font-medium text-gray-900">
              {t('recent_reviews')}
            </h2>

            <div className="mt-6 space-y-10 divide-y divide-gray-200 border-t border-b border-gray-200 pb-10">
              {product?.reviews?.length > 0 ? product?.reviews.map((review) => (
                <div
                  key={review._id}
                  className="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8">
                  <div className="lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8">
                    <div className="flex items-center xl:col-span-1">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            className={classNames(
                              review.rating > rating
                                ? "text-yellow-400"
                                : "text-gray-200",
                              "h-5 w-5 flex-shrink-0"
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="ml-3 text-sm text-gray-700">
                        {review?.rating}
                        <span className="sr-only"> out of 5 stars</span>
                      </p>
                    </div>

                    <div className="mt-4 lg:mt-6 xl:col-span-2 xl:mt-0">
                      <h3 className="text-sm font-medium text-gray-900">
                        {review?.message}
                      </h3>

                      <div
                        className="mt-3 space-y-6 text-sm text-gray-500"
                        dangerouslySetInnerHTML={{ __html: review.content }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center text-sm lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start xl:col-span-3">
                    <p className="font-medium text-gray-900">{review?.user?.fullName}</p>
                    <time
                      dateTime={review.createdAt}
                      className="ml-4 border-l border-gray-200 pl-4 text-gray-500 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                </div>

              )) : <p className="font-medium text-gray-900 ">{t('no_review_found')}</p>}
            </div>
            {
              showAddReviewModal && <AddReviewModal showAddReviewModal={showAddReviewModal} setShowAddReviewModal={setShowAddReviewModal} productId={product._id} />
            }
          </section >
        </main >
      </div >}
    </>
  );
}
