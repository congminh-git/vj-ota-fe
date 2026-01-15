export function getCurrentTimestamp() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export const parseNgayThang = (input) => {
    if (typeof input === 'string') {
        let [datePart, timePart] = input.split(' ');
        let [year, month, day] = datePart.split('-');
        return {
            date: `${day}-${month}-${year}`,
            time: timePart.split(':').slice(0, 2).join(':'),
        };
    } else {
        return {
            date: null,
            time: null,
        };
    }
};

export function tinhThoiGianBay(startTime, endTime) {
    let start = new Date(startTime);
    let end = new Date(endTime);
    let timeDiff = Math.abs(end - start);
    let hours = Math.floor(timeDiff / 3600000);
    let minutes = Math.floor((timeDiff % 3600000) / 60000);
    return `${hours}h${minutes}`;
}