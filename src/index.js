import "./styles.css";

const body = document.querySelector("body");
const unitButton = document.querySelector("#unit-toggle");
const searchButton = document.querySelector("#search");
const input = document.querySelector("input");

const location = document.querySelector("#location");
const temp = document.querySelector("#temp");
const icon = document.querySelector("#icon");
const condition = document.querySelector("#condition");

let currentUnit = "C";

async function getWeather(location) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=KYQMJ6NYQETXZ39PXPYN5M84Z&contentType=json`,
    { mode: "cors" },
  );
  return await response.json();
}

function convertTemp(temp) {
  if (currentUnit == "C") {
    temp = Math.round((temp - 32) * (5 / 9));
  } else {
    temp = Math.round((temp * (9 / 5)) + 32);
  }

  return temp;
}

function toggleNight(time) {
  const hour = time.slice(0, 2);
  
  if(hour >= 20 || hour <= 6) {
    body.classList.add("night");
    searchButton.classList.add("night");
  } else {
    body.classList.remove("night");
    searchButton.classList.remove("night");
  }
}

searchButton.addEventListener("click", () => {
  if(input.value) {
    const loading = document.createElement("h1");
    loading.textContent = "Loading...";
    body.querySelector("#content").appendChild(loading);

    getWeather(input.value).then((weather) => {
      console.log(weather);
      location.textContent = weather.resolvedAddress;
      // Check unit
      if (currentUnit == "C") {
        temp.textContent = convertTemp(weather.currentConditions.temp) + "°C";
      } else {
        temp.textContent = Math.floor(weather.currentConditions.temp) + "°F";
      }

      icon.classList.remove("visible");      
      import(`./icons/${weather.currentConditions.icon}.svg`).then((image) =>  {
        icon.src = image.default;
        icon.classList.add("visible");
      });
      condition.textContent = weather.currentConditions.conditions;
      input.value = "";
      toggleNight(weather.currentConditions.datetime);
      loading.remove();
    }).catch(() => {
      loading.remove();
    });
  }
});

unitButton.addEventListener("click", () => {
  if (temp.textContent) {
    if (currentUnit == "C") {
      currentUnit = "F";
      let currentTemp = temp.textContent.slice(0, -2);
      currentTemp = convertTemp(currentTemp);
      temp.textContent = currentTemp + "°F";
    } else {
      currentUnit = "C";
      let currentTemp = temp.textContent.slice(0, -2);
      currentTemp = convertTemp(currentTemp);
      temp.textContent = currentTemp + "°C";
    }
  } else {
    currentUnit == "C" ? (currentUnit = "F") : (currentUnit = "C");
  }
  unitButton.textContent = "°" + currentUnit;
});
