function updateTargetWord(target_word) {
  console.log("target word:",target_word);
  word.value = target_word;
};

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    updateTargetWord(request.selection);
  }
);
