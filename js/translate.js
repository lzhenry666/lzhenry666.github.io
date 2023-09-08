function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}
var flags = document.getElementsByClassName("flag_link");

Array.prototype.forEach.call(flags, function (e) {
  e.addEventListener("click", function () {
    var lang = e.getAttribute("data-lang");
    var languageSelect = document.querySelector("select.goog-te-combo");
    languageSelect.value = lang;
    languageSelect.dispatchEvent(new Event("change"));

    setTimeout(function () {
      languageSelect.value = lang;
      languageSelect.dispatchEvent(new Event("change"));
    }, 100);
  });
});
