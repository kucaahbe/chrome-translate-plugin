var ENABLED="enabled"
var DISABLED="disabled"

/* event listeners */

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  localStorage[sender.tab.id]==ENABLED && showInfoBar(sender.tab,request);
});

chrome.browserAction.onClicked.addListener(function(tab) {
  toggleOnOff(tab.id);
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  var tabId = activeInfo.tabId;
  //initialize settings for this tab:
  localStorage[tabId] || (localStorage[tabId]=DISABLED);
  (localStorage[tabId]==DISABLED ? setBadgeOff() : setBadgeOn());
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  if (removeInfo.isWindowClosing) {
    localStorage.clear();
  } else {
    localStorage.removeItem(tabId);
  }
});

/* -------------- */

/* shows infobar and creates uniquely named connection to it */
function showInfoBar(tab,data)
{
  chrome.experimental.infobars.show(
    {
      tabId: tab.id,
      path: "infobar.html"
      //height: //( optional integer )
    },
    function (window) {
      window.tabId || (window.tabId = tab.id);
      window.port   || (window.port   = chrome.extension.connect({name: "infobar-"+tab.id}));

      console.log("created infobar within tab: ",window.tabId);

      window.port.postMessage(data);
    }
  );
};

/* badge manipulation */

function toggleOnOff(tabId) {
  if (localStorage[tabId]==DISABLED) {
    setBadgeOn();
    localStorage[tabId]=ENABLED;
  } else {
    setBadgeOff();
    localStorage[tabId]=DISABLED;
  }
};

function setBadgeTextAndColor(text,color) {
  chrome.browserAction.setBadgeText({text: text});
  chrome.browserAction.setBadgeBackgroundColor({color: color});
};

function setBadgeOn() { setBadgeTextAndColor("on","#F00"); };

function setBadgeOff() { setBadgeTextAndColor("off","#D5D5D5"); };
