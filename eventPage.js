/* event listeners */

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  showInfoBar(sender.tab,request);
});

chrome.browserAction.onClicked.addListener(function(tab) {
  toggleOnOff(tab);
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  console.log('tabs.onActivated',activeInfo);
  turnOff();
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  // tabId -> remove it's translator state
  // removeInfo.isWindowClosing == true -> remove all translator state
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
      window.tab_id || (window.tab_id = tab.id);
      window.port   || (window.port   = chrome.extension.connect({name: "infobar-"+tab.id}));

      console.log("created infobar within tab: ",window.tab_id);

      window.port.postMessage(data);
    }
  );
};

/* badge manipulation */

function toggleOnOff() {
  if (true) { turnOn(); } else { turnOff(); }
};

function setBadgeTextAndColor(text,color) {
  chrome.browserAction.setBadgeText({text: text});
  chrome.browserAction.setBadgeBackgroundColor({color: color});
};

function turnOn(tab_id) { setBadgeTextAndColor("on","#F00"); };

function turnOff(tab_id) { setBadgeTextAndColor("off","#D5D5D5"); };
