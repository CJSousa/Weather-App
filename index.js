function updateDate(date) {
  let now = new Date();
  let dayOfWeek = now.getDay();
  let dayOfMonth = now.getDate();
  let currentYear = now.getFullYear();
  let monthNumber = now.getMonth();
  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  let weekDay = weekDays[dayOfWeek];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let month = months[monthNumber];

  if (month < 10) {
    month = `0${month}`;
  }

  if (dayOfMonth < 10) {
    dayOfMonth = `0${dayOfMonth}`;
  }

  return `${weekDay}, ${month} ${dayOfMonth}, ${currentYear}`;
}

function updateTime(date) {
  let now = new Date();
  let hour = now.getHours();
  let minutes = now.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hour <= 12) {
    return `${hour}:${minutes} am`;
  } else {
    hour = hour - 12;
    return `${hour}:${minutes} pm`;
  }
}

let today = new Date();
//Update Date
let h2 = document.querySelector("h2");
h2.innerHTML = updateDate(today);
//Update Time
let h3 = document.querySelector("h3"); //How do we make it update in real time?
h3.innerHTML = updateTime(today);
//setTimeout("renderTime()", 1000);
//renderTime();

function convertDate(epoch) {
  let dateInSeconds = new Date(epoch * 1000);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let month = months[dateInSeconds.getMonth()];
  let date = dateInSeconds.getDate();
  let day = days[dateInSeconds.getDay()];
  let year = dateInSeconds.getFullYear();
  let time = `${day}, ${date} ${month}, ${year}`;
  return time;
}

function convertTime(epoch) {
  let dateSeconds = new Date(epoch * 1000);
  let hour = dateSeconds.getHours();
  return hour;
}

let modeTempDegrees = "C";
let tempValues = {}; //Assigns ids to the temperatures they should be showing

function renderTemperatures() {
  for (let [id, currentDegreesTemp] of Object.entries(tempValues)) {
    if (modeTempDegrees === "C") {
      document.querySelector(id).innerHTML = `${Math.round(
        currentDegreesTemp
      )}°${modeTempDegrees}`;
    } else {
      document.querySelector(id).innerHTML = `${Math.round(
        currentDegreesTemp * (9 / 5) + 32
      )}°${modeTempDegrees}`;
    }
  }
}

function changeDegreesToC() {
  modeTempDegrees = "C";
  renderTemperatures();
}

function changeDegreesToF() {
  modeTempDegrees = "F";
  renderTemperatures();
}

let buttonToGetCelsius = document.querySelector("#celsius");
buttonToGetCelsius.addEventListener("click", changeDegreesToC);

let buttonToGetF = document.querySelector("#far");
buttonToGetF.addEventListener("click", changeDegreesToF);

function changeMode() {
  let mode = document.getElementById("body");
  if (mode.classList.contains("lightMode")) {
    mode.classList.add("darkMode");
    mode.classList.remove("lightMode");
  } else if (mode.classList.contains("darkMode")) {
    mode.classList.remove("darkMode");
    mode.classList.add("lightMode");
  }
}

let buttonChangeMode = document.querySelector("#buttonChangeMode");
buttonChangeMode.addEventListener("click", changeMode);

function nightMode(response) {
  let sunrise = response.data.sys.sunrise;
  let sunset = response.data.sys.sunset;
  let timezone = response.data.timezone;
  let mode = document.getElementById("body");
  let today = new Date();
  let difference = today + timezone - 3600;
  let differenceSunrise = sunrise + timezone - 3600;
  let differenceSunset = sunset + timezone - 3600;
  let hours = convertTime(difference);
  let currentSunrise = convertTime(differenceSunrise);
  let currentSunset = convertTime(differenceSunset);

  if (hours > currentSunset) {
    mode.classList.add("darkMode");
    mode.classList.remove("lightMode");
  } else if (hours < currentSunrise) {
    mode.classList.add("darkMode");
    mode.classList.remove("lightMode");
  } else {
    mode.classList.remove("darkMode");
    mode.classList.add("lightMode");
  }
}

