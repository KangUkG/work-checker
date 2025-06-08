const dotenv = require('dotenv');
const fileUtil = require("../utils/file-util");

// MODE에 맞춰 환경변수 불러오기
if (process.env.MODE === 'local') {
    dotenv.config({ path: "config/.env.local" });

} else if (process.env.MODE === 'prod') {
    dotenv.config({ path: "config/.env" });
}


// 허용한 client 목록 load
const { clients } = require("./clients.json");


const WORK_STATUS = {
    "WORK": { label: "WORK", val: 1 },
    "VACATION": { label: "VACATION", val: 0 },
}
Object.freeze(WORK_STATUS);

module.exports = {
    clients, WORK_STATUS
};