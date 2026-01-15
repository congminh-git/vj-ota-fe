export const SignalBars = ({ className, strokeWidth }: { className: string; strokeWidth: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            className={className}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25v7.5M4.5 8.25v7.5M17.25 6v12m-10.5-12v12M12 4.5v15"
            />
        </svg>
    );
};
