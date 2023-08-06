import { Link } from "react-router-dom";

export default function ThanksForOrdering() {
  return (
    <div className="flex max-w-7xl mx-auto">
      <div className="max-w-2xl h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <img
          src="https://tailwindui.com/img/ecommerce-images/confirmation-page-06-hero.jpg"
          alt="TODO"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div>
        <div className="mx-auto max-w-2xl py-16 px-4 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-2">
            <h1 className="text-sm font-medium text-indigo-600">
              Đơn hàng của bạn đang được xử lý
            </h1>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Cảm ơn bạn đã đặt hàng
            </p>
            <p className="mt-2 text-base text-gray-500">
              {/* We appreciate your order, we’re currently processing it. So hang
              tight and we’ll send you confirmation very soon! */}
              Chúng tôi đánh giá cao đơn đặt hàng của bạn, chúng tôi hiện đang xử lý nó. Vì vậy, hãy chờ đợi và chúng tôi sẽ sớm gửi cho bạn xác nhận!
            </p>

            <div className="mt-16 border-t border-gray-200 py-6 text-right">
              <Link
                to="/"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Tiếp tục mua sắm
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
