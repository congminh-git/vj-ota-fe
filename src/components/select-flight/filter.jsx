import FilterBySeatClass from './filter_by_fareClass';
import FilterByPrice from './filter_by_price';
import FilterByStopPoint from './filter_by_airport';
import FilterDepartmentTime from './filter_by_date';

function Filter() {
    return (
        <div className="col-span-1 p-4 bg-white rounded-lg hidden sm:block">
            <FilterByPrice />
            <FilterByStopPoint />
            <FilterDepartmentTime />
            <FilterBySeatClass />
        </div>
    );
}

export default Filter;