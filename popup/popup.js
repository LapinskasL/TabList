//TODO:

//1. fix issue with spaces in tab names
//2. format tab names nicely



console.log('popup.js running');

window.onload = function() {
    initialLoad();
    document.getElementById('plusIcon').addEventListener('click', addTab);
    console.log('popup window.onload ran');
};

// function loadTabBlocks() {
//     chrome.storage.sync.get({
//         tabBlocks: 0,
//         tabIconNum: [],
//     }, function(items) {
//         initialLoad(items.tabBlocks);
//     });  
// }

function initialLoad() {
    chrome.storage.sync.get({
        tabBlocks: 0,
        tabIconNum: [],
    }, function(items) {
        for (let i = 0; i < items.tabBlocks; i++) {
            createNewTabBlock(items.tabIconNum[i]);
        }
    
        retrieveTabInfo();
        restoreListNames();
        
    
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
    });  



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
        tabIconNum: [],
        tabBlocks: 1,
    }, function (items) {
        let updatedListNames = [];
        let updatedWebsiteList = [];
        let updatedTabIconNum = [];
        let updatedTabBlocks =  items.tabBlocks - 1;
        for (let i = 0; i < items.tabBlocks; i++) {
            if (i !== index) {
                updatedListNames.push(items.listNames[i]);
                updatedWebsiteList.push(items.websiteList[i]);
                updatedTabIconNum.push(items.tabIconNum[i]);
            }
        }
        // set the new array value to the same key
        chrome.storage.sync.set({
            listNames: updatedListNames,
            websiteList: updatedWebsiteList,
            tabBlocks: updatedTabBlocks,
            tabIconNum: updatedTabIconNum,
        });
    });
}

function setTabIconNum(num) {
    // by passing an object you can define default values e.g.: []
    chrome.storage.sync.get({
        tabIconNum: [],
        tabBlocks: 1,
    }, function (items) {

        var tabIconNum = resizeArray(items.tabIconNum, items.tabBlocks);
        //tabIconNum = [];
        tabIconNum.push(num);
        // set the new array value to the same key
        chrome.storage.sync.set({
            tabIconNum: tabIconNum,
        });
        retrieveTabInfo();
        restoreListNames();
        removeDeleteIconListeners();
    });
}

function retrieveTabInfo() {
    var tabBlockNum = document.getElementsByClassName('tabBlock').length;
    setNumOfTabBlocks(tabBlockNum);

    //addListenersToTabIcons();
    //restoreListNames();
}

// restoreListNamesAndIcons
function restoreListNames() {
    chrome.storage.sync.get({
        listNames: [],
        tabIconNum: [],
        tabBlocks: 1,
    }, function(items) {
        let tabNames = document.getElementsByClassName('tabName');
        let listNames = resizeArray(items.listNames, items.tabBlocks);

        let tabIcons = document.getElementsByClassName('tabIcon');
        //resize?
        console.log(listNames[0]);
        for (let i = 0; i < tabNames.length; i++) {
            tabNames[i].innerHTML = listNames[i];
            tabIcons[i].src = '../images/tabImages/tab' + items.tabIconNum[i] + '.png';
        }
    });  
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
            //random num between 0-23 (number of icons)
            let randNum = Math.floor(Math.random() * Math.floor(24));
            createNewTabBlock(randNum);
            setTabIconNum(randNum);
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

function restoreAndLaunch(index) {
    console.log('restoring is happening'); 
    chrome.storage.sync.get({
        websiteList: [''],
        tabBlocks: 1,
    }, function(items) {
        resizeArray(items.websiteList, items.tabBlocks);
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


function createNewTabBlock(num) {
    // var imgArray = new Array();
    // for (let i = 0; i < 24; i++) {
    //     imgArray[i] = new Image();
    //     imgArray[i].src = '../images/tabImages/tab' + i + '.png';
    // }
    // var randomTabImagePath = imgArray[Math.floor(Math.random()*imgArray.length)].src;

    var tabBlockDiv = document.createElement('div');
    tabBlockDiv.className = 'tabBlock';

    var label = document.createElement('label');
    label.className = 'tabName';

    var tabIconImg = document.createElement('img');
    tabIconImg.className = 'tabIcon';
    tabIconImg.id = 'color' + num;


    var arrayOfColors = ['#42C8A5','#42C6C8','#42A4C9','#4184C8','#4262C7','#4242C8','#6642C8','#8842C7','#A741C8','#C842C5',
    '#C842A3','#C94284','#C84362','#C84241','#C76244','#C88443','#C8A443','#C9C643','#A7C843','#86C842',
    '#64C842','#42C843','#41C862','#42C785'];

    var css = '#color' + num + ':hover { box-shadow: 0px 0px 3px ' + arrayOfColors[num] + ' }';
    var style = document.createElement('style');


    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    tabIconImg.appendChild(style);

    var deleteIconImg = document.createElement('img');
    deleteIconImg.className = 'deleteIcon';
    deleteIconImg.src = '../images/delete.png';

    tabBlockDiv.appendChild(label);
    tabBlockDiv.appendChild(document.createElement('br'));
    tabBlockDiv.appendChild(tabIconImg);
    tabBlockDiv.appendChild(deleteIconImg);

    document.getElementById('tabBlockDivWrapper').appendChild(tabBlockDiv);
    document.getElementById('color' + num).src = '../images/tabImages/tab' + num + '.png';
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