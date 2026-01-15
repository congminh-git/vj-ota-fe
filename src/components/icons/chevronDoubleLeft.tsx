export const ChevronDoubleLeft = ({ className, strokeWidth }: { className: string; strokeWidth: string }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path stroke="none" d="M0 0h24v24H0z" /> <polyline points="11 7 6 12 11 17" />{' '}
            <polyline points="17 7 12 12 17 17" />
        </svg>
    );
};
