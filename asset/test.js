

// config load
require("../config/config");



console.log(process.env.IS_WEBHOOK_MODE); 
const mode = process.env.IS_WEBHOOK_MODE;
if (mode == 0) {
    console.log("hi")
} else if (parseInt(mode) === 0) {
    console.log("hi2");
}
