const TelegramBot = require('node-telegram-bot-api');

const token = '7705924933:AAFT6jXwEszCnnYUYyrUx04GyH0eWVdnCzE';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
const chatId1 = 'id1';

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/check/, (msg, match) => {
    const chatId = msg.chat.id;
    // bot.sendMessage(chatId, "Welcome", {
    //     "reply_markup": {
    //         "keyboard": [["Sample text", "Second sample"], ["Keyboard"], ["I'm robot"]]
    //     }
    // });

    bot.sendMessage(chatId1, "오늘 기분이 어떠신가요? 😊?", {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '출근', callback_data: 'WORK' },
                    { text: '휴가', callback_data: 'VACATION' }
                ]
            ]
        }
    });

});

bot.on('callback_query', (callbackQuery) => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;

    // null check
    console.log("action ::", action);
    console.log("msg :: ", msg);

    // start
    let botMessage;
    switch (action) {
        case "WORK":
            botMessage = "WORK START!";
            break;
        case "VACATION":
            botMessage = "VACATION START!";
            break;
        default:
            botMessage = "ERROR VALUE!!!!??";
    }

    // 버튼 클릭에 대한 응답 메시지
  bot.sendMessage(msg.chat.id, botMessage);
  
  // 콜백 응답도 전송 (버튼 상태 업데이트용)
  bot.answerCallbackQuery(callbackQuery.id);

});

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     console.log("chatId ::", chatId);
//     console.log("message :: ", msg);
//     // send a message to the chat acknowledging receipt of their message
//     bot.sendMessage(chatId, 'Received your message');

// });

console.log("start TelegramBot");


// load Scheduler(일일 출근확인);
// require("./utils/scheduler");

const schedule = require('node-schedule');

let cnt = 0;
const job = schedule.scheduleJob('*/5 * * * * *', function () {
    console.log('The answer to life, the universe, and everything!');


    if (cnt == 0) {
        bot.sendPhoto(chatId1, "https://www.google.com/logos/doodles/2025/2025-korea-presidential-elections-6753651837110783-l.webp",
            { caption: "Here we go ! \nThis is just a caption " }
        );


    }
    cnt += 1;
});



