function ProposedFlightItem() {
    return (
        <div className="col-span-1 rounded-md shadow p-2">
            <div className="w-full flex justify-start">
                <div className="w-1/4 relative">
                    <div className="absolute inset-0">
                        <div className="bg-[url('/vietjet-airlines-logo.jpg')] h-full w-full bg-cover"></div>
                    </div>
                </div>
                <span className="text-xs font-medium p-2">VietjetAir</span>
            </div>
            <div className="text-sm">
                <i className="flex font-medium">
                    <span>Tân Sơn Nhất</span>
                    <span className="mx-2">
                        <svg
                            className="h-5 w-5"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {' '}
                            <path stroke="none" d="M0 0h24v24H0z" /> <line x1="5" y1="12" x2="19" y2="12" />{' '}
                            <line x1="15" y1="16" x2="19" y2="12" /> <line x1="15" y1="8" x2="19" y2="12" />
                        </svg>
                    </span>
                    <span>Nội bài</span>
                </i>
            </div>
            <div className="text-xs text-gray-500 mt-1">Khởi hành: 11/04/2024</div>
            <div className="mt-2 sm:mt-4 font-semibold text-sky-400">
                599.000
                <span>
                    <u>đ</u>
                </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
                Giá sau thuế: 1.200.000<u>đ</u>
            </div>
        </div>
    );
}

export default ProposedFlightItem;