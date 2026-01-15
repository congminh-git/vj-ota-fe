'use client';

import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import Vietnamese from 'flatpickr/dist/l10n/vn';
import ListPaymentMethod from '@/components/payment/listPaymentMethod';
import Loading from '@/components/loading';
import { useState, useEffect } from 'react';
import { formatTravelOptions, getTravelOptionsAddPassenger } from '@/services/travelOptions/functions';
import { parseNgayThang } from '@/components/select-flight/flight_item';
import { putQuotationReservationAddPassenger } from '@/services/quotations/functions';
import { postReservationAddPassenger } from '@/services/reservations/functions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getCurrencySymbol } from '@/lib/parseCurrency';
import { getCompany } from '@/services/companies/functions';

export default function AddPassengerPopup({
    addPassengerInfoPopup,
    setAddPassengerInfoPopup,
    reservationKey,
    reservationByKey,
    currency,
    exchangeRate,
}) {
    const [passengerFirstName, setPassengerFirstName] = useState(null);
    const [passengerLastName, setPassengerLastName] = useState(null);
    const [passengerGender, setPassengerGender] = useState(null);
    const [infantFirstName, setInfantFirstName] = useState(null);
    const [infantLastName, setInfantLastName] = useState(null);
    const [infantGender, setInfantGender] = useState(null);
    const [haveInfant, setHaveInfant] = useState(false);
    const [infantBirthDate, setInfantBirthDate] = useState(false);
    const [passengerType, setPassengerType] = useState('adult');
    const [travelOptions, setTravelOptions] = useState(null);
    const [listSelectedJourney, setListSelectedJourney] = useState([]);
    const [quotations, setQuotations] = useState(null);
    const [listJourneyKey, setListJourneyKey] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [price, setPrice] = useState(null);
    const [postBody, setPostBody] = useState(null);
    const [postResult, setPostResult] = useState(null);
    const [paymentAction, setPaymentAction] = useState(false);
    const [companyKey, setCompanyKey] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState('');
    // const router = useRouter();

    const handleSelectPassengerType = (event) => {
        setPassengerType(event.target.value);
    };

    const removeVietnameseDiacritics = (str) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/Đ/g, 'D')
            .replace(/đ/g, 'd')
            .toUpperCase();
    };

    // const handleSelectJourney = (event, index, listJourneyKey) => {
    //     if (event.target.checked) {
    //         const element = document.getElementById(`select-fare-option-${index}`);
    //         const bookingKey = element.value;
    //         setListSelectedJourney([
    //             ...listSelectedJourney,
    //             { journey: event.target.value, bookingKey: bookingKey, key: listJourneyKey[index] },
    //         ]);
    //     } else {
    //         const listStr = JSON.stringify(listSelectedJourney);
    //         const list = JSON.parse(listStr);
    //         let indexToRemove = listSelectedJourney.findIndex((item) => item.journey == event.target.value);
    //         list.splice(indexToRemove, 1);
    //         if (indexToRemove !== -1) {
    //             setListSelectedJourney(list);
    //         }
    //     }
    // };

    const handleChangeFareOption = (event, index, listJourneyKey) => {
        if (listSelectedJourney.findIndex((item) => item.journey == index) != -1) {
            const listStr = JSON.stringify(listSelectedJourney);
            const list = JSON.parse(listStr);
            list[index].bookingKey = event.target.value;
            list[index].key = listJourneyKey[index];
            setListSelectedJourney(list);
        }
    };

    const handleThanhToan = async () => {
        setPaymentAction(true);
        const response = await postReservationAddPassenger(reservationKey, postBody);
        setPostResult(response)
    };

    const handlePutQuotationReservationAddPassenger = async (body) => {
        const data = await putQuotationReservationAddPassenger(body);
        setQuotations(data);
    };

    const checkAdd = () => {
        let error = 0;
        if (!passengerFirstName || passengerFirstName.trim().length == 0) {
            document.querySelector('.passenger-firstname').innerHTML = 'Họ không được để trống';
            error += 1;
        } else {
            document.querySelector('.passenger-firstname').innerHTML = '';
        }

        if (!passengerLastName || passengerLastName.trim().length == 0) {
            document.querySelector('.passenger-lastname').innerHTML = 'Tên không được để trống';
            error += 1;
        } else {
            document.querySelector('.passenger-lastname').innerHTML = '';
        }

        if (!passengerGender || passengerGender.trim().length == 0) {
            document.querySelector('.passenger-gender').innerHTML = 'Chọn giới tính';
            error += 1;
        } else {
            document.querySelector('.passenger-gender').innerHTML = '';
        }

        if (document.querySelector('.infant-firstname')) {
            if ((haveInfant && !infantFirstName) || (haveInfant && infantFirstName.trim().length == 0)) {
                document.querySelector('.infant-firstname').innerHTML = 'Họ không được để trống';
                error += 1;
            } else {
                document.querySelector('.infant-firstname').innerHTML = '';
            }

            if ((haveInfant && !infantLastName) || (haveInfant && infantLastName.trim().length == 0)) {
                document.querySelector('.infant-lastname').innerHTML = 'Tên không được để trống';
                error += 1;
            } else {
                document.querySelector('.infant-lastname').innerHTML = '';
            }

            if ((haveInfant && !infantGender) || (haveInfant && infantGender.trim().length == 0)) {
                document.querySelector('.infant-gender').innerHTML = 'Chọn giới tính';
                error += 1;
            } else {
                document.querySelector('.infant-gender').innerHTML = '';
            }

            if ((haveInfant && !infantBirthDate) || (haveInfant && infantBirthDate.trim().length == 0)) {
                document.querySelector('.infant-birthdate').innerHTML = 'Hãy chọn ngày sinh';
                error += 1;
            } else {
                document.querySelector('.infant-birthdate').innerHTML = '';
            }
        }

        if (error == 0) {
            if (listSelectedJourney.length > 0) {
                const jsonPassenger = {
                    index: 1,
                    fareApplicability: {
                        adult: passengerType == 'adult',
                        child: passengerType == 'child',
                    },
                    reservationProfile: {
                        lastName: passengerLastName,
                        firstName: passengerFirstName,
                        middleName: '',
                        title: passengerGender == 'Male' ? 'Mr' : 'Ms',
                        gender: passengerGender,
                        destinationContactInformation: null,
                        loyaltyProgram: null,
                        preBoard: false,
                        status: {
                            active: true,
                            inactive: false,
                            denied: false,
                        },
                        reference1: '',
                        reference2: '',
                        notes: '',
                    },
                    weight: null,
                    notes: '',
                    infants: haveInfant
                        ? [
                              {
                                  index: 2,
                                  reservationProfile: {
                                      lastName: infantLastName,
                                      firstName: infantFirstName,
                                      title: 'Infant',
                                      gender: infantGender,
                                      address: {},
                                      birthDate: infantBirthDate,
                                  },
                              },
                          ]
                        : [],
                    journeys: listSelectedJourney.map((item, index) => {
                        return {
                            key: item.key,
                            passengerJourneyDetails: [
                                {
                                    passenger: {
                                        index: 1,
                                    },
                                    bookingKey: item.bookingKey,
                                    reservationStatus: {
                                        confirmed: true,
                                        waitlist: false,
                                        standby: false,
                                        cancelled: false,
                                        open: false,
                                        finalized: false,
                                        external: false,
                                    },
                                },
                            ],
                            reservationStatus: {
                                cancelled: false,
                                open: false,
                                finalized: false,
                                external: false,
                                disrupted: false,
                            },
                        };
                    }),
                };
                setPostBody(jsonPassenger);

                const reservationStr = JSON.stringify(reservationByKey);
                const quotationBody = JSON.parse(reservationStr);
                quotationBody.passengers.push(jsonPassenger);
                quotationBody.paymentTransactions = [];
                quotationBody.paymentTransactions.push({
                    paymentMethod: {
                        key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1¥CcncCLQNu3uhZGWzJkJUbmKK13BpWK¥9VaH1zFawFw==',
                        identifier: 'AG',
                        description: 'Agency Credit',
                    },
                    paymentMethodCriteria: {
                        account: {
                            company: {
                                key: companyKey,
                            },
                        },
                    },
                    currencyAmounts: [
                        {
                            totalAmount: 0,
                            currency: {
                                code: currency,
                                baseCurrency: true,
                            },
                            exchangeRate: exchangeRate,
                        },
                    ],
                    processingCurrencyAmounts: [
                        {
                            totalAmount: 0,
                            currency: {
                                code: currency,
                                baseCurrency: true,
                            },
                            exchangeRate: exchangeRate,
                        },
                    ],
                    payerDescription: null,
                    receiptNumber: null,
                    payments: null,
                    refundTransactions: null,
                    notes: null,
                });

                handlePutQuotationReservationAddPassenger(quotationBody);
            } else {
                toast.error('Chọn chặng bay muốn thêm hành khách');
            }
        }
    };

    const handleGetCompany = async () => {
        const data = await getCompany()
        setCompanyKey(data.key)
    }

    useEffect(() => {
        if (currency) {
            setCurrencySymbol(getCurrencySymbol(currency));
        }
    }, [currency]);

    useEffect(() => {
        if (document.querySelector('#ngay-sinh-em-be')) {
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
                    setInfantBirthDate(selectedDate.toISOString().split('T')[0]);
                },
            };
            const infantBirthDate = flatpickr(`#ngay-sinh-em-be`, displayObject);
            document.querySelector(`#ngay-sinh-em-be`).style.display = 'none';
        }
    }, [reservationByKey, haveInfant]);

    useEffect(() => {
        if(reservationKey && companyKey) {
            const getTravelOptions = async () => { 
                const result = await getTravelOptionsAddPassenger(reservationKey, companyKey);
                setTravelOptions(formatTravelOptions(result));
            }
            getTravelOptions(reservationKey, companyKey);
        }
    }, [reservationKey, companyKey]);

    useEffect(() => {
        if(reservationKey && companyKey) {
            handleGetCompany()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reservationKey]);

    useEffect(() => {
        if (reservationByKey) {
            let tempListJourneykey = [];
            reservationByKey.journeys.forEach((element) => {
                if (!element.reservationStatus.cancelled) {
                    tempListJourneykey.push(element.key);
                }
            });
            setListJourneyKey(tempListJourneykey);
        }
    }, [reservationByKey]);

    useEffect(() => {
        if (quotations) {
            let tempListPaymentTransactions = [];
            let tempPrice = 0;
            quotations.paymentTransactions.map((item) => {
                if (!item.receiptNumber) {
                    tempListPaymentTransactions.push({
                        ...item,
                        paymentMethodCriteria: {
                            account: {
                                company: {
                                    key: companyKey,
                                },
                            },
                        },
                    });
                    tempPrice += item.currencyAmounts[0].totalAmount;
                }
            });
            setPostBody({
                ...postBody,
                paymentTransactions: tempListPaymentTransactions,
            });
            setPrice(tempPrice);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quotations]);

    useEffect(() => {
        if (postResult) {
            location.reload();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postResult]);

    useEffect(() => {
        if (reservationByKey && listJourneyKey && travelOptions) {
            let listNotCancelJourney = reservationByKey.journeys.filter((item) => !item.reservationStatus.cancelled);
            let templist = listNotCancelJourney.map((item, index) => {
                const bookingKey = travelOptions[index].fareOptions[0].bookingCode.key;
                return {
                    journey: index,
                    bookingKey: bookingKey,
                    key: item.key,
                };
            });
            setListSelectedJourney(templist);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listJourneyKey]);

    return (
        <div
            className={`${
                addPassengerInfoPopup ? 'flex' : 'hidden'
            } h-screen w-screen bg-gray-700 bg-opacity-50 fixed z-20 top-0 right-0 flex justify-end`}
        >
            <div className="h-full p-8 bg-white overflow-auto">
                <div className="flex justify-between items-center pb-4 border-b">
                    <button
                        onClick={() => {
                            setAddPassengerInfoPopup(false);
                            setQuotations(null);
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
                    <h4 className="font-bold">Thêm hành khách</h4>
                </div>
                <div className="mt-4 max-w-[600px]">
                    <div className="mb-2">
                        <div className="flex justify-start items-end mb-2">
                            <p className="text-sm text-sky-400 font-medium">
                                <i>Hành khách:</i>
                            </p>
                            <select
                                onChange={handleSelectPassengerType}
                                name=""
                                id=""
                                className="ml-4 border rounded p-1"
                                disabled={quotations ? true : false}
                            >
                                <option value="adult">Người lớn</option>
                                <option value="child">Trẻ em</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-3 w-full border px-2 py-1 rounded">
                                <div className="grid grid-cols-2">
                                    <div className="col-span-1">
                                        <div>
                                            <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                Họ:
                                            </label>
                                            <input
                                                value={passengerFirstName || ""}
                                                onChange={(e) =>
                                                    setPassengerFirstName(
                                                        removeVietnameseDiacritics(e.target.value.toUpperCase()),
                                                    )
                                                }
                                                className="w-full outline-none"
                                                type="text"
                                                disabled={quotations ? true : false}
                                            />
                                        </div>
                                        <p className="text-xs text-red-400 passenger-firstname"></p>
                                    </div>
                                    <div className="col-span-1">
                                        <div>
                                            <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                Tên:
                                            </label>
                                            <input
                                                value={passengerLastName || ""}
                                                onChange={(e) =>
                                                    setPassengerLastName(
                                                        removeVietnameseDiacritics(e.target.value.toUpperCase()),
                                                    )
                                                }
                                                className="w-full outline-none"
                                                type="text"
                                                disabled={quotations ? true : false}
                                            />
                                            <p className="text-xs text-red-400 passenger-lastname"></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1 flex flex-col justify-between">
                                <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                    Giới tính
                                </label>
                                <div className="">
                                    <div>
                                        <label>
                                            <input
                                                onChange={(e) => setPassengerGender(e.target.value)}
                                                className="mr-2"
                                                type="radio"
                                                value="Male"
                                                name={`gioi-tinh-hanh-khach`}
                                                disabled={quotations ? true : false}
                                            />
                                            Nam
                                        </label>
                                        <label className="ml-6">
                                            <input
                                                onChange={(e) => setPassengerGender(e.target.value)}
                                                className="mr-2"
                                                type="radio"
                                                value="Female"
                                                name={`gioi-tinh-hanh-khach`}
                                                disabled={quotations ? true : false}
                                            />
                                            Nữ
                                        </label>
                                    </div>
                                    <p className="text-xs text-red-400 passenger-gender"></p>
                                </div>
                            </div>
                            <div className="col-span-4 flex items-center">
                                <input
                                    id="default-checkbox"
                                    type="checkbox"
                                    value=""
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    disabled={passengerType == 'child' || quotations ? true : false}
                                    onChange={() => setHaveInfant(!haveInfant)}
                                />
                                <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900">
                                    Em bé đi cùng
                                </label>
                            </div>
                        </div>
                    </div>
                    {passengerType == 'adult' && haveInfant == true ? (
                        <div className="mt-6">
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
                                            <div>
                                                <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                    Họ:
                                                </label>
                                                <input
                                                    value={infantFirstName || ""}
                                                    onChange={(e) => setInfantFirstName(e.target.value.toUpperCase())}
                                                    className="w-full outline-none"
                                                    type="text"
                                                    disabled={quotations ? true : false}
                                                />
                                            </div>
                                            <p className="text-xs text-red-400 infant-firstname"></p>
                                        </div>
                                        <div className="col-span-1">
                                            <div>
                                                <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                    Tên:
                                                </label>
                                                <input
                                                    value={infantLastName || ""}
                                                    onChange={(e) => setInfantLastName(e.target.value.toUpperCase())}
                                                    className="w-full outline-none"
                                                    type="text"
                                                    disabled={quotations ? true : false}
                                                />
                                            </div>
                                            <p className="text-xs text-red-400 infant-lastname"></p>
                                        </div>
                                    </div>
                                    <div className="col-span-3 w-full border px-2 py-1 rounded">
                                        <div>
                                            <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                Ngày sinh
                                            </label>
                                            <input
                                                id={`ngay-sinh-em-be`}
                                                value={''}
                                                className="w-full outline-none"
                                                type="text"
                                                disabled={quotations ? true : false}
                                            />
                                        </div>
                                        <p className="text-xs text-red-400 infant-birthdate"></p>
                                    </div>
                                </div>
                                <div className="col-span-1 flex flex-col justify-between">
                                    <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                        Giới tính
                                    </label>
                                    <div className="">
                                        <div className="flex justify-between items-center">
                                            <label>
                                                <input
                                                    onChange={(e) => setInfantGender(e.target.value)}
                                                    className="mr-2"
                                                    type="radio"
                                                    value="Male"
                                                    name={`gioi-tinh-em-be`}
                                                    disabled={quotations ? true : false}
                                                />
                                                Nam
                                            </label>
                                            <label>
                                                <input
                                                    onChange={(e) => setInfantGender(e.target.value)}
                                                    className="mr-2"
                                                    type="radio"
                                                    value="Female"
                                                    name={`gioi-tinh-em-be`}
                                                    disabled={quotations ? true : false}
                                                />
                                                Nữ
                                            </label>
                                        </div>
                                        <p className="text-xs text-red-400 infant-gender"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}

                    {travelOptions ? (
                        <div>
                            <p className="text-sky-400 text-sm mt-6 font-medium">
                                <i>Chặng bay:</i>
                            </p>
                            <div>
                                {travelOptions.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between py-2 border-t border-b mb-1"
                                        >
                                            <div className="flex items-center">
                                                {/* <input
                                                    id={`select-checkbox-${index}`}
                                                    type="checkbox"
                                                    value={index}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                    onChange={(event) =>
                                                        handleSelectJourney(event, index, listJourneyKey)
                                                    }
                                                /> */}
                                                <label
                                                    htmlFor={`select-checkbox-${index}`}
                                                    className="ms-2 text-sm font-medium text-gray-900"
                                                >
                                                    Chặng {index + 1}:{' '}
                                                    {`${item.flights[0].airlineCode} ${item.flights[0].flightNumber} :`}
                                                    <span className="ml-4 text-sky-400">
                                                        {item.flights[0].departure.airportCode}
                                                    </span>
                                                    <span className="font-medium ml-2 mr-4">
                                                        (
                                                        {
                                                            parseNgayThang(item.flights[0].departure.localScheduledTime)
                                                                .time
                                                        }
                                                        )
                                                    </span>
                                                    -
                                                    <span className="ml-4 text-sky-400">
                                                        {item.flights[0].arrival.airportCode}
                                                    </span>
                                                    <span className="font-medium ml-2">
                                                        (
                                                        {
                                                            parseNgayThang(item.flights[0].arrival.localScheduledTime)
                                                                .time
                                                        }
                                                        )
                                                    </span>
                                                </label>
                                            </div>
                                            <select
                                                onChange={(event) =>
                                                    handleChangeFareOption(event, index, listJourneyKey)
                                                }
                                                className="border rounded p-1"
                                                id={`select-fare-option-${index}`}
                                            >
                                                {item.fareOptions.map((fareOption, fareIndex) => {
                                                    if (fareOption.fareValidity.valid) {
                                                        return (
                                                            <option
                                                                key={`fare-${fareIndex}`}
                                                                value={fareOption.bookingCode.key || ""}
                                                            >
                                                                {fareOption.fareClass.description}
                                                            </option>
                                                        );
                                                    }
                                                })}
                                            </select>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div>
                    <button
                        onClick={checkAdd}
                        disabled=""
                        className={`${
                            quotations ? 'hidden' : 'block'
                        } mt-8 w-full rounded py-2 text-white bg-blue-500 hover:bg-blue-400`}
                    >
                        <p className="font-bold">Tiếp theo</p>
                    </button>

                    <div className={`${quotations ? 'block' : 'hidden'}`}>
                        <ListPaymentMethod setPaymentMethod={setPaymentMethod} listPaymentMethod={['AG']} />
                        <button
                            onClick={handleThanhToan}
                            disabled={paymentMethod ? false : true}
                            className={`mt-8 w-full rounded py-2 text-white ${
                                paymentMethod ? 'bg-blue-500 hover:bg-blue-400' : 'bg-gray-200'
                            }`}
                        >
                            {paymentAction ? (
                                <Loading />
                            ) : (
                                <>
                                    <p>
                                        (<i>{price?.toLocaleString()}</i> {currencySymbol})
                                    </p>
                                    <p className="font-bold">Thanh toán</p>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}