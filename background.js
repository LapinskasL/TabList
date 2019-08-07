console.log("background.js running");

function launch(stringOfLinks) {
    if (stringOfLinks.length > 0) {
        let webArray = makeLinkArray(stringOfLinks);

        chrome.windows.create({ url: webArray[0] }, function(win) {
            chrome.windows.update(win.id, { focused: true });
        }); 
    
        for (let i = 1; i < webArray.length; i++) {
            chrome.tabs.create({ url: webArray[i] });
        }
    }
}

function makeLinkArray(linkList) {
    let arrLinks = linkList.split('\n');
    for (let i = 0; i < arrLinks.length; i++) {
        if (arrLinks[i] != "" & arrLinks[i].includes("://") == false) {
           arrLinks[i] = "https://" + arrLinks[i];
        }
    }

    return arrLinks;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.msg) {
        case "launchList":
            launch(request.linkString);
            break;
    }
    return true;
});
