function Breadcrumb({ listBreadcrumb }) {
    return (
        <div className="col-span-1 mb-4 rounded-lg">
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                        <a
                            href={`${listBreadcrumb[0].uri}`}
                            className="inline-flex items-center text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600"
                        >
                            {listBreadcrumb[0].title}
                        </a>
                    </li>
                    {listBreadcrumb.map((item, index) => {
                        if (index > 0) {
                            return (
                                <li key={index}>
                                    <div className="flex items-center">
                                        <svg
                                            className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 6 10"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 9 4-4-4-4"
                                            />
                                        </svg>
                                        <a
                                            href={`${item.uri}`}
                                            className={`ms-1 text-xs sm:text-sm ${
                                                index == listBreadcrumb.length - 1
                                                    ? 'text-gray-700 font-bold'
                                                    : 'text-gray-500 font-medium'
                                            }  hover:text-blue-600 md:ms-2`}
                                        >
                                            {item.title}
                                        </a>
                                    </div>
                                </li>
                            );
                        }
                    })}
                </ol>
            </nav>
        </div>
    );
}

export default Breadcrumb;