//todo: implement deletion function
//TODO:
//0. fix bug with deleting a tab and then trying to launch another one while still in the delete menu
//   This is an issue with indexes of tabs being preset after deletion.
//   POTENTIAL SOLUTION: repaste updated number of tabs   OR    rewrite their indexes?

//1. fix issue with spaces in tab names
//2. format tab names nicely
//3. make tab icons more varied and exciting to click on
//4. change addtab icon (maybe include a ghost tab when hovered over addtab icon. Or maybe
//   make the icon where a new tab would be.)



console.log('popup.js running');

window.onload = function() {
    loadTabBlocks();
    document.getElementById('plusIcon').addEventListener('click', addTab);
    console.log('popup window.onload ran');
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
    gearOptions.addEventListener('click', function () {
        chrome.runtime.openOptionsPage();
    });

    let plusIcon = document.getElementById('plusIcon');

    let trashClosedIcon = document.getElementById('trashClosedIcon');
    trashClosedIcon.addEventListener('click', function() {
        plusIcon.style.display = 'none';
        trashClosedIcon.style.display = 'none';
        let trashOpenedIcon = document.getElementById('trashOpenedIcon');
        trashOpenedIcon.style.display = 'inline';
        let deleteIcons = document.getElementsByClassName('deleteIcon');
        for (let i = 0; i < deleteIcons.length; i++) {
            deleteIcons[i].style.display = 'inline';
        }

        trashOpenedIcon.addEventListener('click', function() {
            plusIcon.style.display = 'inline';
            trashOpenedIcon.style.display = 'none';
            trashClosedIcon.style.display = 'inline';
            for (let i = 0; i < deleteIcons.length; i++) {
                deleteIcons[i].style.display = 'none';
            }
        });
    });

    addListenersToDeleteIcons();

}


function addListenersToDeleteIcons() {
    let deleteIcons = document.getElementsByClassName('deleteIcon');
    for (let i = 0; i < deleteIcons.length; i++) {
        deleteIcons[i].addEventListener('click', ()=> removeTabBlockAndListeners(i), false);
    }
    addListenersToTabIcons();
}

function removeTabBlockAndListeners(index) {
    console.log('popup remove listeners and block index: ' + index);
    removeTabBlock(index);
    removeDeleteIconListeners();
    updateTabSettings(index);

    chrome.runtime.sendMessage({
        msg: 'removeTabSettings',
        tabIndex: index,
    });
}

function removeTabBlock(index) {
    let tabBlocks = document.getElementsByClassName('tabBlock');
    tabBlocks[index].remove();
}

function removeDeleteIconListeners() {
    removeListenersFromArray(document.getElementsByClassName('deleteIcon'));
    removeListenersFromArray(document.getElementsByClassName('tabIcon'));
    addListenersToDeleteIcons();
}

function removeListenersFromArray(arrayOfObjects) {
    for (let i = 0; i < arrayOfObjects.length; i++) {
        var newArrayOfObjects = arrayOfObjects[i].cloneNode(true);
        arrayOfObjects[i].parentNode.replaceChild(newArrayOfObjects, arrayOfObjects[i]);  
    }
}

function addListenersToTabIcons() {
    let tabIcons = document.getElementsByClassName('tabIcon');
    for (let i = 0; i < tabIcons.length; i++) {
        tabIcons[i].addEventListener('click', ()=> restoreAndLaunch(i));
    }
}



function updateTabSettings(index) {
    chrome.storage.sync.get({
        listNames: [],
        websiteList: [],
        tabBlocks: 1,
    }, function (items) {
        let updatedListNames = [];
        let updatedWebsiteList = [];
        let updatedTabBlocks =  items.tabBlocks - 1;
        for (let i = 0; i < items.tabBlocks; i++) {
            if (i !== index) {
                updatedListNames.push(items.listNames[i]);
                updatedWebsiteList.push(items.websiteList[i]);
            }
        }
        // set the new array value to the same key
        chrome.storage.sync.set({
            listNames: updatedListNames,
            websiteList: updatedWebsiteList,
            tabBlocks: updatedTabBlocks,
        });
    });
}

function retrieveTabInfo() {
    var tabBlockNum = document.getElementsByClassName('tabBlock').length;
    setNumOfTabBlocks(tabBlockNum);

    //addListenersToTabIcons();
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
            removeDeleteIconListeners();
            chrome.runtime.sendMessage({
                msg: 'newTab',
            });
        }
    }); 
    
}


function nameIfEmpty(string, num) {
    if (string == '') {
        return 'Name' + num;
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
    console.log('restoring is happening'); 
    chrome.storage.sync.get({
        websiteList: [''],
        tabBlocks: 1,
    }, function(items) {
        resizeArray(items.websiteList, items.tabBlocks);
        //websiteList.length = 3;
        sendMessageToOptions(items.websiteList[index]);
    });
  }

function sendMessageToOptions(theList) {
    //save_options();
    console.log('popup sendMessage ran');
    if (theList !== '') {
        chrome.runtime.sendMessage({
            msg: 'launchList',
            linkString: theList
        });
    }
}


function createNewTabBlock() {
    var imgArray = new Array();
    for (let i = 0; i < 24; i++) {
        imgArray[i] = new Image();
        imgArray[i].src = '../images/tabImages/tab' + i + '.png';
    }
    var randomTabImagePath = imgArray[Math.floor(Math.random()*imgArray.length)].src;


    var tabBlockDiv = document.createElement('div');
    tabBlockDiv.className = 'tabBlock';

    var label = document.createElement('label');
    label.className = 'tabName';

    var tabIconImg = document.createElement('img');
    tabIconImg.className = 'tabIcon';
    tabIconImg.src = randomTabImagePath;

    var deleteIconImg = document.createElement('img');
    deleteIconImg.className = 'deleteIcon';
    deleteIconImg.src = '../images/delete.png';

    tabBlockDiv.appendChild(label);
    tabBlockDiv.appendChild(document.createElement('br'));
    tabBlockDiv.appendChild(tabIconImg);
    tabBlockDiv.appendChild(deleteIconImg);

    document.getElementById('tabBlockDivWrapper').appendChild(tabBlockDiv);
}


//Duplicate function (same in options.js). Fix later
function resizeArray(arr, size) {
    if (arr.length !== size) {
        arr.length = size;
        for (let i = 0; i < size; i++) {
            if (arr[i] == null || arr[i] == undefined) {
                arr[i] = '';
            }
        }
    }
    return arr;
}