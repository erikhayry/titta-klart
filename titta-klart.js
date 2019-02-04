console.log('titta klart')
const VERSION = '1.0.0';
const TITTA_KLART_API_URL = 'https://titta-klart-api.now.sh';
const SVT_VIDEO_API_URL = 'https://api.svt.se/videoplayer-api/video/';

let GLOBAL_IS_NOTIFIED = false;
Sentry.init({
    dsn: 'https://119e710167b34a6a877b58ad0610f6f7@sentry.io/1381535'
});
Sentry.configureScope((scope) => {
    scope.setTag("version", VERSION);
});

function notify(message){
    if(typeof browser !== 'undefined') {
        browser.runtime.sendMessage({'daysLeft': message});
        GLOBAL_IS_NOTIFIED = true

    } else if(typeof chrome !== 'undefined'){
        chrome.runtime.sendMessage({'daysLeft': message});
        GLOBAL_IS_NOTIFIED = true
    } else {
        Sentry.captureMessage('Unable to send message to background script');
    }
}

async function getEpisodeByUrl(url){
    return fetch(TITTA_KLART_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({urls: [url]})
        })
        .then(res => res.json())
        .then((data) => getEpisode(data[url]))
        .catch(error => console.error(error));
}

async function getEpisode(id){
    return fetch(SVT_VIDEO_API_URL + id)
        .then(res => res.json())
        .then(json => {
            const { rights: { validTo }, episodeTitle, programTitle } = json;
            return {
                validTo,
                programTitle,
                episodeTitle,
                title: programTitle + ' - ' + episodeTitle
            }
        })
        .catch(err => {
            console.log(err)
        })
}

async function getNextEpisode(currentEpisodeUrl, episodeEls){
    const currentEpisodeUrlCleaned = currentEpisodeUrl
        .replace(location.search, '')
        .replace(location.hash, '');

    const currentEpisodeIndex = Array.prototype.slice.call(episodeEls).findIndex(episodeEl => {
        const href = episodeEl.getElementsByTagName('a')[0].href;

        return href.indexOf(currentEpisodeUrlCleaned) > -1;
    });

    if(currentEpisodeIndex > -1){
        const nextEpisodeEl = episodeEls[currentEpisodeIndex + 1];
        if(nextEpisodeEl){
            return getEpisodeByUrl(nextEpisodeEl.getElementsByTagName('a')[0].href)
        }
    }

    return Promise.resolve({});
}

function isVideoPage(){
    const numberOfSlashesInUrl = (location.href.match(/\//g) || []).length;
    const numberOfVideoAndSlashesInUrl = (location.href.match(/\/video\//g) || []).length;

    return numberOfVideoAndSlashesInUrl === 1 && numberOfSlashesInUrl === 6
}

function getEpisodeNumberAndTotal(){
    const videoDescriptionEl = document.querySelectorAll('.play_video-page__title-element--description')[0];
    const videoDescription = videoDescriptionEl ? videoDescriptionEl.textContent : '';
    const episodeOfTotal = videoDescription.match(/Del (.*) av (.*)\w/);
    const [episodeNumber, totalNumberOfEpisodes] = episodeOfTotal && episodeOfTotal.length > 0? episodeOfTotal[0].replace('Del ', '') .split(' av ') : [undefined, undefined];

    return {
        episodeNumber, totalNumberOfEpisodes
    }
}

function getVideoPage(){
    const videoEl = document.querySelectorAll('[data-video-id]')[0];
    const seasonEpisodesEls = document.querySelectorAll('[id^="section-sasong"] li');
    const episodeEls =  seasonEpisodesEls.length ? seasonEpisodesEls : document.querySelectorAll('[class^="play_related-list lp_"] li');
    const numberOfEpisodes = episodeEls.length;
    const numberOfEpisodesWatched =
        document.querySelectorAll('[id^="section-sasong"] span[aria-valuenow|="100"]').length ||
        document.querySelectorAll('[class^="play_related-list lp_"] span[aria-valuenow|="100"]').length;
    const lastEpisodeEl = episodeEls[episodeEls.length - 1];
    const numberOfEpisodesLeft = numberOfEpisodes - numberOfEpisodesWatched;
    const {episodeNumber, totalNumberOfEpisodes} = getEpisodeNumberAndTotal();



    return {
        videoEl,
        episodeEls,
        numberOfEpisodes,
        lastEpisodeEl,
        numberOfEpisodesLeft,
        episodeNumber,
        totalNumberOfEpisodes
    }
}

function handleSeasonWithSameValidToDates(validTo, numberOfEpisodesLeft, title){
    let message = '';
    const daysLeft = moment(validTo).diff(moment(), 'days');

    if(daysLeft > numberOfEpisodesLeft){
        message = `Du behöver se ett avsnitt var ${Math.floor(daysLeft/numberOfEpisodesLeft)} dag för att hinna se klart säsongen av ${title}`;

    } else {
        const numberOfEpisodesPerDay = daysLeft === 0 ? numberOfEpisodesLeft : numberOfEpisodesLeft/daysLeft;
        message = `Du behöver se minst ${numberOfEpisodesPerDay} avsnitt varje dag för att hinna se klart säsongen av ${title}`;
    }
    notify(message);
}

async function handleSeasonWithDifferentValidToDates(episodeEls, videoEl){
    //TODO handle different valid to dates (calendar ics, notify end of video, browser push)

    const { validTo, title } = await getNextEpisode(location.href, episodeEls);

    if(validTo && title){
        const daysLeft = moment(validTo).diff(moment(), 'days');
        const message = `Nästa avsnitt finns kvar i ${daysLeft} dag(ar) och heter ${title}`;

        videoEl.addEventListener("timeupdate", () => {
            if(!GLOBAL_IS_NOTIFIED && videoEl.duration - videoEl.currentTime < 60){
                notify(message);
            }
        }, true);
    } else {
        console.log('No more episodes in list')
    }
}

async function analyzePage(){
    GLOBAL_IS_NOTIFIED = false;

    if(isVideoPage()) {
        const { videoEl, episodeEls, numberOfEpisodes, lastEpisodeEl, numberOfEpisodesLeft, episodeNumber, totalNumberOfEpisodes } = getVideoPage();
        console.log(episodeNumber, totalNumberOfEpisodes);

        //There is a video and additional content to watch
        if(videoEl && numberOfEpisodes > 0) {
            const {validTo, title} = await getEpisode(videoEl.attributes['data-video-id'].value);

            if(validTo){
                const {validTo: lastEpisodeValidToDate} = await getEpisodeByUrl(lastEpisodeEl.getElementsByTagName('a')[0].href);

                //This video and the last one of the seaons got the same valid to date so we assume all videos got the same date
                if(validTo === lastEpisodeValidToDate){
                    handleSeasonWithSameValidToDates(validTo, numberOfEpisodesLeft, title)

                } else {
                    handleSeasonWithDifferentValidToDates(episodeEls, videoEl)
                }

                //TODO handle uppcoming
            } else {
                const error = `validTo date "${validTo}" is missing`;
                Sentry.captureMessage(error);
                console.error(error);
            }
        } else {
            const error = 'Unable to calculate tempo';
            Sentry.captureMessage(error);
            console.error(error);
        }
    }
}

new MutationObserver(function() {
    setTimeout(function(){
        analyzePage();
    }, 2000)
}).observe(document.querySelector('title'), { childList: true });

analyzePage();