var malep = document.getElementById("malep");
var femalep = document.getElementById("femalep");

// Stats hidden at start
document.getElementById("stats").style.display = "none";


// Update the relevant fields with the new data
function setStats(stats) {
    malep.innerHTML = stats.male;
    femalep.innerHTML = stats.female;
    // Set tweet text
    setTweet(stats.male, stats.female);
}

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function() {
    // ...query for the active tab...
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        // ...and send a request for the DOM info...
        chrome.tabs.sendMessage(
            tabs[0].id, {
                from: 'popup',
                subject: 'stats'
            },
            // ...also specifying a callback to be called
            //    from the receiving end (content script)
            setStats);
    });
});


// TWEET

var tweetB = document.getElementById("tweet-button");
var tweetText;
var tweetUrl;

tweetB.onclick = function() {

    chrome.tabs.create({
        active: true,
        url: tweetUrl
    });
};

function setTweet(m, f) {
    tweetText = "There's " + m + "% male presence vs " + f + "% female presence on this page.";
    var activeTab;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(arrayOfTabs) {
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        activeTab = arrayOfTabs[0];

        // Set the tweet text and parameters
        console.log(activeTab.url);
        tweetUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweetText) + "&url=" + activeTab.url + "&hashtags="+ "WomenInMedia" + "&via=sheChromeExtension";
        document.getElementById("stats").style.display = "block";
        tweetB.style.color = "red";
    });
}
