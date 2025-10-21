'use client';

import Breadcrumb from '@/components/breadcrumb';
import PassengersInfomation from '@/components/thanh-toan/thong_tin_hanh_khach';
import Steps from '@/components/danh-sach-ve/steps';
import FlightInfomation from '@/components/thong-tin-hanh-khach/thong_tin_chuyen_bay';
import PriceInfomation from '@/components/thong-tin-hanh-khach/thong_tin_gia';
import ListPaymentMethod from '@/components/thanh-toan/listPaymentMethod';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCompany } from '@/services/companies/functions';
import { getPaymentMethods } from '@/services/paymentMethods/functions';
import { postReservationDatVe, postReservationByInternationalCard } from '@/services/reservations/functions';
import { putQuotationReservation } from '@/services/quotations/functions';
import InternationalCardInfoForm from '@/components/thanh-toan/internationalCardInfo';

// Custom hook để đọc sessionStorage một lần
const useSessionStorageData = () => {
    return useMemo(() => {
        if (typeof window === 'undefined') {
            return {
                cityPair: null,
                departmentDate: null,
                returnDate: null,
                roundTrip: null,
                adult: null,
                child: null,
                infant: null,
                departureCity: null,
                arrivalCity: null,
                fareOptionsDepartureFlightStr: null,
                fareOptionsReturnFlightStr: null,
                listPassengers: null,
                reservationBody: null,
                baggageTotalPrice: null,
                mealTotalPrice: null,
                seatTotalPrice: null,
                currency: 'VND',
                exchangeRate: 1,
                insuranceTotalPrice: null,
            };
        }
        return {
            cityPair: sessionStorage.getItem('cityPairSearchParam'),
            departmentDate: sessionStorage.getItem('departmentDateSearchParam'),
            returnDate: sessionStorage.getItem('returnDateSearchParam'),
            roundTrip: JSON.parse(sessionStorage.getItem('roundTripSearchParam')),
            adult: parseInt(sessionStorage.getItem('adultSearchParam')),
            child: parseInt(sessionStorage.getItem('childSearchParam')),
            infant: parseInt(sessionStorage.getItem('infantSearchParam')),
            departureCity: sessionStorage.getItem('departureCitySearchParam'),
            arrivalCity: sessionStorage.getItem('arrivalCitySearchParam'),
            fareOptionsDepartureFlightStr: sessionStorage.getItem('fareOptionsDepartureFlight'),
            fareOptionsReturnFlightStr: sessionStorage.getItem('fareOptionsReturnFlight'),
            listPassengers: JSON.parse(sessionStorage.getItem('listPassengers')),
            reservationBody: JSON.parse(sessionStorage.getItem('reservationBody')),
            baggageTotalPrice: JSON.parse(sessionStorage.getItem('baggageTotalPrice')),
            mealTotalPrice: JSON.parse(sessionStorage.getItem('mealTotalPrice')),
            seatTotalPrice: JSON.parse(sessionStorage.getItem('seatTotalPrice')),
            currency: sessionStorage.getItem('currencySearchParam') ?? 'VND',
            exchangeRate: parseInt(sessionStorage.getItem('exchangeRate')) ?? 1,
            insuranceTotalPrice: JSON.parse(sessionStorage.getItem('insuranceTotalPrice')),
        };
    }, []);
};

