var ENABLED="enabled"
    DISABLED="disabled"
    YANDEX_API_URL = "http://translate.yandex.net/api/v1/tr.json/translate";

/* event listeners */

// port listener, listens for messages from content script
chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(data) {
    switch(port.name) {
      case "cs":
        contentScriptMessageHandler(data,port.sender.tab.id);
      break;
      default:
        console.error("unknown port name: ",port.name);
    }
  });
});

chrome.browserAction.onClicked.addListener(toggleOnOff);

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

function contentScriptMessageHandler(data,tab_id) {
  if (localStorage[tab_id]==ENABLED) {
    translate(data.selection);
    showInfoBar(tab_id);
  }
};

/* shows infobar and creates uniquely named connection to it */
function showInfoBar(tab_id)
{
  chrome.experimental.infobars.show(
    {
      tabId: tab_id,
      path: "infobar.html"
      //height: //( optional integer )
    },
    function (window) {
      var views=chrome.extension.getViews()
      console.debug(views);
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

/* backgound translate */
function translate(phrase) {

  var query = [];
  from_lang = "en";
  to_lang   = "ru";

  query.push("lang="+from_lang+"-"+to_lang);
  query.push("text="+encodeURI(phrase));

  console.info("sent \"%s\" to translator",phrase);
  YandexAPIcall(query,function (response) {
    var translated = response.text.join(" ");
    console.info("\"%s\" -> \"%s\"",phrase,translated);
  });
};

/*
 * params - Array
 * callback(parsed_response) - function
 */
function YandexAPIcall(params,callback) {
  var request = YANDEX_API_URL+"?"+params.join("&");
  console.debug(request);

  var xhr = new XMLHttpRequest();
  xhr.open("GET",request,true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var response = JSON.parse(xhr.responseText)
      console.debug('got response:',response);
      callback(response);
    }
  };
  xhr.send();
};
