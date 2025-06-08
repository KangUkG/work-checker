const { WORK_STATUS, clients } = require("../config/config");
const fileUtil = require("../utils/file-util");
const dateUtil = require("../utils/date-util");
const messages = require("../bot/messages");

const pth = require("path");
// telegramBot load
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELE_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// callback variables
const CHECK_WORK = 'WORK';
const CHECK_VACATION = 'VACATION';

const TOTAL_LASTMONTH = "LASTMONTH";
const TOTAL_THISMONTH = "THISMONTH";

//callback-type
const CB_TYPE_CHECK = "CHECK";
const CB_TYPE_TOTAL = "TOTAL";


bot.setMyCommands([
    { command: '/check', description: '오늘 출근여부 확인' },
    { command: '/total', description: '총 출근일 출력' },
]);

bot.onText(/\/keywords/, (msg, _) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Show 'KEYWORDS' on your keyboard", {
        "reply_markup": {
            "keyboard": [["/check", "/total"]],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
});


bot.onText(/\/total/, (msg, _) => {
    const chatId = msg.chat.id;
    const thisMonth = dateUtil.getDate("YYYYMM");
    const lastMonth = dateUtil.getLastMonth("YYYYMM");

    bot.sendMessage(chatId, "몇 월?", {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: `📅  ${lastMonth.slice(4)}월  `, callback_data: JSON.stringify({ label: TOTAL_LASTMONTH, val: lastMonth }) },
                    { text: `📅  ${thisMonth.slice(4)}월  `, callback_data: JSON.stringify({ label: TOTAL_THISMONTH, val: thisMonth }) }
                ]
            ]
        }
    });
});


// 입력한 년, 월 출근 일수 반환
bot.onText(/\/total (.+)/, (msg, _) => {
    // /total YYYYMM -> YYYYMM 얻기
    const match = msg.text.match(/\d{6}/);
    const yyyymm = match ? match[0] : null;
    if (!yyyymm) {
        bot.sendMessage(msg.chat.id, messages.error.invalidFormat);
    }

    const dirPath = dateUtil.getDate("YYYYMM");

    const files = fileUtil.openFiles(dirPath);
    // YYYYMM에 기록이 없을 경우
    if (!files || files.length === 0) {
        bot.sendMessage(msg.chat.id, messages.error.noFiles);
        return;
    }

    let work = 0;
    let nowork = 0;
    let total = 0;
    files.forEach(f => {
        if (!f.isFile) return;
        const filePath = pth.join(dirPath, f.name);
        const workdays = loadWorkdays(filePath); // [ [ '2025-06-07', '1' ], [ '2025-06-08', '0' ] ]

        // total 더하고
        total += workdays.length;
        // 순회하면서 1, 0에 맞춰 값++
        workdays.forEach(([_, isWorked]) => {
            parseInt(isWorked) ? work++ : nowork++;
        })
    });

    let botMessage = `총 ${total}일 중 ${work}일 출근, ${nowork}일 휴무입니다.`;
    bot.sendMessage(msg.chat.id, botMessage, {
        reply_markup: {
            remove_keyboard: true
        }
    });
});

bot.on('callback_query', (callbackQuery) => {
    const action = JSON.parse(callbackQuery.data);
    const msg = callbackQuery.message;

    console.log(callbackQuery);
    console.log("action ::", action);
    console.log("msg :: ", msg);

    // validation1 : null check
    if (!action || !msg) {
        throw new Error("NULL ACTION OR MESSAGE");
    }

    // validation2 : data check
    const today = dateUtil.getDate("YYYY-MM-DD");

    // start
    let botMessage;
    let content;
    let cbType;
    switch (action.label) {
        case CHECK_WORK:
            cbType = CB_TYPE_CHECK;
            botMessage = `🟢 출근했습니다. \n 📅 ${today}`;
            content = [today, WORK_STATUS.WORK.val + "\n"].join(",");
            break;
        case CHECK_VACATION:
            cbType = CB_TYPE_CHECK;
            botMessage = `🟡 휴무입니다. \n 📅 ${today}`;
            content = [today, WORK_STATUS.VACATION.val + "\n"].join(",");
            break;
        case TOTAL_LASTMONTH:
            cbType = CB_TYPE_TOTAL;
            console.log("hihi");
            break;
        case TOTAL_THISMONTH:
            cbType = CB_TYPE_TOTAL;
            console.log("hihi2");
            break;
        default:
            botMessage = messages.error.invalidAction + action.label;
    }


    // callback_type에 맞는 로직처리리
    if (cbType === CB_TYPE_CHECK) {
        console.log("content :: ", content);

        const fileName = dateUtil.getWeekOfMonth() + ".txt";
        const filePath = pth.join(dateUtil.getDate("YYYYMM"), fileName);

        const workdays = loadWorkdays(filePath);
        const duplicated = workdays.findIndex((v) => v[0] === today);
        if (duplicated != -1) {
            bot.sendMessage(msg.chat.id, messages.warn.alreadyCheck);
            bot.answerCallbackQuery(callbackQuery.id);
            return;
        }

        // 파일에 기록 
        fileUtil.writeFile(filePath, content);

    }
    else if (cbType === CB_TYPE_TOTAL) {
        // const dirPath = dateUtil.getDate("YYYYMM");
        const dirPath = action.val;
        if (!dirPath) {
            botMessage = messages.error.invalidFormat;
        }

        const files = fileUtil.openFiles(dirPath);
        // YYYYMM에 기록이 없을 경우
        if (!files?.length) {
            botMessage = messages.error.noFiles;
        } else {
            let work = 0;
            let nowork = 0;
            let total = 0;
            files.forEach(f => {
                if (!f.isFile) return;
                const filePath = pth.join(dirPath, f.name);
                const workdays = loadWorkdays(filePath); // [ [ '2025-06-07', '1' ], [ '2025-06-08', '0' ] ]
    
                // total 더하고
                total += workdays.length;
                // 순회하면서 1, 0에 맞춰 값++
                workdays.forEach(([_, isWorked]) => {
                    parseInt(isWorked) ? work++ : nowork++;
                })
            });
    
            botMessage = `총 ${total}일 중 ${work}일 출근, ${nowork}일 휴무입니다.`;
        }
    }

    // 버튼 클릭에 대한 응답 메시지
    bot.sendMessage(msg.chat.id, botMessage, {
        reply_markup: {
            remove_keyboard: true
        }
    });

    // 콜백 응답도 전송 (버튼 상태 업데이트용)
    bot.answerCallbackQuery(callbackQuery.id);

});

bot.onText(/\/check/, (msg, _) => {
    const chatId = msg.chat.id;

    // client 목록에 포함되어 있는지 확인
    console.log(clients, chatId);
    const target = clients.find(client => client.id == chatId);
    if (!target) {
        bot.sendMessage(chatId, messages.error.unauthorizedUser);
        return;
    }

    // 출근 확인 메세지 전송
    bot.sendMessage(chatId, "오늘 출근 했나요?", {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '출근', callback_data: JSON.stringify({ label: CHECK_WORK, val: '' }) },
                    { text: '휴가', callback_data: JSON.stringify({ label: CHECK_VACATION, val: '' }) }
                ]
            ]
        }
    });
});

function loadWorkdays(path) {
    const rawdata = fileUtil.openFile(path);
    const { data } = fileUtil.parseCsv(rawdata);
    return data.map(d => d.split(","));
}

module.exports = bot;