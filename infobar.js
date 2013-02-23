function updateTargetWord(target_word) {
  console.log("target word:",target_word);
  word.value = target_word;
  translateTargetWord(target_word);
};

function reseiveMessageFromPort(port_name,tab_id,data) {
  if (port_name == "infobar-"+tab_id) {
    updateTargetWord(data.selection);
  }
};

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(data) {
    if (window.tab_id) {
      reseiveMessageFromPort(port.name,window.tab_id,data);
    } else {
      chrome.tabs.getCurrent(function (tab) {
        console.log("tab id:",tab.id);
        window.tab_id = tab.id;
        reseiveMessageFromPort(port.name,window.tab_id,data);
      });
    }
  });
});
