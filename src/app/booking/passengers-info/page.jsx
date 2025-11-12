'use client';

import Breadcrumb from '@/components/breadcrumb';
import PassengerInfomation from '@/components/passengers-info/passenger_info';
import Steps from '@/components/select-flight/steps';
import ContactInfomation from '@/components/passengers-info/contact_info';
import FlightInfomation from '@/components/passengers-info/journey_info';
import PriceInfomation from '@/components/passengers-info/price_info';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PassengerInfomationPage() {
    const router = useRouter();
    const [contactInfomation, setContactInfomation] = useState({
        firstName: null,
        lastName: null,
        phoneNumber: null,
        email: null,
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

    useEffect(()=>{ 
        if(!fareOptionsDepartureFlight) {
            router.replace('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[fareOptionsDepartureFlight])

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
                    document.querySelector(`.passengers-info-sdt-${index}`).innerHTML =
                        'Vui lòng nhập số điện thoại';
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

            if ((element.dob && isAbove14(element.dob)) && (!element.idType || element.idType == '')) {
                document.querySelector(`.passengers-info-id-type-${index}`).innerHTML = 'Vui lòng chọn loại ID';
                validateCount += 1;
            } else {
                document.querySelector(`.passengers-info-id-type-${index}`).innerHTML = '';
            }

            if ((element.dob && isAbove14(element.dob)) && !element.number) {
                document.querySelector(`.passengers-info-passport-${index}`).innerHTML = 'Vui lòng nhập passport / cccd';
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
        {
            fareOptionsDepartureFlight
            ?
                <main className="relative mt-[74px] sm:mt-0">
                    <Steps />
                    {departureFlight ? (
                        <div className="flex flex-wrap justify-center sm:p-4 p-2 min-h-screen bg-gray-100 border shadow">
                            <div className={` w-full max-w-[1200px]`}>
                                <Breadcrumb listBreadcrumb={listBreadcrumb} />
                                <div className="grid grid-cols-7 gap-4">
                                    <div className="col-span-7 sm:col-span-5">
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
                                        <button
                                            onClick={checkValidation}
                                            className="bg-sky-500 rounded text-white text-sm font-semibold px-10 py-2 mt-4 w-full sm:w-fit"
                                        >
                                            Tiếp theo
                                        </button>
                                    </div>
                                    <div className="col-span-7 sm:col-span-2">
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
                                        {/* <FlightInfomation departureFlight={departureFlight} returnFlight={returnFlight} /> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center min-h-screen">
                            <div role="status" className="mt-16">
                                <svg
                                    aria-hidden="true"
                                    className="w-8 h-8 text-gray-200 animate-spin fill-green-600"
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
                </main>
            :
            <div className='min-h-screen'>
                <span>Loading...</span>
            </div>
        }
        </>
    );
}