function clickForCurrentData() {
  function showWeatherDetailsToday(response) {
    for (let tempMarker of document.getElementsByClassName(
      "tempCurrentLocation"
    )) {
      tempMarker.style.visibility = "visible";
    }

    let place = document.querySelector("#currentLocation");
    place.innerText = response.data.name;

    let weatherToday = response.data.weather[0].description;
    let currentWeatherToday = document.querySelector("#descripWeatherToday");
    currentWeatherToday.innerHTML = `${weatherToday}`;

    let icon = document.querySelector("#iconToday");
    icon.setAttribute(
      "src",
      `http://openweathermap.org/img/w/${response.data.weather[0].icon}.png`
    );

    let temperature = response.data.main.temp;
    tempValues["#tempNow"] = temperature;

    let maxTempToday = response.data.main.temp_max;
    tempValues["#maxTempNow"] = maxTempToday;

    let minTempToday = response.data.main.temp_min;
    tempValues["#minTempNow"] = minTempToday;

    let humidityToday = response.data.main.humidity;
    let currentHumidityToday = document.querySelector("#humidityToday");
    currentHumidityToday.innerHTML = `Humidity: ${humidityToday}%`;

    let windSpeedToday = response.data.wind.speed;
    let currentWindSpeed = document.querySelector("#windToday");
    currentWindSpeed.innerHTML = `Wind speed: ${windSpeedToday}km/h`;

    renderTemperatures();
  }

  function showPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let apiKey = "8a8a393e03ebb3959d1f1fd908ba1628";
    let apiEndPoint = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    axios.get(apiEndPoint).then(showWeatherDetailsToday);
    axios.get(apiEndPoint).then(nightMode);
  }

  navigator.geolocation.getCurrentPosition(showPosition);
}

let buttonToGetLocation = document.querySelector("#location");
buttonToGetLocation.addEventListener("click", clickForCurrentData);

//Form Details Next Trip
function search(city) {
  let apiKey = "8a8a393e03ebb3959d1f1fd908ba1628";
  let apiEndPoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiEndPoint).then(showWeatherDetailsNextTrip);
}

function handleBrowser(event) {
  event.preventDefault();
  inputBrowser = document.querySelector("#nextTrip");
  search(nextTrip.value);
}

function showWeatherDetailsNextTrip(response) {
  let place = document.querySelector("#placeNextTrip");
  place.innerText = response.data.name;

  let weatherNextTrip = document.querySelector("#weatherNext");
  weatherNextTrip.innerHTML = response.data.weather[0].description;

  let icon = document.querySelector("#iconNextTrip");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/w/${response.data.weather[0].icon}.png`
  );

  let tNext = response.data.main.temp;
  tempValues["#tempNextTrip"] = tNext;

  let maxT = response.data.main.temp_max;
  tempValues["#maxTempNextTrip"] = maxT;

  let minT = response.data.main.temp_min;
  tempValues["#minTempNextTrip"] = minT;

  renderTemperatures();

  let humidity = document.querySelector("#humidityNextTrip");
  let humNext = response.data.main.humidity;
  humidity.innerText = `Humidity: ${humNext}%`;

  let wind = document.querySelector("#windNextTrip");
  let windNext = Math.round(response.data.wind.speed);
  wind.innerText = `Wind speed: ${windNext} km\h`;
}

//Form Forecats Details
function searchForecast(city) {
  let apiKey = "8a8a393e03ebb3959d1f1fd908ba1628";
  let apiEndPoint = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiEndPoint).then(showWeatherDetailsForecast);
}
function handleBrowserForecast(event) {
  event.preventDefault();
  inputBrowser = document.querySelector("#nextTrip");
  searchForecast(nextTrip.value);
}
function showWeatherDetailsForecast(response) {
  for (let tempMarker of document.getElementsByClassName("tempNextDays")) {
    tempMarker.style.visibility = "visible";
  }

  for (let i = 1; i != 6; i++) {
    let base = 8 * (i - 1);

    let date = document.querySelector("#day" + i);
    dayForecast = response.data.list[base + 7].dt;
    dayForecast = convertDate(dayForecast);
    date.innerHTML = dayForecast;

    let weather = document.querySelector("#descripWeather" + i);
    weather.innerHTML = response.data.list[base + 7].weather[0].description;

    let icon = document.querySelector("#icon" + i);
    icon.setAttribute(
      "src",
      `http://openweathermap.org/img/w/${
        response.data.list[base + 7].weather[0].icon
      }.png`
    );

    let maxTemp = response.data.list
      .slice(base + 0, base + 8)
      .map(temp => temp.main.temp_max)
      .reduce((temp, lastTemp) => Math.max(temp, lastTemp));
    let minTemp = response.data.list
      .slice(base + 0, base + 8)
      .map(temp => temp.main.temp_min)
      .reduce((temp, lastTemp) => Math.min(temp, lastTemp));
    tempValues["#maxTemp" + i] = maxTemp;
    tempValues["#minTemp" + i] = minTemp;

    let humidity = document.querySelector("#humidity" + i);
    let hum = response.data.list[base + 7].main.humidity;
    humidity.innerText = `Hum: ${hum}%`;

    let wind1 = document.querySelector("#wind1");
    let windNext1 = Math.round(response.data.list[7].wind.speed);
    wind1.innerText = `Wind: ${windNext1}km/h`;
  }
}

let formTrip = document.querySelector("#formNextTrip");
formTrip.addEventListener("submit", handleBrowser);
formTrip.addEventListener("submit", handleBrowserForecast);
let defaultCity = `Lisbon, PT`;
search(defaultCity);
