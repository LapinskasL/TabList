console.log("options.js running");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.msg) {
        case "newTab":
            undoJavaScriptHTML();
            initialLoad();
            break;
        case "removeTabSettings":
            chrome.storage.sync.get({
                tabIndex: -1,
            }, function(items) {
                removeTabSettings(items.tabIndex);
            }); 
            break;
    }
});

// function scrollDown() {
//     var testLists = document.getElementsByClassName('testList');
//     var testListLast = testLists.length - 1
//     testListLast[testListLast].scrollTop = testListLast[testListLast].scrollHeight;
// }

function removeTabSettings(index) {
    console.log("removeTabSettings aunched with index: " + index);
}

function undoJavaScriptHTML() {
    document.body.innerHTML = "";

    var h3 = document.createElement("h3");
    h3.innerHTML = "*Changes are saved automatically";

    var br = document.createElement("br");
    
    document.body.appendChild(h3);
    document.body.appendChild(br);
}

window.onload = function() {
    initialLoad();
}


function setSettings() {
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


function initialLoad() {
    chrome.storage.sync.get({
        tabBlocks: 1,
    }, function(items) {
        for (let i = 0; i < items.tabBlocks; i++) {
            createNewTabSettingsBlock(i + 1);
        }
        setSettings();
    }); 
}

function saveData() {
    // by passing an object you can define default values e.g.: []
    chrome.storage.sync.get({
        listNames: [],
        websiteList: [],
        tabBlocks: 1,
    }, function (items) {
        var listNames = resizeArray(items.listNames, items.tabBlocks);
        var websiteList = resizeArray(items.websiteList, items.tabBlocks);
        var listArr = document.getElementsByClassName('listName');
        var websiteListArr = document.getElementsByClassName('textbox');

        listNames = [];
        websiteList = [];

        for (let i = 0; i < items.tabBlocks; i++) {
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
        tabBlocks: 1,
    }, function(items) {
        var listArr = document.getElementsByClassName('listName');
        var textBoxes = document.getElementsByClassName('textbox');

        var listNames = resizeArray(items.listNames, items.tabBlocks);
        var websiteList = resizeArray(items.websiteList, items.tabBlocks);
        for (let i = 0; i < listArr.length; i++) {
            listArr[i].value = listNames[i];
            textBoxes[i].value = websiteList[i];
        }
    });
  }



  function createNewTabSettingsBlock(listNum) {
    var div = document.createElement("div");
    div.className = "tabSettingsBlock";

    var span = document.createElement("span");
    span.className = "listNameSpan";
    span.innerHTML = "List " + listNum + " name: ";

    var input = document.createElement("input");
    input.type = "text";
    input.maxLength = "10";
    input.className = "listName";

    var textarea = document.createElement("textarea");
    textarea.className = "textbox";
    textarea.wrap = "off";
    textarea.placeholder = "Paste each link on a new line";

    var button = document.createElement("button");
    button.className = "testList";
    button.type = "button";
    button.innerHTML = "Test List #" + listNum;

    div.appendChild(span);
    div.appendChild(input);
    div.appendChild(document.createElement("br"));
    div.appendChild(textarea);
    div.appendChild(document.createElement("br"));
    div.appendChild(button);

    document.body.appendChild(div);
    document.body.appendChild(document.createElement("br"));
    document.body.appendChild(document.createElement("br"));
    document.body.appendChild(document.createElement("br"));
}


//Duplicate function (same in popup.js). Fix later
function resizeArray(arr, size) {
    arr.length = size;
    for (let i = 0; i < size; i++) {
        if (arr[i] == null || arr[i] == undefined) {
            arr[i] = "";
        }
    }

    return arr;
}