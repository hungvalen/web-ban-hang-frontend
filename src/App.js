import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ManageCoupons from "./components/Admin/Coupons/ManageCoupons";
import Login from "./components/Users/Forms/Login";
import RegisterForm from "./components/Users/Forms/RegisterForm";
import HomePage from "./components/HomePage/HomePage";
import Navbar from "./components/Navbar/Navbar";
import OrderHistory from "./components/Admin/Orders/ManageOrders";
import OrderPayment from "./components/Users/Products/OrderPayment";
import ManageCategories from "./components/Admin/Categories/ManageCategories";
import ManageStocks from "./components/Admin/Products/ManageStocks";
import AddCategory from "./components/Admin/Categories/modal/AddCategory";
import AddBrand from "./components/Admin/Categories/AddBrand";
import AddColor from "./components/Admin/Categories/AddColor";
import AllCategories from "./components/HomePage/AllCategories";
import Product from "./components/Users/Products/Product";
import ShoppingCart from "./components/Users/Products/ShoppingCart";
import ProductsFilters from "./components/Users/Products/ProductsFilters";
import CustomerProfile from "./components/Users/Profile/CustomerProfile";
import AddReview from "./components/Users/Reviews/AddReview";
import OrdersList from "./components/Admin/Orders/OdersList";
import ManageOrders from "./components/Admin/Orders/ManageOrders";
import Customers from "./components/Admin/Orders/Customers";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import AdminRoute from "./components/AuthRoute/AdminRoute";
import Navigation from "./components/Navbar/Navigation";
import ThanksForOrdering from "./components/Users/Products/ThanksForOrdering";
import ManageCustomers from "./components/Admin/Customers/Customers";
import MyOrder from "./components/Users/Profile/MyOrder";
import OrderDetails from "./components/Users/Profile/OrderDetails";
import ResetPassword from "./components/Users/Auth/ResetPassword";
import ForgotPassword from "./components/Users/Auth/ForgotPassword";
import ManageBrands from "./components/Admin/Categories/brand/ManageBrands";
import ManageShippingUnit from "./components/Admin/ShippingUnit/ManageShippingUnit";
import ManagePaymentMethod from "./components/Admin/PaymentMethod/ManagePaymentMethod";
import UserChatComponent from "./components/Chat/UserChatComponent";
import ChatPopup from "./components/Chat/UserChatComponent";
import ManageReviews from "./components/Admin/Reviews/ManageReviews";
import VerifyAccount from "./components/Users/VerifyAccount";
const App = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const isAdmin = user?.userFound;
  return (<>
<BrowserRouter>
  {/* {isAdmin ? null : <Navbar />} */}
  <Navigation />
  {/* hide navbar if admin */}
  <Routes>
    {/* nested route */}
    {/* <Route element={<ChatPopup />}> */}

      <Route path="success" element={<ThanksForOrdering />} />

      <Route path="admin" element={
        <AdminRoute>
          <AdminDashboard admin={isAdmin} />
        </AdminRoute>
      }>
        {/* products */} <Route path="" element={<OrdersList />} />
        <Route path="manage-products" element={<ManageStocks />} />
        {/* coupons */}
        <Route path="manage-coupon" element={<ManageCoupons />} />
        {/* Category */}
        <Route path="manage-category" element={<ManageCategories />} />
        {/* brand category */}
        <Route path="add-brand" element={<AddBrand />} />
        <Route path="all-brands" element={<ManageBrands />} />
        {/* color category */}
        <Route path="add-color" element={<AddColor />} />
        {/* Orders */}
        <Route path="manage-orders" element={<ManageOrders />} />
        <Route path="order-payment" element={<OrderPayment />} />
        <Route path="customers" element={<ManageCustomers />} />
        {/* Shipping unut */}
        <Route path="shipping-unit" element={<ManageShippingUnit />} />
        <Route path="payment-method" element={<ManagePaymentMethod />} />
        {/* Reviews */}
        <Route path="manage-reviews" element={<ManageReviews />} />

      </Route>
      {/* public links */}
      {/* Products */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products-filters" element={<ProductsFilters />} />
      <Route path="/products/:id" element={<Product />} />
      <Route path="/all-categories" element={<AllCategories />} />
      {/* review */}
      <Route path="/add-review/:id" element={<AddReview />} />

      {/* shopping cart */}
      <Route path="/shopping-cart" element={<ShoppingCart />} />
      <Route path="/order-payment" element={<OrderPayment />} />
      {/* users */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password/:token" element={<ForgotPassword />} />
      <Route path="/confirm/:token/:expirationTime" element={<VerifyAccount />} />
      <Route path="/customer-profile" element={<CustomerProfile />} />
      <Route path="/order-details/:id" element={<OrderDetails />} />
      <Route path="/my-order" element={<MyOrder />} />
    {/* </Route> */}
  </Routes>
  {/* <ChatPopup/> */}

</BrowserRouter>
  </>
    
  );
};

export default App;
