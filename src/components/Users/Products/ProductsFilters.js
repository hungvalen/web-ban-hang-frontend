import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  Disclosure,
  Menu,
  Transition,
  RadioGroup,
  Listbox,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import Products from "./Products";
import { useSearchParams } from "react-router-dom";
import baseURL from "../../../utils/baseURL";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import NoDataFound from "../../NoDataFound/NoDataFound";
import { fetchAllProductAction } from "../../../redux/slices/products/productSlices";
import { fetchBrandAction } from "../../../redux/slices/brand/brandSlice";
import { fetchColorAction } from "../../../redux/slices/color/colorSlice";
import { limitNumber } from "../../../utils/limitNumber";
import Pagination from "../../pagination/Pagination";
import { useTranslation } from "react-i18next";
import { fetchCategoriesAction } from "../../../redux/slices/categories/categoriesSlice";
// const sortOptions = [
//   { name: "Most Popular", value: '', href: "#", current: true },
//   { name: "Best Rating", value: 'highest-rated', href: "#", current: false },
//   { name: "Newest", value: 'newest', href: "#", current: false },
//   { name: "Price: Low to High", value: 'low-to-high-price', href: "#", current: false },
//   { name: "Price: High to Low", value: 'high-to-low-price', href: "#", current: false },
// ];

