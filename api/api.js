const crawl = require('./utils.js');
const fetch = require('node-fetch');

function getVideoData(videoId){
    return fetch('https://api.svt.se/videoplayer-api/video/' + videoId)
        .then(res => res.json())
        .then(json => json.rights.validTo)
}

function onPage($, result = {}, error, res, done){
    const videoEl = $('[data-video-id]');
    return videoEl[0] ? videoEl[0].attribs["data-video-id"] : undefined
}

function onDone(result){
    return new Promise((resolve, reject) => {
        resolve(result)
    });
}

module.exports = function(url) {
    return crawl(onPage, [url], onDone)
        .then(getVideoData)
};