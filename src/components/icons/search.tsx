export const Search = ({ className, strokeWidth }: { className: string; strokeWidth: string }) => {
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
            {' '}
            <path stroke="none" d="M0 0h24v24H0z" /> <circle cx="10" cy="10" r="7" />{' '}
            <line x1="21" y1="21" x2="15" y2="15" />
        </svg>
    );
};
