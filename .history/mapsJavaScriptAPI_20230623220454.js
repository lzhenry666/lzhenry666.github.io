var CROSproxyURL = "https://www.whateverorigin.org/get?url=";

var args = "";
if (typeof language != "undefined") args += "&language=" + language;

var bypass = function (googleAPIcomponentJS, googleAPIcomponentURL) {
  if (googleAPIcomponentURL.toString().indexOf("common.js") == -1) {
    googleAPIcomponentJS.src = googleAPIcomponentURL;
  } else {
    var removeFailureAlert = function (googleAPIcomponentURL) {
      sendRequestThroughCROSproxy(googleAPIcomponentURL, (responseText) => {
        var script = document.createElement("script");
        script.innerHTML = responseText.replace(
          new RegExp(/;if.*Failure.*\}/),
          ";"
        );
        document.head.appendChild(script);
      });
    };
    googleAPIcomponentJS.innerHTML =
      "(" +
      removeFailureAlert.toString() +
      ')("' +
      googleAPIcomponentURL.toString() +
      '")';
  }
};

var createAndExecutePayload = function (googleAPIjs) {
  var script = document.createElement("script");
  var appendChildToHeadJS = googleAPIjs.match(/(\w+)\.src=(_.*?);/);
  var googleAPIcomponentJS = appendChildToHeadJS[1];
  var googleAPIcomponentURL = appendChildToHeadJS[2];
  script.innerHTML = googleAPIjs.replace(
    appendChildToHeadJS[0],
    "(" +
      bypass.toString() +
      ")(" +
      googleAPIcomponentJS +
      ", " +
      googleAPIcomponentURL +
      ");"
  );
  document.head.appendChild(script);
};

sendRequestThroughCROSproxy(
  "https://maps.googleapis.com/maps/api/js?key=:)&callback=initMap" + args,
  (googleAPIjs) => {
    createAndExecutePayload(googleAPIjs);
  }
);

function sendRequestThroughCROSproxy(url, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        if (callback) callback(JSON.parse(this.responseText).contents);
      } else {
        sendRequestThroughCROSproxy(url, callback); //retry
      }
    }
  };
  xhttp.open("GET", CROSproxyURL + encodeURIComponent(url), true);
  xhttp.send();
}

async function getIPAndLocation() {
  try {
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();
    const ip = ipData.ip;
    alert("seu ip é, " + ip);

    const locResponse = await fetch(`http://ip-api.com/json/${ip}`);
    const locData = await locResponse.json();
    console.log(
      `🚀 ~ file: index.html:1334 ~ getIPAndLocation ~ locData:`,
      locData,
      locData.lat,
      locData.lon
    );

    const lat = locData.lat;
    console.log(`🚀 ~ file: index.html:1337 ~ getIPAndLocation ~ lat:`, lat);
    const lng = locData.lon;
    console.log(`🚀 ~ file: index.html:1338 ~ getIPAndLocation ~ lng:`, lng);
    alert("Olá, você esta nasa proximmidades  de: ", lat + "," + lng);

    return {
      lat,
      lng,
    };
  } catch (error) {
    console.error("Erro ao obter IP e localização:", error);
  }
}

const { lat, lng } = getIPAndLocation();

var map;
function initMap() {
  // The map, centered on Central Park
  const center = { lat: 45.463688, lng: 9.188141 };
  const options = { zoom: 15, scaleControl: true, center: center };
  map = new google.maps.Map(document.getElementById("map"), options);
  // Locations of landmarks
  const p1 = { lat: 46.463688, lng: 9.188141 };
  const p2 = { lat: lat, lng: lng };

  // The markers for The Dakota and The Frick Collection
  var mk1 = new google.maps.Marker({
    position: p1,
    map: map,
    icon: {
      url: "img/marker.png",
      scaledSize: new google.maps.Size(35, 45),
    },
  });
  var mk2 = new google.maps.Marker({
    position: p2,
    map: map,
    icon: {
      url: "img/marker.png",
      scaledSize: new google.maps.Size(35, 45),
    },
  });
}
