'use client';

import { useState, useEffect } from 'react';
import flatpickr from 'flatpickr';
import Vietnamese from 'flatpickr/dist/l10n/vn';
import 'flatpickr/dist/flatpickr.min.css';
import InputMask from 'react-input-mask';

export default function PassengerInfomation({
    listPassenger,
    setListPassenger,
    contactInfomation,
    setContactInfomation,
}) {
    const [passengerAsContactIndex, setPassengerAsContactIndex] = useState(-1);

    useEffect(() => {
        if (
            passengerAsContactIndex != -1 &&
            (listPassenger.listAdult[passengerAsContactIndex].firstName ||
                listPassenger.listAdult[passengerAsContactIndex].lastName ||
                listPassenger.listAdult[passengerAsContactIndex].phoneNumber ||
                listPassenger.listAdult[passengerAsContactIndex].email ||
                listPassenger.listAdult[passengerAsContactIndex].gender)
        ) {
            setContactInfomation({
                ...contactInfomation,
                lastName: listPassenger.listAdult[passengerAsContactIndex].lastName,
                firstName: listPassenger.listAdult[passengerAsContactIndex].firstName,
                phoneNumber: listPassenger.listAdult[passengerAsContactIndex].phoneNumber,
                email: listPassenger.listAdult[passengerAsContactIndex].email,
                gender: listPassenger.listAdult[passengerAsContactIndex].gender,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [passengerAsContactIndex]);

    const funcUseAsContactInfomation = (event) => {
        if (event.target.checked) {
            setPassengerAsContactIndex(parseInt(event.target.value));
        } else {
            setPassengerAsContactIndex(-1);
        }
    };
    return (
        <>
            <div className="bg-white sm:p-4 p-3 rounded-md">
                <h3 className="font-medium">
                    <i>Thông tin hành khách</i>
                </h3>
                <div>
                    {listPassenger.listAdult?.map((item, index) => {
                        return (
                            <div
                                className="mt-6 border border-gray-300 rounded p-2"
                                key={index}
                                id={`nguoi-lon-${index}`}
                            >
                                <p className="text-sm text-sky-400 font-medium mb-2">
                                    <i>Hành khách {index + 1}</i>
                                </p>
                                <div className="grid grid-cols-6 sm:gap-8 gap-6">
                                    <div className="col-span-6 sm:col-span-3 w-full h-fit border px-2 py-1 rounded relative">
                                        <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                            Họ
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={listPassenger.listAdult[index].lastName}
                                            onChange={(e) => {
                                                const listAdult = listPassenger.listAdult;
                                                const updatedLastName = e.target.value
                                                    .normalize('NFD')
                                                    .replace(/[\u0300-\u036f]/g, '')
                                                    .replace(/Đ/g, 'D')
                                                    .replace(/đ/g, 'd')
                                                    .toUpperCase();

                                                listAdult[index] = {
                                                    ...listAdult[index],
                                                    lastName: updatedLastName,
                                                };
                                                setListPassenger({ ...listPassenger, listAdult });
                                            }}
                                            className="w-full outline-none"
                                            type="text"
                                        />
                                        <p
                                            className={`text-red-500 thong-tin-hanh-khach-ho-${index} text-sm absolute top-2 right-2`}
                                        ></p>
                                    </div>
                                    <div className="col-span-6 sm:col-span-3 w-full h-fit border px-2 py-1 rounded relative">
                                        <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                            Tên đệm và tên
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={listPassenger.listAdult[index].firstName}
                                            onChange={(e) => {
                                                const listAdult = listPassenger.listAdult;
                                                const updatedFirstName = e.target.value
                                                    .normalize('NFD')
                                                    .replace(/[\u0300-\u036f]/g, '')
                                                    .replace(/Đ/g, 'D')
                                                    .replace(/đ/g, 'd')
                                                    .toUpperCase();
                                                listAdult[index] = {
                                                    ...listAdult[index],
                                                    firstName: updatedFirstName,
                                                };
                                                setListPassenger({ ...listPassenger, listAdult });
                                            }}
                                            className="w-full outline-none"
                                            type="text"
                                        />
                                        <p
                                            className={`text-red-500 thong-tin-hanh-khach-ten-dem-ten-${index} text-sm absolute top-2 right-2`}
                                        ></p>
                                    </div>
                                    <div className="col-span-6 xl:col-span-3 w-full h-fit border px-2 py-1 rounded relative">
                                        <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                            Ngày sinh
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center">
                                            <InputMask
                                                mask="99/99/9999"
                                                placeholder="DD/MM/YYYY"
                                                maskChar="_"
                                                onChange={(e) => {
                                                    const listAdult = listPassenger.listAdult;

                                                    // Lấy giá trị từ ô nhập
                                                    const dob = e.target.value;
                                                    
                                                    // Tách ngày, tháng và năm
                                                    const [day, month, year] = dob.split('/');

                                                    // Hoán đổi vị trí ngày và tháng (MM/DD/YYYY)
                                                    const newDob = `${month}/${day}/${year}`;

                                                    listAdult[index] = {
                                                        ...listAdult[index],
                                                        dob: newDob,
                                                    };
                                                    setListPassenger({ ...listPassenger, listAdult });
                                                }}
                                            >
                                                {(inputProps) => (
                                                    <input
                                                        {...inputProps}
                                                        type="text"
                                                        name="dob"
                                                        className="w-48 p-2 outline-none"
                                                    />
                                                )}
                                            </InputMask>
                                        </div>
                                        <p
                                            className={`text-red-500 thong-tin-hanh-khach-ngay-sinh-${index} text-sm absolute top-2 right-2`}
                                        ></p>
                                    </div>
                                    <div className={`col-span-6 xl:col-span-3 flex flex-col justify-center`}>
                                        <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                            Giới tính
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div
                                            className={`flex gap-10 items-center thong-tin-hanh-khach-gioi-tinh-${index}`}
                                        >
                                            <label>
                                                <input
                                                    className="mr-2"
                                                    type="radio"
                                                    value="nam"
                                                    name={`gioi-tinh-hanh-khach-${index}`}
                                                    onChange={(e) => {
                                                        const listAdult = listPassenger.listAdult;
                                                        listAdult[index] = {
                                                            ...listAdult[index],
                                                            gender: e.target.value,
                                                        };
                                                        setListPassenger({ ...listPassenger, listAdult });
                                                    }}
                                                />
                                                Nam
                                            </label>
                                            <label>
                                                <input
                                                    className="mr-2"
                                                    type="radio"
                                                    value="nu"
                                                    name={`gioi-tinh-hanh-khach-${index}`}
                                                    onChange={(e) => {
                                                        const listAdult = listPassenger.listAdult;
                                                        listAdult[index] = {
                                                            ...listAdult[index],
                                                            gender: e.target.value,
                                                        };
                                                        setListPassenger({ ...listPassenger, listAdult });
                                                    }}
                                                />
                                                Nữ
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-span-6 sm:col-span-3 w-full h-fit border px-2 py-1 rounded relative">
                                        <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                            Loại ID
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={listPassenger.listAdult[index].idType}
                                            onChange={(e) => {
                                                const listAdult = listPassenger.listAdult;
                                                const updatedIDType = e.target.value

                                                listAdult[index] = {
                                                    ...listAdult[index],
                                                    idType: updatedIDType,
                                                };
                                                setListPassenger({ ...listPassenger, listAdult });
                                            }}
                                            className="w-full outline-none"
                                            type="text"
                                        >
                                             <option value="">Chọn loại ID</option>
                                             <option value="CCCD">CCCD</option>
                                             <option value="Passport">Passport</option>
                                        </select>
                                        <p
                                            className={`text-red-500 thong-tin-hanh-khach-id-type-${index} text-sm absolute top-2 right-2`}
                                        ></p>
                                    </div>
                                    <div className="col-span-6 sm:col-span-3 w-full h-fit border px-2 py-1 rounded relative">
                                        <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                            Number
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={listPassenger.listAdult[index].number}
                                            onChange={(e) => {
                                                const listAdult = listPassenger.listAdult;
                                                const idNumber = e.target.value
                                                    .normalize('NFD')
                                                    .replace(/[\u0300-\u036f]/g, '')
                                                    .replace(/Đ/g, 'D')
                                                    .replace(/đ/g, 'd')
                                                    .toUpperCase();
                                                listAdult[index] = {
                                                    ...listAdult[index],
                                                    number: idNumber,
                                                };
                                                setListPassenger({ ...listPassenger, listAdult });
                                            }}
                                            className="w-full outline-none"
                                            type="text"
                                        />
                                        <p
                                            className={`text-red-500 thong-tin-hanh-khach-passport-${index} text-sm absolute top-2 right-2`}
                                        ></p>
                                    </div>
                                    {index === 0 ? (
                                        <>
                                            <div className="col-span-6 xl:col-span-3 w-full h-fit border px-2 py-1 rounded relative">
                                                <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                    Số điện thoại
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex items-center text-sm">
                                                    {/* <div className="w-5 h-4 bg-[url('/vietnamicon.png')] bg-cover rounded-full"></div>
                                                    <p className="ml-2">+84</p> */}
                                                    <input
                                                        onChange={(e) => {
                                                            const listAdult = listPassenger.listAdult;
                                                            const value = e.target.value.replace(/\D/g, '');
                                                            listAdult[index] = {
                                                                ...listAdult[index],
                                                                phoneNumber: value,
                                                            };
                                                            setListPassenger({ ...listPassenger, listAdult });
                                                        }}
                                                        value={listPassenger.listAdult[index].phoneNumber}
                                                        className="w-full outline-none"
                                                        maxLength={10}
                                                        type="text"
                                                    />
                                                </div>
                                                <p
                                                    className={`text-red-500 thong-tin-hanh-khach-sdt-${index} text-sm absolute top-2 right-2`}
                                                ></p>
                                            </div>
                                            <div className="col-span-6 xl:col-span-3 w-full h-fit border px-2 py-1 rounded relative">
                                                <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                    Email
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    onChange={(e) => {
                                                        const listAdult = listPassenger.listAdult;
                                                        listAdult[index] = {
                                                            ...listAdult[index],
                                                            email: e.target.value,
                                                        };
                                                        setListPassenger({ ...listPassenger, listAdult });
                                                    }}
                                                    className="w-full outline-none"
                                                    type="text"
                                                />
                                                <p
                                                    className={`text-red-500 thong-tin-hanh-khach-email-${index} text-sm absolute top-2 right-2`}
                                                ></p>
                                            </div>
                                            <div
                                                className={`${
                                                    listPassenger.listAdult &&
                                                    listPassenger.listAdult[index]?.lastName &&
                                                    listPassenger.listAdult[index]?.firstName &&
                                                    listPassenger.listAdult[index]?.phoneNumber &&
                                                    listPassenger.listAdult[index]?.email &&
                                                    listPassenger.listAdult[index]?.gender
                                                        ? 'text-gray-700'
                                                        : 'text-gray-400'
                                                } flex items-center mt-1 col-span-6`}
                                            >
                                                <input
                                                    onChange={funcUseAsContactInfomation}
                                                    checked={index == passengerAsContactIndex ? true : false}
                                                    disabled={
                                                        listPassenger.listAdult &&
                                                        listPassenger.listAdult[index]?.lastName &&
                                                        listPassenger.listAdult[index]?.firstName &&
                                                        listPassenger.listAdult[index]?.phoneNumber &&
                                                        listPassenger.listAdult[index]?.email &&
                                                        listPassenger.listAdult[index]?.gender
                                                            ? false
                                                            : true
                                                    }
                                                    id={`use-as-contact-info-${index}`}
                                                    type="checkbox"
                                                    value={`${index}`}
                                                    name="use-as-contact-info"
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                />
                                                <label
                                                    htmlFor={`use-as-contact-info-${index}`}
                                                    className="w-full ms-2 text-sm font-medium"
                                                >
                                                    <i>Dùng làm thông tin liên hệ</i>
                                                </label>
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                    {listPassenger.listChild?.map((item, index) => {
                        return (
                            <div
                                className="mt-6  border border-gray-300 rounded p-2"
                                key={index}
                                id={`tre-em-${index}`}
                            >
                                <p className="text-sm text-sky-400 font-medium mb-2">
                                    <i>
                                        Trẻ em {index + 1} <span>{'(2-11 tuổi)'}</span>
                                    </i>
                                </p>
                                <div className="grid grid-cols-6 gap-8">
                                    <div className="col-span-6 sm:col-span-3 w-full h-fit border px-2 py-1 rounded relative">
                                        <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                            Họ
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={listPassenger.listChild[index].lastName}
                                            className="w-full outline-none"
                                            type="text"
                                            onChange={(e) => {
                                                const listChild = listPassenger.listChild;
                                                const updatedLastName = e.target.value
                                                    .normalize('NFD')
                                                    .replace(/[\u0300-\u036f]/g, '')
                                                    .replace(/Đ/g, 'D')
                                                    .replace(/đ/g, 'd')
                                                    .toUpperCase();
                                                listChild[index] = {
                                                    ...listChild[index],
                                                    lastName: updatedLastName,
                                                };
                                                setListPassenger({ ...listPassenger, listChild });
                                            }}
                                        />
                                        <p
                                            className={`text-red-500 thong-tin-tre-em-ho-${index} text-sm absolute top-2 right-2`}
                                        ></p>
                                    </div>
                                    <div className="col-span-6 sm:col-span-3 w-full h-fit border px-2 py-1 rounded relative">
                                        <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                            Tên đệm và tên
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={listPassenger.listChild[index].firstName}
                                            onChange={(e) => {
                                                const listChild = listPassenger.listChild;
                                                const updatedFirstName = e.target.value
                                                    .normalize('NFD')
                                                    .replace(/[\u0300-\u036f]/g, '')
                                                    .replace(/Đ/g, 'D')
                                                    .replace(/đ/g, 'd')
                                                    .toUpperCase();
                                                listChild[index] = {
                                                    ...listChild[index],
                                                    firstName: updatedFirstName,
                                                };
                                                setListPassenger({ ...listPassenger, listChild });
                                            }}
                                            className="w-full outline-none"
                                            type="text"
                                        />
                                        <p
                                            className={`text-red-500 thong-tin-tre-em-ten-dem-ten-${index} text-sm absolute top-2 right-2`}
                                        ></p>
                                    </div>
                                    <div className="col-span-6 xl:col-span-3 w-full h-fit border px-2 py-1 rounded relative">
                                        <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                            Ngày sinh
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flexitems-center">
                                            <InputMask
                                                mask="99/99/9999"
                                                placeholder="DD/MM/YYYY"
                                                maskChar="_"
                                                onChange={(e) => {
                                                    const listChild = listPassenger.listChild;
                                                    
                                                    // Lấy giá trị từ ô nhập
                                                    const dob = e.target.value;
                                                    
                                                    // Tách ngày, tháng và năm
                                                    const [day, month, year] = dob.split('/');

                                                    // Hoán đổi vị trí ngày và tháng (MM/DD/YYYY)
                                                    const newDob = `${month}/${day}/${year}`;

                                                    listChild[index] = {
                                                        ...listChild[index],
                                                        dob: newDob,
                                                    };
                                                    setListPassenger({ ...listPassenger, listChild });
                                                }}
                                            >
                                                {(inputProps) => (
                                                    <input
                                                        {...inputProps}
                                                        type="text"
                                                        name="dob"
                                                        className="w-48 p-2 outline-none"
                                                    />
                                                )}
                                            </InputMask>
                                        </div>
                                        <p
                                            className={`text-red-500 thong-tin-tre-em-ngay-sinh-${index} text-sm absolute top-2 right-2`}
                                        ></p>
                                    </div>
                                    <div className="col-span-6 xl:col-span-3 flex flex-col justify-between">
                                        <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                            Giới tính
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div className={`flex gap-10 items-center thong-tin-tre-em-gioi-tinh-${index}`}>
                                            <label>
                                                <input
                                                    className="mr-2"
                                                    type="radio"
                                                    value="nam"
                                                    name={`gioi-tinh-tre-em-${index}`}
                                                    onChange={(e) => {
                                                        const listChild = listPassenger.listChild;
                                                        listChild[index] = {
                                                            ...listChild[index],
                                                            gender: e.target.value,
                                                        };
                                                        setListPassenger({ ...listPassenger, listChild });
                                                    }}
                                                />
                                                Nam
                                            </label>
                                            <label>
                                                <input
                                                    className="mr-2"
                                                    type="radio"
                                                    value="nu"
                                                    name={`gioi-tinh-tre-em-${index}`}
                                                    onChange={(e) => {
                                                        const listChild = listPassenger.listChild;
                                                        listChild[index] = {
                                                            ...listChild[index],
                                                            gender: e.target.value,
                                                        };
                                                        setListPassenger({ ...listPassenger, listChild });
                                                    }}
                                                />
                                                Nữ
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {listPassenger.listInfant?.map((item, index) => {
                        return (
                            <div className="mt-6 border border-gray-300 rounded p-2" key={index} id={`em-be-${index}`}>
                                <p className="text-sm text-sky-400 font-medium mb-2">
                                    <i>
                                        Em bé {index + 1} <span>{'(<2 tuổi)'}</span>
                                    </i>
                                </p>
                                <div className="grid grid-cols-6 gap-6 sm:gap-8">
                                    <div className="col-span-6 sm:col-span-3 w-full h-fit border px-2 py-1 rounded relative">
                                        <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                            Họ
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={listPassenger.listInfant[index].lastName}
                                            className="w-full outline-none"
                                            type="text"
                                            onChange={(e) => {
                                                const listInfant = listPassenger.listInfant;
                                                const updatedLastName = e.target.value
                                                    .normalize('NFD')
                                                    .replace(/[\u0300-\u036f]/g, '')
                                                    .replace(/Đ/g, 'D')
                                                    .replace(/đ/g, 'd')
                                                    .toUpperCase();
                                                listInfant[index] = {
                                                    ...listInfant[index],
                                                    lastName: updatedLastName,
                                                };
                                                setListPassenger({ ...listPassenger, listInfant });
                                            }}
                                        />
                                        <p
                                            className={`text-red-500 thong-tin-em-be-ho-${index} text-sm absolute top-2 right-2`}
                                        ></p>
                                    </div>
                                    <div className="col-span-6 sm:col-span-3 w-full h-fit border px-2 py-1 rounded relative">
                                        <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                            Tên đệm và tên
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={listPassenger.listInfant[index].firstName}
                                            className="w-full outline-none"
                                            type="text"
                                            onChange={(e) => {
                                                const listInfant = listPassenger.listInfant;
                                                const updatedFirstName = e.target.value
                                                    .normalize('NFD')
                                                    .replace(/[\u0300-\u036f]/g, '')
                                                    .replace(/Đ/g, 'D')
                                                    .replace(/đ/g, 'd')
                                                    .toUpperCase();
                                                listInfant[index] = {
                                                    ...listInfant[index],
                                                    firstName: updatedFirstName,
                                                };
                                                setListPassenger({ ...listPassenger, listInfant });
                                            }}
                                        />
                                        <p
                                            className={`text-red-500 thong-tin-em-be-ten-dem-ten-${index} text-sm absolute top-2 right-2`}
                                        ></p>
                                    </div>
                                    <div className="col-span-6 xl:col-span-3 w-full h-fit border px-2 py-1 rounded relative">
                                        <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                            Ngày sinh
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex space-x-2 items-center">
                                            <InputMask
                                                mask="99/99/9999"
                                                placeholder="DD/MM/YYYY"
                                                maskChar="_"
                                                onChange={(e) => {
                                                    const listInfant = listPassenger.listInfant;
                                                    
                                                    // Lấy giá trị từ ô nhập
                                                    const dob = e.target.value;
                                                    
                                                    // Tách ngày, tháng và năm
                                                    const [day, month, year] = dob.split('/');

                                                    // Hoán đổi vị trí ngày và tháng (MM/DD/YYYY)
                                                    const newDob = `${month}/${day}/${year}`;

                                                    listInfant[index] = {
                                                        ...listInfant[index],
                                                        dob: newDob,
                                                    };
                                                    setListPassenger({ ...listPassenger, listInfant });
                                                }}
                                            >
                                                {(inputProps) => (
                                                    <input
                                                        {...inputProps}
                                                        type="text"
                                                        name="dob"
                                                        className="w-48 p-2 outline-none"
                                                    />
                                                )}
                                            </InputMask>
                                        </div>
                                        <p
                                            className={`text-red-500 thong-tin-em-be-ngay-sinh-${index} text-sm absolute top-2 right-2`}
                                        ></p>
                                    </div>
                                    <div className="col-span-6 xl:col-span-3 flex flex-col justify-between">
                                        <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                            Giới tính
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div className={`flex gap-10 items-center thong-tin-em-be-gioi-tinh-${index}`}>
                                            <label>
                                                <input
                                                    className="mr-2"
                                                    type="radio"
                                                    value="nam"
                                                    name={`gioi-tinh-em-be-${index}`}
                                                    onChange={(e) => {
                                                        const listInfant = listPassenger.listInfant;
                                                        listInfant[index] = {
                                                            ...listInfant[index],
                                                            gender: e.target.value,
                                                        };
                                                        setListPassenger({ ...listPassenger, listInfant });
                                                    }}
                                                />
                                                Nam
                                            </label>
                                            <label>
                                                <input
                                                    className="mr-2"
                                                    type="radio"
                                                    value="nu"
                                                    name={`gioi-tinh-em-be-${index}`}
                                                    onChange={(e) => {
                                                        const listInfant = listPassenger.listInfant;
                                                        listInfant[index] = {
                                                            ...listInfant[index],
                                                            gender: e.target.value,
                                                        };
                                                        setListPassenger({ ...listPassenger, listInfant });
                                                    }}
                                                />
                                                Nữ
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full border px-2 mt-2 py-1 rounded relative">
                                    <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                        Chọn người lớn đi cùng
                                    </label>
                                    <select
                                        name=""
                                        id={`ngay-sinh-em-be-${index}`}
                                        className="outline-none w-full"
                                        value={listPassenger.listInfant[index].adultFollow}
                                        onChange={(e) => {
                                            const listInfant = listPassenger.listInfant;
                                            listInfant[index] = {
                                                ...listInfant[index],
                                                adultFollow: parseInt(e.target.value),
                                            };
                                            setListPassenger({ ...listPassenger, listInfant });
                                        }}
                                    >
                                        {listPassenger.listAdult?.map((item, i) => {
                                            return (
                                                <option value={i} key={i}>
                                                    Nguời lớn {i + 1}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <p
                                        className={`text-red-500 thong-tin-em-be-nguoi-lon-di-cung-${index} text-sm absolute top-2 right-2`}
                                    ></p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}