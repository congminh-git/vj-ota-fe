function StepItem({ number, title, end, active }) {
    return (
        <div className={`items-center sm:ml-6 text-sm ${active ? 'flex' : 'hidden'} sm:flex`}>
            <div
                className={`w-8 h-8 flex justify-center items-center rounded-full bg-gray-200 font-medium ${
                    active ? 'text-white bg-yellow-400' : 'text-gray-500 bg-gray-200'
                }`}
            >
                {number}
            </div>
            <div>
                <span className={`${active ? 'text-yellow-400' : 'text-gray-500'} pl-2 pr-4`}>{title}</span>
            </div>
            <div>
                {end ? (
                    ''
                ) : (
                    <svg
                        className={`h-5 w-5 ${active ? 'text-yellow-400' : 'text-gray-500'} hidden sm:block`}
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
                        <path stroke="none" d="M0 0h24v24H0z" /> <polyline points="9 6 15 12 9 18" />
                    </svg>
                )}
            </div>
        </div>
    );
}

export default StepItem;