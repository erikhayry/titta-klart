console.log('barnvakten')
const VERSION = '1.0.0';
const TITTA_KLART_API_URL = 'https://titta-klart-api.now.sh';
const SVT_VIDEO_API_URL = 'https://api.svt.se/videoplayer-api/video/';

let GLOBAL_IS_NOTIFIED = false;
//Sentry.init({
//    dsn: 'https://119e710167b34a6a877b58ad0610f6f7@sentry.io/1381535'
//});
//Sentry.configureScope((scope) => {
//    scope.setTag("version", VERSION);
//});

const queue = [
    "https://www.svtplay.se/video/2520376/pippi-langstrump/pippi-langstrump-sasong-1-avsnitt-1",
    "https://www.youtube.com/watch?v=BQxo3LR_lWY",
    "https://www.oppetarkiv.se/video/10678783/bamse-varldens-starkaste-bjorn-sasong-1-avsnitt-2-av-7",
    "https://www.svtplay.se/video/19323091/greta-gris/greta-gris-sasong-7-zoo"
];

function start(){
    const videoEl = document.querySelector('video');
    const svtPlayBtn = document.querySelectorAll('.svp_js-splash--btn-play')[0];

    if(videoEl){
        console.log(videoEl, svtPlayBtn)
        if(svtPlayBtn){
            svtPlayBtn.click()
        } else {
            videoEl.play();
        }

        videoEl.addEventListener("canplay", () => {
            console.log('canplay')
        }, true);

        videoEl.addEventListener("loadeddata", () => {
            console.log('loadeddata')
        }, true);

        let index = parseInt(location.search.slice(1).split('=')[1]);
        console.log('index', index);
        if (!document.fullscreenElement) {
            videoEl.requestFullscreen().then({}).catch(err => {
                console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                const svtFullScreenBtn = document.querySelectorAll('.svp_js-controls-btn--fullscreen')[0];
                console.log(svtFullScreenBtn)
                if(svtFullScreenBtn){
                    svtFullScreenBtn.click()
                }
            });
        } else {
            document.exitFullscreen();
        }

        videoEl.addEventListener("timeupdate", () => {
            console.log('timeupdate')
            if(videoEl.duration - videoEl.currentTime < 10){
                videoEl.pause();
                const newUrl = queue[index + 1] + '?barnvaktIndex=' + (index + 1);
                console.log('paused', newUrl)
                location.href = newUrl;
            }
        }, true);
    }
}



setTimeout(function(){
    start();
}, 2000)