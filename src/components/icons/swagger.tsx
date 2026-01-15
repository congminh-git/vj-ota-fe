export const Swagger = ({ className, strokeWidth }: { className: string; strokeWidth: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className={className}
        >
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8c-1 .5-2 2-2 4s1 3.5 2 4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 8c1 .5 2 2 2 4s-1 3.5-2 4" />
            <circle cx="10.5" cy="12" r="0.8" />
            <circle cx="12" cy="12" r="0.8" />
            <circle cx="13.5" cy="12" r="0.8" />
        </svg>
    );
};
