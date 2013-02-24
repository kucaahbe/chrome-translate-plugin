function update_view(phrase,translated_phrase) {
  word.value       = phrase;
  translated.value = translated_phrase;
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
