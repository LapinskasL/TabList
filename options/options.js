//todo: implement color change function
//TODO:

//1. continue implementing color change function

console.log("options.js running");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.msg) {
        case "newTab":
            refreshPage();
            break;
        case "removeTabSettings":
            removeTabSettings(request.tabIndex);
            refreshPage();
            break;
    }

});

function refreshPage() {
    undoJavaScriptHTML();
    initialLoad();
}

function removeTabSettings(index) {
    let tabSettingsBlocks = document.getElementsByClassName('tabSettingsBlock');
    tabSettingsBlocks[index].remove();

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
        tabIconNum: ['0'],
    }, function(items) {
        for (let i = 0; i < items.tabBlocks; i++) {
            createNewTabSettingsBlock(i, items.tabIconNum[i]);
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



  function createNewTabSettingsBlock(index, colorNum) {
    var divBlock = document.createElement("div");
    divBlock.className = "tabSettingsBlock";

    var span = document.createElement("span");
    span.className = "listNameSpan";
    span.innerHTML = "List " + (index + 1) + " name: ";

    var input = document.createElement("input");
    input.type = "text";
    input.maxLength = "10";
    input.className = "listName";
    
    var divColor = document.createElement('div');
    divColor.className = "colorDisplay";

    var arrayOfColors = ['#42C8A5','#42C6C8','#42A4C9','#4184C8','#4262C7','#4242C8','#6642C8','#8842C7','#A741C8','#C842C5',
                         '#C842A3','#C94284','#C84362','#C84241','#C76244','#C88443','#C8A443','#C9C643','#A7C843','#86C842',
                         '#64C842','#42C843','#41C862','#42C785'];

    var select = document.createElement("select");
    select.id = "colorDropDown";

    for (let i = 0; i < 24; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.style = "background-Color: " + arrayOfColors[i];
        option.innerHTML = i;
        select.appendChild(option);
    }
    select.selectedIndex = colorNum;
    divColor.style = "background-color: " + arrayOfColors[colorNum];

    var textarea = document.createElement("textarea");
    textarea.className = "textbox";
    textarea.wrap = "off";
    textarea.placeholder = "Paste each link on a new line";

    var button = document.createElement("button");
    button.className = "testList";
    button.type = "button";
    button.innerHTML = "Test List #" + (index + 1);

    divBlock.appendChild(span);
    divBlock.appendChild(input);
    divBlock.appendChild(divColor);
    divBlock.appendChild(select);
    divBlock.appendChild(document.createElement("br"));
    divBlock.appendChild(textarea);
    divBlock.appendChild(document.createElement("br"));
    divBlock.appendChild(button);

    document.body.appendChild(divBlock);
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