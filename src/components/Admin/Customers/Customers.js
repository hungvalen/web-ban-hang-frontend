import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListUsersAction } from "../../../redux/slices/users/usersSlice";
import Pagination from "../../pagination/Pagination";
import { useSearchParams } from "react-router-dom";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import NoDataFound from "../../NoDataFound/NoDataFound";
import EditCustomer from "./modal/EditCustomer";
import { resetSuccessAction } from "../../../redux/slices/globalActions/globalAction";
import DeleteCustomer from "./modal/deleteCustomer";
import AddCustomerModal from "./modal/AddCustomer";
import { limitNumber } from "../../../utils/limitNumber";
import { useTranslation } from "react-i18next";

export default function ManageCustomers() {
  const [isShowEditUserModal, setIsShowEditUserModal] = useState(false);
  const [isShowDeleteUserModal, setIsShowDeleteUserModal] = useState(false);
  const [isShowAddUserModal, setIsShowAddUserModal] = useState(false);
  const [query, setQuery] = useState("");
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const { users, loading, error, isUpdated, isDeleted, isAdded } = useSelector(state => state.users);
  const count = users?.count;
  const results = users?.results;
  const [limit, setLimit] = useState(5);
  const [user, setUser] = useState(" ");
  const [page, setPage] = useState(1);
  let totalPage = Math.ceil(count / limitNumber);
  const { t } = useTranslation();

  // useEffect(() => {
  //   // if (results > 5) {
  //   //   setLimit(results)
  //   // }
  //   // else {
  //   //   setLimit(5)
  //   // }

  // }, [results])

  useEffect(() => {
    dispatch(getListUsersAction({
      page,
      limit,
      query
    }))
  }, [page, limit, dispatch, query])


  useEffect(() => {
    if (isUpdated) {
      dispatch(getListUsersAction({
        page,
        limit,
        query

      }))
      dispatch(resetSuccessAction());
    }
  }, [isUpdated, dispatch, page, limit, query])

  useEffect(() => {
    if (isDeleted) {
      dispatch(getListUsersAction({
        page,
        limit,
        query

      }))
      dispatch(resetSuccessAction());
    }
  }, [isDeleted, dispatch, page, limit, query])

  useEffect(() => {
    if (isAdded) {
      dispatch(getListUsersAction({
        page,
        limit,
        query

      }))
      dispatch(resetSuccessAction());
    }
  }, [isAdded, dispatch, page, limit, query])

  const handleShowEditUserModal = (person) => {
    setIsShowEditUserModal(true);
    setUser(person);
  }

  const handleShowDeleteUserModal = (person) => {
    setIsShowDeleteUserModal(true);
    setUser(person);
  }

  const handleAddCustomer = () => {
    setIsShowAddUserModal(true);
  }


  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-5 ">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">{t('manage_users')}</h1>
          {/* <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p> */}
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleAddCustomer}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
            {t('add_user')}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-end mt-2">
        <input
          type="search"
          name="search"
          placeHolder={t('search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      {loading ? <LoadingComponent /> : error ? <ErrorMsg /> : (users.length <= 0 || users?.users?.length <= 0) ? <NoDataFound /> : <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                      {t('name')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('created_At')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('email')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('address')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('phone_number')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('role')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('edit')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('delete')}
                    </th>

                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {
                    users?.users?.map((person) => (
                      <tr key={person._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                          {person?.fullName ?? 'Chưa cập nhật'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(person?.createdAt).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person?.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person?.address ?? 'Chưa cập nhật'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person?.phone}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {t(person.role)}
                        </td>
                        <td className="relative whitespace-nowrap px-3 py-4 text-sm font-medium sm:pr-6 lg:pr-8">
                          <button
                            type="button"
                            onClick={() => handleShowEditUserModal(person)}
                            className="text-indigo-600 hover:text-indigo-900">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>
                          </button>
                        </td>
                        <td className="relative whitespace-nowrap px-3 py-4 text-sm font-medium sm:pr-6 lg:pr-8">
                          <button
                            type="button"
                            onClick={() => handleShowDeleteUserModal(person)}
                            className="text-indigo-600 hover:text-indigo-900">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <Pagination page={page} pages={totalPage} changePage={setPage} count={count} />

            </div>
          </div>
        </div>
      </div>
      }
      {
        isShowEditUserModal === true && <EditCustomer user={user} isShowEditUserModal={isShowEditUserModal} setIsShowEditUserModal={setIsShowEditUserModal} />
      }
      {
        isShowDeleteUserModal === true && <DeleteCustomer user={user} isShowDeleteUserModal={isShowDeleteUserModal} setIsShowDeleteUserModal={setIsShowDeleteUserModal} />
      }
      {
        isShowAddUserModal === true && <AddCustomerModal isShowAddUserModal={isShowAddUserModal} setIsShowAddUserModal={setIsShowAddUserModal} />
      }
    </div>
  );
}
