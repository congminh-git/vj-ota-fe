'use client';

import Breadcrumb from '@/components/breadcrumb';
import PassengerInfomation from '@/components/passengers-info/passenger_info';
import Steps from '@/components/select-flight/steps';
import ContactInfomation from '@/components/passengers-info/contact_info';
import FlightInfomation from '@/components/passengers-info/journey_info';
import PriceInfomation from '@/components/passengers-info/price_info';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/loading';
import ProgressLoading from '@/components/progress_loading';

export default function PassengerInfomationPage() {
    const router = useRouter();
    const [contactInfomation, setContactInfomation] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        gender: null,
        dob: null,
    });
    const [listPassenger, setListPassenger] = useState({
        listAdult: null,
        listChild: null,
        listInfant: null,
    });
    const cityPair = typeof window !== 'undefined' ? sessionStorage.getItem('cityPairSearchParam') : null;
    const departmentDate = typeof window !== 'undefined' ? sessionStorage.getItem('departmentDateSearchParam') : null;
    const returnDate = typeof window !== 'undefined' ? sessionStorage.getItem('returnDateSearchParam') : null;
    const roundTrip = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('roundTripSearchParam')) : null;
    const currency = typeof window !== 'undefined' ? sessionStorage.getItem('currencySearchParam') : null;
    const adult = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('adultSearchParam')) : null;
    const child = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('childSearchParam')) : null;
    const infant = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('infantSearchParam')) : null;
    const departureCity = typeof window !== 'undefined' ? sessionStorage.getItem('departureCitySearchParam') : null;
    const arrivalCity = typeof window !== 'undefined' ? sessionStorage.getItem('arrivalCitySearchParam') : null;
    const activeSelectFlightParam =
        typeof window !== 'undefined' ? sessionStorage.getItem('activeSelectFlightSearchParam') : null;
    const departureFlight =
        typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('departureFlight')) : null;
    const returnFlight = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('returnFlight')) : null;
    const fareOptionsDepartureFlight =
        typeof window !== 'undefined' ? sessionStorage.getItem('fareOptionsDepartureFlight') : null;
    const fareOptionsReturnFlight =
        typeof window !== 'undefined' ? sessionStorage.getItem('fareOptionsReturnFlight') : null;

    const listBreadcrumb = [
        { title: 'Tìm vé', uri: '/booking' },
        {
            title: 'Danh sách vé',
            uri: `/booking/select-flight?cityPair=${cityPair}&departure=${departmentDate}&roundTrip=${roundTrip}&comeback=${returnDate}&currency=${currency}&adultCount=${adult}&childCount=${child}&infantCount=${infant}&departureCity=${departureCity}&arrivalCity=${arrivalCity}&activeSelectFlight=${'đi'}`,
        },
        { title: 'Thông tin hành khách', uri: '/booking/passengers-info' },
    ];

    const convertToDate = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day); // month is 0-indexed in JavaScript
    };

    const calculateAge = (birthdate) => {
        const birthDate = new Date(convertToDate(birthdate));
        const today = new Date();
        // Calculate the difference in years
        let age = today.getFullYear() - birthDate.getFullYear();
        // Check if the birthday has already occurred this year
        const hasHadBirthdayThisYear =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
        // Adjust the age if the birthday hasn't occurred yet this year
        if (!hasHadBirthdayThisYear) {
            age -= 1;
        }
        return age;
    };

    const validateDob = (value) => {
        return !/^(\d{2})\/(\d{2})\/(\d{4})$/.test(value);
    };

    function isAbove14(birthDateStr) {
        const birthDate = new Date(birthDateStr);
        const today = new Date();
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 15);
        return birthDate <= minDate;
    }

    useEffect(() => {
        if (!fareOptionsDepartureFlight) {
            router.replace('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fareOptionsDepartureFlight]);

    useEffect(() => {
        let listAdult = [];
        let listChild = [];
        let listInfant = [];
        for (let i = 0; i < adult; i++) {
            listAdult.push({
                firstName: null,
                lastName: null,
                phoneNumber: null,
                email: null,
                gender: null,
                dob: null,
                idType: null,
                number: null,
            });
        }
        for (let i = 0; i < child; i++) {
            listChild.push({
                firstName: null,
                lastName: null,
                gender: null,
                dob: null,
            });
        }
        for (let i = 0; i < infant; i++) {
            listInfant.push({
                firstName: null,
                lastName: null,
                gender: null,
                dob: null,
                adultFollow: i,
            });
        }
        setListPassenger({
            listAdult: listAdult,
            listChild: listChild,
            listInfant: listInfant,
        });
    }, [infant, adult, child]);

    const checkValidation = () => {
        let validateCount = 0;
        if (!contactInfomation.gender) {
            document.querySelector('.thong-tin-lien-he-gioi-tinh').style.borderBottom = '1px solid rgb(239, 68, 68)';
            validateCount += 1;
        } else {
            document.querySelector('.thong-tin-lien-he-gioi-tinh').style.borderBottom = 'none';
        }

        if (!contactInfomation.lastName) {
            document.querySelector('.thong-tin-lien-he-ho').innerHTML = 'Vui lòng nhập họ';
            validateCount += 1;
        } else {
            document.querySelector('.thong-tin-lien-he-ho').innerHTML = '';
        }

        if (!contactInfomation.firstName) {
            document.querySelector('.thong-tin-lien-he-ten-dem-ten').innerHTML = 'Vui lòng nhập tên đệm và tên';
            validateCount += 1;
        } else {
            document.querySelector('.thong-tin-lien-he-ten-dem-ten').innerHTML = '';
        }

        if (!contactInfomation.email) {
            document.querySelector('.thong-tin-lien-he-email').innerHTML = 'Vui lòng nhập email';
            validateCount += 1;
        } else {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfomation.email)) {
                document.querySelector('.thong-tin-lien-he-email').innerHTML = 'Email không hợp lệ';
                validateCount += 1;
            } else {
                document.querySelector('.thong-tin-lien-he-email').innerHTML = '';
            }
        }

        if (!contactInfomation.phoneNumber) {
            document.querySelector('.thong-tin-lien-he-so-dien-thoai').innerHTML = 'Vui lòng nhập số điện thoại';
            validateCount += 1;
        } else {
            document.querySelector('.thong-tin-lien-he-so-dien-thoai').innerHTML = '';
        }

        listPassenger.listAdult.forEach((element, index) => {
            if (!element.lastName) {
                document.querySelector(`.passengers-info-ho-${index}`).innerHTML = 'Vui lòng nhập họ';
                validateCount += 1;
            } else {
                document.querySelector(`.passengers-info-ho-${index}`).innerHTML = '';
            }

            if (!element.firstName) {
                document.querySelector(`.passengers-info-ten-dem-ten-${index}`).innerHTML =
                    'Vui lòng nhập tên đệm và tên';
                validateCount += 1;
            } else {
                document.querySelector(`.passengers-info-ten-dem-ten-${index}`).innerHTML = '';
            }

            if (validateDob(element.dob)) {
                document.querySelector(`.passengers-info-ngay-sinh-${index}`).innerHTML =
                    'Vui lòng nhập đầy đủ ngày sinh';
                validateCount += 1;
            } else {
                if (calculateAge(element.dob) < 12) {
                    document.querySelector(`.passengers-info-ngay-sinh-${index}`).innerHTML =
                        'Người lớn phải từ 12 tuổi trở lên';
                    validateCount += 1;
                } else {
                    document.querySelector(`.passengers-info-ngay-sinh-${index}`).innerHTML = '';
                }
            }

            if (!element.gender) {
                document.querySelector(`.passengers-info-gioi-tinh-${index}`).style.borderBottom =
                    '1px solid rgb(239, 68, 68)';
                validateCount += 1;
            } else {
                document.querySelector(`.passengers-info-gioi-tinh-${index}`).style.borderBottom = 'none';
            }

            if (index === 0) {
                if (!element.phoneNumber) {
                    document.querySelector(`.passengers-info-sdt-${index}`).innerHTML = 'Vui lòng nhập số điện thoại';
                    validateCount += 1;
                } else {
                    document.querySelector(`.passengers-info-sdt-${index}`).innerHTML = '';
                }

                if (!element.email) {
                    document.querySelector(`.passengers-info-email-${index}`).innerHTML = 'Vui lòng nhập email';
                    validateCount += 1;
                } else {
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfomation.email)) {
                        document.querySelector(`.passengers-info-email-${index}`).innerHTML = 'Email không hợp lệ';
                        validateCount += 1;
                    } else {
                        document.querySelector(`.passengers-info-email-${index}`).innerHTML = '';
                    }
                }
            }

            if (element.dob && isAbove14(element.dob) && (!element.idType || element.idType == '')) {
                document.querySelector(`.passengers-info-id-type-${index}`).innerHTML = 'Vui lòng chọn loại ID';
                validateCount += 1;
            } else {
                document.querySelector(`.passengers-info-id-type-${index}`).innerHTML = '';
            }

            if (element.dob && isAbove14(element.dob) && !element.number) {
                document.querySelector(`.passengers-info-passport-${index}`).innerHTML =
                    'Vui lòng nhập passport / cccd';
                validateCount += 1;
            } else {
                document.querySelector(`.passengers-info-passport-${index}`).innerHTML = '';
            }
        });

        listPassenger.listChild.forEach((element, index) => {
            if (!element.lastName) {
                document.querySelector(`.thong-tin-tre-em-ho-${index}`).innerHTML = 'Vui lòng nhập họ';
                validateCount += 1;
            } else {
                document.querySelector(`.thong-tin-tre-em-ho-${index}`).innerHTML = '';
            }

            if (!element.firstName) {
                document.querySelector(`.thong-tin-tre-em-ten-dem-ten-${index}`).innerHTML =
                    'Vui lòng nhập tên đệm và tên';
                validateCount += 1;
            } else {
                document.querySelector(`.thong-tin-tre-em-ten-dem-ten-${index}`).innerHTML = '';
            }

            if (validateDob(element.dob)) {
                document.querySelector(`.thong-tin-tre-em-ngay-sinh-${index}`).innerHTML = 'Vui lòng nhập ngày sinh';
                validateCount += 1;
            } else {
                if (calculateAge(element.dob) < 2 || calculateAge(element.dob) > 11) {
                    document.querySelector(`.thong-tin-tre-em-ngay-sinh-${index}`).innerHTML =
                        'Trẻ em phải từ 2-11 tuổi';
                    validateCount += 1;
                } else {
                    document.querySelector(`.thong-tin-tre-em-ngay-sinh-${index}`).innerHTML = '';
                }
            }

            if (!element.gender) {
                document.querySelector(`.thong-tin-tre-em-gioi-tinh-${index}`).style.borderBottom =
                    '1px solid rgb(239, 68, 68)';
                validateCount += 1;
            } else {
                document.querySelector(`.thong-tin-tre-em-gioi-tinh-${index}`).style.borderBottom = 'none';
            }
        });

        listPassenger.listInfant.forEach((element, index) => {
            if (!element.lastName) {
                document.querySelector(`.thong-tin-em-be-ho-${index}`).innerHTML = 'Vui lòng nhập họ';
                validateCount += 1;
            } else {
                document.querySelector(`.thong-tin-em-be-ho-${index}`).innerHTML = '';
            }

            if (!element.firstName) {
                document.querySelector(`.thong-tin-em-be-ten-dem-ten-${index}`).innerHTML =
                    'Vui lòng nhập tên đệm và tên';
                validateCount += 1;
            } else {
                document.querySelector(`.thong-tin-em-be-ten-dem-ten-${index}`).innerHTML = '';
            }

            if (validateDob(element.dob)) {
                document.querySelector(`.thong-tin-em-be-ngay-sinh-${index}`).innerHTML = 'Vui lòng nhập ngày sinh';
                validateCount += 1;
            } else {
                if (calculateAge(element.dob) > 2) {
                    document.querySelector(`.thong-tin-em-be-ngay-sinh-${index}`).innerHTML = 'Em bé phải dưới 2 tuổi';
                    validateCount += 1;
                } else {
                    document.querySelector(`.thong-tin-em-be-ngay-sinh-${index}`).innerHTML = '';
                }
            }

            if (!element.gender) {
                document.querySelector(`.thong-tin-em-be-gioi-tinh-${index}`).style.borderBottom =
                    '1px solid rgb(239, 68, 68)';
                validateCount += 1;
            } else {
                document.querySelector(`.thong-tin-em-be-gioi-tinh-${index}`).style.borderBottom = 'none';
            }
        });

        const listSelectNguoiLonDiCung = [];
        const indexMap = {};
        const duplicates = [];

        listPassenger.listInfant.forEach((element1, index1) => {
            listSelectNguoiLonDiCung.push(element1.adultFollow);
        });
        listSelectNguoiLonDiCung.forEach((item, index) => {
            if (indexMap[item] !== undefined) {
                duplicates.push(indexMap[item], index);
            } else {
                indexMap[item] = index;
            }
        });

        const uniqueArr = [...new Set(duplicates)];
        listPassenger.listInfant.forEach((element, index) => {
            if (uniqueArr.includes(index)) {
                document.querySelector(`.thong-tin-em-be-nguoi-lon-di-cung-${index}`).innerHTML =
                    'Người lớn đi cùng bị trùng';
                validateCount += 1;
            } else {
                document.querySelector(`.thong-tin-em-be-nguoi-lon-di-cung-${index}`).innerHTML = '';
            }
        });

        if (validateCount === 0) {
            sessionStorage.setItem('listPassengers', JSON.stringify(listPassenger));
            sessionStorage.setItem('contactInfomation', JSON.stringify(contactInfomation));
            router.push(`/booking/add-on`);
        } else {
            console.log('Bạn đã chọn Cancel');
        }
    };

    return (
        <>
            {fareOptionsDepartureFlight ? (
                <main className="relative mt-[74px] sm:mt-0">
                    <Steps />
                    {departureFlight ? (
                        <div className="flex flex-wrap justify-center sm:p-4 p-2 min-h-screen bg-gray-100 border shadow">
                            <div className={` w-full max-w-[1200px]`}>
                                <Breadcrumb listBreadcrumb={listBreadcrumb} />
                                <div className="grid grid-cols-8 gap-4">
                                    <div className="col-span-8 sm:col-span-5">
                                        <PassengerInfomation
                                            listPassenger={listPassenger}
                                            setListPassenger={setListPassenger}
                                            contactInfomation={contactInfomation}
                                            setContactInfomation={setContactInfomation}
                                        />
                                        <ContactInfomation
                                            contactInfomation={contactInfomation}
                                            setContactInfomation={setContactInfomation}
                                        />
                                    </div>
                                    <div className="col-span-8 sm:col-span-3 hidden sm:block">
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
                                            fareOptionsDepartureFlight={fareOptionsDepartureFlight}
                                            fareOptionsReturnFlight={fareOptionsReturnFlight}
                                        />
                                        <button
                                            onClick={checkValidation}
                                            className="bg-yellow-400 hover:bg-yellow-500 rounded-md text-white text-sm font-semibold px-10 py-4 mt-4 w-full transition-all"
                                        >
                                            Tiếp theo
                                        </button>
                                    </div>
                                </div>
                                <div className='block sm:hidden fixed bottom-0 left-0 w-full bg-white p-2 sm:p-4 border-t shadow'>
                                    <button
                                        onClick={checkValidation}
                                        className="bg-yellow-400 hover:bg-yellow-500 rounded-md text-white text-sm font-semibold px-10 py-4 w-full transition-all block sm:hidden"
                                    >
                                        Tiếp theo
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Loading />
                    )}
                </main>
            ) : (
                <ProgressLoading loading={true} />
            )}
        </>
    );
}
