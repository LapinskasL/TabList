//todo: implement deletion function

console.log("popup.js running");

window.onload = function() {
    loadTabBlocks();
    document.getElementById("plusIcon").addEventListener("click", addTab);
    console.log("popup window.onload ran");
};

function loadTabBlocks() {
    chrome.storage.sync.get({
        tabBlocks: 1,
    }, function(items) {
        initialLoad(items.tabBlocks);
    });  
}

function initialLoad(numOfBlocks) {
    for (let i = 0; i < numOfBlocks; i++) {
        createNewTabBlock();
    }

    retrieveTabInfo();

    let gearOptions = document.getElementById('gearIcon');
    gearOptions.addEventListener("click", function () {
        chrome.runtime.openOptionsPage();
    });

    let trashClosedIcon = document.getElementById('trashClosedIcon');
    trashClosedIcon.addEventListener("click", function() {
        trashClosedIcon.style.display = "none";
        let trashOpenedIcon = document.getElementById('trashOpenedIcon');
        trashOpenedIcon.style.display = "inline";
        let deleteIcons = document.getElementsByClassName('deleteIcon');
        for (let i = 0; i < deleteIcons.length; i++) {
            deleteIcons[i].style.display = "inline";
        }

        trashOpenedIcon.addEventListener("click", function() {
            trashOpenedIcon.style.display = "none";
            trashClosedIcon.style.display = "inline";
            for (let i = 0; i < deleteIcons.length; i++) {
                deleteIcons[i].style.display = "none";
            }
        });
    });
}

function retrieveTabInfo() {
    var tabBlockNum = document.getElementsByClassName('tabBlock').length;
    setNumOfTabBlocks(tabBlockNum);

    let tabIcons = document.getElementsByClassName('tabIcon');
    for (let i = 0; i < tabIcons.length; i++) {
        tabIcons[i].addEventListener("click", ()=> restoreAndLaunch(i));
    }
    restoreListNames();
}


function setNumOfTabBlocks(num) {
    chrome.storage.sync.set({
        tabBlocks: num,
    });
}

function addTab() {
    chrome.storage.sync.get({
        tabBlocks: 1,
    }, function(items) {
        if (items.tabBlocks <= 9) {
            createNewTabBlock();
            retrieveTabInfo();
            chrome.runtime.sendMessage({
                msg: "newTab",
            });
        }
    }); 
    
}


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
        tabBlocks: 1,
    }, function(items) {
        let tabNames = document.getElementsByClassName('tabName');
        let listNames = resizeArray(items.listNames, items.tabBlocks);
        console.log(listNames[0]);
        for (let i = 0; i < tabNames.length; i++) {
            tabNames[i].innerHTML = listNames[i];
        }
    });  
}

function restoreAndLaunch(index) {
    console.log("restoring is happening"); 
    chrome.storage.sync.get({
        websiteList: [""],
        tabBlocks: 1,
    }, function(items) {
        resizeArray(items.websiteList, items.tabBlocks);
        //websiteList.length = 3;
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


function createNewTabBlock() {
    var tabBlockDiv = document.createElement("div");
    tabBlockDiv.className = "tabBlock";

    var label = document.createElement("label");
    label.className = "tabName";

    var tabIconImg = document.createElement("img");
    tabIconImg.className = "tabIcon";
    tabIconImg.src = "../images/tab1.png";

    var deleteIconImg = document.createElement("img");
    deleteIconImg.className = "deleteIcon";
    deleteIconImg.src = "../images/delete.png";

    tabBlockDiv.appendChild(label);
    tabBlockDiv.appendChild(document.createElement("br"));
    tabBlockDiv.appendChild(tabIconImg);
    tabBlockDiv.appendChild(deleteIconImg);

    document.getElementById("tabBlockDivWrapper").appendChild(tabBlockDiv);
}


//Duplicate function (same in options.js). Fix later
function resizeArray(arr, size) {
    if (arr.length !== size) {
        arr.length = size;
        for (let i = 0; i < size; i++) {
            if (arr[i] == null || arr[i] == undefined) {
                arr[i] = "";
            }
        }
    }
    return arr;
}