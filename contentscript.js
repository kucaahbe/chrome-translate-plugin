var cached_selected = "";

function sendSelectedToTranslator() {

  var current_selected = window.getSelection().toString();

  // selection should be non-empty string:
  if (typeof(current_selected) != "string" || current_selected.trim().length == 0) { return; }

  if (cached_selected == current_selected) {
    //prevent sending same selection, it is already translated
    return;
  } else {
    cached_selected = current_selected;
  }

  if (cached_selected.length > 0) {
    var payload = { selection: cached_selected.trim() }

    // send data to event page
    chrome.extension.sendMessage(payload);

    //console.debug("selected: \"%s\" sent to translator", payload.selection);
  }
};

document.addEventListener("mouseup",sendSelectedToTranslator);
document.addEventListener("keyup",  sendSelectedToTranslator);
