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
  let currentValue = document.querySelector("temperature").value;
  newDegTemp = currentValue * (9 / 5) + 35;
  newDegTemp = Math.round(newDegTemp);
  //Add the F at the end
  return newDegTemp;
}

function changeDegreesToC() {
  let currentValue = document.querySelector("temperature").value;
  newDegTemp = (currentValue - 35) * (5 / 9);
  newDegTemp = Math.round(newDegTemp);
  //Add the C at the end
  return newDegTemp;
}

let buttonF = document.querySelector("#far");
buttonF.addEventListener("click", changeDegreesToF);
let buttonC = document.querySelector("#celsius");
buttonC.addEventListener("click", changeDegreesToC);

//Dark Mode --> Not working
function darkMode() {
  if (body.classList === "lightMode") {
    body.classList.add("darkMode").remove("lightMode");
  } else {
    body.classList.add("lightMode").remove("darkMode");
  }
}
let changeModeButton = document.querySelector("#buttonChangeMode");
changeModeButton.addEventListener("click", darkMode);

//Night Mode --> Not working
function nightMode(response, date) {
  let sunset = response.data.sys.sunset;
  let sunrise = response.data.sys.sunrise;
  let now = new Date();

  if (now.getTime() > sunrise && now.getTime() >= sunset) {
    body.classList.add("darkMode").remove("lightMode");
  } else {
    body.classList.add("lightMode").remove("darkMode");
  }
}

//Getting a date right -> important for forecast
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
  let dayMonth = dateInSeconds.getDate();
  let dayWeek = days[dateInSeconds.getDay()];
  let year = dateInSeconds.getFullYear();
  let time = `${dayWeek}, ${dateMonth} ${month}, ${year}`;
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
    axios.get(apiEndPoint).then(nightMode);
  }

  navigator.geolocation.getCurrentPosition(showPosition);
}

let buttonToGetLocation = document.querySelector("#location");
buttonToGetLocation.addEventListener("click", clickForCurrentData);

//Form
function search(city) {
  let apiKey = "8a8a393e03ebb3959d1f1fd908ba1628";
  let apiEndPoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  let apiEndPointForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric$appid=${apiKey}`;

  axios.get(apiEndPoint).then(showWeatherDetailsNextTrip);
  axios.get(apiEndPointForecast).then(showWeatherDetailsForecast);
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
  wind.innerText = `Wind speed: ${windNext}km/h`;
}

function showWeatherDetailsForecast(response) {
  //Day 1 --> Not working, but once it does it will be the same for other days
  let date1 = document.querySelector("#day1");
  date1For = response.data.list[0].dt;
  date1For.innerHTML = convertDate(date1For);
  console.log(date1For);
  let weather1 = document.querySelector("#descripWeather1");
  weather1.innerHTML = response.data.list[0].weather[0].description;

  let icon = document.querySelector("#icon1");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/w/${
      response.data.list[0].weather[0].icon
    }.png`
  );

  let maxTemp1 = document.querySelector("#maxTemp1");
  let maxT1 = Math.round(response.data.list[0].main.temp_max);
  maxTemp1.innerHTML = `${maxT1}°C`;

  let minTemp1 = document.querySelector("#minTemp1");
  let minT1 = Math.round(response.data.list[0].main.temp_min);
  minTemp1.innerText = `${minT1}°C`;

  let humidity1 = document.querySelector("#humidity1");
  let hum1 = response.data.list[0].main.humidity;
  humidity1.innerText = `Humidity: ${hum1}%`;

  let wind1 = document.querySelector("#wind1");
  let windNext1 = Math.round(response.data.list[0].wind.speed);
  wind1.innerText = `Wind speed: ${windNext1}km/h`;
}

let formTrip = document.querySelector("#formNextTrip");
formTrip.addEventListener("submit", handleBrowser);
search(Lisbon, PT);
