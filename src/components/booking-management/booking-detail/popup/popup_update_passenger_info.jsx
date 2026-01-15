'use client';

import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import Vietnamese from 'flatpickr/dist/l10n/vn';
import Change from '@/components/booking-management/booking-detail/update-passengers-info/change-info';
import Loading from '@/components/loading';
import { useState, useEffect } from 'react';
import { getReservationPassengers } from '@/services/reservations/functions';
import { useRouter, usePathname } from 'next/navigation';

export default function UpdatePassengerInfomationPopup({
    changePassengerInfoPopup,
    setChangePassengerInfoPopup,
    reservationKey,
    reservationByKey,
    companyKey,
    passengerSelect,
    setPassengerSelect,
}) {
    const [passengerInfomation, setPassengerInfomation] = useState([]);
    const [listChange, setListChange] = useState([]);
    const [listAdult, setListAdult] = useState([]);
    const [listChild, setListChild] = useState([]);
    const [changeIndex, setChangeIndex] = useState(0);
    const router = useRouter();
    const pathName = usePathname();

    const changeGender = (e, list, setList, index) => {
        if (list[index].reservationProfile.gender !== e.target.value) {
            const newList = [...list];
            newList[index].reservationProfile = {
                ...newList[index].reservationProfile,
                gender: e.target.value,
            };
            setList(newList);
        }
    };

    const changeFirstName = (e, list, setList, index) => {
        if (list[index].reservationProfile.firstName !== e.target.value) {
            const newList = [...list];
            newList[index].reservationProfile = {
                ...newList[index].reservationProfile,
                firstName: removeVietnameseDiacritics(e.target.value.toUpperCase()),
            };
            setList(newList);
        }
    };

    const changeLastName = (e, list, setList, index) => {
        if (list[index].reservationProfile.lastName !== e.target.value) {
            const newList = [...list];
            newList[index].reservationProfile = {
                ...newList[index].reservationProfile,
                lastName: removeVietnameseDiacritics(e.target.value.toUpperCase()),
            };
            setList(newList);
        }
    };

    const changeGenderInfant = (e, list, setList, index) => {
        if (list[index].infants[0].reservationProfile.gender !== e.target.value) {
            const newList = [...list];
            newList[index].infants[0].reservationProfile = {
                ...newList[index].infants[0].reservationProfile,
                gender: e.target.value,
            };
            setList(newList);
        }
    };

    const changeFirstNameInfant = (e, list, setList, index) => {
        if (list[index].infants[0].reservationProfile.firstName !== e.target.value) {
            const newList = [...list];
            newList[index].infants[0].reservationProfile = {
                ...newList[index].infants[0].reservationProfile,
                firstName: removeVietnameseDiacritics(e.target.value.toUpperCase()),
            };
            setList(newList);
        }
    };

    const changeLastNameInfant = (e, list, setList, index) => {
        if (list[index].infants[0].reservationProfile.lastName !== e.target.value) {
            const newList = [...list];
            newList[index].infants[0].reservationProfile = {
                ...newList[index].infants[0].reservationProfile,
                lastName: removeVietnameseDiacritics(e.target.value.toUpperCase()),
            };
            setList(newList);
        }
    };

    const checkForChanges = (passengerInfomation, listAdult, listChild) => {
        const listChangePassenger = [];
        JSON.parse(passengerInfomation).forEach((element) => {
            if (element.fareApplicability.adult) {
                const elementKey = element.key;
                for (let i = 0; i < listAdult.length; i++) {
                    if (listAdult[i].key == elementKey) {
                        if (JSON.stringify(listAdult[i]) !== JSON.stringify(element)) {
                            listChangePassenger.push(listAdult[i]);
                        }
                        break;
                    }
                }
            } else {
                const elementKey = element.key;
                for (let i = 0; i < listChild.length; i++) {
                    if (listChild[i].key == elementKey) {
                        if (JSON.stringify(listChild[i]) !== JSON.stringify(element)) {
                            listChangePassenger.push(listChild[i]);
                        }
                        break;
                    }
                }
            }
        });
        return listChangePassenger;
    };

    const checkForChangesPassenger = async () => {
        const listChangePassenger = checkForChanges(passengerInfomation, listAdult, listChild);
        setListChange(listChangePassenger);
        setChangeIndex(0);
    };

    const handleGetReservationPassengers = async (reservationKey, passengerSelect) => {
        const data = await getReservationPassengers(reservationKey, passengerSelect)
        setPassengerInfomation(data)
    }

    const reload = () => {
        location.reload();
    };

    const removeVietnameseDiacritics = (str) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/Đ/g, 'D')
            .replace(/đ/g, 'd')
            .toUpperCase();
    };

    useEffect(() => {
        if (passengerInfomation && typeof passengerInfomation == 'string') {
            const tempListAdult = [];
            const tempListChild = [];
            JSON.parse(passengerInfomation).map((item, index) => {
                if (item.fareApplicability.adult) {
                    tempListAdult.push(item);
                } else {
                    tempListChild.push(item);
                }
            });
            setListAdult(tempListAdult);
            setListChild(tempListChild);
        }
    }, [passengerInfomation]);

    useEffect(() => {
        if (passengerSelect) {
            if (reservationKey) handleGetReservationPassengers(reservationKey, passengerSelect);
        }
    }, [reservationKey, passengerSelect]);

    useEffect(() => {
        if (changeIndex > 0) {
            reload();
        }
    }, [changeIndex]);

    useEffect(() => {
        listAdult.forEach((element, index) => {
            if (element.infants[0]) {
                const displayObject = {
                    enableTime: false,
                    dateFormat: 'Y-m-d',
                    altInput: true,
                    minDate: new Date().fp_incr(-365 * 2),
                    maxDate: 'today',
                    locale: Vietnamese.vn,
                    onChange: function (dateStr) {
                        let selectedDate = new Date(dateStr);
                        selectedDate.setDate(selectedDate.getDate() + 1);
                        if (new Date(element.infants[0].reservationProfile.birthDate) !== selectedDate) {
                            const newList = [...listAdult];
                            newList[index].infants[0].reservationProfile = {
                                ...newList[index].infants[0].reservationProfile,
                                birthDate: selectedDate.toISOString().split('T')[0],
                            };
                            setListAdult(newList);
                        }
                    },
                };
                const input = flatpickr(`#ngay-sinh-em-be-${index}`, displayObject);
                document.querySelector(`#ngay-sinh-em-be-${index}`).style.display = 'none';
            }
        });
    }, [listAdult]);

    return (
        <div
            className={`${
                changePassengerInfoPopup ? 'flex' : 'hidden'
            } h-screen w-screen bg-gray-700 bg-opacity-50 fixed z-20 top-0 right-0 flex justify-end`}
        >
            <div className="h-full p-8 bg-white overflow-auto">
                <div className="flex justify-between items-center pb-4 border-b">
                    <button
                        onClick={() => {
                            setChangePassengerInfoPopup(false);
                            setPassengerSelect(null);
                            setPassengerInfomation(null);
                        }}
                        className="bg-white p-2 rounded-md hover:bg-gray-100 border"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h4 className="font-bold">Cập nhật thông tin hành khách</h4>
                </div>
                {passengerInfomation ? (
                    <div className="mt-4 w-[600px]">
                        {listAdult.map((item, index) => {
                            return (
                                <div key={index}>
                                    <div className="mb-2">
                                        <p className="text-sm text-sky-400 font-medium mb-2">
                                            <i>Hành khách {index + 1}</i>
                                        </p>
                                        <div className="grid grid-cols-4 gap-8">
                                            <div className="col-span-3 w-full border px-2 py-1 rounded">
                                                <div className="grid grid-cols-2">
                                                    <div className="col-span-1">
                                                        <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                            Họ:
                                                        </label>
                                                        <input
                                                            value={item.reservationProfile.firstName}
                                                            onChange={(e) =>
                                                                changeFirstName(e, listAdult, setListAdult, index)
                                                            }
                                                            className="w-full outline-none"
                                                            type="text"
                                                        />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                            Tên đệm và tên:
                                                        </label>
                                                        <input
                                                            value={item.reservationProfile.lastName}
                                                            onChange={(e) =>
                                                                changeLastName(e, listAdult, setListAdult, index)
                                                            }
                                                            className="w-full outline-none"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-1 flex flex-col justify-between">
                                                <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                    Giới tính
                                                </label>
                                                <div className=" flex justify-between items-center">
                                                    <label>
                                                        <input
                                                            checked={
                                                                item.reservationProfile.gender.toUpperCase() == 'MALE'
                                                            }
                                                            onChange={(e) =>
                                                                changeGender(e, listAdult, setListAdult, index)
                                                            }
                                                            className="mr-2"
                                                            type="radio"
                                                            value="Male"
                                                            name={`gioi-tinh-hanh-khach-${index + 1}`}
                                                        />
                                                        Nam
                                                    </label>
                                                    <label className="ml-2">
                                                        <input
                                                            checked={
                                                                item.reservationProfile.gender.toUpperCase() == 'FEMALE'
                                                            }
                                                            onChange={(e) =>
                                                                changeGender(e, listAdult, setListAdult, index)
                                                            }
                                                            className="mr-2"
                                                            type="radio"
                                                            value="Female"
                                                            name={`gioi-tinh-hanh-khach-${index + 1}`}
                                                        />
                                                        Nữ
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {item.infants[0] ? (
                                        <div className="mb-6">
                                            <p>
                                                <i>Đi cùng</i>
                                            </p>
                                            <p className="text-sm text-sky-400 font-medium mb-2">
                                                <i>
                                                    Em bé 1 <span>{'(<2 tuổi)'}</span>
                                                </i>
                                            </p>
                                            <div className="grid grid-cols-4 gap-8">
                                                <div className="col-span-3 grid grid-cols-8 gap-4">
                                                    <div className="col-span-5 grid grid-cols-2 border rounded px-2 py-1">
                                                        <div className="col-span-1">
                                                            <label
                                                                htmlFor=""
                                                                className="text-sm text-gray-500 font-medium"
                                                            >
                                                                Họ:
                                                            </label>
                                                            <input
                                                                value={item.infants[0].reservationProfile.firstName}
                                                                onChange={(e) =>
                                                                    changeFirstNameInfant(
                                                                        e,
                                                                        listAdult,
                                                                        setListAdult,
                                                                        index,
                                                                    )
                                                                }
                                                                className="w-full outline-none"
                                                                type="text"
                                                            />
                                                        </div>
                                                        <div className="col-span-1">
                                                            <label
                                                                htmlFor=""
                                                                className="text-sm text-gray-500 font-medium"
                                                            >
                                                                Tên:
                                                            </label>
                                                            <input
                                                                value={item.infants[0].reservationProfile.lastName}
                                                                onChange={(e) =>
                                                                    changeLastNameInfant(
                                                                        e,
                                                                        listAdult,
                                                                        setListAdult,
                                                                        index,
                                                                    )
                                                                }
                                                                className="w-full outline-none"
                                                                type="text"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-span-3 w-full border px-2 py-1 rounded">
                                                        <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                            Ngày sinh
                                                        </label>
                                                        <input
                                                            id={`ngay-sinh-em-be-${index}`}
                                                            value={item.infants[0].reservationProfile.birthDate}
                                                            className="w-full outline-none"
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-span-1 flex flex-col justify-between">
                                                    <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                        Giới tính
                                                    </label>
                                                    <div className=" flex justify-between items-center">
                                                        <label>
                                                            <input
                                                                checked={
                                                                    item.infants[0].reservationProfile.gender.toUpperCase() ==
                                                                    'MALE'
                                                                }
                                                                onChange={(e) =>
                                                                    changeGenderInfant(
                                                                        e,
                                                                        listAdult,
                                                                        setListAdult,
                                                                        index,
                                                                    )
                                                                }
                                                                className="mr-2"
                                                                type="radio"
                                                                value="Male"
                                                                name={`gioi-tinh-em-be-${index}`}
                                                            />
                                                            Nam
                                                        </label>
                                                        <label>
                                                            <input
                                                                checked={
                                                                    item.infants[0].reservationProfile.gender.toUpperCase() ==
                                                                    'FEMALE'
                                                                }
                                                                onChange={(e) =>
                                                                    changeGenderInfant(
                                                                        e,
                                                                        listAdult,
                                                                        setListAdult,
                                                                        index,
                                                                    )
                                                                }
                                                                className="mr-2"
                                                                type="radio"
                                                                value="Female"
                                                                name={`gioi-tinh-em-be-${index}`}
                                                            />
                                                            Nữ
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            );
                        })}
                        {listChild.map((item, index) => {
                            return (
                                <div key={index} className="mb-2">
                                    <p className="text-sm text-sky-400 font-medium mb-2">
                                        <i>
                                            Trẻ em 1 <span>(2-11 tuổi)</span>
                                        </i>
                                    </p>
                                    <div className="grid grid-cols-4 gap-8">
                                        <div className="col-span-3 w-full border px-2 py-1 rounded">
                                            <div className="grid grid-cols-2">
                                                <div className="col-span-1">
                                                    <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                        Họ:
                                                    </label>
                                                    <input
                                                        value={item.reservationProfile.firstName}
                                                        onChange={(e) =>
                                                            changeFirstName(e, listChild, setListChild, index)
                                                        }
                                                        className="w-full outline-none"
                                                        type="text"
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                        Tên:
                                                    </label>
                                                    <input
                                                        value={item.reservationProfile.lastName}
                                                        onChange={(e) =>
                                                            changeLastName(e, listChild, setListChild, index)
                                                        }
                                                        className="w-full outline-none"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1 flex flex-col justify-between">
                                            <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                Giới tính
                                            </label>
                                            <div className=" flex justify-between items-center">
                                                <label>
                                                    <input
                                                        checked={item.reservationProfile.gender.toUpperCase() == 'MALE'}
                                                        onChange={(e) =>
                                                            changeGender(e, listChild, setListChild, index)
                                                        }
                                                        className="mr-2"
                                                        type="radio"
                                                        value="Male"
                                                        name={`gioi-tinh-tre-em-${index + 1}`}
                                                    />
                                                    Nam
                                                </label>
                                                <label className="ml-2">
                                                    <input
                                                        checked={
                                                            item.reservationProfile.gender.toUpperCase() == 'FEMALE'
                                                        }
                                                        onChange={(e) =>
                                                            changeGender(e, listChild, setListChild, index)
                                                        }
                                                        className="mr-2"
                                                        type="radio"
                                                        value="Female"
                                                        name={`gioi-tinh-tre-em-${index + 1}`}
                                                    />
                                                    Nữ
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="mt-8">
                            <button
                                onClick={() => checkForChangesPassenger()}
                                className="w-full py-2 border-2 rounded-md border-blue-400 text-white bg-blue-400 hover:bg-white hover:text-blue-400 font-medium"
                            >
                                Tiếp theo
                            </button>
                        </div>

                        <div className="mt-10">
                            {listChange.map((changeItem, index) => {
                                const list = JSON.parse(passengerInfomation);
                                for (let i = 0; i < list.length; i++) {
                                    if (changeItem.key == list[i].key) {
                                        return (
                                            <div key={index}>
                                                <Change
                                                    changeItem={changeItem}
                                                    notChangeItem={list[i]}
                                                    index={index}
                                                    changeIndex={changeIndex}
                                                    setChangeIndex={setChangeIndex}
                                                    reservationKey={reservationKey}
                                                    companyKey={companyKey}
                                                    reservationByKey={reservationByKey}
                                                />
                                            </div>
                                        );
                                    }
                                }
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 w-[600px]">
                        <Loading />
                    </div>
                )}
            </div>
        </div>
    );
}