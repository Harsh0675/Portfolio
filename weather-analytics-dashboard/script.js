document.addEventListener("DOMContentLoaded", () => {
  // 1. Weather Dataset for Major Cities
  const WEATHER_DATA = {
    "New Delhi": {
      country: "India",
      tempC: 34,
      condition: "Partly Cloudy",
      icon: "fa-cloud-sun",
      highC: 36,
      lowC: 28,
      humidity: 62,
      windSpeed: "14 km/h",
      uvIndex: "8 (Very High)",
      airQuality: "112 (Moderate)",
      pressure: "1008 hPa",
      visibility: "8 km",
      forecast: [
        { day: "Today", condition: "Partly Cloudy", icon: "fa-cloud-sun", highC: 36, lowC: 28 },
        { day: "Sun, Aug 16", condition: "Thunderstorms", icon: "fa-cloud-bolt", highC: 32, lowC: 26 },
        { day: "Mon, Aug 17", condition: "Heavy Rain", icon: "fa-cloud-showers-heavy", highC: 30, lowC: 25 },
        { day: "Tue, Aug 18", condition: "Scattered Showers", icon: "fa-cloud-sun-rain", highC: 33, lowC: 26 },
        { day: "Wed, Aug 19", condition: "Clear Sunny", icon: "fa-sun", highC: 35, lowC: 27 }
      ],
      hourly: [
        { time: "09:00", tempC: 30 },
        { time: "12:00", tempC: 34 },
        { time: "15:00", tempC: 36 },
        { time: "18:00", tempC: 33 },
        { time: "21:00", tempC: 31 },
        { time: "00:00", tempC: 29 }
      ]
    },
    "London": {
      country: "United Kingdom",
      tempC: 22,
      condition: "Mostly Sunny",
      icon: "fa-sun",
      highC: 24,
      lowC: 15,
      humidity: 54,
      windSpeed: "18 km/h",
      uvIndex: "5 (Moderate)",
      airQuality: "35 (Good)",
      pressure: "1016 hPa",
      visibility: "10 km",
      forecast: [
        { day: "Today", condition: "Mostly Sunny", icon: "fa-sun", highC: 24, lowC: 15 },
        { day: "Sun, Aug 16", condition: "Passing Clouds", icon: "fa-cloud-sun", highC: 23, lowC: 14 },
        { day: "Mon, Aug 17", condition: "Light Drizzle", icon: "fa-cloud-rain", highC: 20, lowC: 13 },
        { day: "Tue, Aug 18", condition: "Overcast", icon: "fa-cloud", highC: 21, lowC: 14 },
        { day: "Wed, Aug 19", condition: "Sunny Spells", icon: "fa-sun", highC: 25, lowC: 16 }
      ],
      hourly: [
        { time: "09:00", tempC: 18 },
        { time: "12:00", tempC: 22 },
        { time: "15:00", tempC: 24 },
        { time: "18:00", tempC: 22 },
        { time: "21:00", tempC: 19 },
        { time: "00:00", tempC: 16 }
      ]
    },
    "Tokyo": {
      country: "Japan",
      tempC: 29,
      condition: "Humid & Sunny",
      icon: "fa-sun",
      highC: 31,
      lowC: 24,
      humidity: 78,
      windSpeed: "12 km/h",
      uvIndex: "7 (High)",
      airQuality: "42 (Good)",
      pressure: "1012 hPa",
      visibility: "10 km",
      forecast: [
        { day: "Today", condition: "Humid & Sunny", icon: "fa-sun", highC: 31, lowC: 24 },
        { day: "Sun, Aug 16", condition: "Clear Skies", icon: "fa-sun", highC: 32, lowC: 25 },
        { day: "Mon, Aug 17", condition: "Evening Rain", icon: "fa-cloud-sun-rain", highC: 29, lowC: 23 },
        { day: "Tue, Aug 18", condition: "Cloudy", icon: "fa-cloud", highC: 30, lowC: 24 },
        { day: "Wed, Aug 19", condition: "Sunny", icon: "fa-sun", highC: 33, lowC: 26 }
      ],
      hourly: [
        { time: "09:00", tempC: 26 },
        { time: "12:00", tempC: 29 },
        { time: "15:00", tempC: 31 },
        { time: "18:00", tempC: 29 },
        { time: "21:00", tempC: 27 },
        { time: "00:00", tempC: 25 }
      ]
    },
    "New York": {
      country: "United States",
      tempC: 27,
      condition: "Clear Blue Sky",
      icon: "fa-sun",
      highC: 29,
      lowC: 20,
      humidity: 50,
      windSpeed: "16 km/h",
      uvIndex: "6 (High)",
      airQuality: "48 (Good)",
      pressure: "1018 hPa",
      visibility: "10 km",
      forecast: [
        { day: "Today", condition: "Clear Blue Sky", icon: "fa-sun", highC: 29, lowC: 20 },
        { day: "Sun, Aug 16", condition: "Partly Cloudy", icon: "fa-cloud-sun", highC: 28, lowC: 19 },
        { day: "Mon, Aug 17", condition: "Windy", icon: "fa-wind", highC: 25, lowC: 18 },
        { day: "Tue, Aug 18", condition: "Sunny", icon: "fa-sun", highC: 27, lowC: 19 },
        { day: "Wed, Aug 19", condition: "Warm & Clear", icon: "fa-sun", highC: 30, lowC: 21 }
      ],
      hourly: [
        { time: "09:00", tempC: 22 },
        { time: "12:00", tempC: 27 },
        { time: "15:00", tempC: 29 },
        { time: "18:00", tempC: 26 },
        { time: "21:00", tempC: 23 },
        { time: "00:00", tempC: 21 }
      ]
    },
    "Sydney": {
      country: "Australia",
      tempC: 19,
      condition: "Breezy & Mild",
      icon: "fa-wind",
      highC: 21,
      lowC: 12,
      humidity: 58,
      windSpeed: "22 km/h",
      uvIndex: "4 (Moderate)",
      airQuality: "28 (Good)",
      pressure: "1022 hPa",
      visibility: "10 km",
      forecast: [
        { day: "Today", condition: "Breezy & Mild", icon: "fa-wind", highC: 21, lowC: 12 },
        { day: "Sun, Aug 16", condition: "Sunny", icon: "fa-sun", highC: 22, lowC: 13 },
        { day: "Mon, Aug 17", condition: "Light Rain", icon: "fa-cloud-rain", highC: 18, lowC: 11 },
        { day: "Tue, Aug 18", condition: "Partly Cloudy", icon: "fa-cloud-sun", highC: 20, lowC: 12 },
        { day: "Wed, Aug 19", condition: "Clear", icon: "fa-sun", highC: 23, lowC: 14 }
      ],
      hourly: [
        { time: "09:00", tempC: 15 },
        { time: "12:00", tempC: 19 },
        { time: "15:00", tempC: 21 },
        { time: "18:00", tempC: 18 },
        { time: "21:00", tempC: 16 },
        { time: "00:00", tempC: 13 }
      ]
    },
    "Paris": {
      country: "France",
      tempC: 25,
      condition: "Pleasant & Sunny",
      icon: "fa-sun",
      highC: 27,
      lowC: 16,
      humidity: 49,
      windSpeed: "11 km/h",
      uvIndex: "6 (High)",
      airQuality: "38 (Good)",
      pressure: "1015 hPa",
      visibility: "10 km",
      forecast: [
        { day: "Today", condition: "Pleasant & Sunny", icon: "fa-sun", highC: 27, lowC: 16 },
        { day: "Sun, Aug 16", condition: "Warm Skies", icon: "fa-sun", highC: 28, lowC: 17 },
        { day: "Mon, Aug 17", condition: "Showers", icon: "fa-cloud-showers-heavy", highC: 22, lowC: 15 },
        { day: "Tue, Aug 18", condition: "Partly Cloudy", icon: "fa-cloud-sun", highC: 24, lowC: 16 },
        { day: "Wed, Aug 19", condition: "Sunny", icon: "fa-sun", highC: 26, lowC: 17 }
      ],
      hourly: [
        { time: "09:00", tempC: 19 },
        { time: "12:00", tempC: 25 },
        { time: "15:00", tempC: 27 },
        { time: "18:00", tempC: 24 },
        { time: "21:00", tempC: 21 },
        { time: "00:00", tempC: 17 }
      ]
    },
    "San Francisco": {
      country: "United States",
      tempC: 18,
      condition: "Coastal Fog",
      icon: "fa-smog",
      highC: 20,
      lowC: 13,
      humidity: 82,
      windSpeed: "24 km/h",
      uvIndex: "5 (Moderate)",
      airQuality: "30 (Good)",
      pressure: "1014 hPa",
      visibility: "6 km",
      forecast: [
        { day: "Today", condition: "Coastal Fog", icon: "fa-smog", highC: 20, lowC: 13 },
        { day: "Sun, Aug 16", condition: "Sunny Afternoon", icon: "fa-cloud-sun", highC: 21, lowC: 14 },
        { day: "Mon, Aug 17", condition: "Windy", icon: "fa-wind", highC: 19, lowC: 13 },
        { day: "Tue, Aug 18", condition: "Morning Fog", icon: "fa-smog", highC: 20, lowC: 13 },
        { day: "Wed, Aug 19", condition: "Clear", icon: "fa-sun", highC: 22, lowC: 14 }
      ],
      hourly: [
        { time: "09:00", tempC: 14 },
        { time: "12:00", tempC: 18 },
        { time: "15:00", tempC: 20 },
        { time: "18:00", tempC: 17 },
        { time: "21:00", tempC: 15 },
        { time: "00:00", tempC: 13 }
      ]
    }
  };

  // 2. Units & State
  let currentCity = "New Delhi";
  let isCelsius = true;

  const toF = (c) => Math.round((c * 9) / 5 + 32);

  const showToast = (message) => {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = message;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 3000);
    }
  };

  // 3. Render Weather View
  const renderWeather = () => {
    const cityData = WEATHER_DATA[currentCity];
    if (!cityData) return;

    // Unit Converter Helper
    const formatTemp = (c) => (isCelsius ? `${c}°C` : `${toF(c)}°F`);

    // Hero Weather Card
    const heroCard = document.getElementById("current-weather-card");
    if (heroCard) {
      heroCard.innerHTML = `
        <div>
          <span class="badge-tag"><i class="fa-solid fa-location-dot"></i> ${currentCity}, ${cityData.country}</span>
          <div class="current-temp-big">${formatTemp(cityData.tempC)}</div>
          <div class="current-condition">
            <i class="fa-solid ${cityData.icon}"></i> ${cityData.condition}
          </div>
          <p class="text-muted" style="margin-top: 0.5rem;">High: ${formatTemp(cityData.highC)} &bull; Low: ${formatTemp(cityData.lowC)}</p>
        </div>

        <div style="text-align: right;" class="hero-icon-wrapper">
          <i class="fa-solid ${cityData.icon} weather-hero-icon"></i>
        </div>
      `;
    }

    // Metrics Grid
    const metricsGrid = document.getElementById("weather-metrics-grid");
    if (metricsGrid) {
      metricsGrid.innerHTML = `
        <div class="metric-card">
          <div class="metric-icon"><i class="fa-solid fa-droplet"></i></div>
          <div>
            <span class="metric-label">Humidity</span>
            <h3 class="metric-value">${cityData.humidity}%</h3>
            <span class="metric-sub">Dew Point Normal</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon"><i class="fa-solid fa-wind"></i></div>
          <div>
            <span class="metric-label">Wind Speed</span>
            <h3 class="metric-value">${cityData.windSpeed}</h3>
            <span class="metric-sub">Direction NW</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon"><i class="fa-solid fa-sun"></i></div>
          <div>
            <span class="metric-label">UV Index</span>
            <h3 class="metric-value">${cityData.uvIndex}</h3>
            <span class="metric-sub">Sun Protection Target</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon"><i class="fa-solid fa-gauge-high"></i></div>
          <div>
            <span class="metric-label">Air Quality (AQI)</span>
            <h3 class="metric-value">${cityData.airQuality}</h3>
            <span class="metric-sub">Pressure ${cityData.pressure}</span>
          </div>
        </div>
      `;
    }

    // 5-Day Forecast List
    const forecastList = document.getElementById("forecast-list");
    if (forecastList) {
      forecastList.innerHTML = cityData.forecast.map((f) => `
        <div class="forecast-item">
          <span class="forecast-day">${f.day}</span>
          <div class="forecast-cond">
            <i class="fa-solid ${f.icon}"></i> ${f.condition}
          </div>
          <span class="forecast-temp">${formatTemp(f.highC)} / ${formatTemp(f.lowC)}</span>
        </div>
      `).join("");
    }

    // Hourly Temperature Visualizer Bars
    const hourlyBars = document.getElementById("hourly-bars");
    if (hourlyBars) {
      const maxTemp = Math.max(...cityData.hourly.map((h) => h.tempC));
      hourlyBars.innerHTML = cityData.hourly.map((h) => {
        const pct = Math.round((h.tempC / (maxTemp + 5)) * 100);
        return `
          <div class="hourly-item">
            <span class="hourly-temp">${formatTemp(h.tempC)}</span>
            <div class="hourly-bar-track">
              <div class="hourly-bar-fill" style="height: ${pct}%;"></div>
            </div>
            <span class="hourly-time">${h.time}</span>
          </div>
        `;
      }).join("");
    }
  };

  // 4. City Selectors
  document.querySelectorAll(".city-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".city-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentCity = pill.getAttribute("data-city");
      renderWeather();
      showToast(`Loaded weather for ${currentCity}`);
    });
  });

  const citySearchInput = document.getElementById("city-search-input");
  if (citySearchInput) {
    citySearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = citySearchInput.value.trim();
        const foundKey = Object.keys(WEATHER_DATA).find(
          (k) => k.toLowerCase() === query.toLowerCase()
        );

        if (foundKey) {
          currentCity = foundKey;
          document.querySelectorAll(".city-pill").forEach((p) => {
            p.classList.toggle("active", p.getAttribute("data-city") === currentCity);
          });
          renderWeather();
          showToast(`Loaded weather for ${currentCity}`);
        } else {
          showToast(`City "${query}" not found. Try New Delhi, London, Tokyo, etc.`);
        }
      }
    });
  }

  // 5. Unit Toggle (°C / °F)
  document.getElementById("btn-unit-c")?.addEventListener("click", () => {
    isCelsius = true;
    document.getElementById("btn-unit-c").classList.add("active");
    document.getElementById("btn-unit-f").classList.remove("active");
    renderWeather();
  });

  document.getElementById("btn-unit-f")?.addEventListener("click", () => {
    isCelsius = false;
    document.getElementById("btn-unit-f").classList.add("active");
    document.getElementById("btn-unit-c").classList.remove("active");
    renderWeather();
  });

  // Initialize View
  renderWeather();
});
