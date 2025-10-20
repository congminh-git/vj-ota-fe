import FilterBySeatClass from './bo_loc_theo_hang_ve';
import FilterByPrice from './bo_loc_theo_khoang_gia';
import FilterByStopPoint from './bo_loc_theo_diem_dung';
import FilterDepartmentTime from './bo_loc_theo_thoi_gian';

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