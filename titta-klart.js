var browser = browser || chrome;

console.log('Titta klart')
moment.locale('se', {
    monthsShort: [
        'jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'
    ],
    weekdaysShort : [
        "Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"
    ]
});

function checkTempo(){
  let dateEl = document.querySelectorAll('.play_video-page__meta-data-holder .play_video-page__meta-data-item')[1]
  let numberOfEpisodes = document.querySelectorAll('[id^="section-sasong"] li').length;
  let numberOfEpisodesWatched = document.querySelectorAll('[id^="section-sasong"] span[aria-valuenow|="100"]').length

  console.log(dateEl, numberOfEpisodes, numberOfEpisodesWatched)

  if(dateEl && numberOfEpisodes > 0){
    let dateString = dateEl.textContent.split(' (')[0];
    let numberOfEpisodesLeft = numberOfEpisodes - numberOfEpisodesWatched;
    let dateFormatted = moment(dateString, "ddd D MMM H.m");

    if(dateFormatted.isValid()){
      let daysLeft = moment(dateFormatted).diff(moment(), 'days');
      let message = 'Kan inte räkna ut tempo, fel datumformat';

      console.log(dateFormatted, daysLeft)

      if(daysLeft > numberOfEpisodesLeft){
          message = `Du behöver se ett avsnitt var ${Math.floor(daysLeft/numberOfEpisodesLeft)} dag för att hinna se klart serien`;

      } else {
          message = `Du behöver se minst ${numberOfEpisodesLeft/daysLeft} avsnitt varje dag för att hinna se klart serien`;
          browser.runtime.sendMessage({"daysLeft": message});
      }

        browser.runtime.sendMessage({"daysLeft": message});
        console.log(message)
    }



  } else {
    console.log('Kan inte räkna ut tempo')
  }
}

new MutationObserver(function() {
  setTimeout(function(){
    checkTempo();    
  }, 2000)  
}).observe(document.querySelector('title'),{ childList: true });


checkTempo();

