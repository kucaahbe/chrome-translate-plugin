document.addEventListener("mouseup",sendSelectionToTranslator);
document.addEventListener("keyup",sendSelectionToTranslator);

var selection = null;

function makesSenseToSendSelection() {
  if (typeof(selection) != "string") {
    return false;
  }

  // removes blanks from start and end
  selection = selection.trim();
  // so only non-empty selection should go to translator
  return (selection.length > 0);
};

function sendSelectionToTranslator() {

  var current_selection = window.getSelection().toString();
  selection = (selection == current_selection ? null : current_selection);

  if (makesSenseToSendSelection()) {
    console.debug("selection: \"%s\" sent to translator", selection);

    // send data to event page
    chrome.extension.sendMessage({
      selection: selection
    });

  } else {
    console.debug("selection isn't text:", selection);
  }
};
