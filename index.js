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
console.log(today);
//Update Date
let h2 = document.querySelector("h2");
h2.innerHTML = updateDate(today);
//Update Time
let h3 = document.querySelector("h3"); //How do we make it update in real time?
h3.innerHTML = updateTime(today);
//setTimeout("renderTime()", 1000);
//renderTime();

function changeDegreesToF() {
  let currentTemperature = document.querySelector("temperature");
  let currentValue = document.querySelector("temperature");
  newDegTemp = currentValue * (9 / 5) + 35;
  newDegTemp = Math.round(newDegTemp);
  currentTemperature.innerHTML = `°F`;
}

function changeDegreesToC() {
  let currentTemperature = document.querySelector("temperature");
  let currentValue = document.querySelector("temperature");
  newDegTemp = (currentValue - 35) * (5 / 9);
  newDegTemp = Math.round(newDegTemp);
  currentTemperature.innerHTML = `${newDegTemp}°C`;
}

let buttonF = document.querySelector("#far");
buttonF.addEventListener("click", changeDegreesToF);
let buttonC = document.querySelector("#celsius");
buttonC.addEventListener("click", changeDegreesToC);

function darkMode() {
  if (body.classList.contains("lightMode")) {
    body.classList.add("darkMode").remove("lightMode");
  } else if (body.classList.contains("darkMode")) {
    body.classList.add("lightMode").remove("darkMode");
  }
}
let changeModeButton = document.querySelector("#buttonChangeMode");
changeModeButton.addEventListener("click", darkMode);

//Night Mode --> Not working
//function nightMode(response, date) {
//  let sunset = response.data.sys.sunset;
//  let sunrise = response.data.sys.sunrise;
//  let now = new Date();

//  if (now.getTime() > sunrise && now.getTime() >= sunset) {
//    body.classList.add("darkMode").remove("lightMode");
//  } else {
//    body.classList.add("lightMode").remove("darkMode");
//  }
//}

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

