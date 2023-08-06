import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store/store";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-toastify/dist/ReactToastify.css';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Import translations
import enTranslation from './locales/en.json'
import viTranslation from './locales/vi.json';
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from "react-toastify";
const root = ReactDOM.createRoot(document.getElementById("root"));
const storedLanguage = localStorage.getItem('language') || 'en'; // Get the language from Local Storage or use the default 'en'

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    vi: { translation: viTranslation },
  },
  lng: storedLanguage, // Ngôn ngữ mặc định khi bắt đầu ứng dụng
  fallbackLng: 'en', // Ngôn ngữ dự phòng nếu không tìm thấy ngôn ngữ hiện tại
  interpolation: {
    escapeValue: false, // Cho phép sử dụng biểu thức trong các chuỗi dịch
  },
});
root.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <React.StrictMode>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <App />

        {/* Same as */}
        <ToastContainer />
      </React.StrictMode>
    </Provider>

  </I18nextProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
