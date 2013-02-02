function updateTargetWord(target_word) {
  console.log("target word:",target_word);
  word.value = target_word;
};

chrome.tabs.getCurrent(function (tab) {
  console.log("tab id:",tab.id);

  chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(data) {
      if (port.name == "infobar-"+tab.id) {
        updateTargetWord(data.selection);
      }
    });
  });
});
