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

  let date1 = document.querySelector("#day1");
  day1Forecast = response.data.list[7].dt;
  day1Forecast = convertDate(day1Forecast);
  date1.innerHTML = day1Forecast;

  let weather1 = document.querySelector("#descripWeather1");
  weather1.innerHTML = response.data.list[7].weather[0].description;
  let icon1 = document.querySelector("#icon1");
  icon1.setAttribute(
    "src",
    `http://openweathermap.org/img/w/${
      response.data.list[7].weather[0].icon
    }.png`
  );
  let maxDay1Temp0 = response.data.list[0].main.temp_max;
  let maxDay1Temp1 = response.data.list[1].main.temp_max;
  let maxDay1Temp2 = response.data.list[2].main.temp_max;
  let maxDay1Temp3 = response.data.list[3].main.temp_max;
  let maxDay1Temp4 = response.data.list[4].main.temp_max;
  let maxDay1Temp5 = response.data.list[5].main.temp_max;
  let maxDay1Temp6 = response.data.list[6].main.temp_max;
  let maxDay1Temp7 = response.data.list[7].main.temp_max;
  let maxT1 = Math.max(
    maxDay1Temp0,
    maxDay1Temp1,
    maxDay1Temp2,
    maxDay1Temp3,
    maxDay1Temp4,
    maxDay1Temp5,
    maxDay1Temp6,
    maxDay1Temp7
  );
  tempValues["#maxTemp1"] = maxT1;

  let minDay1Temp0 = response.data.list[0].main.temp_max;
  let minDay1Temp1 = response.data.list[1].main.temp_max;
  let minDay1Temp2 = response.data.list[2].main.temp_max;
  let minDay1Temp3 = response.data.list[3].main.temp_max;
  let minDay1Temp4 = response.data.list[4].main.temp_max;
  let minDay1Temp5 = response.data.list[5].main.temp_max;
  let minDay1Temp6 = response.data.list[6].main.temp_max;
  let minDay1Temp7 = response.data.list[7].main.temp_max;
  let minT1 = Math.min(
    minDay1Temp0,
    minDay1Temp1,
    minDay1Temp2,
    minDay1Temp3,
    minDay1Temp4,
    minDay1Temp5,
    minDay1Temp6,
    minDay1Temp7
  );
  tempValues["#minTemp1"] = minT1;

  let humidity1 = document.querySelector("#humidity1");
  let hum1 = response.data.list[7].main.humidity;
  humidity1.innerText = `Hum: ${hum1}%`;
  let wind1 = document.querySelector("#wind1");
  let windNext1 = Math.round(response.data.list[7].wind.speed);
  wind1.innerText = `Wind: ${windNext1}km/h`;

  let date2 = document.querySelector("#day2");
  day2Forecast = response.data.list[15].dt;
  day2Forecast = convertDate(day2Forecast);
  date2.innerHTML = day2Forecast;

  let weather2 = document.querySelector("#descripWeather2");
  weather2.innerHTML = response.data.list[15].weather[0].description;
  let icon2 = document.querySelector("#icon2");
  icon2.setAttribute(
    "src",
    `http://openweathermap.org/img/w/${
      response.data.list[15].weather[0].icon
    }.png`
  );
  let maxDay2Temp8 = response.data.list[8].main.temp_max;
  let maxDay2Temp9 = response.data.list[9].main.temp_max;
  let maxDay2Temp10 = response.data.list[10].main.temp_max;
  let maxDay2Temp11 = response.data.list[11].main.temp_max;
  let maxDay2Temp12 = response.data.list[12].main.temp_max;
  let maxDay2Temp13 = response.data.list[13].main.temp_max;
  let maxDay2Temp14 = response.data.list[14].main.temp_max;
  let maxDay2Temp15 = response.data.list[15].main.temp_max;
  let maxT2 = Math.max(
    maxDay2Temp8,
    maxDay2Temp9,
    maxDay2Temp10,
    maxDay2Temp11,
    maxDay2Temp12,
    maxDay2Temp13,
    maxDay2Temp14,
    maxDay2Temp15
  );

  tempValues["#maxTemp2"] = maxT2;

  let minDay2Temp8 = response.data.list[8].main.temp_max;
  let minDay2Temp9 = response.data.list[9].main.temp_max;
  let minDay2Temp10 = response.data.list[10].main.temp_max;
  let minDay2Temp11 = response.data.list[11].main.temp_max;
  let minDay2Temp12 = response.data.list[12].main.temp_max;
  let minDay2Temp13 = response.data.list[13].main.temp_max;
  let minDay2Temp14 = response.data.list[14].main.temp_max;
  let minDay2Temp15 = response.data.list[15].main.temp_max;
  let minT2 = Math.min(
    minDay2Temp8,
    minDay2Temp9,
    minDay2Temp10,
    minDay2Temp11,
    minDay2Temp12,
    minDay2Temp13,
    minDay2Temp14,
    minDay2Temp15
  );
  tempValues["#minTemp2"] = minT2;

  let humidity2 = document.querySelector("#humidity2");
  let hum2 = response.data.list[15].main.humidity;
  humidity2.innerText = `Hum: ${hum2}%`;
  let wind2 = document.querySelector("#wind2");
  let windNext2 = Math.round(response.data.list[15].wind.speed);
  wind2.innerText = `Wind: ${windNext2}km/h`;

  let date3 = document.querySelector("#day3");
  day3Forecast = response.data.list[23].dt;
  day3Forecast = convertDate(day3Forecast);
  date3.innerHTML = day3Forecast;

  let weather3 = document.querySelector("#descripWeather3");
  weather3.innerHTML = response.data.list[23].weather[0].description;
  let icon3 = document.querySelector("#icon3");
  icon3.setAttribute(
    "src",
    `http://openweathermap.org/img/w/${
      response.data.list[23].weather[0].icon
    }.png`
  );
  let maxDay3Temp16 = response.data.list[16].main.temp_max;
  let maxDay3Temp17 = response.data.list[17].main.temp_max;
  let maxDay3Temp18 = response.data.list[18].main.temp_max;
  let maxDay3Temp19 = response.data.list[19].main.temp_max;
  let maxDay3Temp20 = response.data.list[20].main.temp_max;
  let maxDay3Temp21 = response.data.list[21].main.temp_max;
  let maxDay3Temp22 = response.data.list[22].main.temp_max;
  let maxDay3Temp23 = response.data.list[23].main.temp_max;
  let maxT3 = Math.max(
    maxDay3Temp16,
    maxDay3Temp17,
    maxDay3Temp18,
    maxDay3Temp19,
    maxDay3Temp20,
    maxDay3Temp21,
    maxDay3Temp22,
    maxDay3Temp23
  );
  tempValues["#maxTemp3"] = maxT3;

  let minDay3Temp16 = response.data.list[16].main.temp_max;
  let minDay3Temp17 = response.data.list[17].main.temp_max;
  let minDay3Temp18 = response.data.list[18].main.temp_max;
  let minDay3Temp19 = response.data.list[19].main.temp_max;
  let minDay3Temp20 = response.data.list[20].main.temp_max;
  let minDay3Temp21 = response.data.list[21].main.temp_max;
  let minDay3Temp22 = response.data.list[22].main.temp_max;
  let minDay3Temp23 = response.data.list[23].main.temp_max;
  let minT3 = Math.min(
    minDay3Temp16,
    minDay3Temp17,
    minDay3Temp18,
    minDay3Temp19,
    minDay3Temp20,
    minDay3Temp21,
    minDay3Temp22,
    minDay3Temp23
  );
  tempValues["#minTemp3"] = minT3;

  let humidity3 = document.querySelector("#humidity3");
  let hum3 = response.data.list[17].main.humidity;
  humidity3.innerText = `Hum: ${hum3}%`;
  let wind3 = document.querySelector("#wind3");
  let windNext3 = Math.round(response.data.list[17].wind.speed);
  wind3.innerText = `Wind: ${windNext3}km/h`;

  let date4 = document.querySelector("#day4");
  day4Forecast = response.data.list[31].dt;
  day4Forecast = convertDate(day4Forecast);
  date4.innerHTML = day4Forecast;

  let weather4 = document.querySelector("#descripWeather4");
  weather4.innerHTML = response.data.list[31].weather[0].description;
  let icon4 = document.querySelector("#icon4");
  icon4.setAttribute(
    "src",
    `http://openweathermap.org/img/w/${
      response.data.list[31].weather[0].icon
    }.png`
  );
  let maxDay4Temp24 = response.data.list[24].main.temp_max;
  let maxDay4Temp25 = response.data.list[25].main.temp_max;
  let maxDay4Temp26 = response.data.list[26].main.temp_max;
  let maxDay4Temp27 = response.data.list[27].main.temp_max;
  let maxDay4Temp28 = response.data.list[28].main.temp_max;
  let maxDay4Temp29 = response.data.list[29].main.temp_max;
  let maxDay4Temp30 = response.data.list[30].main.temp_max;
  let maxDay4Temp31 = response.data.list[31].main.temp_max;
  let maxT4 = Math.max(
    maxDay4Temp24,
    maxDay4Temp25,
    maxDay4Temp26,
    maxDay4Temp27,
    maxDay4Temp28,
    maxDay4Temp29,
    maxDay4Temp30,
    maxDay4Temp31
  );
  tempValues["#maxTemp4"] = maxT4;

  let minDay4Temp24 = response.data.list[24].main.temp_min;
  let minDay4Temp25 = response.data.list[25].main.temp_min;
  let minDay4Temp26 = response.data.list[26].main.temp_min;
  let minDay4Temp27 = response.data.list[27].main.temp_min;
  let minDay4Temp28 = response.data.list[28].main.temp_min;
  let minDay4Temp29 = response.data.list[29].main.temp_min;
  let minDay4Temp30 = response.data.list[30].main.temp_min;
  let minDay4Temp31 = response.data.list[31].main.temp_min;
  let minT4 = Math.min(
    minDay4Temp24,
    minDay4Temp25,
    minDay4Temp26,
    minDay4Temp27,
    minDay4Temp28,
    minDay4Temp29,
    minDay4Temp30,
    minDay4Temp31
  );
  tempValues["#minTemp4"] = minT4;

  let humidity4 = document.querySelector("#humidity4");
  let hum4 = response.data.list[25].main.humidity;
  humidity4.innerText = `Hum: ${hum4}%`;
  let wind4 = document.querySelector("#wind4");
  let windNext4 = Math.round(response.data.list[25].wind.speed);
  wind4.innerText = `Wind: ${windNext4}km/h`;

  let date5 = document.querySelector("#day5");
  day5Forecast = response.data.list[39].dt;
  day5Forecast = convertDate(day5Forecast);
  date5.innerHTML = day5Forecast;

  let weather5 = document.querySelector("#descripWeather5");
  weather5.innerHTML = response.data.list[39].weather[0].description;
  let icon5 = document.querySelector("#icon5");
  icon5.setAttribute(
    "src",
    `http://openweathermap.org/img/w/${
      response.data.list[33].weather[0].icon
    }.png`
  );

  let maxDay5Temp32 = response.data.list[32].main.temp_max;
  let maxDay5Temp33 = response.data.list[33].main.temp_max;
  let maxDay5Temp34 = response.data.list[34].main.temp_max;
  let maxDay5Temp35 = response.data.list[35].main.temp_max;
  let maxDay5Temp36 = response.data.list[36].main.temp_max;
  let maxDay5Temp37 = response.data.list[37].main.temp_max;
  let maxDay5Temp38 = response.data.list[38].main.temp_max;
  let maxDay5Temp39 = response.data.list[39].main.temp_max;
  let maxT5 = Math.max(
    maxDay5Temp32,
    maxDay5Temp33,
    maxDay5Temp34,
    maxDay5Temp35,
    maxDay5Temp36,
    maxDay5Temp37,
    maxDay5Temp38,
    maxDay5Temp39
  );
  tempValues["#maxTemp5"] = maxT4;

  let minDay5Temp24 = response.data.list[32].main.temp_min;
  let minDay5Temp25 = response.data.list[33].main.temp_min;
  let minDay5Temp26 = response.data.list[34].main.temp_min;
  let minDay5Temp27 = response.data.list[35].main.temp_min;
  let minDay5Temp28 = response.data.list[36].main.temp_min;
  let minDay5Temp29 = response.data.list[37].main.temp_min;
  let minDay5Temp30 = response.data.list[38].main.temp_min;
  let minDay5Temp31 = response.data.list[39].main.temp_min;
  let minT5 = Math.min(
    minDay5Temp24,
    minDay5Temp25,
    minDay5Temp26,
    minDay5Temp27,
    minDay5Temp28,
    minDay5Temp29,
    minDay5Temp30,
    minDay5Temp31
  );
  tempValues["#minTemp5"] = minT5;
  renderTemperatures();

  let humidity5 = document.querySelector("#humidity5");
  let hum5 = response.data.list[33].main.humidity;
  humidity5.innerText = `Hum: ${hum5}%`;
  let wind5 = document.querySelector("#wind5");
  let windNext5 = Math.round(response.data.list[33].wind.speed);
  wind5.innerText = `Wind: ${windNext5}km/h`;
}

let formTrip = document.querySelector("#formNextTrip");
formTrip.addEventListener("submit", handleBrowser);
formTrip.addEventListener("submit", handleBrowserForecast);
let defaultCity = `Lisbon, PT`;
search(defaultCity);