export default function PaymentPage() {
    const router = useRouter();
    // Sử dụng custom hook để đọc sessionStorage
    const sessionData = useSessionStorageData();
    const {
        cityPair,
        departmentDate,
        returnDate,
        roundTrip,
        adult,
        child,
        infant,
        departureCity,
        arrivalCity,
        fareOptionsDepartureFlightStr,
        fareOptionsReturnFlightStr,
        listPassengers,
        reservationBody,
        baggageTotalPrice,
        mealTotalPrice,
        seatTotalPrice,
        currency,
        exchangeRate,
        insuranceTotalPrice,
    } = sessionData;
    const [fareOptionsDepartureFlight, setFareOptionsDepartureFlight] = useState(0);
    const [fareOptionsReturnFlight, setFareOptionsReturnFlight] = useState(0);
    const [totalPrice, setTotalPrice] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState({ identifier: '', description: '', creditCard: '' });
    const [companyKey, setCompanyKey] = useState();
    const [listPaymentMethod, setListPaymentMethod] = useState([]);
    const [listPaymentMethodKey, setListPaymentMethodKey] = useState([]);
    const [quotations, setQuotations] = useState(null);
    const [sendEmail, setSendEmail] = useState(null);
    const [body, setBody] = useState(null);
    const [loading, setLoading] = useState(false);
    const [departureFlight, setDepartureFlight] = useState(null);
    const [returnFlight, setReturnFlight] = useState(null);
    const [agreementCheckbox, setAgreementCheckbox] = useState(false);
    const [useVoucher, setUseVoucher] = useState(false);
    const [voucherSerialNumber, setVoucherSerialNumber] = useState('');
    const [personalIdentificationNumber, setPersonalIdentificationNumber] = useState('');
    const [password, setPassword] = useState('');
    const prevPaymentTransactionsRef = useRef();

    const [billing, setBilling] = useState({
        city: '',
        state: '',
        country: '',
        address: '',
        postalCode: '',
        phone: ''
    });

    const [cardInfo, setCardInfo] = useState({
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    // Memoize breadcrumb để tránh tạo lại object mỗi lần render
    const listBreadcrumb = useMemo(
        () => [
            { title: 'Tìm vé', uri: '/dat-ve' },
            {
                title: 'Danh sách vé',
                uri: `/dat-ve/danh-sach-ve?cityPair=${cityPair}&departure=${departmentDate}&roundTrip=${roundTrip}&comeback=${returnDate}&currency=${currency}&adultCount=${adult}&childCount=${child}&infantCount=${infant}&departureCity=${departureCity}&arrivalCity=${arrivalCity}&activeChonVe=${'đi'}`,
            },
            {
                title: 'Thông tin hành khách',
                uri: `/dat-ve/thong-tin-hanh-khach?cityPair=${cityPair}&departure=${departmentDate}&roundTrip=${roundTrip}&comeback=${returnDate}&currency=${currency}&adultCount=${adult}&childCount=${child}&infantCount=${infant}&departureCity=${departureCity}&arrivalCity=${arrivalCity}&activeChonVe=${'đi'}`,
            },
            {
                title: 'Thêm dịch vụ',
                uri: `/dat-ve/them-dich-vu`,
            },
            { title: 'Thanh toán', uri: 'thanh-toan' },
        ],
        [cityPair, departmentDate, roundTrip, returnDate, currency, adult, child, infant, departureCity, arrivalCity],
    );

    const isValidCreditCard = useCallback((cardNumber) => {
        // Remove any non-digit characters
        cardNumber = cardNumber.replace(/\D/g, '');
        // Check if the input is empty or not a number
        if (cardNumber.length === 0 || isNaN(cardNumber)) {
            return false;
        }
        // Reverse the card number
        let reversedCardNumber = cardNumber.split('').reverse().join('');
        let total = 0;
        for (let i = 0; i < reversedCardNumber.length; i++) {
            let digit = parseInt(reversedCardNumber.charAt(i));
            // Double every second digit
            if (i % 2 === 1) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            total += digit;
        }
        // If the total modulo 10 is 0, the number is valid
        return total % 10 === 0;
    }, []);

    const isValidExpiryDate = useCallback((value) => {
        // Check if the format is correct
        const regex = /^(\d{2})\/(\d{2})$/;
        if (!regex.test(value)) {
            return false;
        }

        // Extract month and year
        const [_, month, year] = value.match(regex);
        const currentYear = new Date().getFullYear() % 100; // Get last two digits of current year
        const currentMonth = new Date().getMonth() + 1;

        // Check if the month is valid (1-12)
        if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
            return false;
        }

        // Check if the year is valid (current year or later)
        if (
            parseInt(year, 10) < currentYear ||
            (parseInt(year, 10) === currentYear && parseInt(month, 10) < currentMonth)
        ) {
            return false;
        }

        // If all checks pass, the date is valid
        return true;
    }, []);

    const handleBooking = useCallback(async () => {
        setLoading(true);
        const data = await postReservationDatVe(body, quotations, paymentMethod.creditCard);
        if (data) {
            setSendEmail(true);
            setLoading(false);
            router.push('/dat-ve/thanh-toan/dat-cho-thanh-cong');
        }
    }, [body, quotations, paymentMethod, router]);

    const handleBookingWithInternationalCard = useCallback(async () => {
        setLoading(true);
        const data = await postReservationByInternationalCard(body, quotations, billing, cardInfo);
        //Redirect sang endpoint trả về
        router.push(data?.data?.responseData?.endpoint)
    }, [body, quotations, billing, cardInfo, router]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const checkValidation = useCallback(() => {
        if (['AG', 'PL'].includes(paymentMethod.identifier)) {
            handleBooking();
        } else if (['VJPVI', 'VJPMC', 'VJPAMEX', 'VJPJCB'].includes(paymentMethod.identifier)) {
            handleBookingWithInternationalCard();
        } else {
            let validateCount = 0;
            if (!paymentMethod.creditCard.number.replace(/\D/g, '')) {
                document.querySelector('.credit-card-card-number').innerHTML = 'Vui lòng nhập số thẻ';
                validateCount += 1;
            } else {
                if (!isValidCreditCard(paymentMethod.creditCard.number.replace(/\D/g, ''))) {
                    document.querySelector('.credit-card-card-number').innerHTML = 'Số thẻ không hợp lệ';
                    validateCount += 1;
                } else {
                    document.querySelector('.credit-card-card-number').innerHTML = '';
                }
            }

            if (!paymentMethod.creditCard.cardHolder) {
                document.querySelector('.credit-card-card-holder').innerHTML = 'Vui lòng nhập tên chủ thẻ';
                validateCount += 1;
            } else {
                document.querySelector('.credit-card-card-holder').style.borderBottom = 'none';
            }

            const expiryDateField = document.querySelector('.credit-card-expiry-date');
            if (!paymentMethod.creditCard.expiryDate) {
                expiryDateField.innerHTML = 'Vui lòng nhập ngày hết hạn';
                validateCount++;
            } else {
                if (!isValidExpiryDate(paymentMethod.creditCard.expiryDate)) {
                    expiryDateField.innerHTML = 'Ngày hết hạn không hợp lệ';
                    validateCount++;
                } else {
                    paymentMethod.creditCard.expiryMonth = parseInt(paymentMethod.creditCard.expiryDate.split('/')[0]);
                    paymentMethod.creditCard.expiryYear = parseInt(paymentMethod.creditCard.expiryDate.split('/')[1]);
                    expiryDateField.style.borderBottom = 'none';
                }
            }

            if (!paymentMethod.creditCard.verificationNumber) {
                document.querySelector('.credit-card-cvv').innerHTML = 'Vui lòng nhập số cvv';
                validateCount += 1;
            } else {
                document.querySelector('.credit-card-cvv').style.borderBottom = 'none';
            }

            if (!paymentMethod.creditCard.billing.address.address1) {
                document.querySelector('.credit-card-address').innerHTML = 'Vui lòng nhập địa chỉ';
                validateCount += 1;
            } else {
                document.querySelector('.credit-card-address').style.borderBottom = 'none';
            }

            if (!paymentMethod.creditCard.billing.address.postalCode) {
                document.querySelector('.credit-card-postal-code').innerHTML = 'Vui lòng nhập mã bưu điện';
                validateCount += 1;
            } else {
                document.querySelector('.credit-card-postal-code').style.borderBottom = 'none';
            }

            if (!paymentMethod.creditCard.billing.address.location.province.code) {
                document.querySelector('.credit-card-province').innerHTML = 'Vui lòng chọn tỉnh/bang';
                validateCount += 1;
            } else {
                document.querySelector('.credit-card-province').style.borderBottom = 'none';
            }

            if (!paymentMethod.creditCard.billing.address.city) {
                document.querySelector('.credit-card-city').innerHTML = 'Vui lòng nhập thành phố';
                validateCount += 1;
            } else {
                document.querySelector('.credit-card-city').style.borderBottom = 'none';
            }
            if (validateCount === 0) {
                handleBooking();
            }
        }
    }, [paymentMethod, isValidCreditCard, isValidExpiryDate, handleBooking, handleBookingWithInternationalCard]);

    const handleGetCompany = useCallback(async () => {
        const data = await getCompany();
        setCompanyKey(data.key);
    }, []);

    const handlePutQuotation = useCallback(async (body) => {
        const data = await putQuotationReservation(body);
        setQuotations(data);
    }, []);

    useEffect(() => {
        if (fareOptionsDepartureFlightStr) {
            setFareOptionsDepartureFlight(fareOptionsDepartureFlightStr);
        } else {
            router.replace('/');
        }
        if (fareOptionsReturnFlightStr) {
            setFareOptionsReturnFlight(fareOptionsReturnFlightStr);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fareOptionsDepartureFlightStr, fareOptionsReturnFlightStr]);

    useEffect(() => {
        setDepartureFlight(
            typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('departureFlight')) : null,
        );
        setReturnFlight(typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('returnFlight')) : null);
        handleGetCompany();
        setBody(reservationBody);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleGetCompany, reservationBody]);

    useEffect(() => {
        const getValidPaymentMethod = async () => {
            if (returnFlight) {
                const paymentMethodDepartureFlight = await getPaymentMethods(
                    departureFlight?.fareOptions.find(
                        (element) => element.bookingCode.key == fareOptionsDepartureFlight,
                    ).bookingCode.key,
                );
                const paymentMethodReturnFlight = await getPaymentMethods(
                    returnFlight?.fareOptions.find((element) => element.bookingCode.key == fareOptionsReturnFlight)
                        .bookingCode.key,
                );
                if (paymentMethodDepartureFlight && paymentMethodReturnFlight) {
                    const paymentMethodDepartureFlightFormat = {
                        identifier: paymentMethodDepartureFlight.map((item) => {
                            return item.identifier;
                        }),
                        description: paymentMethodDepartureFlight.map((item) => {
                            return item.description;
                        }),
                        key: paymentMethodDepartureFlight.map((item) => {
                            return item.key;
                        }),
                    };
                    const paymentMethodReturnFlightFormat = {
                        identifier: paymentMethodReturnFlight.map((item) => {
                            return item.identifier;
                        }),
                        description: paymentMethodReturnFlight.map((item) => {
                            return item.description;
                        }),
                        key: paymentMethodReturnFlight.map((item) => {
                            return item.key;
                        }),
                    };
                    setListPaymentMethod([
                        ...paymentMethodDepartureFlightFormat.identifier,
                        ...paymentMethodReturnFlightFormat.identifier,
                    ]);
                    setListPaymentMethodKey([
                        ...paymentMethodDepartureFlightFormat.key,
                        ...paymentMethodReturnFlightFormat.key,
                    ]);
                }
            } else {
                if (departureFlight) {
                    const paymentMethodDepartureFlight = await getPaymentMethods(
                        departureFlight?.fareOptions.find(
                            (element) => element.bookingCode.key == fareOptionsDepartureFlight,
                        ).bookingCode.key,
                    );

                    if (paymentMethodDepartureFlight) {
                        const paymentMethodDepartureFlightFormat = {
                            identifier: paymentMethodDepartureFlight.map((item) => {
                                return item.identifier;
                            }),
                            description: paymentMethodDepartureFlight.map((item) => {
                                return item.description;
                            }),
                            key: paymentMethodDepartureFlight.map((item) => {
                                return item.key;
                            }),
                        };
                        setListPaymentMethod([...paymentMethodDepartureFlightFormat.identifier]);
                        setListPaymentMethodKey([...paymentMethodDepartureFlightFormat.key]);
                    }
                }
            }
        };

        getValidPaymentMethod();
    }, [fareOptionsDepartureFlight, fareOptionsReturnFlight, departureFlight, returnFlight]);

    useEffect(() => {
        if (paymentMethod.identifier) {
            let paymentTransactions = {};
            if (paymentMethod.identifier == 'PL') {
                paymentTransactions = {
                    paymentMethod: {
                        key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1rOTwFA5LN6VUgknLR¥uSRURzqRAo79Q¥yB9ni61HUMA==',
                        identifier: 'PL',
                        description: 'Pay Later',
                    },
                    paymentMethodCriteria: {
                        thirdParty: {
                            clientIP: '192.168.0.0',
                            language: {
                                href: 'https://intelisys-api.intelisys.ca/RESTv1/languages/EN',
                                code: 'EN',
                                name: 'English CN',
                            },
                            applicationIdentifier: '',
                            redirectURL: '',
                            postURL: '',
                            postData: '',
                            reference: '',
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
                };
            } else if (['MC', 'VI'].includes(paymentMethod.identifier)) {
                paymentTransactions = {
                    paymentMethod: {
                        href: 'https://vietjet-api.intelisystraining.ca/RESTv1/paymentMethods/tfCeB5%C2%A5mircWvs2C4HkDdOXNJf%C6%92NFOopDW2yQCBh2p1AuSbxTJj2UqzUc4Ck91xspsOlecpL5aqwqwENWdei2A==',
                        key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1AuSbxTJj2UqzUc4Ck91xspsOlecpL5aqwqwENWdei2A==',
                        identifier: paymentMethod.identifier,
                        description: paymentMethod.description,
                    },
                    paymentMethodCriteria: {
                        creditCard: {
                            number: '',
                            expiryMonth: '',
                            expiryYear: '',
                            verificationNumber: '',
                            cardHolder: '',
                            billing: {
                                contactInformation: {
                                    name: '',
                                    email: '',
                                },
                                address: {
                                    address1: '',
                                    address2: '',
                                    city: '',
                                    location: {
                                        country: {
                                            code: '',
                                        },
                                        province: {
                                            code: '',
                                        },
                                    },
                                    postalCode: '',
                                },
                            },
                            shipping: {
                                contactInformation: {
                                    name: '',
                                    email: '',
                                },
                                address: {
                                    address1: '',
                                    address2: '',
                                    city: '',
                                    location: {
                                        country: {
                                            code: '',
                                        },
                                        province: {
                                            code: '',
                                        },
                                    },
                                    postalCode: '',
                                },
                            },
                            clientIP: '34.111.128.39',
                        },
                    },
                    currencyAmounts: [
                        {
                            totalAmount: 0,
                            currency: {
                                href: 'https://vietjet-api.intelisys.ca/RESTv1/currencies/VND',
                                code: currency,
                                description: 'US Dollar',
                                baseCurrency: false,
                            },
                            exchangeRate: exchangeRate,
                        },
                    ],
                };
            } else {
                paymentTransactions = {
                    paymentMethod: {
                        key: listPaymentMethodKey[listPaymentMethod.indexOf(paymentMethod.identifier)],
                        identifier: paymentMethod.identifier,
                        description: paymentMethod.description,
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
                                href: 'https://vietjet-api.intelisys.ca/RESTv1/currencies/VND',
                                code: currency,
                                description: 'US Dollar',
                                baseCurrency: false,
                            },
                            exchangeRate: exchangeRate,
                        },
                    ],
                    allPassengers: true,
                };
            }
            // So sánh paymentTransactions mới với cũ
            const prev = prevPaymentTransactionsRef.current;
            const isEqual = JSON.stringify(prev) === JSON.stringify(paymentTransactions);
            if (!isEqual) {
                prevPaymentTransactionsRef.current = paymentTransactions;
                setBody({
                    ...body,
                    paymentTransactions: [paymentTransactions],
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentMethod, listPaymentMethodKey, companyKey, currency, exchangeRate, body]);

    useEffect(() => {
        if (body) {
            handlePutQuotation(body);
        }
    }, [body, handlePutQuotation]);

    useEffect(() => {
        if (quotations) {
            let total = 0;
            quotations.paymentTransactions.forEach((element) => {
                total += element.currencyAmounts[0].totalAmount;
            });
            setTotalPrice(total);
        }
    }, [quotations]);

    return (
        <>
            {fareOptionsDepartureFlightStr ? (
                <main className="relative">
                    <Steps />
                    <div className="flex flex-wrap justify-center p-4 min-h-screen bg-gray-100 border shadow">
                        <div className={` w-full max-w-[1200px]`}>
                            <Breadcrumb listBreadcrumb={listBreadcrumb} />
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <PassengersInfomation listPassengers={listPassengers} />
                                    <div className="mt-4">
                                        <div className="mb-4 bg-white p-4 rounded-md">
                                            <h3 className="font-medium flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id=""
                                                    checked={useVoucher}
                                                    onChange={() => {
                                                        setUseVoucher(!useVoucher);
                                                    }}
                                                    className="mr-2 h-4 w-4"
                                                />
                                                <i>Voucher</i>
                                            </h3>
                                            <div
                                                className={`grid grid-cols-2 gap-4 mt-4 ${
                                                    useVoucher ? 'grid' : 'hidden'
                                                }`}
                                            >
                                                <div className="col-span-2">
                                                    <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                        Mã thẻ quà tặng
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <input className="w-full outline-none border-b" type="text" />
                                                </div>
                                                <div className="col-span-1">
                                                    <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                        Mật khẩu
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <input className="w-full outline-none border-b" type="text" />
                                                </div>
                                                <div className="col-span-1">
                                                    <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                                        Mã PIN
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <input className="w-full outline-none border-b" type="text" />
                                                </div>
                                            </div>
                                        </div>
                                        <ListPaymentMethod
                                            setPaymentMethod={setPaymentMethod}
                                            listPaymentMethod={listPaymentMethod}
                                            useVoucher={useVoucher}
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
                                    </div>
                                    <div className="mt-4 bg-white p-4 rounded-md">
                                        <input
                                            type="checkbox"
                                            id="agreementCheckbox"
                                            value={agreementCheckbox}
                                            onChange={() => setAgreementCheckbox(!agreementCheckbox)}
                                            className="h-4 w-4"
                                        />
                                        <label className="ml-2" htmlFor="agreementCheckbox">
                                            Tôi đã đọc, hiểu và đồng ý với{' '}
                                            <a
                                                className="text-[#236FA1]"
                                                href="https://www.vietjetair.com/vi/pages/chinh-sach-ve-quyen-rieng-tu-1702461524009"
                                            >
                                                Chính sách về quyền riêng tư,{' '}
                                            </a>
                                            <a
                                                className="text-[#236FA1]"
                                                href="https://www.vietjetair.com/vi/pages/de-co-chuyen-bay-tot-dep-1578323501979/dieu-le-van-chuyen-1601835865384"
                                            >
                                                Điều lệ vận chuyển,{' '}
                                            </a>
                                            <a
                                                className="text-[#236FA1]"
                                                href="https://www.vietjetair.com/vi/pages/de-co-chuyen-bay-tot-dep-1578323501979/dieu-kien-ve-1641466500765"
                                            >
                                                Điều kiện vé{' '}
                                            </a>
                                            và {''}
                                            <a
                                                className="text-[#236FA1]"
                                                href="https://www.vietjetair.com/vi/pages/vat-dung-cam-mang-len-may-bay-1638837843950"
                                            >
                                                Quy định vật dụng bị cấm
                                            </a>{' '}
                                            mang lên chuyến bay
                                        </label>
                                    </div>
                                    <button
                                        onClick={checkValidation}
                                        className={`bg-sky-500 rounded text-white text-sm font-semibold px-10 py-2 mt-4 ${
                                            paymentMethod.identifier == '' ||
                                            !agreementCheckbox ||
                                            !((paymentMethod.identifier === 'VJPVI' ||
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
                                                cardInfo.cardNumber)
                                                ? 'grayscale'
                                                : ''
                                        }`}
                                        disabled={
                                            paymentMethod.identifier == '' ||
                                            !agreementCheckbox ||
                                            !((paymentMethod.identifier === 'VJPVI' ||
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
                                                cardInfo.cardNumber)
                                        }
                                    >
                                        {loading ? (
                                            <div role="status">
                                                <svg
                                                    aria-hidden="true"
                                                    className="inline w-6 h-6 text-gray-200 animate-spin fill-green-500"
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
                                        ) : (['AG', 'VI'].includes(paymentMethod.identifier) || ((paymentMethod.identifier === 'VJPVI' ||
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
                                                cardInfo.cardNumber)) ? (
                                            'Thanh toán'
                                        ) : paymentMethod.identifier == 'PL' ? (
                                            'Giữ chỗ'
                                        ) : (
                                            'Tiếp theo'
                                        )}
                                    </button>
                                </div>
                                <div className="col-span-1">
                                    <PriceInfomation
                                        departureFlight={departureFlight}
                                        returnFlight={returnFlight}
                                        roundTrip={roundTrip}
                                        adult={adult}
                                        child={child}
                                        infant={infant}
                                        cityPair={cityPair}
                                        departureCity={departureCity}
                                        arrivalCity={arrivalCity}
                                        setTotalPrice={setTotalPrice}
                                        fareOptionsDepartureFlight={fareOptionsDepartureFlight}
                                        fareOptionsReturnFlight={fareOptionsReturnFlight}
                                        baggageTotalPrice={baggageTotalPrice}
                                        seatTotalPrice={seatTotalPrice}
                                        mealTotalPrice={mealTotalPrice}
                                        insuranceTotalPrice={insuranceTotalPrice}
                                        processingAmount={quotations?.paymentTransactions[0]?.processingCurrencyAmounts[0]?.totalAmount || 0}
                                    />
                                    {/* <FlightInfomation departureFlight={departureFlight} returnFlight={returnFlight} /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            ) : (
                <div className="min-h-screen">
                    <span>Loading...</span>
                </div>
            )}
        </>
    );
}