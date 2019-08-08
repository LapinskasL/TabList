console.log("options.js running");

window.onload = function() {
    //@@@TEMPORARY GLOBAL?????
    textBoxesNum = document.getElementsByClassName('textbox').length;


    restoreData();

    let testButtons = document.getElementsByClassName('testList');
    let textBoxes = document.getElementsByClassName('textbox');
    let inputs = document.getElementsByTagName('input');

    for (let i = 0; i < textBoxes.length; i++) {
        testButtons[i].addEventListener("click", ()=> sendMessageToBackground(i));
        textBoxes[i].addEventListener("change", saveData);
        inputs[i].addEventListener("change", saveData);
    }
}


function saveData() {
    // by passing an object you can define default values e.g.: []
    chrome.storage.sync.get({
        listNames: [],
        websiteList: [],
    }, function (items) {
        var listNames = resizeArray(items.listNames, 3);
        var websiteList = resizeArray(items.websiteList, 3)
        var listArr = document.getElementsByClassName('listName');
        var websiteListArr = document.getElementsByClassName('textbox');

        listNames = [];
        websiteList = [];

        for (let i = 0; i < listArr.length; i++) {
            listNames.push(listArr[i].value);
            websiteList.push(websiteListArr[i].value);
        }
        // set the new array value to the same key
        chrome.storage.sync.set({
            listNames: listNames,
            websiteList: websiteList
        });
    });
}


function sendMessageToBackground(index) {
    chrome.runtime.sendMessage({
        msg: "launchList",
        linkString: document.getElementsByClassName("textbox")[index].value
    });
}


// Restores list into the textbox.
function restoreData() {
    console.log("restoring is happening");
    // Use default value comments = false and playlists = false.
    chrome.storage.sync.get({
        websiteList: [],       
        listNames: [],
    }, function(items) {
        var listArr = document.getElementsByClassName('listName');
        var textBoxes = document.getElementsByClassName('textbox');

        var listNames = resizeArray(items.listNames, 3);
        var websiteList = resizeArray(items.websiteList, 3)
        for (let i = 0; i < listArr.length; i++) {
            listArr[i].value = listNames[i];
            textBoxes[i].value = websiteList[i];
        }
    });
  }


function resizeArray(arr, size) {
    arr.length = size;
    for (let i = 0; i < size; i++) {
        if (arr[i] == null || arr[i] == undefined) {
            arr[i] = "";
        }
    }

    return arr;
}