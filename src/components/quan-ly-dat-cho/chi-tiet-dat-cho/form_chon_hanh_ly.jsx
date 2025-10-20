'use client';

import { useEffect, useState } from 'react';
import { putQuotationEditReservationAncillaryPurchases } from '@/services/quotations/functions';
import { postReservationAncillaryBulk } from '@/services/reservations/functions';
import ListBaggagePack from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/them-dich-vu/list_goi_hanh_ly';
import ListPaymentMethod from '@/components/thanh-toan/listPaymentMethod';
import { getCurrencySymbol } from '@/lib/parseCurrency';

function SelectBaggageForm({
    body,
    setRefetch,
    refetch,
    companyKey,
    listAllJourneyBaggageOptions,
    currency,
    exchangeRate,
}) {
    const [selectedJourney, setSelectedJourney] = useState(1);
    const [selectedBaggagePack, setSelectedBaggagePack] = useState([]);
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
            selectedBaggagePack.forEach((element) => {
                newBody.ancillaryPurchases.push(element);
            });

            handlePutQuotationEditReservationAncillaryPurchases(newBody);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBaggagePack]);

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

    const handlePay = () => {
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
                <ListPaymentMethod setPaymentMethod={setPaymentMethod} listPaymentMethod={['AG']} />

                <button
                    onClick={() => handlePay()}
                    disabled={selectedBaggagePack.length > 0 && paymentMethod != null ? false : true}
                    className={`mt-8 w-full rounded py-2 text-white ${
                        selectedBaggagePack.length > 0 && paymentMethod != null
                            ? 'bg-blue-500 hover:bg-blue-400'
                            : 'bg-gray-300 text-gray-700'
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
