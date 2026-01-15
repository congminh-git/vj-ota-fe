import { ChevronRight } from "../icons/chevronRight";

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
                    <ChevronRight className={`h-5 w-5 ${active ? 'text-yellow-400' : 'text-gray-500'} hidden sm:block`} strokeWidth={"2"}/>
                )}
            </div>
        </div>
    );
}

export default StepItem;