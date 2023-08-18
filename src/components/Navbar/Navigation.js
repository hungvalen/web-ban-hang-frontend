import logo from "./logoshop.png";
import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import { Bars3Icon, BellIcon, ShoppingCartIcon, XMarkIcon, UserIcon, ArrowRightOnRectangleIcon, TruckIcon, WindowIcon } from '@heroicons/react/24/outline'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesAction } from "../../redux/slices/categories/categoriesSlice";
import Skeleton from "react-loading-skeleton";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";
import { getUserProfileAction } from "../../redux/slices/users/usersSlice";
import CouponBanner from "./CouponBanner";
import {
    ArchiveBoxIcon,
    ArrowRightCircleIcon,
    ChevronDownIcon,
    DocumentDuplicateIcon,
    HeartIcon,
    PencilSquareIcon,
    TrashIcon,
    UserPlusIcon,
} from '@heroicons/react/20/solid'
import { useTranslation } from "react-i18next";

const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
    { name: 'Home', href: '#', current: true },
    { name: 'Team', href: '#', current: false },
    { name: 'Projects', href: '#', current: false },
    { name: 'Calendar', href: '#', current: false },
]
const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Navigation() {
    const { i18n } = useTranslation();
    const { t } = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };
    const [selectedOption, setSelectedOption] = useState('');
    const [inputName,setInputName] = useState("")
    const navigate = useNavigate();
    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };
    let { cartItems } = useSelector(state => state.carts);
    const { categories: { categories }, loading } = useSelector(state => state.category)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCategoriesAction())
    }, [dispatch])

    // get login user from localstorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const isLoggedIn = userInfo?.token ? true : false;
    const isAdmin = userInfo?.userFound?.isAdmin ? true : false;
    console.log(userInfo);
    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        window.location.href = "/";
    }
    console.log("check category", categories);
    const handleSearchProduct = (inputName) => {
        if(inputName){
            navigate(`/products-filters?product-name=${inputName}`)
        }
        else{
            navigate(`/products-filters?category=${selectedOption}`)
        }
    }
    return (
        <Disclosure as="header" className="bg-gray-800">
            {({ open }) => (
                <>
                    <CouponBanner />
                    <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-700 lg:px-8">
                        <div className="relative flex h-16 justify-between">
                            <div className="relative z-1 flex px-2 lg:px-0">
                                <Link to="/" className="flex flex-shrink-0 items-center">
                                    <img
                                        className="block h-32 pt-2  w-auto"
                                        src={logo}
                                        alt="Your Company"
                                    />
                                </Link>
                            </div>

                            <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
                                <div className="flex items-center px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
                                    <div className="w-full mx-32">
                                        {/* <label htmlFor="search" className="sr-only">
                                            Search
                                        </label> */}

                                        <div className="flex">

                                            <div className="relative w-full">
                                                <div className="absolute inset-y-0 left-0 flex items-center rounded border ">
                                                    <label htmlFor="country" className="sr-only">
                                                        Categories
                                                    </label>
                                                    <select
                                                        value={selectedOption} onChange={handleChange}
                                                        id="country"
                                                        name="country"
                                                        autoComplete="country"
                                                        className="h-full w-32 rounded-md border-0 bg-transparent py-0 pl-3  text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                                    >
                                                        <option value="all">All </option>
                                                        {
                                                            loading ? <>...</> : categories && categories.length > 0 && categories?.map((item, index) => {
                                                                return <option key={index} value={item.name}>{item?.name}</option>
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <label htmlFor="search" className="sr-only">
                                                    Search
                                                </label>
                                                <div className="pointer-events-none absolute inset-y-0 left-32 flex items-center pl-3">
                                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                </div>
                                                <input
                                                    id="search"
                                                    name="search"
                                                    className="block w-full rounded-lg bg-white py-1.5 pl-40 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                                    placeholder={t('search')}
                                                    type="search"
                                                    value={inputName}
                                                    onChange={(e) => setInputName(e.target.value)}
                                                />
                                                <button
                                                    onClick={() => handleSearchProduct(inputName)}
                                                    type="submit"
                                                    className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                                    </svg>
                                                    <span className="sr-only">Search</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative z-10 flex items-center lg:hidden">
                                {/* Mobile menu button */}
                                {/* <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button> */}
                            </div>
                            <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
                                {
                                    isLoggedIn ? <>
                                        {/* <button
                                            type="button"
                                            className="flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            <span className="sr-only">View notifications</span>
                                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                                        </button> */}
                                        <div className="mx-auto">
                                            <img width="32" height="32" src="https://img.icons8.com/color/48/great-britain-circular.png" alt="great-britain-circular" className="cursor-pointer inline-block" onClick={() => changeLanguage('en')} />
                                            <img width="32" height="32" src="https://img.icons8.com/color/48/vietnam-circular.png" alt="vietnam-circular" className="cursor-pointer inline-block mr-3" onClick={() => changeLanguage('vi')} />
                                        </div>
                                        {/* Profile dropdown */}
                                        <Menu as="div" className="relative mx-4 flex-shrink-0">
                                            <div>
                                                <Menu.Button className="flex rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                    <span className="sr-only">Open user menu</span>
                                                    <img className="h-8 w-8 rounded-full" src={userInfo?.userFound?.photo} alt="" />
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {/* {userNavigation.map((item) => (
                                              
                                            ))} */}
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <Link
                                                                to="/customer-profile"
                                                                className={classNames(
                                                                    active ? 'bg-gray-100' : '',
                                                                    'px-4 py-2 text-sm text-gray-700  group flex w-full items-center rounded-md'
                                                                )}
                                                            >
                                                                {active ? (
                                                                    <UserIcon
                                                                        className="mr-2 h-5 w-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                ) : (
                                                                    <UserIcon
                                                                        className="mr-2 h-5 w-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                                {t('profile')}
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                    {isAdmin && (
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <Link
                                                                    to="/admin"
                                                                    className={classNames(
                                                                        active ? 'bg-gray-100' : '',
                                                                        'px-4 py-2 text-sm text-gray-700  group flex w-full items-center rounded-md'
                                                                    )}
                                                                >
                                                                    {active ? (
                                                                        <WindowIcon
                                                                            className="mr-2 h-5 w-5"
                                                                            aria-hidden="true"
                                                                        />
                                                                    ) : (
                                                                        <WindowIcon
                                                                            className="mr-2 h-5 w-5"
                                                                            aria-hidden="true"
                                                                        />
                                                                    )}
                                                                    {t('dashboard_profile')}
                                                                </Link>
                                                            )}
                                                        </Menu.Item>
                                                    )}

                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <Link
                                                                to="/my-order"
                                                                className={classNames(
                                                                    active ? 'bg-gray-100' : '',
                                                                    'px-4 py-2 text-sm text-gray-700  group flex w-full items-center rounded-md'
                                                                )}
                                                            >
                                                                {active ? (
                                                                    <TruckIcon
                                                                        className="mr-2 h-5 w-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                ) : (
                                                                    <TruckIcon
                                                                        className="mr-2 h-5 w-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                                {t('my_order')}
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={handleLogout}
                                                                className={classNames(
                                                                    active ? 'bg-gray-100' : '',
                                                                    'px-4 py-2 text-sm text-gray-700  group flex w-full items-center rounded-md'
                                                                )}
                                                            >
                                                                {active ? (
                                                                    <ArrowRightOnRectangleIcon
                                                                        className="mr-2 h-5 w-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                ) : (
                                                                    <ArrowRightOnRectangleIcon
                                                                        className="mr-2 h-5 w-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                                {t('sign_out')}
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>

                                        <div className="flow-root">
                                            <Link
                                                to="/shopping-cart"
                                                className="group -m-2 flex items-center p-2">
                                                <ShoppingCartIcon
                                                    className="h-6 w-6 flex-shrink-0 text-gray-200 group-hover:text-gray-300"
                                                    aria-hidden="true"
                                                />
                                                <span className="ml-2 text-sm font-medium text-gray-200 group-hover:text-gray-300">
                                                    {cartItems?.length > 0
                                                        ? cartItems.length
                                                        : 0}
                                                </span>
                                            </Link>
                                        </div>
                                    </> : <>
                                        <div className="mx-auto">
                                            <img width="32" height="32" src="https://img.icons8.com/color/48/great-britain-circular.png" alt="great-britain-circular" className="cursor-pointer inline-block" onClick={() => changeLanguage('en')} />
                                            <img width="32" height="32" src="https://img.icons8.com/color/48/vietnam-circular.png" alt="vietnam-circular" className="cursor-pointer inline-block mr-3" onClick={() => changeLanguage('vi')} />
                                        </div>
                                        <Link
                                            to="/register"
                                            type="button"
                                            className="mr-4 rounded-md bg-rose-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                                        >
                                            {t('create_an_account')}
                                        </Link>
                                        <Link
                                            to="/login"
                                            type="button"
                                            className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                        >
                                            {t('sign_in')}
                                        </Link>
                                    </>
                                }

                            </div>
                        </div>
                        {/* <nav className="hidden lg:flex lg:space-x-8 lg:py-2" aria-label="Global">
                            {
                                loading ? <Skeleton className="mt-2" width={500} height={30} /> :
                                    categories?.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={`products-filters?category=${item?.name}`}
                                            className={classNames(
                                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'inline-flex items-center rounded-md py-2 px-3 text-sm font-medium'
                                            )}
                                            aria-current={item.current ? 'page' : undefined}
                                        >
                                            {capitalizeFirstLetter(item?.name)}
                                        </Link>
                                    ))}
                        </nav> */}
                    </div>

                    <Disclosure.Panel as="nav" className="lg:hidden" aria-label="Global">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block rounded-md py-2 px-3 text-base font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                        <div className="border-t border-gray-700 pb-3 pt-4">
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    {
                                        <img className="h-10 w-10 rounded-full" src={userInfo?.userFound?.photo} alt="" />

                                    }
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-white">{user?.name}</div>
                                    <div className="text-sm font-medium text-gray-400">{user?.email}</div>
                                </div>
                                <button
                                    type="button"
                                    className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                >
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="mt-3 space-y-1 px-2">
                                {userNavigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                            <div className="flow-root">
                                <Link
                                    to="/shopping-cart"
                                    className="group -m-2 flex items-center p-2">
                                    <ShoppingCartIcon
                                        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                                        {cartItems?.length > 0
                                            ? cartItems.length
                                            : 0}
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}
