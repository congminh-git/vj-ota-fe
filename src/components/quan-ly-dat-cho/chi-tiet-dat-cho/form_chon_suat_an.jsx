'use client';

import ListMealPack from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/them-dich-vu/list_suat_an.jsx';
import ListPaymentMethod from '@/components/thanh-toan/listPaymentMethod';
import InternationalCardInfoForm from '@/components/thanh-toan/internationalCardInfo';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { putQuotationEditReservationAncillaryPurchases } from '@/services/quotations/functions';
import {
    postReservationAncillaryBulk,
    postReservationAncillaryBulkInternationalCard,
} from '@/services/reservations/functions';
import { getCurrencySymbol } from '@/lib/parseCurrency';
import { setCookie, getCookie } from '@/lib/cookie';
import { useRouter } from 'next/navigation';

function SelectMealForm({ body, setRefetch, refetch, companyKey, listAllJourneyMealOptions, currency, exchangeRate }) {
    const router = useRouter();
    const today = useMemo(() => new Date(), []);
    const [selectedJourney, setSelectedJourney] = useState(1);
    const [selectedPassenger, setSelectedPassenger] = useState(1);
    const [selectedMealPack, setSelectedMealPack] = useState([]);
    const [quotations, setQuotations] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState({ identifier: null, description: null });
    const [price, setPrice] = useState(null);
    const [postPaymentTransactions, setPostPaymentTransactions] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState('');

    const [billing, setBilling] = useState({
        city: '',
        state: '',
        country: '',
        address: '',
        postalCode: '',
        phone: '',
    });

    const [cardInfo, setCardInfo] = useState({
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });

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
            var methodIndex = -1;
            const internationalPaymentMethod = [
                {
                    identifier: 'VJPVI',
                    key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p2BJwZ8wTc4ExeJCtCEj4Hz7MHM1X8JzpsHK7LUkJqndw==',
                },
                {
                    identifier: 'VJPMC',
                    key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p194mAGlhM8hHzyNub1xGLall2SNuloDtpyhWuaoDeoPA==',
                },
                {
                    identifier: 'VJPAMEX',
                    key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p104nzxRaOCpOkEMnƒuqo2oi1d¥9h0pvhMOuUOg7P4ƒmA==',
                },
                {
                    identifier: 'VJPJCB',
                    key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1Ur12p0B7xIkkX8eFGwIjU0ZKUMgZƒDSk4CLyF3vJ0EQ==',
                },
            ];
            for (let i = 0; i < internationalPaymentMethod.length; i++) {
                if (internationalPaymentMethod[i].identifier === paymentMethod.identifier) {
                    methodIndex = i;
                    break;
                }
            }
            newBody.paymentTransactions = [
                {
                    paymentMethod: internationalPaymentMethod[methodIndex] || {
                        key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1¥CcncCLQNu3uhZGWzJkJUbmKK13BpWK¥9VaH1zFawFw==',
                        identifier: 'AG',
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
    }, [selectedMealPack, paymentMethod]);

    const xuLyThanhToan = async () => {
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
        } else if (
            paymentMethod.identifier === 'VJPVI' ||
            paymentMethod.identifier === 'VJPMC' ||
            paymentMethod.identifier === 'VJPAMEX' ||
            paymentMethod.identifier === 'VJPJCB'
        ) {
            const selectedMealPackStr = JSON.stringify(selectedMealPack);
            let bodyPost = JSON.parse(selectedMealPackStr);
            var methodIndex = -1;
            const internationalPaymentMethod = [
                {
                    identifier: 'VJPVI',
                    key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p2BJwZ8wTc4ExeJCtCEj4Hz7MHM1X8JzpsHK7LUkJqndw==',
                },
                {
                    identifier: 'VJPMC',
                    key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p194mAGlhM8hHzyNub1xGLall2SNuloDtpyhWuaoDeoPA==',
                },
                {
                    identifier: 'VJPAMEX',
                    key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p104nzxRaOCpOkEMnƒuqo2oi1d¥9h0pvhMOuUOg7P4ƒmA==',
                },
                {
                    identifier: 'VJPJCB',
                    key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1Ur12p0B7xIkkX8eFGwIjU0ZKUMgZƒDSk4CLyF3vJ0EQ==',
                },
            ];
            for (let i = 0; i < internationalPaymentMethod.length; i++) {
                if (internationalPaymentMethod[i].identifier === paymentMethod.identifier) {
                    methodIndex = i;
                    break;
                }
            }
            var paymentObjIndex = -1;
            for (let i = 0; i < quotations.paymentTransactions.length; i++) {
                if (!quotations.paymentTransactions[i].receiptNumber) {
                    paymentObjIndex = i;
                }
            }
            bodyPost[0].paymentTransactions = [
                {
                    paymentMethod: internationalPaymentMethod[methodIndex],
                    paymentMethodCriteria: {
                        account: {
                            company: {
                                key: companyKey,
                            },
                        },
                    },
                    currencyAmounts: [
                        {
                            totalAmount:
                                quotations?.paymentTransactions[paymentObjIndex].currencyAmounts[0].totalAmount,
                            currency: {
                                code: currency,
                                baseCurrency: true,
                            },
                            exchangeRate: exchangeRate,
                        },
                    ],
                    processingCurrencyAmounts: [
                        {
                            totalAmount:
                                quotations?.paymentTransactions[paymentObjIndex].processingCurrencyAmounts[0]
                                    .totalAmount,
                            currency: {
                                code: currency,
                                baseCurrency: true,
                            },
                            exchangeRate: exchangeRate,
                        },
                    ],
                    billingInfo: billing,
                    cardInfo: cardInfo,
                    callbackURLs: {
                        successURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/success',
                        failureURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/failure',
                        cancelURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/cancel',
                        pendingURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/pending',
                        ipnURL: '',
                    },
                    payerDescription: null,
                    receiptNumber: null,
                    payments: null,
                    refundTransactions: null,
                    notes: null,
                },
            ];
            const data = await postReservationAncillaryBulkInternationalCard(body.key, bodyPost);
            setCookie('transactionID', JSON.stringify(data?.data?.responseData?.transactionId));
            setCookie('reservationKey', body.key, 1);
            router.push(data?.data?.responseData?.endpoint);
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

            <ListPaymentMethod
                setPaymentMethod={setPaymentMethod}
                listPaymentMethod={['AG', 'VJPVI', 'VJPMC', 'VJPAMEX', 'VJPJCB']}
                useVoucher={false}
            />

            <InternationalCardInfoForm
                cardInfo={cardInfo}
                setCardInfo={setCardInfo}
                billing={billing}
                setBilling={setBilling}
                show={
                    paymentMethod.identifier === 'VJPVI' ||
                    paymentMethod.identifier === 'VJPMC' ||
                    paymentMethod.identifier === 'VJPAMEX' ||
                    paymentMethod.identifier === 'VJPJCB'
                }
            />

            <button
                onClick={() => xuLyThanhToan()}
                disabled={
                    selectedMealPack.length > 0 &&
                    !paymentMethod.identifier === 'AG' &&
                    !(
                        (paymentMethod.identifier === 'VJPVI' ||
                            paymentMethod.identifier === 'VJPMC' ||
                            paymentMethod.identifier === 'VJPAMEX' ||
                            paymentMethod.identifier === 'VJPJCB') &&
                        billing.address &&
                        billing.city &&
                        billing.country &&
                        billing.postalCode &&
                        billing.phone &&
                        cardInfo.cvv &&
                        cardInfo.expiryDate &&
                        cardInfo.cardName &&
                        cardInfo.cardNumber
                    )
                        ? true
                        : false
                }
                className={`mt-8 w-full rounded py-2 text-white ${
                    ((body?.bookingInformation.hold && new Date(body?.bookingInformation.hold.expiryTime) > today) ||
                        !body?.bookingInformation.hold) &&
                    (paymentMethod.identifier === 'AG' ||
                        ((paymentMethod.identifier === 'VJPVI' ||
                            paymentMethod.identifier === 'VJPMC' ||
                            paymentMethod.identifier === 'VJPAMEX' ||
                            paymentMethod.identifier === 'VJPJCB') &&
                            billing.address &&
                            billing.city &&
                            billing.country &&
                            billing.postalCode &&
                            billing.phone &&
                            cardInfo.cvv &&
                            cardInfo.expiryDate &&
                            cardInfo.cardName &&
                            cardInfo.cardNumber))
                        ? ' border-blue-400 text-white bg-blue-400 hover:text-blue-400 hover:bg-white'
                        : ' border-gray-400 text-white bg-gray-400'
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
