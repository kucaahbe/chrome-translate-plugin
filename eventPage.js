var infobar_window = null;

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse)
  {
    if (infobar_window) {
      showInfoBar(sender.tab,request);
    }
    else
    {
      showInfoBar(sender.tab,request,sendMessageToInfoBar);
    }
  }
);

function sendMessageToInfoBar(msg) {
  chrome.extension.sendMessage(null,msg);
};

//callback should send message to infobar
function showInfoBar(tab,data,callback)
{
  if (tab.id > 0) {
    chrome.experimental.infobars.show(
      {
        tabId: tab.id,
        path: "infobar.html"
        //height: //( optional integer )
      },
      function (window) {
        infobar_window = window;
        console.debug("created infobar in", infobar_window);
        callback && callback(data);
      }
    );
  }
};