function clickForCurrentData() {
  function showWeatherDetailsToday(response) {
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
    let currentTemp = document.querySelector("#tempNow");
    currentTemp.innerHTML = `${temperature}°C`;

    let maxTempToday = Math.round(response.data.main.temp_max);
    let currentTempMaxToday = document.querySelector("#maxTempNow");
    currentTempMaxToday.innerHTML = `${maxTempToday}°C`;

    let minTempToday = Math.round(response.data.main.temp_min);
    let currentTempMinToday = document.querySelector("#minTempNow");
    currentTempMinToday.innerHTML = `${minTempToday}°C`;

    let humidityToday = response.data.main.humidity;
    let currentHumidityToday = document.querySelector("#humidityToday");
    currentHumidityToday.innerHTML = `Humidity: ${humidityToday}%`;

    let windSpeedToday = response.data.wind.speed;
    let currentWindSpeed = document.querySelector("#windToday");
    currentWindSpeed.innerHTML = `Wind speed: ${windSpeedToday}km/h`;
  }

  function showPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let apiKey = "8a8a393e03ebb3959d1f1fd908ba1628";
    let apiEndPoint = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    axios.get(apiEndPoint).then(showWeatherDetailsToday);
    //axios.get(apiEndPoint).then(nightMode);
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

  let temperature = document.querySelector("#tempNextTrip");
  let tNext = Math.round(response.data.main.temp);
  temperature.innerHTML = `${tNext}°C`;

  let maxTemp = document.querySelector("#maxTempNextTrip");
  let maxT = Math.round(response.data.main.temp_max);
  maxTemp.innerHTML = `${maxT}°C`;

  let minTemp = document.querySelector("#minTempNextTrip");
  let minT = Math.round(response.data.main.temp_min);
  minTemp.innerText = `${minT}°C`;

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
  let date1 = document.querySelector("#day1");
  day1Forecast = response.data.list[6].dt;
  console.log(day1Forecast);
  day1Forecast = convertDate(day1Forecast);
  date1.innerHTML = day1Forecast;

  let weather1 = document.querySelector("#descripWeather1");
  weather1.innerHTML = response.data.list[6].weather[0].description;
  let icon1 = document.querySelector("#icon1");
  icon1.setAttribute(
    "src",
    `http://openweathermap.org/img/w/${
      response.data.list[6].weather[0].icon
    }.png`
  );
  let maxTemp1 = document.querySelector("#maxTemp1");
  let maxT1 = Math.round(response.data.list[6].main.temp_max);
  maxTemp1.innerHTML = `${maxT1}°C`;
  let minTemp1 = document.querySelector("#minTemp1");
  let minT1 = Math.round(response.data.list[6].main.temp_min);
  minTemp1.innerText = `${minT1}°C`;
  let humidity1 = document.querySelector("#humidity1");
  let hum1 = response.data.list[6].main.humidity;
  humidity1.innerText = `Hum: ${hum1}%`;
  let wind1 = document.querySelector("#wind1");
  let windNext1 = Math.round(response.data.list[6].wind.speed);
  wind1.innerText = `Wind: ${windNext1}km/h`;

  let date2 = document.querySelector("#day2");
  day2Forecast = response.data.list[10].dt;
  console.log(day2Forecast);
  day2Forecast = convertDate(day2Forecast);
  date2.innerHTML = day2Forecast;

  let weather2 = document.querySelector("#descripWeather2");
  weather2.innerHTML = response.data.list[10].weather[0].description;
  let icon2 = document.querySelector("#icon2");
  icon2.setAttribute(
    "src",
    `http://openweathermap.org/img/w/${
      response.data.list[10].weather[0].icon
    }.png`
  );
  let maxTemp2 = document.querySelector("#maxTemp2");
  let maxT2 = Math.round(response.data.list[10].main.temp_max);
  maxTemp2.innerHTML = `${maxT2}°C`;
  let minTemp2 = document.querySelector("#minTemp2");
  let minT2 = Math.round(response.data.list[10].main.temp_min);
  minTemp2.innerText = `${minT2}°C`;
  let humidity2 = document.querySelector("#humidity2");
  let hum2 = response.data.list[10].main.humidity;
  humidity2.innerText = `Hum: ${hum2}%`;
  let wind2 = document.querySelector("#wind2");
  let windNext2 = Math.round(response.data.list[10].wind.speed);
  wind2.innerText = `Wind: ${windNext2}km/h`;

  let date3 = document.querySelector("#day3");
  day3Forecast = response.data.list[17].dt;
  day3Forecast = convertDate(day3Forecast);
  date3.innerHTML = day3Forecast;

  let weather3 = document.querySelector("#descripWeather3");
  weather3.innerHTML = response.data.list[17].weather[0].description;
  let icon3 = document.querySelector("#icon3");
  icon3.setAttribute(
    "src",
    `http://openweathermap.org/img/w/${
      response.data.list[17].weather[0].icon
    }.png`
  );
  let maxTemp3 = document.querySelector("#maxTemp3");
  let maxT3 = Math.round(response.data.list[17].main.temp_max);
  maxTemp3.innerHTML = `${maxT3}°C`;
  let minTemp3 = document.querySelector("#minTemp3");
  let minT3 = Math.round(response.data.list[17].main.temp_min);
  minTemp3.innerText = `${minT3}°C`;
  let humidity3 = document.querySelector("#humidity3");
  let hum3 = response.data.list[17].main.humidity;
  humidity3.innerText = `Hum: ${hum3}%`;
  let wind3 = document.querySelector("#wind3");
  let windNext3 = Math.round(response.data.list[17].wind.speed);
  wind3.innerText = `Wind: ${windNext3}km/h`;

  let date4 = document.querySelector("#day4");
  day4Forecast = response.data.list[25].dt;
  day4Forecast = convertDate(day4Forecast);
  date4.innerHTML = day4Forecast;

  let weather4 = document.querySelector("#descripWeather4");
  weather4.innerHTML = response.data.list[25].weather[0].description;
  let icon4 = document.querySelector("#icon4");
  icon4.setAttribute(
    "src",
    `http://openweathermap.org/img/w/${
      response.data.list[25].weather[0].icon
    }.png`
  );
  let maxTemp4 = document.querySelector("#maxTemp4");
  let maxT4 = Math.round(response.data.list[25].main.temp_max);
  maxTemp4.innerHTML = `${maxT4}°C`;
  let minTemp4 = document.querySelector("#minTemp4");
  let minT4 = Math.round(response.data.list[25].main.temp_min);
  minTemp4.innerText = `${minT4}°C`;
  let humidity4 = document.querySelector("#humidity4");
  let hum4 = response.data.list[25].main.humidity;
  humidity4.innerText = `Hum: ${hum4}%`;
  let wind4 = document.querySelector("#wind4");
  let windNext4 = Math.round(response.data.list[25].wind.speed);
  wind4.innerText = `Wind: ${windNext4}km/h`;

  let date5 = document.querySelector("#day5");
  day5Forecast = response.data.list[33].dt;
  console.log(day5Forecast);
  day5Forecast = convertDate(day5Forecast);
  date5.innerHTML = day5Forecast;

  let weather5 = document.querySelector("#descripWeather5");
  weather5.innerHTML = response.data.list[33].weather[0].description;
  let icon5 = document.querySelector("#icon5");
  icon5.setAttribute(
    "src",
    `http://openweathermap.org/img/w/${
      response.data.list[33].weather[0].icon
    }.png`
  );
  let maxTemp5 = document.querySelector("#maxTemp5");
  let maxT5 = Math.round(response.data.list[33].main.temp_max);
  maxTemp5.innerHTML = `${maxT5}°C`;
  let minTemp5 = document.querySelector("#minTemp5");
  let minT5 = Math.round(response.data.list[33].main.temp_min);
  minTemp5.innerText = `${minT5}°C`;
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
search(Lisbon, PT);
