'use client';

import SelectBaggagePopup from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/popup/popup_chon_goi_hanh_ly';
import SelectMealPopup from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/popup/popup_chon_suat_an';
import SelectSeatPopup from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/popup/popup_chon_cho_ngoi';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAncillaryOptionsReturn } from '@/services/ancillaryOptions/functions';
import { getSeatSelectionOptionsReturn } from '@/services/seatSelection/functions';
import { getReservationByKey, postEmailingItineraries } from '@/services/reservations/functions';
import { getCompany } from '@/services/companies/functions';

export default function ListService({ reservationKey, setRefetch, refetch, moreAction }) {
    const router = useRouter();
    const [companyKey, setCompanyKey] = useState(null);
    const [body, setBody] = useState(null);
    const [openPopupSelectBaggagePack, setOpenPopupSelectBaggagePack] = useState(false);
    const [openPopupSelectMealPack, setOpenPopupSelectMealPack] = useState(false);
    const [openPopupSelectSeatOption, setOpenPopupSelectSeatOption] = useState(false);
    const [listAllJourneySeatOptions, setListAllJourneySeatOptions] = useState(null);
    const [listAllJourneyBaggageOptions, setListAllJourneyBaggageOptions] = useState(null);
    const [listAllJourneyMealOptions, setListAllJourneyMealOptions] = useState(null);
    const [baggageConfirm, setBaggageConfirm] = useState([]);
    const [mealConfirm, setMealConfirm] = useState([]);
    const [baggagePrice, setBaggagePrice] = useState(0);
    const [mealPrice, setMealPrice] = useState(0);
    const [seatPrice, setSeatPrice] = useState(0);
    const [reservationByKey, setReservationByKey] = useState(null);
    const [sendEmailResult, setSendEmailResult] = useState(null);
    const currency = typeof window !== 'undefined' ? sessionStorage.getItem('currencySearchParam') ?? 'VND' : 'VND';
    const exchangeRate = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('exchangeRate')) ?? 1 : 1;

    useEffect(() => {
        handleGetCompany()
        handleGetReservationByKey(reservationKey);
    }, [reservationKey]);

    useEffect(() => {
        handleGetReservationByKey(reservationKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetch]);

    useEffect(() => {
        setBody(reservationByKey);
    }, [reservationByKey]);

    useEffect(() => {
        if (body) {
            const getSeatOptions = async (bookingKey) => {
                const seatOptions = await getSeatSelectionOptionsReturn(bookingKey);
                return seatOptions;
            };

            const getAncilarryOptions = async (bookingKey) => {
                const ancillaryOptions = await getAncillaryOptionsReturn(bookingKey);
                return ancillaryOptions;
            };

            const fetchSeatOptions = async (body) => {
                if (!listAllJourneySeatOptions && body) {
                    const tempListPromises = body.journeys.map((element) =>
                        getSeatOptions(element.passengerJourneyDetails[0].bookingKey),
                    );
                    const tempList = await Promise.all(tempListPromises);
                    setListAllJourneySeatOptions(tempList);
                }
                if (!listAllJourneyBaggageOptions && !listAllJourneyMealOptions && body) {
                    const tempListPromises = body.journeys.map((element) =>
                        getAncilarryOptions(element.passengerJourneyDetails[0].bookingKey),
                    );
                    const tempList = await Promise.all(tempListPromises);
                    let listBaggage = tempList.map((item) => {
                        if (item) {
                            return item[0];
                        }
                    });
                    let listMeal = tempList.map((item) => {
                        if (item) {
                            return item[1];
                        }
                    });
                    setListAllJourneyBaggageOptions(listBaggage);
                    setListAllJourneyMealOptions(listMeal);
                    console.log('fetch');
                }
            };

            if (!listAllJourneySeatOptions && !listAllJourneyBaggageOptions && !listAllJourneyMealOptions) {
                fetchSeatOptions(body);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [body]);

    useEffect(() => {
        if (baggageConfirm.length > 0 || mealConfirm.length > 0) {
            setBody({ ...body, ancillaryPurchases: [...baggageConfirm, ...mealConfirm] });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baggageConfirm, mealConfirm]);

    const sendItineraryEmail = () => {
        setSendEmailResult(null);
        postEmailingItineraries(
            reservationByKey.key,
            reservationByKey.bookingInformation.contactInformation.email,
            setSendEmailResult,
            false,
        );
    };

    const handleGetReservationByKey = async (reservationKey) => {
        const data = await getReservationByKey(reservationKey)
        setReservationByKey(data)
    }

    const handleGetCompany = async () => {
        const data = await getCompany()
        setCompanyKey(data.key)
    }

    return (
        <div className="flex items-start">
            <div className={`flex-grow p-4 h-fit rounded-md bg-white`}>
                <h1 className="font-bold text-md">
                    <i>Mua thêm dịch vụ</i>
                </h1>
                <p className="text-xs text-red-400">
                    QUAN TRỌNG: Khi thay đổi một số dịch vụ đã mua trước đó, số tiền dư ra sẽ không thể hoàn trả!
                </p>
                <div className="">
                    <div className="mt-4 p-2 border-2 hover:border-blue-400 bg-opacity-50 rounded-md ">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-start items-center">
                                <div className="w-20 h-20 bg-[url('/baggage.jpg')] bg-cover rounded-sm"></div>
                                <span className="ml-2">Chọn gói hành lý</span>
                            </div>
                            <div
                                className={`${
                                    baggagePrice > 0 ? 'block' : 'hidden'
                                } text-3xl font-bold text-orange-500`}
                            >
                                {baggagePrice.toLocaleString()}đ
                            </div>
                            <button
                                onClick={() => setOpenPopupSelectBaggagePack(true)}
                                className="rounded-full h-fit w-fit bg-blue-400 hover:bg-blue-300 text-white border p-2 mr-4"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                            </button>
                        </div>
                        <SelectBaggagePopup
                            openPopupSelectBaggagePack={openPopupSelectBaggagePack}
                            setOpenPopupSelectBaggagePack={setOpenPopupSelectBaggagePack}
                            body={body}
                            setRefetch={setRefetch}
                            refetch={refetch}
                            companyKey={companyKey}
                            listAllJourneyBaggageOptions={listAllJourneyBaggageOptions}
                            currency={currency}
                            exchangeRate={exchangeRate}
                        />
                    </div>
                    <div className="mt-4 p-2 border-2 hover:border-blue-400 bg-opacity-50 rounded-md ">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-start items-center">
                                <div className="w-20 h-20 bg-[url('/meal.jpg')] bg-cover rounded-sm"></div>
                                <span className="ml-2">Chọn suất ăn</span>
                            </div>
                            <div className={`${mealPrice > 0 ? 'block' : 'hidden'} text-3xl font-bold text-orange-500`}>
                                {mealPrice.toLocaleString()}đ
                            </div>
                            <button
                                onClick={() => setOpenPopupSelectMealPack(true)}
                                className="rounded-full h-fit w-fit bg-blue-400 hover:bg-blue-300 text-white border p-2 mr-4"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                            </button>
                        </div>
                        <SelectMealPopup
                            openPopupSelectMealPack={openPopupSelectMealPack}
                            setOpenPopupSelectMealPack={setOpenPopupSelectMealPack}
                            body={body}
                            setRefetch={setRefetch}
                            refetch={refetch}
                            companyKey={companyKey}
                            listAllJourneyMealOptions={listAllJourneyMealOptions}
                            currency={currency}
                            exchangeRate={exchangeRate}
                        />
                    </div>
                    <div className="mt-4 p-2 border-2 hover:border-blue-400 bg-opacity-50 rounded-md ">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-start items-center">
                                <div className="w-20 h-20  bg-[url('/seat.jpg')] bg-cover rounded-sm"></div>
                                <span className="ml-2">Chọn chỗ ngồi</span>
                            </div>
                            <button
                                onClick={() => setOpenPopupSelectSeatOption(true)}
                                className="rounded-full h-fit w-fit bg-blue-400 hover:bg-blue-300 text-white border p-2 mr-4"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                            </button>
                        </div>
                        <SelectSeatPopup
                            openPopupSelectSeatOption={openPopupSelectSeatOption}
                            setOpenPopupSelectSeatOption={setOpenPopupSelectSeatOption}
                            body={body}
                            setRefetch={setRefetch}
                            refetch={refetch}
                            companyKey={companyKey}
                            listAllJourneySeatOptions={listAllJourneySeatOptions}
                            currency={currency}
                            exchangeRate={exchangeRate}
                        />
                    </div>
                </div>
            </div>
            {moreAction ? (
                <div className="bg-white w-[320px] ml-4 p-4 pt-0 rounded">
                    <button
                        onClick={sendItineraryEmail}
                        className="py-2 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-bold w-full mt-4"
                    >
                        Gửi mail hành trình
                    </button>
                    {/* <button
                        onClick={() => {
                            router.replace('/quan-ly-dat-cho/chi-tiet-dat-cho/them-dich-vu');
                        }}
                        className="py-2 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-bold w-full mt-4"
                    >
                        Thêm lựa chọn hành lý, suất ăn, chỗ ngồi
                    </button> */}
                    <button
                        onClick={() => {
                            router.replace('/');
                        }}
                        className="py-2 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-bold w-full mt-4"
                    >
                        Đặt thêm chuyến bay
                    </button>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}