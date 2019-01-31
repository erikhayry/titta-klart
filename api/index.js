const { json, send } = require('micro')
const { router, post } = require('microrouter')
const cors = require('micro-cors')()
const api = require('./api.js')

module.exports = router(
    cors(post('/', async (req, res) => {
        const body = await json(req);
        const date = await api(body.url);
        console.log('date', date)
        send(res, 200, date)
    }))
);