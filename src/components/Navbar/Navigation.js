import logo from "./logoshop.png";
import { Fragment, useEffect } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import { Bars3Icon, BellIcon, ShoppingCartIcon, XMarkIcon, UserIcon, ArrowRightOnRectangleIcon, TruckIcon, WindowIcon } from '@heroicons/react/24/outline'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesAction } from "../../redux/slices/categories/categoriesSlice";

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
    let { cartItems } = useSelector(state => state.carts);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCategoriesAction())
    }, [dispatch])

    // get login user from localstorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const isLoggedIn = userInfo?.token ? true : false;
    const isAdmin = userInfo?.userFound?.isAdmin ? true : false;

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        window.location.href = "/";
    }
    return (
        <Disclosure as="header" className="bg-gray-800">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-700 lg:px-8">
                        <div className="relative flex h-16 justify-between">
                            <div className="relative z-10 flex px-2 lg:px-0">
                                <Link to="/" className="flex flex-shrink-0 items-center">
                                    <img
                                        className="block h-32 pt-2  w-auto"
                                        src={logo}
                                        alt="Your Company"
                                    />
                                </Link>
                            </div>
                            <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
                                <div className="w-full sm:max-w-xs">
                                    <label htmlFor="search" className="sr-only">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="search"
                                            name="search"
                                            className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 focus:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                                            placeholder="Search"
                                            type="search"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="relative z-10 flex items-center lg:hidden">
                                {/* Mobile menu button */}
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
                                {
                                    isLoggedIn ? <>
                                        <button
                                            type="button"
                                            className="flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            <span className="sr-only">View notifications</span>
                                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>

                                        {/* Profile dropdown */}
                                        <Menu as="div" className="relative mx-4 flex-shrink-0">
                                            <div>
                                                <Menu.Button className="flex rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                    <span className="sr-only">Open user menu</span>
                                                    <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
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
                                                                Profile
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
                                                                    Dashboard
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
                                                                My order
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
                                                                Sign out
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
                                        <Link
                                            to="/register"
                                            type="button"
                                            className="mr-4 rounded-md bg-rose-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                                        >
                                            Create an account
                                        </Link>
                                        <Link
                                            to="/login"
                                            type="button"
                                            className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                        >
                                            Sign in
                                        </Link>
                                    </>
                                }

                            </div>
                        </div>
                        <nav className="hidden lg:flex lg:space-x-8 lg:py-2" aria-label="Global">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'inline-flex items-center rounded-md py-2 px-3 text-sm font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </nav>
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
                                    <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-white">{user.name}</div>
                                    <div className="text-sm font-medium text-gray-400">{user.email}</div>
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
