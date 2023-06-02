// Get the form input element
const cityInput = document.querySelector('#city-input');

// Get the search button element
const searchButton = document.querySelector('#search-button');

// Get the search history form element
const searchHistoryForm = document.querySelector('#history');

// Get the current weather elements
const cityName = document.querySelector('#city-name');
const weatherIcon = document.querySelector('#current-pic');
const temperature = document.querySelector('#temperature');
const humidity = document.querySelector('#humidity');
const windSpeed = document.querySelector('#wind-speed');

// Get the weather forecast elements
const forecastContainer = document.querySelector('.forecast');

// Initialize the search history array
let searchHistoryArray = [];

// Function to get the weather data for a city
async function getWeatherData(city) {
  const apiKey = '6b220b3a90533b98b6f53b1b9a3ad5a0';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    // Get the current weather data for the city
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Get the latitude and longitude of the city
    const { lat, lon } = data.coord;

    // Get the weather forecast data for the city
    const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    return { data, forecastData };
  } catch (error) {
    console.log(error);
    alert('Error retrieving weather data. Please try again.');
  }
}

// Function to display the current weather for a city
function displayCurrentWeather(city, weatherData) {
  // Set the city name
  cityName.textContent = city;

  // Set the temperature
  temperature.textContent = `${Math.round(weatherData.data.main.temp)}°C`;

  // Set the humidity
  humidity.textContent = `Humidity: ${weatherData.data.main.humidity}%`;

  // Set the wind speed
  windSpeed.textContent = `Wind Speed: ${Math.round(weatherData.data.wind.speed)} m/s`;

  // Set the weather icon
  const iconCode = weatherData.data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
  weatherIcon.setAttribute('src', iconUrl);

  // Display the current weather container
  currentWeather.style.display = 'block';
}

// Function to display the weather forecast for a city
function displayWeatherForecast(forecastData) {
  // Clear the forecast container
  forecastContainer.innerHTML = '';

  // Create a card for each day in the forecast
  for (let i = 1; i <= 5; i++) {
    // Get the forecast data for the day
    const forecast = forecastData.daily[i];

    // Create a forecast card
    const card = document.createElement('div');
    card.classList.add('col', 'forecast', 'bg-primary', 'text-white', 'ml-3', 'mb-3', 'rounded');

    // Create a card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Create a title for the date
    const date = new Date(forecast.dt * 1000);
    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = date.toLocaleDateString('en-US', { weekday: 'short' });

    // Create an image element for the weather icon
    const icon = document.createElement('img');
    const iconCode = forecast.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    icon.setAttribute('src', iconUrl);
    icon.setAttribute('alt', forecast.weather[0].description);

    // Create a paragraph element for the temperature
    const temp = document.createElement('p');
    temp.classList.add('card-text');
    temp.innerHTML = `${Math.round(forecast.temp.day)}°C`;

    // Create a paragraph element for the wind speed
    const wind = document.createElement('p');
    wind.classList.add('card-text');
    wind.textContent = `${Math.round(forecast.wind_speed)} m/s`;

    // Create a paragraph element for the humidity
    const humidity = document.createElement('p');
    humidity.classList.add('card-text');
    humidity.textContent = `${forecast.humidity}%`;

    // Append the elements to the card body
    cardBody.appendChild(title);
    cardBody.appendChild(icon);
    cardBody.appendChild(temp);
    cardBody.appendChild(wind);
    cardBody.appendChild(humidity);

    // Append the card body to the card
    card.appendChild(cardBody);

    // Append the card to the weather forecast container
    forecastContainer.appendChild(card);
  }
}

// Function to handle form submit
function handleFormSubmit(event) {
  event.preventDefault();

  // Get the user input
  const city = cityInput.value.trim();

  if (city) {
    // Clear the form input
    cityInput.value = '';

    // Get the weather data for the city
    getWeatherData(city)
      .then(weatherData => {
        // Display the current weather
        displayCurrentWeather(city, weatherData);

        // Display the weather forecast
        displayWeatherForecast(weatherData.forecastData);
      })
      .catch(error => console.log(error));

    // Add the city to the search history
    searchHistoryArray.push(city);
    updateSearchHistory();
  } else {
    alert('Please enter a city name.');
  }
}

// Function to update the search history
function updateSearchHistory() {
  // Clear the search history
  searchHistoryForm.innerHTML = '';

  // Create a list item for each city in the search history
  searchHistoryArray.forEach(city => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.textContent = city;
    searchHistoryForm.appendChild(li);
  });
}

// Function to handle search history click
function handleSearchHistoryClick(event) {
  const selectedCity = event.target.textContent;

  // Get the weather data for the selected city
  getWeatherData(selectedCity)
    .then(weatherData => {
      // Display the current weather
      displayCurrentWeather(selectedCity, weatherData);

      // Display the weather forecast
      displayWeatherForecast(weatherData.forecastData);
    })
    .catch(error => console.log(error));
}

// Add event listeners
searchButton.addEventListener('click', handleFormSubmit);
searchHistoryForm.addEventListener('click', handleSearchHistoryClick);
