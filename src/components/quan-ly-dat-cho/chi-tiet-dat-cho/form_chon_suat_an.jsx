'use client';

import ListMealPack from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/them-dich-vu/list_suat_an.jsx';
import ListPaymentMethod from '@/components/thanh-toan/listPaymentMethod';
import { useEffect, useState } from 'react';
import { putQuotationEditReservationAncillaryPurchases } from '@/services/quotations/functions';
import { postReservationAncillaryBulk } from '@/services/reservations/functions';
import { getCurrencySymbol } from '@/lib/parseCurrency';

function SelectMealForm({ body, setRefetch, refetch, companyKey, listAllJourneyMealOptions, currency, exchangeRate }) {
    const [selectedJourney, setSelectedJourney] = useState(1);
    const [selectedPassenger, setSelectedPassenger] = useState(1);
    const [selectedMealPack, setSelectedMealPack] = useState([]);
    const [quotations, setQuotations] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [price, setPrice] = useState(null);
    const [postPaymentTransactions, setPostPaymentTransactions] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState('');

    const handlePutQuotationEditReservationAncillaryPurchases = async (body) => {
        const data = await putQuotationEditReservationAncillaryPurchases(body);
        setQuotations(data);
    };

    useEffect(() => {
        if (currency) {
            setCurrencySymbol(getCurrencySymbol(currency));
        }
    }, [currency]);

    useEffect(() => {
        if (body) {
            console.log(selectedMealPack);
            const bodyStr = JSON.stringify(body);
            let newBody = JSON.parse(bodyStr);
            newBody.paymentTransactions = [
                {
                    paymentMethod: {
                        key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1¥CcncCLQNu3uhZGWzJkJUbmKK13BpWK¥9VaH1zFawFw==',
                        identifier: 'AG',
                    },
                    paymentMethodCriteria: {
                        account: {
                            company: {
                                href: 'https://vietjet-api.intelisys.ca/RESTv1/companies/W5MjN4BoA0qEackTAMd0wKT7kp0UqlAIU8CWUi0vlPM=',
                                key: 'W5MjN4BoA0qEackTAMd0wKT7kp0UqlAIU8CWUi0vlPM=',
                                account: {
                                    accountNumber: '37390080',
                                    creditLimit: 0.0,
                                    creditAvailable: 210105866.03,
                                    currency: {
                                        href: 'https://vietjet-api.intelisys.ca/RESTv1/currencies/VND',
                                        code: currency,
                                        description: 'Vietnam Dong',
                                    },
                                },
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
                    payerDescription: null,
                    receiptNumber: null,
                    payments: null,
                    refundTransactions: null,
                    notes: null,
                },
            ];
            newBody.ancillaryPurchases = [];
            selectedMealPack.forEach((element) => {
                newBody.ancillaryPurchases.push(element);
            });

            handlePutQuotationEditReservationAncillaryPurchases(newBody);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMealPack]);

    const xuLyThanhToan = () => {
        if (paymentMethod.identifier == 'AG') {
            const selectedMealPackStr = JSON.stringify(selectedMealPack);
            let bodyPost = JSON.parse(selectedMealPackStr);
            bodyPost[0].paymentTransactions = postPaymentTransactions;
            bodyPost[0].paymentTransactions.map((item) => {
                item.paymentMethodCriteria = {
                    account: {
                        company: {
                            key: companyKey,
                        },
                    },
                };
            });
            postReservationAncillaryBulk(body.key, bodyPost, setRefetch, refetch);
        }
    };

    useEffect(() => {
        if (quotations) {
            let tong = 0;
            let paymentTrans = [];
            quotations.paymentTransactions.map((item) => {
                if (!item.receiptNumber) {
                    tong += item.currencyAmounts[0].totalAmount;
                    paymentTrans.push(item);
                }
            });
            setPrice(tong);
            setPostPaymentTransactions(paymentTrans);
        }
    }, [quotations]);

    useEffect(() => {
        if (listAllJourneyMealOptions) {
            for (let i = 0; i < body.journeys.length; i++) {
                if (!body.journeys[i].reservationStatus.cancelled) {
                    setSelectedJourney(i + 1);
                    break;
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listAllJourneyMealOptions]);

    return (
        <>
            <div className="flex justify-center items-center border-b mt-2">
                {body?.journeys.map((journey, index) => {
                    if (!journey.reservationStatus.cancelled) {
                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedJourney(index + 1)}
                                className={`${
                                    selectedJourney == index + 1 ? 'border-blue-400' : 'border-transparent'
                                } py-2 px-4 border-b-4 hover:bg-gray-100`}
                            >
                                Chặng {index + 1}
                            </button>
                        );
                    }
                })}
            </div>
            <div
                className={`mt-4 grid grid-cols-${
                    body?.passengers?.length < 3 ? `${body?.passengers?.length}` : '3'
                } gap-4 pb-4 border-b`}
            >
                {body?.passengers?.map((item, index) => {
                    if (
                        body.journeys[selectedJourney - 1].passengerJourneyDetails.findIndex(
                            (itemPassenger) => itemPassenger.passenger.key == item.key,
                        ) != -1
                    ) {
                    }
                    return (
                        <button
                            onClick={() => setSelectedPassenger(index + 1)}
                            className={`${
                                selectedPassenger == index + 1 ? 'border-yellow-400 bg-yellow-400 text-white' : ''
                            } text-sm border-2 hover:border-blue-400 bg-gray-100 p-2 rounded`}
                            key={index + 1}
                        >
                            <p>{item.reservationProfile.gender.toUpperCase() == 'MALE' ? 'Ông' : 'Bà'}</p>
                            <p className="font-bold">
                                {item.reservationProfile.firstName} {item.reservationProfile.lastName}
                            </p>
                        </button>
                    );
                })}
            </div>
            <div className="mt-1">
                <p>Chọn suất ăn</p>
                {listAllJourneyMealOptions?.map((mealOptions, journeyIndex) => {
                    if (mealOptions) {
                        return (
                            <div key={`journey-${journeyIndex}`}>
                                {body?.passengers?.map((element, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={
                                                selectedJourney == journeyIndex + 1 && selectedPassenger == index + 1
                                                    ? 'block'
                                                    : 'hidden'
                                            }
                                        >
                                            <ListMealPack
                                                listMealPack={mealOptions}
                                                journey={body.journeys[journeyIndex].key}
                                                passenger={element.key}
                                                selectedMealPack={selectedMealPack}
                                                setSelectedMealPack={setSelectedMealPack}
                                                body={body}
                                                journeyIndex={journeyIndex}
                                                passengerIndex={index}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    } else {
                        return <></>;
                    }
                })}
            </div>

            <ListPaymentMethod setPaymentMethod={setPaymentMethod} listPaymentMethod={['AG']} />

            <button
                onClick={() => xuLyThanhToan()}
                disabled={selectedMealPack.length > 0 && paymentMethod != null ? false : true}
                className={`mt-8 w-full rounded py-2 text-white ${
                    selectedMealPack.length > 0 && paymentMethod != null
                        ? 'bg-blue-500 hover:bg-blue-400'
                        : 'bg-gray-300 text-gray-700'
                }`}
            >
                <p className="text-sm">
                    Tổng: {price?.toLocaleString()} {currencySymbol} (Đã bao gồm dư nợ)
                </p>
                <p className="font-bold">Xác nhận</p>
            </button>
        </>
    );
}

export default SelectMealForm;