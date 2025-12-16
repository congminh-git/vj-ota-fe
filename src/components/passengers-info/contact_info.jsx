export default function ContactInfomation({ contactInfomation, setContactInfomation }) {
    const handleOptionChange = (event) => {
        setContactInfomation({ ...contactInfomation, gender: event.target.value });
    };
    return (
        <div className="bg-white p-3 sm:p-4 rounded-md mt-4">
            <h3 className="mb-2 font-medium">
                <i>Thông tin liên hệ</i>
            </h3>
            <p className="mb-4 text-sm font-medium text-gray-500">
                Mã đặt chỗ sẽ được gửi tới thông tin liên hệ dưới đây
            </p>
            <div className="grid grid-cols-2 gap-6 sm:gap-8">
                <div className="col-span-1 w-full border px-2 py-1 rounded relative">
                    <label htmlFor="" className="text-sm text-gray-500 font-medium">
                        Họ
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        onChange={(e) => {
                            const updatedLastName = e.target.value
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .replace(/Đ/g, 'D')
                                .replace(/đ/g, 'd')
                                .toUpperCase();
                            setContactInfomation({ ...contactInfomation, lastName: updatedLastName });
                        }}
                        value={contactInfomation.lastName || ''}
                        className="w-full outline-none"
                        type="text"
                    />
                    <p className="text-red-500 thong-tin-lien-he-ho text-sm absolute top-2 right-2"></p>
                </div>
                <div className="col-span-1 w-full border px-2 py-1 rounded relative">
                    <label htmlFor="" className="text-sm text-gray-500 font-medium">
                        Tên đệm và tên
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        onChange={(e) => {
                            const updatedFirstName = e.target.value
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .replace(/Đ/g, 'D')
                                .replace(/đ/g, 'd')
                                .toUpperCase();
                            setContactInfomation({ ...contactInfomation, firstName: updatedFirstName });
                        }}
                        value={contactInfomation.firstName || ''}
                        className="w-full outline-none"
                        type="text"
                    />
                    <p className="text-red-500 thong-tin-lien-he-ten-dem-ten text-sm absolute top-2 right-2"></p>
                </div>
                <div className="col-span-1 w-full border px-2 py-1 rounded relative">
                    <label htmlFor="" className="text-sm text-gray-500 font-medium">
                        Số điện thoại
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center text-sm">
                        {/* <div className="w-5 h-4 bg-[url('/globalImages/vietnamicon.png')] bg-cover rounded-full"></div>
                        <p className="ml-2">+84</p> */}
                        <input
                            value={contactInfomation.phoneNumber || ''}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setContactInfomation({ ...contactInfomation, phoneNumber: value });
                            }}
                            className="w-full outline-none"
                            type="text"
                        />
                    </div>
                    <p className="text-red-500 thong-tin-lien-he-so-dien-thoai text-sm absolute top-2 right-2"></p>
                </div>
                <div className="col-span-1 w-full border px-2 py-1 rounded relative">
                    <label htmlFor="" className="text-sm text-gray-500 font-medium">
                        Email
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        onInput={(e) => setContactInfomation({ ...contactInfomation, email: e.target.value })}
                        className="w-full outline-none"
                        value={contactInfomation.email || ''}
                        type="text"
                    />
                    <p className="text-red-500 thong-tin-lien-he-email text-sm absolute top-2 right-2"></p>
                </div>
                <div className="col-span-1 flex flex-col justify-between">
                    <label htmlFor="" className="text-sm text-gray-500 font-medium">
                        Xưng danh
                        <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex justify-start items-center thong-tin-lien-he-gioi-tinh`}>
                        <label>
                            <input
                                checked={contactInfomation.gender == 'nam' ? true : false}
                                className="mr-2"
                                type="radio"
                                value="nam"
                                name="xung-danh-lien-he"
                                onChange={handleOptionChange}
                            />
                            Ông
                        </label>
                        <label className="ml-8">
                            <input
                                checked={contactInfomation.gender == 'nu' ? true : false}
                                className="mr-2"
                                type="radio"
                                value="nu"
                                name="xung-danh-lien-he"
                                onChange={handleOptionChange}
                            />
                            Bà
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}