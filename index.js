// global variable load

// config load
require("./config/config");

// util load
require("./utils/file-util");
require("./utils/date-util");

// telegramBot load
const { initTelegramBot, checkWorking } = require("./bot/telegram-bot");

let bot;
if (process.env.IS_WEBHOOK_MODE == 0) {
    // pooling 모드
    bot = initTelegramBot(process.env.TELE_TOKEN);

} else if (process.env.IS_WEBHOOK_MODE == 1) {
    // webhook 모드
    bot = initTelegramBot(process.env.TELE_TOKEN, process.env.IS_WEBHOOK_MODE, process.env.BOT_URL);

    // express load
    const { initExpress } = require("./server/server");
    initExpress(process.env.TELE_TOKEN, process.env.BOT_PORT);

} else {
    throw new Error("Unhandling MODE");
}

console.log("============== Success Load Telegram Bot ==============");

// scheduler load
const schedule = require('node-schedule');

// job1 :  매일 아침 9시 주말이 아닌 평일인 경우에 출근여부 확인 
// schedule.scheduleJob('0 0 9 * * *', checkWorking.bind("botArgsssss"));
schedule.scheduleJob('0 0 9 * * *', checkWorking.bind(null, bot));

console.log("============== Success Load Scheduler ==============");

// job2 : 이번달 workDay 데이터 load
// const job2 = schedule.scheduleJob('*/5 * * * * *', () => {

// });



