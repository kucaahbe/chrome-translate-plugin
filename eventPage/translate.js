var Translate = function () {
  this.lang = {
    from: null,
    to: null
  };
  this.text = {
    original: null,
    translated: null
  };
};

Translate.YANDEX_API = {
  detect_url:    "http://translate.yandex.net/api/v1/tr.json/detect",
  translate_url: "http://translate.yandex.net/api/v1/tr.json/translate"
};

/*
 * API_ENDPOINT - String
 * params - Array of params
 * callback_or_false - function or false if ajax call must be synchronous
 */
Translate.YandexAPIcall = function (API_ENDPOINT,params,callback_or_false) {
  var request = API_ENDPOINT+"?"+params.join("&");
  console.debug(request);

  var callback;

  var xhr = new XMLHttpRequest();

  if (typeof(callback_or_false)=="function") {
    callback = callback_or_false
    xhr.open("GET",request,true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var response = JSON.parse(xhr.responseText)
        console.debug('got response:',response);
        callback(response);
      }
    };
    xhr.send();
  }
  else if (typeof(callback_or_false) == "boolean") {
    xhr.open("GET",request,false);
    xhr.send(null);
    if (xhr.status == 200) {
      return JSON.parse(xhr.responseText);
    }
  }
};

Translate.prototype.setText = function (text) {
  this.text.original = text;
}

Translate.prototype.detectLang = function (default_lang_from) {
  var response = Translate.YandexAPIcall(
    Translate.YANDEX_API.detect_url,
    [ "text="+encodeURI(this.text.original) ],
    false
  );

  this.lang.from = response.lang;
}

Translate.prototype.getTranslate = function (to_lang,callback) {
  this.lang.to = to_lang;

  var query = [];

  query.push("lang="+this.lang.from+"-"+this.lang.to);
  query.push("text="+encodeURI(this.text.original));

  console.debug("sent \"%s\" to translator",this.text.original);

  var self = this;

  Translate.YandexAPIcall(
    Translate.YANDEX_API.translate_url,
    query,
    function (response) {
      self.text.translated = response.text.join(" ");

      console.info("\"%s\" -> \"%s\"",self.text.original,self.text.translated);

      callback(self);
    }
  );
};
