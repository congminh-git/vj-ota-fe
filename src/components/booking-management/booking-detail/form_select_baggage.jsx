'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { putQuotationEditReservationAncillaryPurchases } from '@/services/quotations/functions';
import { postReservationAncillaryBulk, postReservationAncillaryBulkInternationalCard } from '@/services/reservations/functions';
import ListBaggagePack from '@/components/booking-management/booking-detail/add-on/list_baggage';
import ListPaymentMethod from '@/components/payment/listPaymentMethod';
import InternationalCardInfoForm from '@/components/payment/internationalCardInfo';
import { getCurrencySymbol } from '@/lib/parseCurrency';
import { setCookie, getCookie } from '@/lib/cookie';
import { useRouter } from 'next/navigation';
import { getBaseURL } from '@/lib/getBaseUrl';

function SelectBaggageForm({
    body,
    setRefetch,
    refetch,
    companyKey,
    listAllJourneyBaggageOptions,
    currency,
    exchangeRate,
}) {
    const router = useRouter();
    const today = useMemo(() => new Date(), []);
    const baseUrl = getBaseURL();
    const [selectedJourney, setSelectedJourney] = useState(1);
    const [selectedBaggagePack, setSelectedBaggagePack] = useState([]);
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
            selectedBaggagePack.forEach((element) => {
                newBody.ancillaryPurchases.push(element);
            });

            handlePutQuotationEditReservationAncillaryPurchases(newBody);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBaggagePack, paymentMethod]);

    useEffect(() => {
        if (listAllJourneyBaggageOptions) {
            for (let i = 0; i < body.journeys.length; i++) {
                if (!body.journeys[i].reservationStatus.cancelled) {
                    setSelectedJourney(i + 1);
                    break;
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listAllJourneyBaggageOptions]);

    const handlePay = async () => {
        if (paymentMethod.identifier == 'AG') {
            const selectedBaggagePackStr = JSON.stringify(selectedBaggagePack);
            let bodyPost = JSON.parse(selectedBaggagePackStr);
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
            const selectedBaggagePackStr = JSON.stringify(selectedBaggagePack);
            let bodyPost = JSON.parse(selectedBaggagePackStr);
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
                        successURL: `${baseUrl}/booking/payment/success`,
                        failureURL: `${baseUrl}/booking/payment/failure`,
                        cancelURL: `${baseUrl}/booking/payment/cancel`,
                        pendingURL: `${baseUrl}/booking/payment/pending`,
                        ipnURL: ``,
                    },
                    payerDescription: null,
                    receiptNumber: null,
                    payments: null,
                    refundTransactions: null,
                    notes: null,
                },
            ];
            const data = await postReservationAncillaryBulkInternationalCard(body.key, bodyPost);
            if (data?.data?.responseData?.transactionId) {
                setCookie('transactionID', JSON.stringify(data?.data?.responseData?.transactionId));
                setCookie('reservationKey', body.key, 1);
                router.push(data?.data?.responseData?.endpoint);
            } else {
                location.reload()
            }
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
            <div className="mt-8">
                {listAllJourneyBaggageOptions?.map((journeyBaggageOptions, journeyIndex) => {
                    if (journeyBaggageOptions) {
                        return (
                            <ul
                                key={`journey-${journeyIndex + 1}`}
                                className={selectedJourney == journeyIndex + 1 ? 'block' : 'hidden'}
                            >
                                {body?.passengers?.map((item, index) => {
                                    const journeyKey = body?.journeys[journeyIndex].key;
                                    const passsengerKey = item.key;
                                    const ancillaryIndex = body?.ancillaryPurchases.findIndex(
                                        (element) =>
                                            element.journey.key == journeyKey &&
                                            element.passenger.key == passsengerKey &&
                                            element.ancillaryItem.ancillaryCategory.name == 'Baggage',
                                    );
                                    return (
                                        <li key={index} className="py-2 border-b grid grid-cols-2 gap-4">
                                            <span className="flex items-center justify-start">
                                                {item.reservationProfile.gender.toUpperCase() == 'MALE' ? 'Ông' : 'Bà'}
                                                <span className="bg-gray-200 h-2 w-2 block rounded-full mx-2"></span>
                                                {item.reservationProfile.firstName} {item.reservationProfile.lastName}
                                            </span>
                                            <div className="flex items-center justify-start">
                                                <ListBaggagePack
                                                    listBaggagePack={journeyBaggageOptions}
                                                    journey={journeyKey}
                                                    passenger={passsengerKey}
                                                    selectedBaggagePack={selectedBaggagePack}
                                                    setSelectedBaggagePack={setSelectedBaggagePack}
                                                    value={
                                                        ancillaryIndex != -1
                                                            ? body?.ancillaryPurchases[ancillaryIndex].ancillaryItem.key
                                                            : null
                                                    }
                                                />
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        );
                    } else {
                        return <></>;
                    }
                })}

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
                    onClick={() => handlePay()}
                    disabled={
                        selectedBaggagePack.length > 0 &&
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
                    ((body?.bookingInformation.hold &&
                        new Date(body?.bookingInformation.hold.expiryTime) > today) ||
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
            </div>
        </>
    );
}

export default SelectBaggageForm;
