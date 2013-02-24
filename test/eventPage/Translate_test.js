var translate;

module( "new Translate()", {
  setup: function () {
    translate = new Translate();
  }
});
test( "it's lang.from is null", function() {
  equal( translate.lang.from, null );
});
test( "it's lang.to is null", function() {
  equal( translate.lang.to, null );
});
test( "it's text.original is null", function() {
  equal( translate.text.original, null );
});
test( "it's text.translated is null", function() {
  equal( translate.text.translated, null );
});

module( "translate.setText(text)", {
  setup: function () {
    translate = new Translate();
    window.textValue="русский текст";
    translate.setText(textValue);
  },
  teardown: function () {
    delete window.textValue;
  }
});
test( "sets text.original to text", function() {
  equal( translate.text.original, textValue );
});
test( "doesn't change text.translated", function() {
  equal( translate.text.translated, null );
});
test( "doesn't change lang.from", function() {
  equal( translate.lang.from, null );
});
test( "doesn't change lang.to", function() {
  equal( translate.lang.to, null );
});

module( "translate.detectLang()", {
  setup: function () {
    translate = new Translate();
    window.textValue="русский текст";
    translate.setText(textValue);
    translate.detectLang();
  },
  teardown: function () {
    delete window.textValue;
  }
});
test( "doesn't change text.original", function() {
  equal( translate.text.original, textValue );
});
test( "doesn't change text.translated", function() {
  equal( translate.text.translated, null );
});
test( "sets lang.from to detected lang", function() {
  equal( translate.lang.from, "ru" );
});
test( "doesn't change lang.to", function() {
  equal( translate.lang.to, null );
});

module( "translate.getTranslate(to_lang,callback)", {
  setup: function () {
    translate = new Translate();

    window.textValue="русский текст";
    window.to_lang="en";

    translate.setText(textValue);
    translate.detectLang();

    window.detected_lang=translate.lang.from;
  },
  teardown: function () {
    delete window.textValue;
    delete window.detected_lang;
  }
});
asyncTest( "doesn't change text.original", 1, function () {
  translate.getTranslate(to_lang,function () {
    equal( translate.text.original, textValue );
    start();
  });
});
asyncTest( "changes text.translated to translated value", 1, function () {
  translate.getTranslate(to_lang,function () {
    equal( translate.text.translated, "English text" );
    start();
  });
});
asyncTest( "doesn't change lang.from", 1, function () {
  translate.getTranslate(to_lang,function () {
    equal( translate.lang.from, detected_lang );
    start();
  });
});
asyncTest( "sets lang.to to to_lang", 1, function () {
  translate.getTranslate(to_lang,function () {
    equal( translate.lang.to, to_lang );
    start();
  });
});
