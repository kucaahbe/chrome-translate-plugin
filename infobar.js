function updateTargetWord(target_word) {
  console.log("target word:",target_word);
  word.value = target_word;
  translateTargetWord(target_word);
};

/* API_ENDPOINT - String
 * params - Array
 * callback(parsed_response) - function
 */
function YandexAPIcall(API_ENDPOINT,params,callback) {
  var request = API_ENDPOINT+"?"+params.join("&");
  console.debug(request);

  var xhr = new XMLHttpRequest();
  xhr.open("GET",request,true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var response = JSON.parse(xhr.responseText)
      console.log(response);
      callback(response);
    }
  };
  xhr.send();
};

function translateTargetWord(word,from_lang,to_lang) {
  var YANDEX_API_URL = "http://translate.yandex.net/api/v1/tr.json/translate";
  var query = [];
  from_lang = "en";
  to_lang   = "ru";

  query.push("lang="+from_lang+"-"+to_lang);
  query.push("text="+encodeURI(word));

  YandexAPIcall(YANDEX_API_URL,query,function (response) {
    translated.value = response.text.join(" ");
  });
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
