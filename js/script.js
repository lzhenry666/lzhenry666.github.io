(function ($) {
  "use strict";

  // Windows load

  $(window).load(function () {
    // Site loader

    $(".loader-inner").fadeOut();
    $(".loader").delay(200).fadeOut("slow");
  });

  // Document ready

  $(document).ready(function () {
    // Site slider

    $("#testimonial-carousel").owlCarousel({
      navigation: false,
      slideSpeed: 300,
      paginationSpeed: 400,
      responsiveRefreshRate: 200,
      responsiveBaseWidth: window,
      pagination: true,
      autoPlay: true,
      singleItem: true,
    });

    $("#block-slider").owlCarousel({
      navigation: true,
      slideSpeed: 300,
      paginationSpeed: 400,
      responsiveRefreshRate: 200,
      responsiveBaseWidth: window,
      pagination: false,
      autoPlay: true,
      singleItem: true,
      navigationText: [
        "<span class='icon-left-open-big'></span>",
        "<span class='icon-right-open-big'></span>",
      ],
    });

    //Portfolio setup

    $(".popup").magnificPopup({
      type: "image",
      fixedContentPos: false,
      fixedBgPos: false,
      mainClass: "mfp-no-margins mfp-with-zoom",
      image: {
        verticalFit: true,
      },
      zoom: {
        enabled: true,
        duration: 300,
      },
    });

    var works = $(".works");
    $(".popup-youtube, .popup-vimeo").magnificPopup({
      disableOn: 700,
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: false,
      fixedContentPos: false,
    });

    $(".filter ").on("click", "li a", function () {
      $(this).addClass("active");
      $(this).parent().siblings().find("a").removeClass("active");
      var filters = $(this).attr("data-filter");
      $(this).closest(works).find(".item").removeClass("disable");

      if (filters !== "all") {
        var selected = $(this).closest(works).find(".item");
        for (var i = 0; i < selected.length; i++) {
          if (!selected.eq(i).hasClass(filters)) {
            selected.eq(i).addClass("disable");
          }
        }
      }

      return false;
    });

    // Search input

    $(".search-form i").on("click", function () {
      $(this).closest(".search-form").find('input[type="text"]').focus();
      if ($(this).closest(".search-form").find('input[type="text"]').val()) {
        $(this)
          .closest(".search-form")
          .find('input[type="submit"]')
          .trigger("click");
      }
    });

    // Form validation

    var inputName = $("input#name");
    var inputEmail = $("input#email");
    var textArea = $("textarea#message");
    var contactForm = $(".contact-form");

    $(".submit").on("click", function () {
      inputName.removeClass("errorForm");
      textArea.removeClass("errorForm");
      inputEmail.removeClass("errorForm");

      var error = false;
      var name = inputName.val();
      if (name == "" || name == " ") {
        error = true;
        inputName.addClass("errorForm");
      }

      var msg = textArea.val();
      if (msg == "" || msg == " ") {
        error = true;
        textArea.addClass("errorForm");
      }

      var email_compare = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
      var email = inputEmail.val();
      if (email == "" || email == " ") {
        inputEmail.addClass("errorForm");
        error = true;
      } else if (!email_compare.test(email)) {
        inputEmail.addClass("errorForm");
        error = true;
      }

      if (error == true) {
        return false;
      }

      var data_string = contactForm.serialize();

      $.ajax({
        type: "POST",
        url: contactForm.attr("action"),
        data: data_string,

        success: function (message) {
          if (message == "SENDING") {
            $("#success").fadeIn("slow");
          } else {
            $("#error").fadeIn("slow");
          }
        },
      });

      return false;
    });
  });
})(jQuery);

document.addEventListener("DOMContentLoaded", () => {
  const botaoNegrito = document.getElementById("darkBold");
  botaoNegrito.addEventListener("click", aplicarNegrito);
});

function aplicarNegrito() {
  const elementos = document.getElementsByTagName("*");

  for (let i = 0; i < elementos.length; i++) {
    const elemento = elementos[i];
    const estiloAtual = window.getComputedStyle(elemento);
    const fontWeight = estiloAtual.getPropertyValue("font-weight");

    if (fontWeight !== "900") {
      elemento.style.fontWeight = "900";
    } else {
      elemento.style.fontWeight = "normal";
    }
  }
}

// Função para alternar o modo escuro
const body = document.body;
const button = document.getElementById("dark-mode-btn");

button.addEventListener("click", toggleDarkMode);

function toggleDarkMode() {
  if (body.style.backgroundColor === "black") {
    body.style.backgroundColor = "white";
  } else {
    body.style.backgroundColor = "black";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const plusButton = document.querySelector("#plus");
  const minusButton = document.querySelector("#minus");

  plusButton.addEventListener("click", () => {
    const bodyStyle = getComputedStyle(document.body);
    let size = parseInt(bodyStyle.fontSize);

    size += 2;
    document.body.style.fontSize = size + "px";

    // Aumenta a fonte de todas as classes
    const elements = document.querySelectorAll("*");
    for (let i = 0; i < elements.length; i++) {
      const elementStyle = getComputedStyle(elements[i]);
      let elementSize = parseInt(elementStyle.fontSize);
      elementSize += 2;
      elements[i].style.fontSize = elementSize + "px";
    }
  });

  minusButton.addEventListener("click", () => {
    const bodyStyle = getComputedStyle(document.body);
    let size = parseInt(bodyStyle.fontSize);

    size -= 2;
    if (size <= 10) {
      size = 10;
    }

    document.body.style.fontSize = size + "px";

    // Diminui a fonte de todas as classes
    const elements = document.querySelectorAll("*");
    for (let i = 0; i < elements.length; i++) {
      const elementStyle = getComputedStyle(elements[i]);
      let elementSize = parseInt(elementStyle.fontSize);
      elementSize -= 2;
      if (elementSize <= 10) {
        elementSize = 10;
      }
      elements[i].style.fontSize = elementSize + "px";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const filterLinks = document.querySelectorAll("#category a");

  filterLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const valorFiltro = event.target.dataset.filter;

      filtrarItens(valorFiltro);
    });
  });
});

function filtrarItens(valor) {
  const itens = document.getElementsByClassName("proj-desc");

  for (let i = 0; i < itens.length; i++) {
    const span = itens[i].querySelector("span");
    const spanValor = span.textContent.toLowerCase();

    if (spanValor === valor.toLowerCase() || valor === "all") {
      // Exibir o item
      itens[i].closest(".item").style.display = "block";
    } else {
      // Ocultar o item
      itens[i].closest(".item").style.display = "none";
    }
  }
}

// Função para traduzir o texto do site
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
