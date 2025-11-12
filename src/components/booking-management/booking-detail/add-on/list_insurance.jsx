'use client';

import { useState, useEffect } from 'react';

function ListChonBaoHiem({
    openchonBaoHiem,
    danhSachBaoHiem,
    body,
    setBody,
    danhSachBaoHiemDuocChon,
    setDanhSachBaoHiemDuocChon,
}) {
    useEffect(() => {
        if (danhSachBaoHiemDuocChon) {
            // console.log(danhSachBaoHiemDuocChon);
        }
    }, [danhSachBaoHiemDuocChon]);
    const handleCheckBaoHiem = (event) => {
        const element = { purchaseKey: event.target.value };
        console.log(event.target.checked);
        if (event.target.checked) {
            setDanhSachBaoHiemDuocChon([...danhSachBaoHiemDuocChon, element]);
        } else {
            const listStr = JSON.stringify(danhSachBaoHiemDuocChon);
            const list = JSON.parse(listStr);
            let indexToRemove = danhSachBaoHiemDuocChon.findIndex(
                (item) => JSON.stringify(item) == JSON.stringify(element),
            );
            list.splice(indexToRemove, 1);
            if (indexToRemove !== -1) {
                setDanhSachBaoHiemDuocChon(list);
            }
        }
    };
    const xacNhanThayDoi = (event) => {
        location.reload();
    };
    return (
        <div className={`${openchonBaoHiem ? 'block' : 'hidden'} mt-6 px-4 pb-2`}>
            {danhSachBaoHiem?.map((element, index) => {
                return (
                    <div key={index + 1} className="flex justify-between">
                        <div className="flex items-center">
                            <input
                                checked={
                                    danhSachBaoHiemDuocChon?.findIndex(
                                        (item) => item.purchaseKey == element.purchaseKey,
                                    ) != -1
                                        ? true
                                        : false
                                }
                                onChange={handleCheckBaoHiem}
                                id={`element-${index + 1}`}
                                type="checkbox"
                                value={element.purchaseKey}
                                className="w-6 h-6 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            ></input>
                            <label htmlFor={`element-${index + 1}`}>{element.insuranceProvider.name}</label>
                        </div>
                        <div className="text-orange-500">{element.chargeAmount.totalAmount.toLocaleString()}đ</div>
                    </div>
                );
            })}

            <div className="mt-6">
                <button
                    onClick={xacNhanThayDoi}
                    className="bg-blue-500 hover:bg-blue-400 rounded w-full px-4 py-2 text-white font-bold"
                >
                    Xác nhận
                </button>
            </div>
        </div>
    );
}

export default ListChonBaoHiem;