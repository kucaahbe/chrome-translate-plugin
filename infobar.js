function updateTargetWord(target_word) {
  console.log("target word:",target_word);
  word.value = target_word;
  translateTargetWord(target_word);
};

function translateTargetWord(word) {
  var YANDEX_API_URL = "http://translate.yandex.net/api/v1/tr.json/translate";
  var query = [];
  query.push("lang=en-ru");
  query.push("text="+encodeURI(word));

  var request = YANDEX_API_URL+"?"+query.join("&");
  console.debug(request);

  var xhr = new XMLHttpRequest();
  xhr.open("GET",request,true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var response = JSON.parse(xhr.responseText)
      console.log(response);
      translated.value = response.text.join(" ");
    }
  };
  xhr.send();
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
