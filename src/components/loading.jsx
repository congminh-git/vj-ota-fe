import { Circle } from "./icons/circle";

function Loading() {
    return (
        <div className="flex justify-center">
            <div role="status" className="">
                <Circle className={'w-8 h-8 text-gray-200 animate-spin fill-green-600'} />
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export default Loading;
