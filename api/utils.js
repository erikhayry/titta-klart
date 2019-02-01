const Crawler = require("crawler");

const CRAWLER_CONF = {
    maxConnections : 10,
    retries: 1
};

module.exports = function crawl(onPage, urls, onDone){
    let result;
    return new Promise((resolve, reject) => {
        const crawler = new Crawler({
            ...CRAWLER_CONF,
            callback : function (error, res, done) {
                if(error){
                    console.log(error);
                } else{
                    const $ = res.$;
                    if($){
                        result = onPage($, result, error, res, done);
                    }
                }
                done();
            }
        });

        crawler.queue(urls);
        crawler.on('drain', function() {
            resolve(onDone(result))
        });
    })
}
