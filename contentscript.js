document.addEventListener("mouseup",sendSelectionToTranslator);
document.addEventListener("keyup",sendSelectionToTranslator);

var selection = null;

function sendSelectionToTranslator() {

  var current_selection = window.getSelection().toString();
  selection = (selection == current_selection ? null : current_selection);

  if (typeof(selection) == "string" && selection.length > 0) {
    console.debug("selection: \"%s\" sent to translator", selection);

    // send data to event page
    chrome.extension.sendMessage({
      selection: selection
    });

  } else {
    console.debug("selection isn't text:", selection);
  }
};
