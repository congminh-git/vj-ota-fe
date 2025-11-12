'use client';

export default function ContactInfomationBookingSuccess({ bookingSuccessResult }) {
    return (
        <div className="border p-4 rounded-lg text-start h-full">
            <h3 className="mb-2">Thông tin liên hệ</h3>
            <div className="text-sm">
                <p className="my-2 grid grid-cols-3">
                    <span className="col-span-1 text-gray-500">Họ và tên:</span>
                    <span className="col-span-2">
                        {bookingSuccessResult?.bookingInformation.contactInformation.name}
                    </span>
                </p>
                <p className="my-2 grid grid-cols-3">
                    <span className="col-span-1 text-gray-500">Số điện thoại:</span>
                    <span className="col-span-2">
                        {bookingSuccessResult?.bookingInformation.contactInformation.phoneNumber}
                    </span>
                </p>
                <p className="my-2 grid grid-cols-3">
                    <span className="col-span-1 text-gray-500">Email:</span>
                    <span className="col-span-2">
                        {bookingSuccessResult?.bookingInformation.contactInformation.email}
                    </span>
                </p>
            </div>
        </div>
    );
}