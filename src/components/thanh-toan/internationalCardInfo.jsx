'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function InternationalCardInfoForm({ cardInfo, setCardInfo, billing, setBilling, show }) {
    const [cvvShow, setCvvShow] = useState(true);

    // Hàm chỉ trả về brand, KHÔNG gọi setState
    const detectCardBrand = (cardNumber) => {
        const s = (cardNumber || '').replace(/\s+/g, '');
        const first1 = s.slice(0, 1);
        const first2 = parseInt(s.slice(0, 2) || '0', 10);
        const first4 = parseInt(s.slice(0, 4) || '0', 10);

        if (!s) return 'NULL';
        if (first1 === '4') return 'VISA';
        if (first2 === 34 || first2 === 37) return 'AMERICAN EXPRESS';
        if ((first2 >= 51 && first2 <= 55) || (first4 >= 2221 && first4 <= 2720)) return 'MASTERCARD';
        if (first2 === 35 && first4 >= 3528 && first4 <= 3589) return 'JCB';
        return 'ERROR';
    };

    // Cập nhật cardType khi cardNumber thay đổi
    useEffect(() => {
        const brand = detectCardBrand(cardInfo.cardNumber);
        if (brand === 'NULL' || brand === 'ERROR') return;
        // use functional updater to avoid needing full `cardInfo` in deps
        setCardInfo((prev) => {
            if (prev.cardType === brand) return prev;
            return { ...prev, cardType: brand };
        });
    }, [cardInfo.cardNumber, setCardInfo]);

    return (
        <div className={`grid-cols-2 gap-12 my-4 p-4 bg-white rounded ${show ? 'grid' : 'hidden'}`}>
            <div>
                <p className="font-semibold mb-4">Thông tin thẻ</p>

                {/* Card Number */}
                <div className="mb-4 border px-3 py-2 rounded relative">
                    <label className="text-sm text-gray-600">
                        Số thẻ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardInfo.cardNumber}
                        className="w-full mt-1 outline-none bg-transparent pr-16"
                        onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            value = value.replace(/(.{4})/g, '$1 ').trim();
                            setCardInfo({
                                ...cardInfo,
                                cardNumber: value,
                            });
                        }}
                    />

                    {/* Detect & show logo */}
                    {(() => {
                        const brand = detectCardBrand(cardInfo.cardNumber);
                        switch (brand) {
                            case 'MASTERCARD':
                                return (
                                    <Image
                                        src="/Mastercard-logo.svg"
                                        alt="Mastercard"
                                        width={48}
                                        height={32}
                                        className="w-12 h-8 absolute right-2 top-7"
                                    />
                                );
                            case 'VISA':
                                return (
                                    <Image
                                        src="/Visa_Inc._logo.svg.png"
                                        alt="Visa"
                                        width={48}
                                        height={32}
                                        className="w-12 h-8 absolute right-2 top-7"
                                    />
                                );
                            case 'AMERICAN EXPRESS':
                                return (
                                    <Image
                                        src="/AmericanExpress.png"
                                        alt="American Express"
                                        width={48}
                                        height={32}
                                        className="w-12 h-8 absolute right-2 top-7"
                                    />
                                );
                            case 'JCB':
                                return (
                                    <Image
                                        src="/JCB_logo.svg.png"
                                        alt="JCB"
                                        width={48}
                                        height={32}
                                        className="w-12 h-8 absolute right-2 top-7"
                                    />
                                );
                            case 'ERROR':
                                return <p className="text-red-500 text-sm absolute right-2 top-7">Số thẻ không hợp lệ</p>;
                            default:
                                return null;
                        }
                    })()}
                </div>

                {/* Cardholder Name */}
                <div className="mb-4 border px-3 py-2 rounded">
                    <label className="text-sm text-gray-600">
                        Tên chủ thẻ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="cardName"
                        place="NGUYEN VAN AN"
                        value={cardInfo.cardName}
                        className="w-full mt-1 outline-none bg-transparent"
                        autoComplete="cc-name"
                        onChange={(e) => {
                            setCardInfo({
                                ...cardInfo,
                                cardName: e.target.value.toUpperCase(),
                            });
                        }}
                    />
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-1 border px-3 py-2 rounded">
                        <label className="text-sm text-gray-600">
                            Ngày hết hạn <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="expiryDate"
                            placeholder="MM/YY"
                            maxLength="5"
                            className="w-full mt-1 outline-none bg-transparent"
                            autoComplete="cc-exp"
                            value={cardInfo.expiryDate}
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length > 4) value = value.slice(0, 4);
                                if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                setCardInfo({
                                    ...cardInfo,
                                    expiryDate: value,
                                });
                            }}
                        />
                    </div>

                    <div className="col-span-1 border px-3 py-2 rounded relative">
                        <label className="text-sm text-gray-600">
                            Số CVV <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center mt-1">
                            <input
                                type={!cvvShow ? 'text' : 'password'}
                                name="cardCvv"
                                placeholder="•••"
                                value={cardInfo.cardCvv}
                                maxLength="4"
                                className="w-full outline-none bg-transparent pr-8"
                                autoComplete="cc-csc"
                                onChange={(e) => {
                                    setCardInfo({
                                        ...cardInfo,
                                        cvv: e.target.value,
                                    });
                                }}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-8 text-gray-500"
                                onClick={() => setCvvShow(!cvvShow)}
                            >
                                {cvvShow ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395m-8.635-13.877A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774m-11.544-11.544L3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <p className="font-semibold mb-4">Thông tin chủ thẻ</p>

                <div className="mb-4 border px-3 py-2 rounded">
                    <label className="text-sm text-gray-600">
                        Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={billing.address}
                        placeholder="Số nhà, tên đường"
                        className="w-full mt-1 outline-none bg-transparent"
                        onChange={(e) => {
                            setBilling({
                                ...billing,
                                address: e.target.value
                            });
                        }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="border px-3 py-2 rounded">
                        <label className="text-sm text-gray-600">
                            Thành phố <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={billing.city}
                            placeholder="Hồ Chí Minh"
                            className="w-full mt-1 outline-none bg-transparent"
                            onChange={(e) => {
                                setBilling({
                                    ...billing,
                                    city: e.target.value,
                                });
                            }}
                        />
                    </div>

                    <div className="border px-3 py-2 rounded">
                        <label className="text-sm text-gray-600">
                            Quốc gia <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="country"
                            className="w-full mt-1 outline-none bg-transparent"
                            value={billing.country} // nhớ thêm value để đồng bộ
                            onChange={(e) => {
                                setBilling({
                                    ...billing,
                                    country: e.target.value,
                                });
                                console.log('Country:', e.target.value);
                            }}
                        >
                            <option value="">Chọn quốc gia</option>
                            <option value="VNM">Việt Nam</option>
                            <option value="USA">United States</option>
                            <option value="JPN">Japan</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="border px-3 py-2 rounded">
                        <label className="text-sm text-gray-600">
                            Tỉnh/Bang <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="state"
                            value={billing.state}
                            placeholder="TP. Hồ Chí Minh"
                            className="w-full mt-1 outline-none bg-transparent"
                            onChange={(e) => {
                                setBilling({
                                    ...billing,
                                    state: e.target.value,
                                });
                            }}
                        />
                    </div>

                    <div className="border px-3 py-2 rounded">
                        <label className="text-sm text-gray-600">
                            Mã bưu điện <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="postalCode"
                            value={billing.postalCode}
                            placeholder="700000"
                            className="w-full mt-1 outline-none bg-transparent"
                            onChange={(e) => {
                                setBilling({
                                    ...billing,
                                    postalCode: e.target.value,
                                });
                            }}
                        />
                    </div>
                </div>

                <div className="border px-3 py-2 rounded flex items-center gap-3">
                    {/* Select mã quốc gia */}
                    <div className="flex items-center gap-2">
                        <select
                            className="text-sm border rounded px-2 py-1 outline-none bg-transparent"
                        >
                            <option value="+84">🇻🇳 +84</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+81">🇯🇵 +81</option>
                            <option value="+82">🇰🇷 +82</option>
                        </select>
                    </div>

                    {/* Input số điện thoại */}
                    <div className="flex-1">
                        <label className="text-sm text-gray-600">
                            Số điện thoại của bạn <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={billing.phone.replace("+84", "") || ''}
                            placeholder="912345678"
                            className="w-full mt-1 outline-none bg-transparent"
                            onChange={(e) => {
                                const rawPhone = e.target.value.replace(/\D/g, ''); // chỉ giữ số
                                setBilling({
                                    ...billing,
                                    phone: `${billing.countryCode || '+84'}${rawPhone}`,
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
