import React, { useEffect, useState } from 'react'
import CustomerDetails from './CustomerDetails';
import ShippingAddressDetails from './ShippingAddressDetails';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfileAction } from '../../../redux/slices/users/usersSlice';
import LoadingComponent from '../../LoadingComp/LoadingComponent';
import formatDate from '../../../utils/formatDate';
import { PaperClipIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom';
import ChangePassword from '../Auth/ChangePassword';
import EditProfileModal from './modal/EditProfileModal';
import { useTranslation } from 'react-i18next';

const CustomerProfile = () => {
  let { profile, loading: loadingProfile, isUpdated } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [isShowChangePassword, setIsShowChangePassword] = useState(false);
  const [isShowEditProfileModal, setIsShowEditProfileModal] = useState(false);
  const [user, setUser] = useState('');
  const { t } = useTranslation();
  useEffect(() => {
    dispatch(getUserProfileAction());
  }, [dispatch])

  useEffect(() => {
    if (isUpdated) {
      dispatch(getUserProfileAction());
    }
  }, [dispatch, isUpdated])

  const handleChangePassword = () => {
    setIsShowChangePassword(!isShowChangePassword);
  }

  const handleEditProfileModal = () => {
    setIsShowEditProfileModal(!isShowEditProfileModal);
    setUser(profile)
  }
  return (
    <>
      {loadingProfile ? <LoadingComponent /> : (
        <div className="flex flex-wrap md:mb-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full md:w-1/3 px-3 mt-3 md:mb-0 flex flex-col items-center">
            <img className="h-56 w-56 rounded-full object-cover object-center" src={profile?.user?.photo} alt="" />
            <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900">{ }</h3>
            <p className="text-sm leading-6 text-gray-600">{ }</p>
            <ul role="list" className="mt-6 flex justify-center gap-x-6">
              <button
                type="button"
                onClick={handleEditProfileModal}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
                {t('edit_profile')}
              </button>
              <button
                type="button"
                onClick={handleChangePassword}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:w-auto">
                {t('change_password')}
              </button>
            </ul>
          </div>

          <div className="w-full md:w-1/2 px-3 mt-3 md:mb-0">
            <div>
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-gray-900">{t('user_information')}</h3>
                {/* <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p> */}
              </div>
              <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">{t('full_name')}</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{profile?.user?.fullName}</dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">{t('email_address')}</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{profile?.user?.email}</dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">{t('phone_number')}</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{profile?.user?.phone}</dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">{t('date_of_birth')}</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{profile?.user?.dateOfBirth ? new Date(profile?.user?.dateOfBirth ?? '').toLocaleDateString() : ''}</dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">{t('address')}</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{profile?.user?.address}</dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">{t('gender')}</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {t(profile?.user?.gender)}
                    </dd>
                  </div>
                  {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">{t('about')}</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {profile?.user?.bio}
                    </dd>
                  </div> */}

                </dl>
              </div>
            </div>
            {/* <CustomerDetails
              email={profile?.user?.email}
              dateJoined={new Date(profile?.user?.createdAt).toDateString()}
              fullName={profile?.user?.fullName}
            /> */}
          </div>
          {/* <div className="w-full md:w-1/3 px-3 mb-3 md:mb-0" /> */}
        </div >
      )}
      {
        isShowChangePassword && <ChangePassword isShowChangePassword={isShowChangePassword} setIsShowChangePassword={setIsShowChangePassword} />
      }
      {
        isShowEditProfileModal && <EditProfileModal isShowEditProfileModal={isShowEditProfileModal} setIsShowEditProfileModal={setIsShowEditProfileModal} user={user?.user} />
      }
    </>
  )
}

export default CustomerProfile