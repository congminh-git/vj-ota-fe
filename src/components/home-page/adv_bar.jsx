function AdvBar() {
    // const listElementAdv = useRef(null);
    // const [view, setView] = useState(0);

    // useEffect(() => {
    //     const advElementBlock = document.querySelector('.list-adv');
    //     if (advElementBlock) {
    //         listElementAdv.current = Array.from(advElementBlock.children);
    //     }

    //     const interval = setInterval(() => {
    //         listElementAdv.current.map((item, index) => {
    //             if (index < view + 3) {
    //                 item.style.display = 'block';
    //             } else {
    //                 item.style.display = 'none';
    //             }
    //             if (view == 3) {
    //                 setView(0);
    //             } else {
    //                 setView(view + 1);
    //             }
    //         });
    //         console.log(listElementAdv.current);
    //     }, 10000);

    //     return () => clearInterval(interval);
    // }, []);
    return (
        <div className="w-full">
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full h-96 list-adv">
                <div className="col-span-1 w-full h-full rounded-md bg-cover bg-[url('/adv1.jpg')]"></div>
                <div className="hidden sm:block col-span-1 w-full h-full rounded-md bg-cover bg-[url('/adv2.jpg')]"></div>
                <div className="hidden md:block col-span-1 w-full h-full rounded-md bg-cover bg-[url('/adv3.png')]"></div>
                <div className="hidden col-span-1 w-full h-full rounded-md bg-cover bg-[url('/adv4.png')]"></div>
                <div className="hidden col-span-1 w-full h-full rounded-md bg-cover bg-[url('/adv5.jpg')]"></div>
                <div className="hidden col-span-1 w-full h-full rounded-md bg-cover bg-[url('/adv6.jpg')]"></div>
            </div>
            <div className="w-full flex justify-center mt-2">
                <div className="flex justify-center">
                    <button className="w-2 h-2 mx-1 rounded-full bg-gray-200"></button>
                    <button className="w-8 h-2 mx-1 rounded-full bg-sky-300"></button>
                    <button className="w-2 h-2 mx-1 rounded-full bg-gray-200"></button>
                    <button className="w-2 h-2 mx-1 rounded-full bg-gray-200"></button>
                </div>
            </div>
        </div>
    );
}

export default AdvBar;