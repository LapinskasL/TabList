console.log("popup.js running");

window.onload = function() {

    positionBlocks();

    let tabIcons = document.getElementsByClassName('tabIcon');
    for (let i = 0; i < tabIcons.length; i++) {
        tabIcons[i].addEventListener("click", ()=> restoreAndLaunch(i));
    }

    restoreListNames();

    let gearOptions = document.getElementById('gearIcon');
    gearOptions.addEventListener("click", function () {
        chrome.runtime.openOptionsPage();
    });

    console.log("popup window.onload ran");
};

function nameIfEmpty(string, num) {
    if (string == "") {
        return "Name" + num;
    } else {
        return string;
    }
}

function restoreListNames() {
    chrome.storage.sync.get({
        listNames: [],
    }, function(items) {
        let tabNames = document.getElementsByClassName('tabName');
        let listNames = items.listNames;
        console.log(listNames[0]);
        for (let i = 0; i < tabNames.length; i++) {
            tabNames[i].innerHTML = listNames[i];
        }
    });  
}

function restoreAndLaunch(index) {
    console.log("restoring is happening"); 
    chrome.storage.sync.get({
        websiteList: [],
    }, function(items) {
        sendMessageToOptions(items.websiteList[index]);
    });
  }

function sendMessageToOptions(theList) {
    //save_options();
    console.log("popup sendMessage ran");
    if (theList !== "") {
        chrome.runtime.sendMessage({
            msg: "launchList",
            linkString: theList
        });
    }
}

function positionBlocks() {
    let tabBlocks = document.getElementsByClassName('tabBlock');

    let left = 1;
    for (let i = 0; i < tabBlocks.length; i++) {
        tabBlocks[i].style.position = "absolute";
        tabBlocks[i].style.top = "0.8em";
        tabBlocks[i].style.left = left + "em";
        left += 6;
        console.log(left);
    }
}
