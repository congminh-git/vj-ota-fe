'use client';

import Breadcrumb from '@/components/breadcrumb';
import UpdatePassengerInfomationPopup from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/popup/popup_cap_nhat_thong_tin_hanh_khach';
import UpdateBookingInfomationPopup from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/popup/popup_cap_nhat_thong_tin_lien_he';
import SearchFlightPopup from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/popup/popup_tim_chuyen_form';
import SplitPassengersPopup from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/popup/popup_tach_hanh_khach';
import FlightInfomation from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/thong_tin_chuyen_bay';
import PassengerInfomation from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/thong_tin_hanh_khach';
import ContactInfomation from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/thong_tin_lien_he';
import ReservationInformation from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/thong_tin_ve';
import {
    getReservationByLocator,
    getReservationByKey,
    postReservationPaymentTransaction,
    postEmailingItineraries,
} from '@/services/reservations/functions';
import { putQuotationPaymentTransaction } from '@/services/quotations/functions';
import { getCompany } from '@/services/companies/functions';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddPassengerPopup from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/popup/popup_them_hanh_khach';
import { toast } from 'react-hot-toast';
import { getCurrencySymbol } from '../../../lib/parseCurrency';

export default function ChiTietDatCho() {
    const today = new Date();
    const router = useRouter();
    const reservationKey = typeof window !== 'undefined' ? sessionStorage.getItem('reservationKey') : null;
    const [reservationByLocator, setReservationByLocator] = useState(null);
    const [reservationByKey, setReservationByKey] = useState(null);
    const [quotations, setQuotations] = useState(null);
    const [sendEmailResult, setSendEmailResult] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [amountPaid, setAmountPaid] = useState(0);
    const [debt, setDebt] = useState(0);
    const [companyKey, setCompanyKey] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState({ identifier: null, description: null });
    const [passengerSelect, setPassengerSelect] = useState(null);
    const [searchFlightPopup, setSearchFlightPopup] = useState(false);
    const [changePassengerInfoPopup, setChangePassengerInfoPopup] = useState(false);
    const [addPassengerInfoPopup, setAddPassengerInfoPopup] = useState(false);
    const [updateBookingInfomationPopup, setUpdateBookingInfomationPopup] = useState(false);
    const [openSplitPassengersPopup, setOpenSplitPassengersPopup] = useState(false);
    const [journeyUpdate, setJourneyUpdate] = useState(null);
    const [listPrice, setListPrice] = useState([]);
    const [listCharge, setListCharge] = useState([]);
    const [notCancelJourneys, setnotCancelJourneys] = useState(null);
    const currency = typeof window !== 'undefined' ? sessionStorage.getItem('currencySearchParam') ?? 'VND' : 'VND';
    const exchangeRate = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('exchangeRate')) ?? 1 : 1;
    const bookingSuccessResult =
    typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('bookingSuccessResult')) : null;
    const listBreadcrumb = [
        { title: 'Quản lý booking', uri: '/quan-ly-dat-cho' },
        { title: 'Quản lý đặt chỗ', uri: '/quan-ly-dat-cho' },
        { title: 'Chi tiết booking', uri: `/quan-ly-dat-cho/chi-tiet-dat-cho/?locator=${bookingSuccessResult?.locator}` },
    ];
    const [currencySymbol, setCurrencySymbol] = useState('');

    useEffect(() => {
        if (currency) {
            setCurrencySymbol(getCurrencySymbol(currency));
        }
    }, [currency]);

    useEffect(() => {
        if(reservationKey) {
            handleGetCompany()
            handleGetReservationByKey(reservationKey);
        } else {
            router.replace('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reservationKey]);

    useEffect(() => {
        if (quotations) {
            let tempTotal = 0;
            let tempPaid = 0;
            let tempDebt = 0;
            quotations?.paymentTransactions.forEach((element) => {
                tempTotal += element.currencyAmounts[0].totalAmount;
                if (element.receiptNumber) {
                    tempPaid += element.currencyAmounts[0].totalAmount;
                } else {
                    tempDebt += element.currencyAmounts[0].totalAmount;
                }
            });
            setTotalPrice(tempTotal);
            setAmountPaid(tempPaid);
            setDebt(tempDebt);
        }
    }, [quotations]);

    useEffect(() => {
        if (reservationByKey) {
                handlePutQuotationPaymentTransaction(
                    reservationKey,
                    reservationByKey,
                    companyKey,
                    currency,
                    exchangeRate,
                );
                handleGetReservationByLocator(reservationByKey.locator);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reservationByKey, companyKey, reservationKey]);

    const handleGetCompany = async () => {
        const data = await getCompany()
        setCompanyKey(data.key)
    }

    const handleGetReservationByKey = async (reservationKey) => {
        const data = await getReservationByKey(reservationKey)
        setReservationByKey(data)
    }

    const handleGetReservationByLocator = async (locator) => {
        const data = await getReservationByLocator(locator)
        setReservationByLocator(data)
    }

    const handlePutQuotationPaymentTransaction = async (
        reservationKey,
        reservationByKey,
        companyKey,
        currency,
        exchangeRate,
    ) => {
        const data = await putQuotationPaymentTransaction(
            reservationKey,
            reservationByKey,
            companyKey,
            currency,
            exchangeRate,
        );
        setQuotations(data);
    };

    const handlePay = async () => {
        if (paymentMethod) {
            postReservationPaymentTransaction(
                reservationByKey,
                companyKey,
                quotations,
                currency,
                exchangeRate,
            );
        } else {
            toast.error('Vui lòng chọn phương thức thanh toán');
        }
    };

    useEffect(() => {
        if (reservationByKey) {
            let tempListPrice = [];
            let tempListCharge = [];
            reservationByKey?.journeys.forEach((journey) => {
                if (!journey.reservationStatus.cancelled) {
                    let price = 0;
                    let list = [];
                    reservationByKey?.charges.map((charge) => {
                        if (charge.journey.key == journey.key) {
                            price += charge.currencyAmounts[0].totalAmount;
                            list.push(charge);
                        }
                    });
                    tempListPrice.push(price);
                    tempListCharge.push(list);
                }
            });
            setListPrice(tempListPrice);
            setListCharge(tempListCharge);
            setnotCancelJourneys(reservationByKey.journeys.filter((journey) => !journey.reservationStatus.cancelled));
        }
    }, [reservationByKey]);

    const sendItineraryEmail = () => {
        setSendEmailResult(null);
        postEmailingItineraries(
            reservationByKey.key,
            reservationByKey.bookingInformation.contactInformation.email,
            setSendEmailResult,
            false,
        );
    };

    return (
        <>
        {
            reservationKey
            ?
            <main className="min-h-screen bg-gray-100 p-4 pb-16 relative">
                <Breadcrumb listBreadcrumb={listBreadcrumb} />
                {reservationByKey ? (
                    <div>
                        <h1 className="text-lg">
                            <i className="font-medium">Chi tiết booking</i>
                        </h1>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <ReservationInformation reservation={reservationByKey} debt={debt} />
                            <ContactInfomation
                                reservation={reservationByKey}
                                setUpdateBookingInfomationPopup={setUpdateBookingInfomationPopup}
                            />
                            <div className="col-span-2">
                                <PassengerInfomation
                                    setChangePassengerInfoPopup={setChangePassengerInfoPopup}
                                    reservation={reservationByKey}
                                    setPassengerSelect={setPassengerSelect}
                                />
                            </div>
                            {notCancelJourneys?.map((element, index) => {
                                return (
                                    <div key={`journey-${index}`} className="col-span-2">
                                        <FlightInfomation
                                            legNumber={index}
                                            setSearchFlightPopup={setSearchFlightPopup}
                                            reservation={reservationByKey}
                                            journeyInfo={element}
                                            setJourneyUpdate={setJourneyUpdate}
                                            price={listPrice[index]}
                                            listCharge={listCharge[index]}
                                            reservationByKey={reservationByKey}
                                            companyKey={companyKey}
                                        />
                                    </div>
                                );
                            })}
                            <div className="col-span-2 font-medium">
                                <div className="border p-4 rounded-lg text-start h-full bg-white">
                                    <div className=" flex justify-between items-center">
                                        <div>
                                            <p>
                                                Tổng giá{' '}
                                                <i className="text-sm text-gray-400 ml-2">
                                                    (Đã bao gồm thuế, VAT và các chi phí khác)
                                                </i>
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <i>{totalPrice.toLocaleString()}</i> {currencySymbol}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-1 flex justify-between items-center">
                                        <div>
                                            <p>Đã thanh toán</p>
                                        </div>
                                        <div>
                                            <p>
                                                <i>{amountPaid.toLocaleString()}</i> {currencySymbol}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-1 flex justify-between items-center">
                                        <div>
                                            <p>Dư nợ</p>
                                        </div>
                                        <div>
                                            <p>
                                                <i>{debt.toLocaleString()}</i> {currencySymbol}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {debt == 0 ? (
                                <></>
                            ) : (
                                <div className="col-span-2 bg-white rounded-md border p-2">
                                    <h4>
                                        <i>Chọn phương thức thanh toán</i>
                                    </h4>
                                    <div className="flex items-center py-2">
                                        <label
                                            className="relative flex items-center p-3 rounded-full cursor-pointer"
                                            htmlFor="agencycredit"
                                        >
                                            <input
                                                name="type"
                                                type="radio"
                                                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                                id="agencycredit"
                                                onChange={() =>
                                                    setPaymentMethod({ identifier: 'AG', description: 'Agency Credit' })
                                                }
                                            />
                                            <span className="absolute text-blue-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3.5 w-3.5"
                                                    viewBox="0 0 16 16"
                                                    fill="currentColor"
                                                >
                                                    <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                                                </svg>
                                            </span>
                                        </label>
                                        <label
                                            className="mt-px font-light text-gray-700 cursor-pointer select-none"
                                            htmlFor="html"
                                        >
                                            Agency Credit
                                        </label>
                                    </div>
                                    {reservationByKey?.bookingInformation.hold ? (
                                        <button
                                            disabled={
                                                new Date(reservationByKey?.bookingInformation.hold.expiryTime) <= today ||
                                                !paymentMethod.identifier
                                                    ? true
                                                    : false
                                            }
                                            className={`${
                                                new Date(reservationByKey?.bookingInformation.hold.expiryTime) > today &&
                                                paymentMethod.identifier
                                                    ? ' border-blue-400 text-white bg-blue-400 hover:text-blue-400 hover:bg-white'
                                                    : ' border-gray-400 text-white bg-gray-400'
                                            } border-2 py-2 justify-center flex items-center font-semibold w-full rounded-md `}
                                            onClick={() => {
                                                handlePay();
                                            }}
                                        >
                                            {new Date(reservationByKey?.bookingInformation.hold.expiryTime) > today
                                                ? 'Thanh toán'
                                                : 'Đã hết hạn giữ chỗ'}
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-start w-full mt-4">
                            <button
                                onClick={sendItineraryEmail}
                                className="py-2 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-bold mr-4"
                            >
                                Gửi mail hành trình
                            </button>
                            <button
                                onClick={() => {
                                    router.replace('/quan-ly-dat-cho/chi-tiet-dat-cho/them-dich-vu');
                                }}
                                className="py-2 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-bold mr-4"
                            >
                                Thêm lựa chọn hành lý, suất ăn, chỗ ngồi
                            </button>
                            <button
                                onClick={() => setSearchFlightPopup('add')}
                                className="py-2 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-bold mr-4"
                            >
                                Thêm chặng bay
                            </button>
                            {/* <button
                                onClick={() => setAddPassengerInfoPopup('add')}
                                className="py-2 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-bold mr-4"
                            >
                                Thêm hành khách
                            </button> */}
                            {reservationByKey.passengers.length > 1 ? (
                                <button
                                    onClick={() => setOpenSplitPassengersPopup(true)}
                                    className="py-2 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-bold mr-4"
                                >
                                    Tách hành khách
                                </button>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="mt-20 flex justify-center">
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
                <SearchFlightPopup
                    searchFlightPopup={searchFlightPopup}
                    setSearchFlightPopup={setSearchFlightPopup}
                    journeyUpdate={journeyUpdate}
                    reservationByKey={reservationByKey}
                />
                <UpdatePassengerInfomationPopup
                    changePassengerInfoPopup={changePassengerInfoPopup}
                    setChangePassengerInfoPopup={setChangePassengerInfoPopup}
                    reservationKey={reservationKey}
                    reservationByKey={reservationByKey}
                    companyKey={companyKey}
                    passengerSelect={passengerSelect}
                    setPassengerSelect={setPassengerSelect}
                />
                <AddPassengerPopup
                    addPassengerInfoPopup={addPassengerInfoPopup}
                    setAddPassengerInfoPopup={setAddPassengerInfoPopup}
                    reservationKey={reservationKey}
                    reservationByKey={reservationByKey}
                    companyKey={companyKey}
                    currency={currency}
                    exchangeRate={exchangeRate}
                />
                <UpdateBookingInfomationPopup
                    updateBookingInfomationPopup={updateBookingInfomationPopup}
                    setUpdateBookingInfomationPopup={setUpdateBookingInfomationPopup}
                    reservationKey={reservationKey}
                    reservationByKey={reservationByKey}
                    companyKey={companyKey}
                />
                <SplitPassengersPopup
                    openSplitPassengersPopup={openSplitPassengersPopup}
                    setOpenSplitPassengersPopup={setOpenSplitPassengersPopup}
                    reservationByKey={reservationByKey}
                />
            </main>
            :
            <div className='min-h-screen'>
                <span>Loading...</span>
            </div>
        }
        </>
    );
}