function ConsecutiveDayItem({ flyingDay, active }) {
    const date = new Date(flyingDay);
    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const dateFormat = `${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
    return (
        <div
            className={`h-full col-span-1 p-2 bg-opacity-50 rounded-md text-sm font-semibold cursor-pointer border-2 border-transparent hover:bg-sky-100 hover:border-sky-500 hover:text-sky-500
            ${active ? 'bg-sky-500 text-white' : 'bg-sky-200 text-sky-500'}`}
        >
            <p className="w-full text-center hidden sm:block">{dayOfWeek}</p>
            <p className="w-full text-center">{dateFormat}</p>
        </div>
    );
}

export default ConsecutiveDayItem;