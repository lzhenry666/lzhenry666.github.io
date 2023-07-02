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
  const url = "https://ip-geo-location.p.rapidapi.com/ip/check?format=json";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "c6224dcafcmsh508f47439a28567p11af11jsn08cef2d57a75",
      "X-RapidAPI-Host": "ip-geo-location.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    //const lat = result.location.latitude;
    //const lng = result.location.longitude;
    const { latitude: lat, longitude: lng } = result.location;
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);

    return { lat, lng };
  } catch (error) {
    console.error(error);
  }
}
function haversine_distance(mk1, mk2) {
  var R = 3958.8; // Radius of the Earth in miles
  var rlat1 = mk1.position.lat() * (Math.PI / 180); // Convert degrees to radians
  var rlat2 = mk2.position.lat() * (Math.PI / 180); // Convert degrees to radians
  var difflat = rlat2 - rlat1; // Radian difference (latitudes)
  var difflon = (mk2.position.lng() - mk1.position.lng()) * (Math.PI / 180); // Radian difference (longitudes)

  var d =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2)
      )
    );
  return d;
}
var map;
async function initMap() {
  const { lat, lng } = await getIPAndLocation();

  // The map, centered on Central Park
  const center = {
    lat: parseFloat(-23.502914035391417),
    lng: parseFloat(-46.44341215307001),
  };
  const options = {
    zoom: 15,
    scaleControl: true,
    center: center,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };
  map = new google.maps.Map(document.getElementById("map"), options);
  // Locations of landmarks
  const p1 = { lat: -23.502914035391417, lng: -46.44341215307001 };
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
      url: "img/point.png",
      scaledSize: new google.maps.Size(35, 45),
    },
  });

  // Draw a line showing the straight distance between the markers
  var line = new google.maps.Polyline({ path: [p1, p2], map: map });
  // Calculate and display the distance between markers
  var distance = haversine_distance(mk1, mk2);
  //convert miles to km
  distance = distance * 1.609344;
  //function to  calculate  the  time was taken to travel between two points with  a car, bike or walking

  function calcularTempoDeViagem(distanciaEmKm, modoDeTransporte) {
    let velocidade;

    // Definindo a velocidade baseada no modo de transporte
    switch (modoDeTransporte) {
      case "caminhada":
        velocidade = 5; // Velocidade média de caminhada é de cerca de 5km/h
        break;
      case "transportePublico":
        velocidade = 30; // Velocidade média de transporte público pode ser de cerca de 30km/h
        break;
      default:
        return "Modo de transporte desconhecido.";
    }

    let tempo = (distanciaEmKm / velocidade) * 60; // tempo = distância / velocidade, convertendo para minutos

    if (tempo > 60) {
      let horas = Math.floor(tempo / 60); // convertendo para horas, parte inteira
      let minutos = Math.round((tempo % 60) * 100) / 100; // restante convertido para minutos, e arredondado para duas casas decimais
      return `${horas} horas e ${minutos} minutos`;
    } else {
      return `${tempo.toFixed(2)} minutos`; // O tempo de viagem estimado em minutos, limitado a duas casas decimais
    }
  }

  let tempoCaminhada = calcularTempoDeViagem(distance, "caminhada");
  let tempoTransportePublico = calcularTempoDeViagem(
    distance,
    "transportePublico"
  );
  document.getElementById("msg").innerHTML =
    "Distance between marks: " +
    distance.toFixed(2) +
    " km." +
    "<br>" +
    "Travel time with car: " +
    tempoTransportePublico +
    "<br>" +
    "Travel time by walking: " +
    tempoCaminhada;
}
