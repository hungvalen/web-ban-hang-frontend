import { Fragment, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Link, Outlet } from "react-router-dom";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { RiCoupon2Line } from "react-icons/ri"
import { BiCategory } from "react-icons/bi"
import { IoColorFilterOutline } from "react-icons/io5"
import { TbBrandItch } from "react-icons/tb"
import { HiOutlineCurrencyDollar } from "react-icons/hi"
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai"
import {
  Bars3CenterLeftIcon,
  BellIcon,
  ClockIcon,
  CogIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  HomeIcon,
  MapPinIcon,
  QuestionMarkCircleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import logo from "../Navbar/logo3.png";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileAction } from "../../redux/slices/users/usersSlice";
import { TbTruckDelivery } from 'react-icons/tb'

const dashboardLinks = [
  {
    name: "Dashboard",
    href: "",
    icon: AiOutlineHome,
    current: true,
  },


];

const productsLinks = [
  {
    name: "Manage Stock",
    href: "manage-products",
    icon: ScaleIcon,
    current: false,
  },
];
const ordersLinks = [
  {
    name: "Manage Orders",
    href: "manage-orders",
    icon: HiOutlineCurrencyDollar

  },
];
const usersLinks = [
  {
    name: "Manage Users",
    href: "customers",
    icon: AiOutlineUser
  },
];

