// global variable load

// config load
require("./config/config");

// util load
require("./utils/file-util");
require("./utils/date-util");

// telegramBot load
const { initTelegramBot, checkWorking } = require("./bot/telegram-bot");
const bot = initTelegramBot(process.env.TELE_TOKEN);


// scheduler load
const schedule = require('node-schedule');

// job1 :  매일 아침 9시 주말이 아닌 평일인 경우에 출근여부 확인 
// schedule.scheduleJob('0 0 9 * * *', checkWorking.bind("botArgsssss"));
schedule.scheduleJob('*/5 * * * * *', checkWorking.bind(null, bot));

// job2 : 이번달 workDay 데이터 load
// const job2 = schedule.scheduleJob('*/5 * * * * *', () => {

// });



