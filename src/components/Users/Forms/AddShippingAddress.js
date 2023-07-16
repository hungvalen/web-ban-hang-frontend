import React, { useState } from 'react'
import { useEffect } from 'react';
import { fetchDistrictAction, fetchProvinceAction, fetchWardAction } from '../../../redux/slices/address/addressSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfileAction, updateUserShippingAddressAction } from '../../../redux/slices/users/usersSlice';
import LoadingComponent from '../../LoadingComp/LoadingComponent';

const AddShippingAddress = (props) => {
  //user profile
  const { formData, setFormData, onChange } = props;
  console.log(formData)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserProfileAction())
  }, [dispatch])
  const { loading, error, profile, } = useSelector(state => state.users);
  const user = profile?.user;
  //onsubmit
  const onSubmit = (e) => {
    e.preventDefault();

  };

  useEffect(() => {
    dispatch(fetchProvinceAction())
  }, [dispatch])

  useEffect(() => {
    if (formData.provinceId !== "") {
      dispatch(fetchDistrictAction({
        province_id: formData.provinceId
      }))
    }

  }, [formData.provinceId, dispatch])

  useEffect(() => {
    if (formData.districtId !== "") {
      dispatch(fetchWardAction({
        district_id: formData.districtId
      }))
    }
  }, [formData.districtId, dispatch])

  const { provinces, districts, wards } = useSelector(state => state.address);
  useEffect(() => {
    if (provinces != null || districts != null || wards != null) {
      provinces.results?.filter(province => {
        if (province.province_id === formData.provinceId) setFormData({ ...formData, province: province.province_name })
        return true;
      });
      districts.results?.filter(district => {
        if (district.district_id === formData.districtId) setFormData({ ...formData, district: district.district_name })
        return true;
      });
      wards.results?.filter(ward => {
        if (ward.ward_id === formData.wardId) setFormData({ ...formData, ward: ward.ward_name })
        return true;
      });
    }

  }, [formData.provinceId, formData.districtId, formData.wardId, provinces, districts, wards])

  return (
    <>
      {/* shipping details */}
      {/* {user?.hasShippingAddress ? (
        <>
          <div className="mt-3">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Shipping details</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
          </div>
          <div className="mt-5 border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">First Name : </dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">{user?.shippingAddress?.firstName}</span>

                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Last name</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">{user?.shippingAddress?.lastName}</span>

                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">MB Bank</span>
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Branch</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">{user?.shippingAddress?.address} {user?.shippingAddress?.ward} {user?.shippingAddress?.district} {user?.shippingAddress?.province}</span>

                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Country</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">
                    {user?.shippingAddress?.country}
                  </span>

                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Phone number:</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">
                    {user?.shippingAddress?.phone}
                  </span>

                </dd>
              </div>

            </dl>
          </div>
        </>
        // <div className="mt-6">
        //   <h3 className="text-lg font-medium text-gray-900">
        //     Shipping details
        //   </h3>

        //   <p className="mt-1 text-sm text-gray-500">
        //     Double check your information.
        //   </p>
        //   <div>
        //     <p className="mt-1 text-sm text-gray-500">
        //       First Name : {user?.shippingAddress?.firstName}
        //     </p>
        //     <p className="mt-1 text-sm text-gray-500">
        //       Last Name : {user?.shippingAddress?.lastName}
        //     </p>
        //     <p className="mt-1 text-sm text-gray-500">
        //       Address : {user?.shippingAddress?.address} {user?.shippingAddress?.ward} {user?.shippingAddress?.district} {user?.shippingAddress?.province}
        //     </p>
        //     <p className="mt-1 text-sm text-gray-500">
        //       Country : {user?.shippingAddress?.country}
        //     </p>
        //     <p className="mt-1 text-sm text-gray-500">
        //       Phone number : {user?.shippingAddress?.phone}
        //     </p>
        //   </div>
        // </div>
      ) : ( */}
        <>
          <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>

          <form
            onSubmit={onSubmit}
            className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  required
                  type="email"
                  name="email"
                  onChange={onChange}
                  value={formData.email}
                  className="block w-full rounded-md border-gray-300  p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700">
                First name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="firstName"
                  onChange={onChange}
                  value={formData.firstName}
                  autoComplete="given-name"
                  className="block w-full rounded-md border-gray-400  p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-medium text-gray-700">
                Last name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="lastName"
                  onChange={onChange}
                  value={formData.lastName}
                  className="block w-full rounded-md border-gray-300  p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="province"
                className="block text-sm font-medium text-gray-700">
                Tỉnh/thành phố
              </label>
              <div className="mt-1">
                <select
                  name="provinceId"
                  value={formData.provinceId}
                  onChange={onChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2  pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                >
                  <option>-- Vui lòng chọn tỉnh/thành phố --</option>
                  {provinces?.results?.map((province) => (
                    <option key={province?.province_id} value={province?.province_id}>
                      {province?.province_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="districtId"
                className="block text-sm font-medium text-gray-700">
                Quận/Huyện
              </label>
              <div className="mt-1">
                <select
                  name="districtId"
                  value={formData.districtId}
                  onChange={onChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2  pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                >
                  <option>-- Vui lòng chọn huyện/ thị xã --</option>
                  {districts?.results?.map((district) => (
                    <option key={district?.district_id} value={district?.district_id}>
                      {district?.district_name}
                    </option>
                  )
                  )}
                </select>

              </div>
            </div>
            <div>
              <label
                htmlFor="wardId"
                className="block text-sm font-medium text-gray-700">
                Phường/Xã
              </label>
              <div className="mt-1">
                <select
                  name="wardId"
                  value={formData.wardId}
                  onChange={onChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2  pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                >
                  <option>-- Vui lòng chọn huyện/ thị xã --</option>
                  {wards?.results?.map((ward) => (
                    <option key={ward?.ward_id} value={ward?.ward_id}>
                      {ward?.ward_name}
                    </option>
                  )
                  )}
                </select>

              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="address"
                  onChange={onChange}
                  value={formData.address}
                  autoComplete="street-address"
                  className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="postal-code"
                className="block text-sm font-medium text-gray-700">
                Postal code
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="postalCode"
                  onChange={onChange}
                  value={formData.postalCode}
                  autoComplete="postal-code"
                  className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  onChange={onChange}
                  value={formData.phone}
                  autoComplete="tel"
                  className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* <button
              type="submit"
              className="w-full rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
              Add Shipping Address
            </button> */}


          </form>
        </>
      {/* )} */}
    </>
  )
}

export default AddShippingAddress