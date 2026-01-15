export const ChevronDoubleRight = ({ className, strokeWidth }: { className: string; strokeWidth: string }) => {
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
            <path stroke="none" d="M0 0h24v24H0z" /> <polyline points="7 7 12 12 7 17" />
            <polyline points="13 7 18 12 13 17" />
        </svg>
    );
};
