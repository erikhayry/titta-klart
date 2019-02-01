const crawl = require('./utils.js');

function onPage($, result = {}, error, res, done){
    const videoEl = $('[data-video-id]');
    result[res.options.uri] = videoEl[0] ? videoEl[0].attribs["data-video-id"] : '';
    return result;
}

function onDone(result){
    return new Promise((resolve, reject) => {
        resolve(result)
    });
}

module.exports = function(urls) {
    return crawl(onPage, urls, onDone)
};