const couponsLinks = [
  {
    name: "Manage Coupon",
    href: "manage-coupon",
    icon: RiCoupon2Line
  },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CategoryLinks = [
  {
    name: "Manage Category",
    href: "manage-category",
    icon: BiCategory,
  },
];

const colorsLinks = [
  {
    name: "Manage Colors",
    href: "all-colors",
    icon: IoColorFilterOutline,
  },
];
const shippingUnitLinks = [
  {

    name: "Manage shipping unit",
    href: "shipping-unit",
    icon: TbTruckDelivery
  },
];
const paymentMethodLinks = [
  {

    name: "Manage payment method",
    href: "payment-method",
    icon: CreditCardIcon
  },
];

const brandsLinks = [
  {
    name: "Manage Brands",
    href: "all-brands",
    icon: TbBrandItch,
  },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let { profile, loading } = useSelector((state) => state.users);
  console.log(profile, loading)
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(getUserProfileAction());
  }, [dispatch])
  return (
    <>
      <div className="h-screen">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10 lg:hidden"
            onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
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
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-cyan-700 pt-5 pb-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4"></div>
                  <nav
                    className="mt-5 flex flex-1 flex-col divide-y divide-cyan-800 overflow-y-auto"
                    aria-label="Sidebar">
                    {/* dashboard link */}
                    <div className="mt-6 pt-6">
                      <div className="space-y-1 px-2">
                        {dashboardLinks.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                            <item.icon
                              className="mr-4 h-6 w-6 text-cyan-200"
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* user link */}
                    <div className="mt-6 pt-6">
                      <div className="space-y-1 px-2">
                        {usersLinks.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                            <item.icon
                              className="mr-4 h-6 w-6 text-cyan-200"
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* orders links mobile */}
                    <div className="mt-6 pt-6">
                      <div className="space-y-1 px-2">
                        {ordersLinks.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                            <item.icon
                              className="mr-4 h-6 w-6 text-cyan-200"
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1 px-2 mt-8">
                      {/*Products  links mobile */}
                      {productsLinks.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "bg-cyan-800 text-white"
                              : "text-cyan-100 hover:text-white hover:bg-cyan-600",
                            "group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"
                          )}
                          aria-current={item.current ? "page" : undefined}>
                          <item.icon
                            className="mr-4 h-6 w-6 flex-shrink-0 text-cyan-200"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 pt-6">
                      <div className="space-y-1 px-2">
                        {couponsLinks.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                            <item.icon
                              className="mr-4 h-6 w-6 text-cyan-200"
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* Categories mobile */}
                    <div className="mt-3 pt-3">
                      <div className="space-y-1 px-2">
                        {CategoryLinks.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                            <item.icon
                              className="mr-4 h-6 w-6 text-cyan-200"
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* colors links mobile */}
                    <div className="mt-3 pt-3">
                      <div className="space-y-1 px-2">
                        {colorsLinks.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                            <item.icon
                              className="mr-4 h-6 w-6 text-cyan-200"
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* brands links mobile */}
                    <div className="mt-3 pt-3">
                      <div className="space-y-1 px-2">
                        {brandsLinks.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                            <item.icon
                              className="mr-4 h-6 w-6 text-cyan-200"
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* shipping unit links mobile */}
                    <div className="mt-3 pt-3">
                      <div className="space-y-1 px-2">
                        {shippingUnitLinks.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                            <item.icon
                              className="mr-4 h-6 w-6 text-cyan-200"
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* payment method links mobile */}
                    <div className="mt-3 pt-3">
                      <div className="space-y-1 px-2">
                        {paymentMethodLinks.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                            <item.icon
                              className="mr-4 h-6 w-6 text-cyan-200"
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </nav>
                  {/* end of mobile nav */}
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-grow flex-col overflow-y-auto bg-cyan-900 pt-5 pb-4">
            <nav
              className="mt-5 flex flex-1 flex-col divide-y divide-cyan-800 overflow-y-auto"
              aria-label="Sidebar">
              {/* dashboard link */}
              <div className="mt-3 pt-3">
                <div className="space-y-1 px-2">
                  {dashboardLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                      <item.icon
                        className="mr-4 h-6 w-6 text-cyan-200"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              {/* user link */}
              <div className="mt-3 pt-3">
                <div className="space-y-1 px-2">
                  {usersLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                      <item.icon
                        className="mr-4 h-6 w-6 text-cyan-200"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              {/* orders links desktop */}
              <div className="mt-3 pt-3">
                <div className="space-y-1 px-2">
                  {ordersLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                      <item.icon
                        className="mr-4 h-6 w-6 text-cyan-200"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mt-3 pt-3">
                <div className="space-y-1 px-2">
                  {/*Products  links desktop */}
                  {productsLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? "bg-cyan-800 text-white"
                          : "text-cyan-100 hover:text-white hover:bg-cyan-600",
                        "group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md"
                      )}
                      aria-current={item.current ? "page" : undefined}>
                      <item.icon
                        className="mr-4 h-6 w-6 flex-shrink-0 text-cyan-200"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>

              </div>
              <div className="mt-3 pt-3">
                <div className="space-y-1 px-2">
                  {couponsLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                      <item.icon
                        className="mr-4 h-6 w-6 text-cyan-200"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              {/* Categories desktop */}
              <div className="mt-3 pt-3">
                <div className="space-y-1 px-2">
                  {CategoryLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                      <item.icon
                        className="mr-4 h-6 w-6 text-cyan-200"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              {/* colors links desktop */}
              <div className="mt-3 pt-3">
                <div className="space-y-1 px-2">
                  {colorsLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                      <item.icon
                        className="mr-4 h-6 w-6 text-cyan-200"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              {/* brands links desktop */}
              <div className="mt-3 pt-3">
                <div className="space-y-1 px-2">
                  {brandsLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                      <item.icon
                        className="mr-4 h-6 w-6 text-cyan-200"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              {/* shipping unit links desktop */}
              <div className="mt-3 pt-3">
                <div className="space-y-1 px-2">
                  {shippingUnitLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                      <item.icon
                        className="mr-4 h-6 w-6 text-cyan-200"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              {/* payment method links desktop */}
              <div className="mt-3 pt-3">
                <div className="space-y-1 px-2">
                  {paymentMethodLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white">
                      <item.icon
                        className="mr-4 h-6 w-6 text-cyan-200"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>

        <div className="flex flex-1 flex-col lg:pl-64">
          <div className="flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:border-none">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <Bars3CenterLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1 pb-8">
            {/* Page header */}
            <div className="bg-white shadow">
              <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-8xl lg:px-8">
                <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
                  <div className="min-w-0 flex-1">
                    {/* Profile */}
                    <div className="flex items-center">
                      <>
                        {
                          loading ? <div className="avatar"><Skeleton cirle className="avatar avatar-skeleton" /></div> : <img
                            className="hidden h-16 w-16 rounded-full sm:block object-cover object-center"
                            src={profile?.user?.photo}
                            alt=""
                          />
                        }
                      </>

                      <div>
                        <div className="flex items-center">

                          {/* <img
                            className="h-16 w-16 rounded-full sm:hidden"
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80"
                            alt=""
                          /> */}
                          {
                            loading ? <Skeleton className="ml-3" width={200} height={30}>
                            </Skeleton> : <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                              Good morning, {profile?.user?.fullName}
                            </h1>
                          }
                          {/* <SkeletonTheme baseColor="#202020" highlightColor="#444">
                            <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                              <Skeleton width={200} height={30}> Good morning, {profile?.user?.fullName}</Skeleton>
                            </h1>
                          </SkeletonTheme> */}

                        </div>
                        <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                          <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
                            {/* Role */}

                            {
                              loading ? <Skeleton className="" width={200} height={30}>
                              </Skeleton> : <>
                                <svg
                                  className="w-6 h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                </svg>
                                <span className="">Role: {profile?.user?.isAdmin ? 'Admin' : 'Customer'}</span>
                              </>
                            }
                          </dd>
                          {/* Date Joined */}
                          <dd className="mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0">
                            {
                              loading ? <Skeleton className="" width={200} height={30} /> : <>
                                <svg
                                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                Date Joined: {new Date(profile?.user?.createdAt).toLocaleDateString()}
                              </>
                            }

                          </dd>
                          {/* email */}
                          <dd className="mt-3 flex items-center text-sm font-medium  text-gray-500 sm:mr-6 sm:mt-0">
                            {
                              loading ? <Skeleton className="" width={200} height={30} /> : <>
                                <svg
                                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                                </svg>
                                {profile?.user?.email}
                              </>
                            }

                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  {/* <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
                      Add money
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
                      Send money
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
            <Outlet />
            {/* content */}
          </main>
        </div>
      </div>
    </>
  );
}
