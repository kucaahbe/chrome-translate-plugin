function update_view(original_text,translated_text) {
  update_input(word,original_text);
  update_input(translated,translated_text);
};

function update_input(input_el,value) {
  if (value) {
    input_el.value = value;
    input_el.disabled = false;
  } else {
    // if value undefined or null
    input_el.disabled = true;
    input_el.value = "";
  }
};

//window.onload=function() {
var port=chrome.extension.connect({name:"infobar"});

chrome.tabs.getCurrent(function(tab) {
  port.postMessage({tabId: tab.id});
});

port.onMessage.addListener(function(translated) {
  update_view(
    translated.text.original,
    translated.text.translated
  );
});
//};
