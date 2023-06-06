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

export default function ManageCustomers() {
  const [isShowEditUserModal, setIsShowEditUserModal] = useState(false);
  const [isShowDeleteUserModal, setIsShowDeleteUserModal] = useState(false);
  const [isShowAddUserModal, setIsShowAddUserModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [params] = useSearchParams();
  const page = params.get("page") || 1;
  const limit = params.get("limit") || 5;
  const dispatch = useDispatch();
  const { users, loading, error, isUpdated, isDeleted, isAdded } = useSelector(state => state.users);
  const count = users?.count;
  const [user, setUser] = useState(" ");
  useEffect(() => {
    dispatch(getListUsersAction({
      page,
      limit
    }))
  }, [page, limit, dispatch])
  useEffect(() => {
    if (isUpdated) {
      dispatch(getListUsersAction({
        page,
        limit
      }))
      dispatch(resetSuccessAction());
    }
  }, [isUpdated, dispatch, page, limit])

  useEffect(() => {
    if (isDeleted) {
      dispatch(getListUsersAction({
        page,
        limit
      }))
      dispatch(resetSuccessAction());
    }
  }, [isDeleted, dispatch, page, limit])

  useEffect(() => {
    if (isAdded) {
      dispatch(getListUsersAction({
        page,
        limit
      }))
      dispatch(resetSuccessAction());
    }
  }, [isAdded, dispatch, page, limit])

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
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Manage Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleAddCustomer}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
            Add user
          </button>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <input
          type="search"
          name="search"
          placeHolder="Seach user"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="block  appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      {loading ? <LoadingComponent /> : error ? <ErrorMsg /> : users.length <= 0 ? <NoDataFound /> : <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Gender
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Phone number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Edit
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Delete
                    </th>

                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {
                    users?.users.filter((val) => {
                      if (searchValue === "") {
                        return val
                      }
                      else if (val.fullName.toLowerCase().includes(searchValue.toLocaleLowerCase())) {
                        return val
                      }
                    })?.map((person) => (
                      <tr key={person._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                          {person._id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person.fullName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person?.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person?.gender}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person?.phone}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person.role}
                        </td>
                        <td className="relative whitespace-nowrap px-3 py-4 text-sm font-medium sm:pr-6 lg:pr-8">
                          <button
                            type="button"
                            onClick={() => handleShowEditUserModal(person)}
                            className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </button>
                        </td>
                        <td className="relative whitespace-nowrap px-3 py-4 text-sm font-medium sm:pr-6 lg:pr-8">
                          <button
                            type="button"
                            onClick={() => handleShowDeleteUserModal(person)}
                            className="text-indigo-600 hover:text-indigo-900">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <Pagination count={count} />

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
