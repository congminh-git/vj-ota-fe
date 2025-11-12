'use client';

export default function BangQuanLyFilter({
    searchValue,
    setSearchValue,
    soDongHienThi,
    setSoDongHienThi,
    thoiGianGioiHan,
    setThoiGianGioiHan,
    tinhTrangThanhToan,
    setTinhTrangThanhToan,
}) {
    return (
        <div className="flex justify-between font-semibold">
            <div>
                <input
                    onInput={(e) => setSearchValue(e.target.value.toUpperCase())}
                    className="border rounded-md outline-none py-2 px-4"
                    type="text"
                    placeholder="Tìm theo mã đặt chỗ"
                />
                <select
                    onChange={(e) => setSoDongHienThi(e.target.value)}
                    className="border rounded-md outline-none py-2 px-4 ml-2"
                    style={{ padding: '9px 12px' }}
                    name=""
                    id=""
                >
                    <option value="15">15</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                </select>
            </div>
            <div className="">
                <select
                    onChange={(e) => setThoiGianGioiHan(e.target.value)}
                    className="border rounded-md outline-none py-2 px-4"
                    style={{ padding: '9px 12px' }}
                    name=""
                    id=""
                >
                    <option value="Tất cả">Tất cả</option>
                    <option value="7 ngày gần nhất">7 ngày gần nhất</option>
                </select>
                <select
                    onChange={(e) => setTinhTrangThanhToan(e.target.value)}
                    className="border rounded-md outline-none py-2 px-4 ml-2"
                    style={{ padding: '9px 12px' }}
                    name=""
                    id=""
                >
                    <option value="Tất cả">Tất cả</option>
                    <option value="Đã thanh toán">Đã thanh toán</option>
                    <option value="Đặt chỗ">Đặt chỗ</option>
                </select>
            </div>
        </div>
    );
}