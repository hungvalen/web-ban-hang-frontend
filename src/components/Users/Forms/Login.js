import React, { useEffect, useState } from "react";
import { loginUserAction } from "../../../redux/slices/users/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "hung@gmail.com",
    password: "1234567",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }
  //---Destructuring---
  const { email, password } = formData;
  //---onchange handler----
  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();
  //---onsubmit handler----
  const onSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(loginUserAction({ email, password }));
  };

  // get data from store
  const { error, loading, userInfo } = useSelector((state) => state?.users?.userAuth);

  // redirect
  useEffect(() => {
    if (userInfo?.userFound) {
      window.location.href = "/"
    }

  }, [userInfo])
  return (
    <>
      <section className="py-20 bg-gray-100 overflow-x-hidden">
        <div className="relative container px-4 mx-auto">
          <div className="absolute inset-0 bg-blue-200 my-24 -ml-4" />
          <div className="relative flex flex-wrap bg-white">
            <div className="w-full md:w-4/6 px-4">
              <div className="lg:max-w-3xl mx-auto py-20 px-4 md:px-10 lg:px-20">
                <h3 className="mb-8 text-4xl md:text-5xl font-bold font-heading">
                  {
                    t('login_account')
                  }
                </h3>
                <p className="mb-10 font-semibold font-heading">
                  {
                    t('happy')
                  }
                </p>

                {/* err */}
                <form
                  className="flex flex-wrap -mx-4"
                  onSubmit={onSubmitHandler}>
                  <div className="w-full md:w-1/2 px-4 mb-4 md:mb-4">
                    <label>
                      <h4 className="mb-5 text-gray-400 uppercase font-bold font-heading">
                        {t('your_email')}
                      </h4>
                      <input
                        name="email"
                        value={email}
                        onChange={onChangeHandler}
                        className="p-5 w-full border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                        type="email"
                      />
                    </label>
                  </div>
                  <div className="w-full md:w-1/2 px-4 mb-4">
                    <label>
                      <h4 className="mb-5 text-gray-400 uppercase font-bold font-heading">
                        {t('password')}
                      </h4>
                      <input
                        name="password"
                        value={password}
                        onChange={onChangeHandler}
                        className="p-5 w-full border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                        type={isPasswordVisible ? "text" : "password"}
                      />
                    </label>
                  </div>
                  <div className="flex items-center px-4 mb-4">
                    <input
                      onChange={() => setIsPasswordVisible((state) => !state)}
                      defaultChecked={isPasswordVisible}
                      id="default-checkbox"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label for="default-checkbox" className="ml-2 text-sm font-semibold text-gray-900 font-heading">{t('show_password')}</label>
                  </div>

                  <div className="w-full px-4">
                    {loading ? <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold font-heading py-5 px-8 rounded-md uppercase">
                      Loading...
                    </button> : (
                      <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold font-heading py-5 px-8 rounded-md uppercase">
                        {t('login')}
                      </button>
                    )}
                  </div>
                  <div className="w-full flex items-center px-4 mb-4 mt-2">
                    <Link to="/reset-password" className="font-semibold underline">{t('forgot_password')}?</Link>
                  </div>
                </form>
              </div>
            </div>
            <div
              className="w-full md:w-2/6 h-128 md:h-auto flex items-center lg:items-end px-4 pb-20 bg-cover bg-no-repeat"
              style={{
                backgroundImage:
                  'url("https://images.pexels.com/photos/4464816/pexels-photo-4464816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
              }}></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