const allPrice = [
  {
    amount: "0 - 500000",
  },
  {
    amount: "500000 - 1000000",
  },
  {
    amount: "1000000 - 1500000",
  },
  {
    amount: "1500000 - 2000000",
  },
  
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const sizeCategories = ["S", "M", "L", "XL", "XXL"];
const ProductsFilters = () => {
  const { t } = useTranslation();

  const sortOptions = [
    { id: 1, name: t('highest-rated'), value: 'highest-rated' },
    { id: 2, name: t('newest'), value: 'newest' },
    { id: 3, name: t('low-to-high-price'), value: 'low-to-high-price' },
    { id: 4, name: t('high-to-low-price'), value: 'high-to-low-price' },
  ]
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const category = params.get("category");
  const brandParams = params.get("brand")
  const productNameParams = params.get("product-name")

  // filter 
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;
  const [sortValue, setSortValue] = useState(sortOptions[0]);
  const [priceFrom, setPriceFrom] = useState(0)
  const [priceTo, setPriceTo] = useState(0)
  // const handleSortOption = (value) => {
  //   setSortValue(value)
  // }
  console.log(sortValue)
  useEffect(() => {
    let productUrl = `${baseURL}/products`;
    const query = {};
    let name = ''
    if (category && category !== "all") {
      query.category = category;
    }

    if(brandParams){
      query.brand = brandParams
    }
    if (brand) {
      query.brand = brand;
    }
    if (size) {
      query.size = size;
    }
    if (price) {
      query.price = price;
    }
    if (color) {
      query.color = color.name;
    }
    if (sortValue) {
      query.sort = sortValue?.value
    }
    if (categoryValue) {
      query.category = categoryValue
    }
    if(productNameParams){
      name = productNameParams
    }
    const queryParams = new URLSearchParams(query).toString();
    if (queryParams) {
      productUrl = `${productUrl}?${queryParams}`;
    }

    dispatch(fetchAllProductAction({ url: productUrl, page, limit, name: name }));
  }, [dispatch, brand, size, category, price, color, params, page, limit, sortValue, categoryValue, brandParams, productNameParams]);

  // useEffect(() => {
  //   let categoryUrl = `${baseURL}/products?category=${category}`;
  //   if (category) {

  //     dispatch(fetchAllProductAction({ url: categoryUrl, page: 1, limit: 5 }))

  //     //     productUrl = `${baseURL}/products?category=${category}`;
  //   }
  // }, [dispatch, brand, size, category, price, color, params])
  const { products, loading, error } = useSelector((state) => state.product);
  console.log(products);
  let count = products?.count;
  let totalPage = Math.ceil(count / limitNumber);
  // fetch brands
  useEffect(() => {
    dispatch(fetchBrandAction(
      {
        page: 1,
        limit: 100,
        query: ''
      }
    ));
  }, [dispatch])

  // fetch colors
  useEffect(() => {
    dispatch(fetchColorAction());
  }, [dispatch])
  useEffect(() => {
    dispatch(fetchCategoriesAction());
  }, [dispatch])


  let colorsLoading;
  let colorsError;
  let { colors } = useSelector((state) => state.color.colors);
  let { brands: { brands } } = useSelector((state) => state.brand);
  let { categories: { categories } } = useSelector(state => state.category)
  console.log(categories)

  const handleFilterPrice = () => {
    if (priceFrom > priceTo) {
      setPrice(`${priceTo} - ${priceFrom}`)
    }
    else {
      setPrice(`${priceFrom} - ${priceTo}`)
    }
  }
  return (
    <div className="bg-white">
      <div>
        {/* Mobile menu */}
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileMenuOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full">
                <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                  <div className="flex px-4 pt-5 pb-2">
                    <button
                      type="button"
                      className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                      onClick={() => setMobileMenuOpen(false)}>
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </div>

      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full">
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}>
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Mobile Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    {/*  */}
                    <Disclosure
                      as="div"
                      key="disclosure_color"
                      className="border-t border-gray-200 px-4 py-6">
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Choose Color
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>

                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {/* Any Color */}
                              {colorsLoading ? (
                                <h2>Loading...</h2>
                              ) : colorsError ? (
                                <h2>{colorsError}</h2>
                              ) : (
                                // <RadioGroup onChange={setColor}>
                                //   <div className="flex items-start  flex-row flex-wrap">
                                //     {colors?.map((item) => (
                                //       <RadioGroup.Option
                                //         key={item?._id}
                                //         value={item}
                                //         className={({ active, checked }) =>
                                //           classNames(
                                //             active && checked
                                //               ? "ring ring-offset-1"
                                //               : "",
                                //             !active && checked ? "ring-2" : "",
                                //             " relative  rounded-full flex  flex-col items-center justify-center cursor-pointer focus:outline-none m-2"
                                //           )
                                //         }>
                                //         <span
                                //           style={{
                                //             backgroundColor: item?.name,
                                //           }}
                                //           aria-hidden="true"
                                //           className="h-8 w-8 border border-black border-opacity-10 rounded-full"
                                //         />
                                //       </RadioGroup.Option>
                                //     ))}
                                //   </div>
                                // </RadioGroup>
                                <fieldset>
                                  <legend className="sr-only">Notifications</legend>
                                  <div className="space-y-5">
                                    <div className="relative flex items-start">
                                      <div className="flex h-6 items-center">
                                        <input
                                          id="comments"
                                          aria-describedby="comments-description"
                                          name="comments"
                                          type="checkbox"
                                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                      </div>
                                      <div className="ml-3 text-sm leading-6">
                                        <label htmlFor="comments" className="font-medium text-gray-900">
                                          New comments
                                        </label>{' '}
                                        <span id="comments-description" className="text-gray-500">
                                          <span className="sr-only">New comments </span>so you always know what's happening.
                                        </span>
                                      </div>
                                    </div>
                                    <div className="relative flex items-start">
                                      <div className="flex h-6 items-center">
                                        <input
                                          id="candidates"
                                          aria-describedby="candidates-description"
                                          name="candidates"
                                          type="checkbox"
                                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                      </div>
                                      <div className="ml-3 text-sm leading-6">
                                        <label htmlFor="candidates" className="font-medium text-gray-900">
                                          New candidates
                                        </label>{' '}
                                        <span id="candidates-description" className="text-gray-500">
                                          <span className="sr-only">New candidates </span>who apply for any open postings.
                                        </span>
                                      </div>
                                    </div>
                                    <div className="relative flex items-start">
                                      <div className="flex h-6 items-center">
                                        <input
                                          id="offers"
                                          aria-describedby="offers-description"
                                          name="offers"
                                          type="checkbox"
                                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                      </div>
                                      <div className="ml-3 text-sm leading-6">
                                        <label htmlFor="offers" className="font-medium text-gray-900">
                                          Offers
                                        </label>{' '}
                                        <span id="offers-description" className="text-gray-500">
                                          <span className="sr-only">Offers </span>when they are accepted or rejected by candidates.
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </fieldset>
                              )}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>

                    {/* price categories section */}
                    <Disclosure
                      as="div"
                      key="disclosure_price"
                      className="border-t border-gray-200 px-4 py-6">
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Price
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6 mt-2">
                              {allPrice?.map((price) => (
                                <div
                                  key={Math.random()}
                                  className="flex items-center">
                                  <input
                                    onClick={() => setPrice(price?.amount)}
                                    name="price"
                                    type="radio"
                                    className="h-4 w-4 rounded border-gray-300 cursor-pointer text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                    {price?.amount}đ
                                  </label>
                                </div>
                              ))}

                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    {/*  end price categories section  */}

                    {/* product brand categories section categories section */}
                    <Disclosure
                      as="div"
                      key="disclosure_brand"
                      className="border-t border-gray-200 px-4 py-6">
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Brand
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-2">
                              {brands != null && brands.length > 0 && brands?.map((brand) => (
                                <div
                                  key={brand?._id}
                                  className="flex items-center">
                                  <input
                                    onClick={() => setBrand(brand?.name)}
                                    name="brand"
                                    type="radio"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                    {brand?.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    {/*  end product brand categories section */}

                    {/* product size categories   */}
                    {/* <Disclosure
                      as="div"
                      key="disclosure_size"
                      className="border-t border-gray-200 px-4 py-6">
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Size
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {sizeCategories.map((size) => (
                                <div key={size} className="flex items-center">
                                  <input
                                    type="radio"
                                    name="size"
                                    onClick={() => setSize(size)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                    {size}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure> */}
                    <fieldset>
                      <legend className="sr-only">Notifications</legend>
                      <div className="space-y-5">
                        <div className="relative flex items-start">
                          <div className="flex h-6 items-center">
                            <input
                              id="comments"
                              aria-describedby="comments-description"
                              name="comments"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                          </div>
                          <div className="ml-3 text-sm leading-6">
                            <label htmlFor="comments" className="font-medium text-gray-900">
                              New comments
                            </label>{' '}
                            <span id="comments-description" className="text-gray-500">
                              <span className="sr-only">New comments </span>so you always know what's happening.
                            </span>
                          </div>
                        </div>
                        <div className="relative flex items-start">
                          <div className="flex h-6 items-center">
                            <input
                              id="candidates"
                              aria-describedby="candidates-description"
                              name="candidates"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                          </div>
                          <div className="ml-3 text-sm leading-6">
                            <label htmlFor="candidates" className="font-medium text-gray-900">
                              New candidates
                            </label>{' '}
                            <span id="candidates-description" className="text-gray-500">
                              <span className="sr-only">New candidates </span>who apply for any open postings.
                            </span>
                          </div>
                        </div>
                        <div className="relative flex items-start">
                          <div className="flex h-6 items-center">
                            <input
                              id="offers"
                              aria-describedby="offers-description"
                              name="offers"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                          </div>
                          <div className="ml-3 text-sm leading-6">
                            <label htmlFor="offers" className="font-medium text-gray-900">
                              Offers
                            </label>{' '}
                            <span id="offers-description" className="text-gray-500">
                              <span className="sr-only">Offers </span>when they are accepted or rejected by candidates.
                            </span>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    {/*  end product size categories section */}
                  </form>
                  {/* end of mobile filters */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {t('product_filter')}
            </h1>
            {/* sort */}
            <div className="flex items-center">
              <Listbox value={sortValue} onChange={setSortValue}>
                {({ open }) => (
                  <>
                    <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900 mr-2">{t('sort')}</Listbox.Label>
                    <div className="relative mt-2">
                      <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        <span className="block truncate">{sortValue?.name}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {sortOptions.map((item) => (
                            <Listbox.Option
                              key={item?.id}
                              className={({ active }) =>
                                classNames(
                                  active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                  'relative cursor-default select-none py-2 pl-3 pr-9'
                                )
                              }
                              value={item}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                    {item?.name}
                                  </span>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active ? 'text-white' : 'text-indigo-600',
                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                      )}
                                    >
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>

              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}>
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Desktop  Filters */}
              <form className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>
                {/* categories Desktop section */}
                <Disclosure
                  as="div"
                  key="disclosure_categories_desktop"
                  className="border-t border-gray-200 px-4 py-6">
                  {({ open }) => (
                    <>
                      <h3 className="-mx-2 -my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            {t('categories')}
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        {/* <div className="space-y-6">
                          {sizeCategories.map((option, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="radio"
                                name="size"
                                onClick={() => setSize(option)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div> */}
                        <fieldset>
                          <legend className="sr-only">Notifications</legend>
                          <div className="space-y-5">
                            {
                              categories?.map((item) => (
                                <div className="relative flex items-start">
                                  <div className="flex h-6 items-center">
                                    <input
                                      id="comments"
                                      aria-describedby="comments-description"
                                      name="comments"
                                      type="radio"
                                      value={item?.name}
                                      onChange={(e) => setCategoryValue(e.target.value)}
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                  </div>
                                  <div className="ml-3 text-sm leading-6">
                                    <label htmlFor="comments" className="font-medium text-gray-900">
                                      {item?.name}
                                    </label>{' '}
                                  </div>
                                </div>
                              ))
                            }


                          </div>
                        </fieldset>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {/* end categories section */}
                {/* colors categories Desktop section */}
                <Disclosure
                  as="div"
                  key="disclosure_categories"
                  className="border-t border-gray-200 px-4 py-6">
                  {({ open }) => (
                    <>
                      <h3 className="-mx-2 -my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            {t('color_categories')}
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>

                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-6">
                          {/* Any Color */}
                          {colorsLoading ? (
                            <h2>Loading...</h2>
                          ) : colorsError ? (
                            <h2>{colorsError}</h2>
                          ) : (
                            <RadioGroup onChange={setColor}>
                              <div className="flex items-start  flex-row flex-wrap">
                                {colors?.map((color, index) => (
                                  <RadioGroup.Option
                                    key={color?.id}
                                    value={color}
                                    className={({ active, checked }) =>
                                      classNames(
                                        active && checked
                                          ? "ring ring-offset-1"
                                          : "",
                                        !active && checked ? "ring-2" : "",
                                        " relative  rounded-full flex  flex-col items-center justify-center cursor-pointer focus:outline-none m-2"
                                      )
                                    }>
                                    <span
                                      style={{ backgroundColor: color?.name }}
                                      aria-hidden="true"
                                      className="h-8 w-8 border border-black border-opacity-10 rounded-full"
                                    />
                                  </RadioGroup.Option>
                                ))}
                              </div>
                            </RadioGroup>
                          )}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {/* colors end categories section */}

                {/* price categories section Desktop*/}
                <Disclosure
                  as="div"
                  key="disclosure_price_desktop"
                  className="border-t border-gray-200 px-4 py-6">
                  {({ open }) => (
                    <>
                      <h3 className="-mx-2 -my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            {t('price')}
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-6 mt-2">
                          {allPrice?.map((price, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                onClick={() => setPrice(price?.amount)}
                                name="price"
                                type="radio"
                                className="h-4 w-4 rounded border-gray-300 cursor-pointer text-indigo-600 focus:ring-indigo-500"
                              />
                              <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                 {price?.amount}đ
                              </label>
                            </div>
                          ))}
                          <div className="flex items-center justify-between ">
                            <input value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} pattern="[0-9]*" type="number" className="w-28 h-8 px-2 rounded border text-left text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="0" />
                            -
                            <input value={priceTo} onChange={(e) => setPriceTo(e.target.value)} pattern="[0-9]*" type="number" className="w-28 h-8 px-2 rounded border text-left text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="0" />
                          </div>
                          <button
                            type="button"
                            className=" mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => handleFilterPrice()}
                          >
                            {t('apply_coupon')}
                          </button>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {/*  end price categories section  Desktop*/}

                {/* product brand categories section categories section */}
                <Disclosure
                  as="div"
                  key="disclosure_brand_desktop"
                  className="border-t border-gray-200 px-4 py-6">
                  {({ open }) => (
                    <>
                      <h3 className="-mx-2 -my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            {t('brand')}
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-2">
                          {brands != null && brands?.length > 0 && brands?.map((brand, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                onClick={() => setBrand(brand?.name)}
                                name="brand"
                                type="radio"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                {brand?.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {/*  end product brand categories section */}

                {/* product size categories  desktop */}
                <Disclosure
                  as="div"
                  key="disclosure_size_desktop"
                  className="border-t border-gray-200 px-4 py-6">
                  {({ open }) => (
                    <>
                      <h3 className="-mx-2 -my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            {t('size')}
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        {/* <div className="space-y-6">
                          {sizeCategories.map((option, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="radio"
                                name="size"
                                onClick={() => setSize(option)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div> */}
                        <fieldset>
                          <legend className="sr-only">Notifications</legend>
                          <div className="space-y-5">
                            {
                              sizeCategories?.map((size) => (
                                <div className="relative flex items-start">
                                  <div className="flex h-6 items-center">
                                    <input
                                      id="comments"
                                      aria-describedby="comments-description"
                                      name="comments"
                                      type="checkbox"
                                      value={size}
                                      onChange={(e) => setSize(e.target.value)}
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                  </div>
                                  <div className="ml-3 text-sm leading-6">
                                    <label htmlFor="comments" className="font-medium text-gray-900">
                                      {size}
                                    </label>{' '}
                                  </div>
                                </div>
                              ))
                            }


                          </div>
                        </fieldset>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {/*  end product size categories section */}
              </form>

              {/* Product grid */}
              {loading ? (
                <LoadingComponent />
              ) : error ? (
                <ErrorMsg message={error?.message} />
              ) : products?.length <= 0 ? <NoDataFound /> : (
                <div className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3">
                  <Products products={products?.products} page={page} pages={totalPage} changePage={setPage} count={count} />
                  <div className="divide mt-4"></div>
                  <Pagination page={page} pages={totalPage} changePage={setPage} count={count} />
                </div>

              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default ProductsFilters