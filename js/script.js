(function ($) {
  "use strict";

  // Windows load

  $(window).load(function () {
    // Site loader

    fetchPosts();
    fetchProjects();
    SearhPostHandler();
  });

  // Document ready
  (function () {
    // get all data in form and return object
    function getFormData(form) {
      var elements = form.elements;
      var honeypot;

      var fields = Object.keys(elements)
        .filter(function (k) {
          if (elements[k].name === "honeypot") {
            honeypot = elements[k].value;
            return false;
          }
          return true;
        })
        .map(function (k) {
          if (elements[k].name !== undefined) {
            return elements[k].name;
            // special case for Edge's html collection
          } else if (elements[k].length > 0) {
            return elements[k].item(0).name;
          }
        })
        .filter(function (item, pos, self) {
          return self.indexOf(item) == pos && item;
        });

      var formData = {};
      fields.forEach(function (name) {
        var element = elements[name];

        // singular form elements just have one value
        formData[name] = element.value;

        // when our element has multiple items, get their values
        if (element.length) {
          var data = [];
          for (var i = 0; i < element.length; i++) {
            var item = element.item(i);
            if (item.checked || item.selected) {
              data.push(item.value);
            }
          }
          formData[name] = data.join(", ");
        }
      });

      // add form-specific values into the data
      formData.formDataNameOrder = JSON.stringify(fields);
      formData.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
      formData.formGoogleSendEmail = form.dataset.email || ""; // no email by default

      return { data: formData, honeypot: honeypot };
    }

    function handleFormSubmit(event) {
      // handles form submit without any jquery
      event.preventDefault(); // we are submitting via xhr below
      var form = event.target;
      var formData = getFormData(form);
      var data = formData.data;

      // If a honeypot field is filled, assume it was done so by a spam bot.
      if (formData.honeypot) {
        return false;
      }

      disableAllButtons(form);
      var url = form.action;
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      // xhr.withCredentials = true;
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          form.reset();
          var formElements = form.querySelector(".form-elements");
          if (formElements) {
            formElements.style.display = "none"; // hide form
          }
          var thankYouMessage = form.querySelector(".thankyou_message");
          if (thankYouMessage) {
            thankYouMessage.style.display = "block";
          }
        }
      };
      // url encode form data for sending as post data
      var encoded = Object.keys(data)
        .map(function (k) {
          return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
        })
        .join("&");
      xhr.send(encoded);
    }

    function loaded() {
      // bind to the submit event of our form
      var forms = document.querySelectorAll("form.gform");
      for (var i = 0; i < forms.length; i++) {
        forms[i].addEventListener("submit", handleFormSubmit, false);
      }
    }
    document.addEventListener("DOMContentLoaded", loaded, false);

    function disableAllButtons(form) {
      var buttons = form.querySelectorAll("button");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
      }
    }
  })();
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
const tags = ["#wrapper"];
const loader_page = document.createElement("div");

const alterarVisibilidade = (tags, displayStyle) => {
  tags.forEach((tag) => {
    const element = document.querySelector(tag);
    if (element) {
      element.style.display = displayStyle;
    }
  });
};

function loader() {
  alterarVisibilidade(tags, "none");
  loader_page.innerHTML =
    '<div class="pokebola">  <div class="pokebola-botao"></div></div>';
  document.body.appendChild(loader_page);

  setTimeout(() => {
    alterarVisibilidade(tags, "block");
    loader_page.style.display = "none";
  }, 2000);
}

loader();
