moment.locale('se', {
    monthsShort: [
        'jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'
    ],
    weekdaysShort : [
        'Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'
    ]
});

function handleCalender(dateString){
    return dateString
        .replace('imorgon', moment().day(1).format("ddd"))
        .replace('ikväll', moment().day(0).format("ddd"))
}

function checkTempo(){
    const dateEl = document.querySelectorAll('.play_video-page__meta-data-holder .play_video-page__meta-data-item')[1];
    const titleEl = document.querySelectorAll('.play_video-page__title-element')[0];
    const numberOfEpisodes = document.querySelectorAll('[id^="section-sasong"] li').length || document.querySelectorAll('[class^="play_related-list lp_"] li').length;
    const numberOfEpisodesWatched = document.querySelectorAll('[id^="section-sasong"] span[aria-valuenow|="100"]').length || document.querySelectorAll('[class^="play_related-list lp_"] span[aria-valuenow|="100"]').length;

    if(dateEl && numberOfEpisodes > 0){
        const dateString = dateEl.textContent.split(' (')[0];
        const numberOfEpisodesLeft = numberOfEpisodes - numberOfEpisodesWatched;
        const dateFormatted = moment(handleCalender(dateString), ['ddd D MMM H.m', 'D MMM H.m', 'ddd H.m']);

        if(dateFormatted.isValid()){
            const daysLeft = moment(dateFormatted).diff(moment(), 'days');
            const title = titleEl ? titleEl.textContent : 'den här serien';
            let message = '';

            if(daysLeft > numberOfEpisodesLeft){
                message = `Du behöver se ett avsnitt var ${Math.floor(daysLeft/numberOfEpisodesLeft)} dag för att hinna se klart säsongen av ${title}`;

            } else {
                const numberOfEpisodesPerDay = daysLeft === 0 ? numberOfEpisodesLeft : numberOfEpisodesLeft/daysLeft;
                message = `Du behöver se minst ${numberOfEpisodesPerDay} avsnitt varje dag för att hinna se klart säsongen av ${title}`;
            }

            if(typeof browser !== 'undefined') {
                browser.runtime.sendMessage({'daysLeft': message});

            } else if(typeof chrome !== 'undefined'){
                chrome.runtime.sendMessage({'daysLeft': message});
            }
        } else {
            console.log(`Datum ${dateString} är i fel format`);
        }
    }
}

new MutationObserver(function() {
    setTimeout(function(){
        checkTempo();
    }, 2000)
}).observe(document.querySelector('title'), { childList: true });


checkTempo();

