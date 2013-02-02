chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse)
  {
    showInfoBar(sender.tab,request);
  }
);

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
