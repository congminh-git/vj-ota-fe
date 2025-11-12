'use client';

export default function ContactInfomation({ reservation, setUpdateBookingInfomationPopup }) {
    return (
        <div className="border p-4 rounded-lg text-start h-full bg-white col-span-1">
            <h3 className="mb-2 flex justify-between">
                Thông tin liên hệ
                <button
                    onClick={() => setUpdateBookingInfomationPopup('update')}
                    className="text-sm text-blue-400 py-2 px-4 rounded bg-blue-100"
                >
                    <i>Chỉnh sửa</i>
                </button>
            </h3>
            <div className="text-sm">
                <p className="my-2 grid grid-cols-3">
                    <span className="col-span-1 text-gray-500">Họ và tên:</span>
                    <span className="col-span-2">{reservation?.bookingInformation.contactInformation.name}</span>
                </p>
                <p className="my-2 grid grid-cols-3">
                    <span className="col-span-1 text-gray-500">Số điện thoại:</span>
                    <span className="col-span-2">{reservation?.bookingInformation.contactInformation.phoneNumber}</span>
                </p>
                <p className="my-2 grid grid-cols-3">
                    <span className="col-span-1 text-gray-500">Email:</span>
                    <span className="col-span-2">{reservation?.bookingInformation.contactInformation.email}</span>
                </p>
            </div>
        </div>
    );
}