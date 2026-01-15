'use client';

import { useEffect, useState } from 'react';

function ListLowFareFlight({
  monthAndYear,
  departmentDate,
  setSelectDayConfirm,
  listLowFareFlight,
}) {
  const [calendar, setCalendar] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [minFare, setMinFare] = useState(null);

  const currency =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('currencySearchParam') ?? 'VND'
      : 'VND';

  function getWeeksOfMonth(yearMonth, listLowFareFlight) {
    const [year, month] = yearMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    let weeks = [];
    let currentWeek = [];

    let firstDay = new Date(year, month - 1, 1).getDay();
    let isoFirstDay = firstDay === 0 ? 7 : firstDay;
    let daysFromPrevMonth = isoFirstDay - 1;

    if (daysFromPrevMonth > 0) {
      const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
      for (
        let i = daysInPrevMonth - daysFromPrevMonth + 1;
        i <= daysInPrevMonth;
        i++
      ) {
        currentWeek.push(
          `${year}-${String(month - 1).padStart(2, '0')}-${String(i).padStart(
            2,
            '0',
          )}`,
        );
      }
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(
        `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
          2,
          '0',
        )}`,
      );
      let dayOfWeek = new Date(year, month - 1, day).getDay();
      let isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
      if (isoDayOfWeek === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      let daysFromNextMonth = 7 - currentWeek.length;
      for (let i = 1; i <= daysFromNextMonth; i++) {
        currentWeek.push(
          `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(
            2,
            '0',
          )}`,
        );
      }
      weeks.push(currentWeek);
    }

    weeks = weeks
      .map((week) =>
        week.map((date) => {
          let [y, m, d] = date.split('-').map(Number);
          if (m < 1) {
            y -= 1;
            m = 12;
          } else if (m > 12) {
            y += 1;
            m = 1;
          }
          const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(
            d,
          ).padStart(2, '0')}`;

          const index = listLowFareFlight.findIndex(
            (e) => e.departureDate === dateStr,
          );

          let totalAmount = 0;
          let discountAmount = 0;

          if (index !== -1) {
            totalAmount =
              listLowFareFlight[index].fareOption.fareCharges[0]
                .currencyAmounts[0].baseAmount;
            discountAmount = listLowFareFlight[index]
              ?.promoCodeApplicability?.promoCodeRequested
              ? listLowFareFlight[index].fareOption.fareCharges[0]
                  .currencyAmounts[0].discountAmount
              : 0;
          }

          return { date: dateStr, totalAmount, discountAmount };
        }),
      )
      .filter((week) =>
        week.some(
          (e) => parseInt(e.date.split('-')[1]) === month,
        ),
      );

    return weeks;
  }

  function isFutureDate(date) {
    const input = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return input >= today;
  }

  function formatNumber(str) {
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  useEffect(() => {
    if (monthAndYear && listLowFareFlight) {
      setCalendar(getWeeksOfMonth(monthAndYear, listLowFareFlight));
      let min = Number.MAX_SAFE_INTEGER;
      listLowFareFlight.forEach((e) => {
        const fare =
          e.fareOption.fareCharges[0].currencyAmounts[0].baseAmount;
        if (fare < min) min = fare;
      });
      setMinFare(min);
    }
  }, [monthAndYear, listLowFareFlight]);

  useEffect(() => {
    if (departmentDate) setSelectedDay(departmentDate);
  }, [departmentDate]);

  return (
    <div className="w-full overflow-hidden rounded-md shadow">
      <table className="w-full table-fixed text-gray-600">
        <thead className="bg-gray-50">
          <tr>
            {[
              'T2',
              'T3',
              'T4',
              'T5',
              'T6',
              'T7',
              'CN',
            ].map((d, i) => (
              <th
                key={i}
                className={`py-2 text-center text-[10px] sm:text-xs ${
                  d === 'CN' ? 'text-red-400' : ''
                }`}
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {calendar &&
            calendar.map((week, wi) => (
              <tr key={wi} className="border-b">
                {week.map((day, di) => {
                  const active =
                    day.date.split('-')[1] ===
                      monthAndYear.split('-')[1] &&
                    isFutureDate(day.date);

                  return (
                    <td
                      key={di}
                      className="border-r last:border-r-0 p-[2px]"
                    >
                      <button
                        disabled={!active}
                        onClick={() => {
                          setSelectedDay(day.date);
                          setSelectDayConfirm(day.date);
                        }}
                        className={`relative w-full rounded-md px-1 py-1
                          min-h-[56px] sm:min-h-[90px]
                          ${
                            selectedDay === day.date
                              ? 'bg-rose-200'
                              : day.totalAmount === minFare
                              ? 'bg-lime-400 text-white'
                              : 'bg-white'
                          }`}
                      >
                        <span className="absolute top-1 right-1 text-[9px] sm:text-xs">
                          {day.date.split('-')[2]}
                        </span>

                        {day.totalAmount > 0 && (
                          <>
                            {day.discountAmount > 0 && (
                              <p className="text-[9px] line-through">
                                {day.totalAmount.toLocaleString()}
                              </p>
                            )}

                            <p className="font-bold text-[11px] sm:text-lg">
                              {formatNumber(
                                (
                                  day.totalAmount -
                                  day.discountAmount
                                )
                                  .toString()
                                  .slice(0, -3),
                              )}
                            </p>

                            <p className="text-[9px] sm:text-sm">
                              {(day.totalAmount - day.discountAmount)
                                .toString()
                                .slice(-3)}
                              <span className="hidden sm:inline">
                                {currency}
                              </span>
                            </p>
                          </>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListLowFareFlight;
