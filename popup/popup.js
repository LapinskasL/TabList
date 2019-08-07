console.log("popup.js running");

window.onload = function() {
    let launchList1 = document.getElementById('launchList1');
    launchList1.addEventListener("click", ()=> restoreAndLaunch("1"));

    let launchList2 = document.getElementById('launchList2');
    launchList2.addEventListener("click", ()=> restoreAndLaunch("2"));

    let launchList3 = document.getElementById('launchList3');
    launchList3.addEventListener("click", ()=> restoreAndLaunch("3"));
    console.log("popup window.onload ran");

    restoreListNames();
    let gearOptions = document.getElementById('gearIcon');
    gearOptions.addEventListener("click", function () {
        chrome.runtime.openOptionsPage();
    });
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
        listName1: "",
        listName2: "",
        listName3: "",
    }, function(items) {
        let labels = document.getElementsByTagName('label'); 
        labels[0].innerHTML = items.listName1;
        labels[1].innerHTML = items.listName2;
        labels[2].innerHTML = items.listName3;
    });  
}

function restoreAndLaunch(number) {
    console.log("restoring is happening");
    // Use default value comments = false and playlists = false.
    chrome.storage.sync.get({
        websiteList1: "",
        websiteList2: "",
        websiteList3: "",
    }, function(items) {
        switch (number) {
            case "1":
                sendMessageToOptions(items.websiteList1);
                break;
            case "2":
                sendMessageToOptions(items.websiteList2);
                break;
            case "3":
                sendMessageToOptions(items.websiteList3);
                break;
            default:
                break;
        }
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


