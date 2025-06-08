const express = require('express');

function initExpress(token, port) {
    const app = express();

    // parse the updates to JSON
    app.use(express.json());

    app.get('/', (req, res) => {
        res.json({
            timestamp: new Date().toLocaleDateString(),
            msg: 'Hi. resultMsg!'
        })

    });

    // We are receiving updates at the route below!
    app.post(`/bot${token}`, (req, res) => {
        bot.processUpdate(req.body);
        res.sendStatus(200);
    });


    // Start Express Server
    app.listen(port, () => {
        console.log(`Express server is listening on ${port}`);
    });
}

module.exports = {
    initExpress
}

