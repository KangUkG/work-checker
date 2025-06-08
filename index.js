// global variable load

// config load
// const { clients } = require("./config/config");

// telegramBot load
const { checkWorking } = require("./bot/telegram-bot");



// scheduler load
const schedule = require('node-schedule');

// job1 :  매일 아침 9시 주말이 아닌 평일인 경우에 출근여부 확인 
schedule.scheduleJob('0 0 9 * * *', checkWorking);


// job2 : 이번달 workDay 데이터 load
// const job2 = schedule.scheduleJob('*/5 * * * * *', () => {

// });



