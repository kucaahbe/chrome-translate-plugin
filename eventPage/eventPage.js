var InfobarSet = function() {}
InfobarSet.prototype.add    = function(tab_id,port) { this[tab_id] = port; }
InfobarSet.prototype.remove = function(tab_id) { delete this[tab_id]; }

var ENABLED="enabled"
    DISABLED="disabled"
    infobar_list = new InfobarSet();

/* event listeners */

/* port listener, listens for messages from content script */
chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(data) {
    switch(port.name) {
      case "cs":
        contentScriptMessageHandler(data,port.sender.tab.id);
      break;
      case "infobar":
        infobar_list.add(data.tabId,port);
        updateInfobar(port,{text:{}});
      break;
      default:
        console.error("unknown port name: ",port.name);
    }
  });
});

/* plugin button listener */
chrome.browserAction.onClicked.addListener(toggleOnOff);

/* tab activation listener */
chrome.tabs.onActivated.addListener(function(activeInfo) {
  var tab_id = activeInfo.tabId;
  //initialize settings for this tab:
  localStorage[tab_id] || (localStorage[tab_id]=DISABLED);
  (localStorage[tab_id]==DISABLED ? setBadgeOff() : setBadgeOn());
});

/* tab removal listener, removes settings from local storage */
chrome.tabs.onRemoved.addListener(function(tab_id, removeInfo) {
  if (removeInfo.isWindowClosing) {
    localStorage.clear();
  } else {
    localStorage.removeItem(tab_id);
  }
});

/* -------------- */

function contentScriptMessageHandler(data,tab_id) {
  if (localStorage[tab_id]==ENABLED) {
    showInfoBar(tab_id);

    var translate = new Translate();
    translate.setText(data.selection);
    translate.detectLang();
    translate.getTranslate("ru",function () {
      if (infobar_list[tab_id]) {
        console.debug('updating infobar');
        updateInfobar(infobar_list[tab_id],translate);
      }
    });
  }
};

function updateInfobar(port,translated) {
  port.postMessage(translated);
};

function showInfoBar(tab_id)
{
  if (infobar_list[tab_id]) {
    return;
  }
  chrome.experimental.infobars.show(
    {
      tabId: tab_id,
      path: "infobar/infobar.html"
      //height: //( optional integer )
    },
    function (window) {
      //var views=chrome.extension.getViews()
      //console.debug(views);
      //infobar_list.add(tab_id);
      console.debug("created infobar within tab: ",tab_id);
    }
  );
};

/* badge manipulation */

function toggleOnOff(tab) {
  if (localStorage[tab.id]==DISABLED) {
    setBadgeOn();
    localStorage[tab.id]=ENABLED;
  } else {
    setBadgeOff();
    localStorage[tab.id]=DISABLED;
  }
};

function setBadgeTextAndColor(text,color) {
  chrome.browserAction.setBadgeText({text: text});
  chrome.browserAction.setBadgeBackgroundColor({color: color});
};

function setBadgeOn() { setBadgeTextAndColor("on","#F00"); };

function setBadgeOff() { setBadgeTextAndColor("off","#D5D5D5"); };