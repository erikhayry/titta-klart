const { json, send } = require('micro')
const { router, post } = require('microrouter')
const cors = require('micro-cors')()
const api = require('./api.js')

module.exports = router(
    cors(post('/', async (req, res) => {
        const body = await json(req);
        const ids = await api(body.urls);
        send(res, 200, ids)
    }))
);