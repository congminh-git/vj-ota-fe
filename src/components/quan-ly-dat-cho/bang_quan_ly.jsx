'use client';

import BangQuanLyItem from './bang_quan_ly_item';
import { useEffect, useState } from 'react';

export default function BangQuanLy({ danhSachVe, searchValue, soDongHienThi, thoiGianGioiHan, tinhTrangThanhToan }) {
    const [pageNumber, setPageNumber] = useState(1);
    const [danhSachDaLocTimKiem, setDanhSachDaLocTimKiem] = useState(null);

    useEffect(() => {
        setPageNumber(1);
    }, [soDongHienThi]);

    useEffect(() => {
        if (danhSachVe) {
            const list = [];
            danhSachVe.reverse().forEach((element) => {
                if (element.locator.includes(searchValue)) {
                    if (tinhTrangThanhToan == 'Tất cả') {
                        list.push(element);
                    } else if (tinhTrangThanhToan == 'Đã thanh toán') {
                        if (JSON.parse(element.thongTin).paymentTransactions[0].paymentMethod.identifier != 'PL') {
                            list.push(element);
                        }
                    } else if (tinhTrangThanhToan == 'Đặt chỗ') {
                        if (JSON.parse(element.thongTin).paymentTransactions[0].paymentMethod.identifier == 'PL') {
                            list.push(element);
                        }
                    }
                }
            });
            setDanhSachDaLocTimKiem(list.reverse());
        }
    }, [danhSachVe, searchValue, tinhTrangThanhToan]);
    return (
        <>
            <div className="text-sm text-start grid grid-cols-8 gap-2 p-2 text-gray-800 bg-gray-100 rounded-md font-medium">
                <div>STT</div>
                <div>Mã đặt chỗ</div>
                <div>Tên khách hàng</div>
                <div>Số điện thoại</div>
                <div>PT thanh toán</div>
                <div>TT thanh toán</div>
                <div>Tổng tiền</div>
                <div>Hành động</div>
            </div>
            {danhSachDaLocTimKiem ? (
                <div>
                    {danhSachDaLocTimKiem.length > 0 ? (
                        danhSachDaLocTimKiem.map((item, index) => {
                            if (
                                index + 1 <= pageNumber * soDongHienThi &&
                                index + 1 > (pageNumber - 1) * soDongHienThi
                            ) {
                                var inputDate = new Date(JSON.parse(item.thongTin).bookingInformation.creation.time);
                                var oneWeekAgo = new Date();
                                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                                if (
                                    (thoiGianGioiHan == '7 ngày gần nhất' && inputDate > oneWeekAgo) ||
                                    thoiGianGioiHan == 'Tất cả'
                                ) {
                                    return (
                                        <div key={index}>
                                            <BangQuanLyItem index={index + 1} duLieuVe={JSON.parse(item.thongTin)} />
                                        </div>
                                    );
                                }
                            }
                        })
                    ) : (
                        <div className="w-full flex justify-center items-center">
                            <div className="flex flex-col items-center mt-12">
                                <div className="w-[100px] h-[120px] bg-[url('/KhongTimThayKetQua.png')] bg-cover"></div>
                                <p className="my-1 text-md">Không có kết quả</p>
                                <p className="text-sm">
                                    <i>{searchValue}</i>
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="mt-4 flex justify-end">
                        <div className="text-center">
                            <div className="text-sm text-gray-700">
                                Hiển thị{' '}
                                <span className="font-semibold text-gray-900">
                                    {(pageNumber - 1) * soDongHienThi + 1}
                                </span>{' '}
                                đến{' '}
                                <span className="font-semibold text-gray-900">
                                    {soDongHienThi > danhSachDaLocTimKiem.length
                                        ? danhSachDaLocTimKiem.length
                                        : pageNumber * soDongHienThi > danhSachDaLocTimKiem.length
                                        ? danhSachDaLocTimKiem.length
                                        : pageNumber * soDongHienThi}
                                </span>{' '}
                                của{' '}
                                <span className="font-semibold text-gray-900">
                                    {danhSachDaLocTimKiem.length}
                                </span>{' '}
                                vé
                            </div>
                            <div className="flex justify-between">
                                <button
                                    onClick={() => {
                                        if (pageNumber > 1) {
                                            setPageNumber(pageNumber - 1);
                                        }
                                    }}
                                    className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-600 rounded-s hover:bg-gray-900"
                                >
                                    <svg
                                        className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 10"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 5H1m0 0 4 4M1 5l4-4"
                                        />
                                    </svg>
                                    Prev
                                </button>
                                <button
                                    onClick={() => {
                                        if (
                                            pageNumber <
                                            (danhSachDaLocTimKiem.length % soDongHienThi == 0
                                                ? Math.floor(danhSachDaLocTimKiem.length / soDongHienThi)
                                                : Math.floor(danhSachDaLocTimKiem.length / soDongHienThi) + 1)
                                        ) {
                                            setPageNumber(pageNumber + 1);
                                        }
                                    }}
                                    className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-600 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900"
                                >
                                    Next
                                    <svg
                                        className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 10"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 5h12m0 0L9 1m4 4L9 9"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-4 flex justify-center">
                    <div role="status">
                        <svg
                            aria-hidden="true"
                            className="inline w-10 h-10 text-gray-200 animate-spin fill-green-500"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
        </>
    );
}