console.log('Titta klart')

function checkTempo(){
  let dateEl = document.querySelectorAll('.play_video-page__meta-data-holder .play_video-page__meta-data-item')[1]
  let numberOfEpisodes = document.querySelectorAll('[id^="section-sasong"] li').length;
  let numberOfEpisodesWatched = document.querySelectorAll('[id^="section-sasong"] span[aria-valuenow|="100"]').length

  console.log(dateEl, numberOfEpisodes, numberOfEpisodesWatched)

  if(dateEl && numberOfEpisodes > 0){
    let dateString = dateEl.textContent.split(' (')[0].split(' ');
    let numberOfEpisodesLeft = numberOfEpisodes - numberOfEpisodesWatched;
    let dateFormatted = moment(`${dateString[1]} ${dateString[2]} ${dateString[3]}`, "D MMM H.m");

    if(dateFormatted.isValid()){
      let daysLeft = moment(dateFormatted).diff(moment(), 'days');

      console.log(dateFormatted, daysLeft)

      if(daysLeft > numberOfEpisodesLeft){
        console.log(`Du behöver se ett avsnitt var ${Math.floor(daysLeft/numberOfEpisodesLeft)} dag för att hinna se klart serien` )
      } else {
        console.log(`Du behöver se minst ${numberOfEpisodesLeft/daysLeft} avsnitt varje dag för att hinna se klart serien` )
      }      
    } else {
    console.log('Kan inte räkna ut tempo, fel datumformat')
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

