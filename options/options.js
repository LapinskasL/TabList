console.log("options.js running");

window.onload = function() {

    restore_options();

    let launchButton1 = document.getElementById("launchList1");
    launchButton1.addEventListener("click", ()=> sendMessageToBackground("1"));
    document.getElementById("textbox1").addEventListener("change", saveData);

    let launchButton2 = document.getElementById("launchList2");
    launchButton2.addEventListener("click", ()=> sendMessageToBackground("2"));
    document.getElementById("textbox2").addEventListener("change", saveData);

    let launchButton3 = document.getElementById("launchList3");
    launchButton3.addEventListener("click", ()=> sendMessageToBackground("3"));
    document.getElementById("textbox3").addEventListener("change", saveData);

    let inputs = document.getElementsByTagName('input');
    
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("change", saveData);
    }
}


function saveData() {
    chrome.storage.sync.set({
        websiteList1: document.getElementById("textbox1").value,
        websiteList2: document.getElementById("textbox2").value,
        websiteList3: document.getElementById("textbox3").value,

        listName1: document.getElementById("listName1").value,
        listName2: document.getElementById("listName2").value,
        listName3: document.getElementById("listName3").value,
    });
}

function sendMessageToBackground(listNum) {
    chrome.runtime.sendMessage({
        msg: "launchList",
        linkString: document.getElementById("textbox" + listNum).value
    });
}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ VVVV this rn

// Restores list into the textbox.
function restore_options() {
    console.log("restoring is happening");
    // Use default value comments = false and playlists = false.
    chrome.storage.sync.get({
        websiteList1: "",
        websiteList2: "",
        websiteList3: "",

        listName1: "",
        listName2: "",
        listName3: ""
    }, function(items) {
        document.getElementById("textbox1").value = items.websiteList1;
        document.getElementById("textbox2").value = items.websiteList2;
        document.getElementById("textbox3").value = items.websiteList3;

        document.getElementById("listName1").value = items.listName1;
        document.getElementById("listName2").value = items.listName2;
        document.getElementById("listName3").value = items.listName3;
    });
  }
