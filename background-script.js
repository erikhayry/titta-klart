
/*
Log that we received the message.
Then display a notification. The notification contains the URL,
which we read from the message.
*/
function notify(message) {
    if(typeof browser !== 'undefined'){
        browser.notifications.create({
            'type': 'basic',
            'iconUrl': browser.extension.getURL('icons/logo@2x.png'),
            'title': 'Titta klart',
            'message':  message.daysLeft
        });

    } else if(typeof chrome !== 'undefined'){
        chrome.notifications.create('days-left', {
            'type': 'basic',
            'iconUrl': 'icons/logo@2x.png',
            'title': 'Titta klart',
            'message':  message.daysLeft
        }, function (id) {
            chrome.notifications.clear(id)
        })
    }
}

if(typeof browser !== 'undefined') {
    browser.runtime.onMessage.addListener(notify);
} else if(typeof chrome !== 'undefined'){
    chrome.runtime.onMessage.addListener(notify);
}