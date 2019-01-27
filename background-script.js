var browser = browser || chrome;

/*
Log that we received the message.
Then display a notification. The notification contains the URL,
which we read from the message.
*/
function notify(message) {
    console.log("background script received message");
    browser.notifications.create({
        "type": "basic",
        "iconUrl": browser.extension.getURL("icons/link-48.png"),
        "title": 'Titta klart',
        "message":  message.daysLeft
    });
}
browser.runtime.onMessage.addListener(notify);