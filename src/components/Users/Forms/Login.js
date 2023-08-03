import React, { useEffect, useState } from "react";
import { loginUserAction, registerUserAction } from "../../../redux/slices/users/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { isEmailValid, isVietnamesePhoneNumberValid } from "../../../utils/validate";
const Login = () => {
  const { t } = useTranslation();
  //dispatch
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorInput, setErrorInput] = useState({
    emailError: '',
    passwordError: '',
  });

  const dispatch = useDispatch();

  const { email, password } = formData;
  const { emailError, passwordError } = errorInput;
  //---onchange handler----
  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }
  //---onsubmit handler----
  const onSubmitHandler = (e) => {
    e.preventDefault();
    // Kiểm tra tất cả các trường cần thiết
    let isValidForm = true;
    if (!email.trim() || !password.trim()) {
      setErrorInput({
        emailError: !email.trim() ? 'Vui lòng nhập địa chỉ email.' : '',
        passwordError: !password.trim() ? 'Vui lòng nhập mật khẩu.' : '',
      });
      return;
    } else {
      setErrorInput({});
      isValidForm = true;
    }
    if (isValidForm) {
      dispatch(loginUserAction({ email, password }));
      setFormData({ email: '', password: '', });
      setErrorInput({ emailError: '', passwordError: '', });
    }
  };

  const { error, loading, userInfo } = useSelector((state) => state?.users?.userAuth);

  // redirect
  useEffect(() => {
    if (userInfo?.userFound) {
      window.location.href = "/"
    }

  }, [userInfo])

  const handleEmailChange = (event) => {
    // Lấy giá trị nhập vào từ input
    const inputEmail = event.target.value;

    const isValidEmail = isEmailValid(inputEmail);

    if (!isValidEmail) {
      setErrorInput({ ...errorInput, emailError: 'Địa chỉ email không hợp lệ.' });
    }
    else {
      setErrorInput({ ...errorInput, emailError: '' });

    }
    setFormData({ ...formData, email: inputEmail });

  };

  const handlePasswordChange = (event) => {
    const inputPassword = event.target.value;

    setErrorInput({ ...errorInput, passwordError: inputPassword.trim() ? '' : 'Vui lòng nhập mật khẩu.' });
    setFormData({ ...formData, password: inputPassword });
  };
  return (
    <>
      <div className="max-w-7xl mx-auto flex min-h-full mt-7 flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                {/* Sign in to your account {' '} */} {t('sign_in')}
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {t('not_registered_yet')}?
                <Link to="/register" className="ml-1 font-semibold text-indigo-600 hover:text-indigo-500">
                  {t('create_an_account')}
                </Link>
              </p>
            </div>

            <div className="mt-10">
              <div>
                <form className="space-y-6" onSubmit={onSubmitHandler}>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                      {t('email')}
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        // required
                        value={email}
                        onChange={handleEmailChange}
                        className="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {emailError && <p className="text-red-500 text-sm mt-1 leading-6">{emailError}</p>}

                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      {t('password')}
                    </label>
                    <div className="relative w-full container mx-auto mt-2">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        // required
                        onChange={handlePasswordChange}
                        value={password}
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                      <span
                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                        onClick={togglePasswordVisibility}
                      >
                        {isPasswordVisible ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                            />
                          </svg>

                        )}
                      </span>
                    </div>
                    {passwordError && <p className="text-red-500 text-sm mt-1 leading-6">{passwordError}</p>}

                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-700">
                        Remember me

                      </label>

                    </div>

                    <div className="text-sm leading-6">
                      <Link to="/reset-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        {t('forgot_password')}?
                      </Link>
                    </div>
                  </div>

                  <div>
                    {loading ? <button
                      disabled
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Loading ...
                    </button> : (

                      <button
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        {t('sign_in')}
                      </button>)}
                  </div>
                </form>
              </div>

              <div className="mt-10">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-white px-6 text-gray-900">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Link
                    href="#"
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-[#1D9BF0] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
                  >
                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    <span className="text-sm font-semibold leading-6">Twitter</span>
                  </Link>

                  <Link
                    href="#"
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
                  >
                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-semibold leading-6">GitHub</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default Login;
