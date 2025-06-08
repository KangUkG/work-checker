const d = require('dayjs');
const weekday = require('dayjs/plugin/weekday');
const weekOfYear = require('dayjs/plugin/weekOfYear');
const advancedFormat = require('dayjs/plugin/advancedFormat');

d.extend(weekday);
d.extend(weekOfYear);
d.extend(advancedFormat);


function getLastMonth(formatStr, targetDate) {
    const date = targetDate ? d(targetDate) : d();
    return date.add(-1, 'month').format(formatStr);
}

function getDate(formatStr, targetDate) {
    const date = targetDate ? d(targetDate) : d();
    return date.format(formatStr);
}

// true = 주말 / false = 평일
function isWeekend() {
    const today = d().day();
    return today == 0 || today === 6;
}

function getWeekOfMonth(targetDate) {
    const date = targetDate ? d(targetDate) : d();

    const firstDayOfMonth = date.startOf('month');
    const firstWeekday = firstDayOfMonth.day();

    // 오늘이 그 달의 며칠인지
    const dayOfMonth = date.date();

    // 해당 월의 몇번째 주인가? 
    return Math.ceil((firstWeekday + dayOfMonth) / 7);
}

module.exports = {
    getDate, isWeekend, getWeekOfMonth, getLastMonth
}