"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaThermometerHalf,
  FaTint,
  FaWind,
  FaEye,
  FaSun,
  FaMoon,
  FaCloud,
  FaCloudRain,
  FaBolt,
  FaSnowflake,
  FaRedo,
  FaInfoCircle,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaCompass,
  FaGlobe,
  FaChartLine,
  FaCalendarWeek,
} from "react-icons/fa";

export default function WeatherPage() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHourly, setShowHourly] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState("celsius");

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const DEFAULT_CITY = "Gobindhagonj,Bangladesh";

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!API_KEY) {
          throw new Error("Weather API key is missing");
        }

        // Fetch current weather with air quality
        const currentResponse = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${DEFAULT_CITY}&lang=bn&aqi=yes`
        );
        const currentData = await currentResponse.json();

        // Fetch 7-day forecast with hourly data
        const forecastResponse = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${DEFAULT_CITY}&days=7&lang=bn&aqi=yes&hour=1`
        );
        const forecastData = await forecastResponse.json();

        // Fetch weather alerts
        const alertsResponse = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${DEFAULT_CITY}&days=1&lang=bn&alerts=yes`
        );
        const alertsData = await alertsResponse.json();

        if (currentData.error) {
          throw new Error(currentData.error.message);
        }

        if (currentData && currentData.current && currentData.location) {
          setWeather({
            temp_c: currentData.current.temp_c,
            temp_f: currentData.current.temp_f,
            feelslike_c: currentData.current.feelslike_c,
            feelslike_f: currentData.current.feelslike_f,
            condition: currentData.current.condition.text,
            icon: currentData.current.condition.code,
            wind_kph: currentData.current.wind_kph,
            wind_mph: currentData.current.wind_mph,
            wind_dir: currentData.current.wind_dir,
            humidity: currentData.current.humidity,
            pressure: currentData.current.pressure_mb,
            visibility: currentData.current.vis_km,
            uv: currentData.current.uv,
            time: currentData.location.localtime,
            city: "গোবিন্দগঞ্জ", // Always show Gobindhagonj
            region: currentData.location.region,
            country: currentData.location.country,
            last_updated: currentData.current.last_updated,
            is_day: currentData.current.is_day,
          });

          // Set air quality data
          if (currentData.current.air_quality) {
            setAirQuality(currentData.current.air_quality);
          }
        }

        if (forecastData && forecastData.forecast) {
          setForecast(forecastData.forecast.forecastday);
          setHourlyForecast(forecastData.forecast.forecastday[0]?.hour || []);
        }

        if (alertsData && alertsData.alerts && alertsData.alerts.alert) {
          setAlerts(alertsData.alerts.alert);
        }
      } catch (error) {
        console.error("Weather fetch failed:", error);
        setError(error.message || "আবহাওয়ার তথ্য লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [API_KEY]);

  const refreshData = () => {
    window.location.reload();
  };

  const getWeatherIcon = (code, isDay = true) => {
    if (code >= 1000 && code < 1003)
      return isDay ? (
        <FaSun className="text-yellow-500 text-6xl" />
      ) : (
        <FaMoon className="text-blue-400 text-6xl" />
      );
    if (code === 1003)
      return <FaCloud className="text-gray-500 text-6xl" />;
    if (code >= 1006 && code <= 1009)
      return <FaCloud className="text-gray-600 text-6xl" />;
    if (code >= 1063 && code <= 1201)
      return <FaCloudRain className="text-blue-500 text-6xl" />;
    if (code >= 1210 && code <= 1225)
      return <FaSnowflake className="text-blue-300 text-6xl" />;
    if (code >= 1273)
      return <FaBolt className="text-purple-500 text-6xl" />;
    if (code >= 1135 && code <= 1147)
      return <FaCloud className="text-gray-400 text-6xl" />;
    return isDay ? (
      <FaSun className="text-yellow-500 text-6xl" />
    ) : (
      <FaMoon className="text-blue-400 text-6xl" />
    );
  };

  const getWeatherIconSmall = (code, isDay = true) => {
    if (code >= 1000 && code < 1003)
      return isDay ? (
        <FaSun className="text-yellow-500 text-2xl" />
      ) : (
        <FaMoon className="text-blue-400 text-2xl" />
      );
    if (code === 1003)
      return <FaCloud className="text-gray-500 text-2xl" />;
    if (code >= 1006 && code <= 1009)
      return <FaCloud className="text-gray-600 text-2xl" />;
    if (code >= 1063 && code <= 1201)
      return <FaCloudRain className="text-blue-500 text-2xl" />;
    if (code >= 1210 && code <= 1225)
      return <FaSnowflake className="text-blue-300 text-2xl" />;
    if (code >= 1273)
      return <FaBolt className="text-purple-500 text-2xl" />;
    if (code >= 1135 && code <= 1147)
      return <FaCloud className="text-gray-400 text-2xl" />;
    return isDay ? (
      <FaSun className="text-yellow-500 text-2xl" />
    ) : (
      <FaMoon className="text-blue-400 text-2xl" />
    );
  };

  const getAirQualityColor = (aqi) => {
    if (aqi <= 50) return "text-green-600 bg-green-100";
    if (aqi <= 100) return "text-yellow-600 bg-yellow-100";
    if (aqi <= 150) return "text-orange-600 bg-orange-100";
    if (aqi <= 200) return "text-red-600 bg-red-100";
    if (aqi <= 300) return "text-purple-600 bg-purple-100";
    return "text-red-800 bg-red-200";
  };

  const getAirQualityText = (aqi) => {
    if (aqi <= 50) return "উত্তম";
    if (aqi <= 100) return "মাঝারি";
    if (aqi <= 150) return "অস্বাস্থ্যকর (সংবেদনশীল)";
    if (aqi <= 200) return "অস্বাস্থ্যকর";
    if (aqi <= 300) return "খুব অস্বাস্থ্যকর";
    return "বিপজ্জনক";
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("bn-BD", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDateTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("bn-BD", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatHour = (hour) => {
    return `${hour}:00`;
  };

  const getTemperature = (tempC, tempF) => {
    if (temperatureUnit === "celsius") {
      return `${Math.round(tempC)}°C`;
    }
    return `${Math.round(tempF)}°F`;
  };

  const getWindSpeed = (kph, mph) => {
    if (temperatureUnit === "celsius") {
      return `${kph} কিমি/ঘণ্টা`;
    }
    return `${mph} মাইল/ঘণ্টা`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <span className="text-xl text-gray-600">
              আবহাওয়ার তথ্য লোড হচ্ছে...
            </span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navbar />
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🌤️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            আবহাওয়ার তথ্য লোড করতে সমস্যা
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
              <FaSun className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              গোবিন্দগঞ্জের আবহাওয়া
            </h1>
            <p className="text-sm md:text-base text-blue-100 max-w-2xl mx-auto">
              গোবিন্দগঞ্জের বর্তমান আবহাওয়া ও পূর্বাভাস
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-end gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTemperatureUnit("celsius")}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  temperatureUnit === "celsius"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setTemperatureUnit("fahrenheit")}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  temperatureUnit === "fahrenheit"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                °F
              </button>
            </div>

            <button
              onClick={refreshData}
              className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="রিফ্রেশ করুন"
            >
              <FaRedo className="text-base" />
            </button>
          </div>
        </div>

        {weather && (
          <>
            {/* Weather Alerts */}
            {alerts && alerts.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-3 mb-4">
                <div className="flex items-start">
                  <FaExclamationTriangle className="text-red-500 text-lg mr-2 mt-1" />
                  <div>
                    <h3 className="text-base font-semibold text-red-800 mb-1">
                      আবহাওয়া সতর্কতা
                    </h3>
                    {alerts.map((alert, index) => (
                      <div key={index} className="text-red-700 mb-1">
                        <p className="font-medium text-sm">{alert.headline}</p>
                        <p className="text-xs">{alert.msg}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Current Weather Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Weather Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-red-500 mr-2 text-lg" />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {weather.city}
                        </h2>
                        <p className="text-gray-600 text-sm">
                          বাংলাদেশ
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">সর্বশেষ আপডেট</p>
                      <p className="text-xs font-medium">
                        {formatTime(weather.last_updated)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-5xl font-bold text-gray-900 mr-6">
                        {getTemperature(weather.temp_c, weather.temp_f)}
                      </div>
                      <div>
                        <div className="mb-2">
                          {getWeatherIcon(weather.icon, weather.is_day)}
                        </div>
                        <p className="text-lg text-gray-700 font-medium mb-1">
                          {weather.condition}
                        </p>
                        <p className="text-gray-500 text-sm">
                          অনুভূত:{" "}
                          {getTemperature(
                            weather.feelslike_c,
                            weather.feelslike_f
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Weather Details */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center">
                    <FaInfoCircle className="mr-2 text-blue-600 text-sm" />
                    আবহাওয়ার বিবরণ
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaTint className="text-blue-500 mr-2 text-sm" />
                        <span className="text-gray-700 text-sm">আদ্রতা</span>
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        {weather.humidity}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaWind className="text-green-500 mr-2 text-sm" />
                        <span className="text-gray-700 text-sm">
                          বাতাসের গতি
                        </span>
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        {getWindSpeed(weather.wind_kph, weather.wind_mph)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaCompass className="text-purple-500 mr-2 text-sm" />
                        <span className="text-gray-700 text-sm">
                          বাতাসের দিক
                        </span>
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        {weather.wind_dir}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaEye className="text-indigo-500 mr-2 text-sm" />
                        <span className="text-gray-700 text-sm">দৃশ্যমানতা</span>
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        {weather.visibility} কিমি
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaThermometerHalf className="text-red-500 mr-2 text-sm" />
                        <span className="text-gray-700 text-sm">চাপ</span>
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        {weather.pressure} hPa
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaSun className="text-yellow-500 mr-2 text-sm" />
                        <span className="text-gray-700 text-sm">UV সূচক</span>
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        {weather.uv}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Air Quality Section */}
            {airQuality && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaGlobe className="mr-2 text-green-600 text-lg" />
                  বায়ু মান সূচক (AQI)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${getAirQualityColor(
                        airQuality["us-epa-index"]
                      )}`}
                    >
                      <span className="text-lg font-bold">
                        {airQuality["us-epa-index"]}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-gray-800 mb-1">
                      মার্কিন মান
                    </h4>
                    <p
                      className={`text-xs font-medium ${
                        getAirQualityColor(airQuality["us-epa-index"]).split(
                          " "
                        )[0]
                      }`}
                    >
                      {getAirQualityText(airQuality["us-epa-index"])}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="text-xl text-blue-600 mb-3">
                      <FaThermometerHalf />
                    </div>
                    <h4 className="text-base font-semibold text-gray-800 mb-1">
                      PM2.5
                    </h4>
                    <p className="text-xl font-bold text-blue-600">
                      {airQuality.pm2_5?.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-600">μg/m³</p>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                    <div className="text-xl text-purple-600 mb-3">
                      <FaCloud />
                    </div>
                    <h4 className="text-base font-semibold text-gray-800 mb-1">
                      PM10
                    </h4>
                    <p className="text-xl font-bold text-purple-600">
                      {airQuality.pm10?.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-600">μg/m³</p>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="text-xl text-yellow-600 mb-3">
                      <FaThermometerHalf />
                    </div>
                    <h4 className="text-base font-semibold text-gray-800 mb-1">
                      NO₂
                    </h4>
                    <p className="text-xl font-bold text-yellow-600">
                      {airQuality.no2?.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-600">μg/m³</p>
                  </div>
                </div>
              </div>
            )}

            {/* Hourly Forecast Toggle */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <FaClock className="mr-2 text-blue-600 text-lg" />
                  ঘণ্টার পর ঘণ্টা পূর্বাভাস
                </h3>
                <button
                  onClick={() => setShowHourly(!showHourly)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                >
                  {showHourly ? "আড়াল করুন" : "দেখুন"}
                  <FaArrowDown
                    className={`ml-1.5 text-xs transition-transform ${
                      showHourly ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Hourly Forecast */}
            {showHourly && hourlyForecast && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  আজকের ঘণ্টার পর ঘণ্টা পূর্বাভাস
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {hourlyForecast.map((hour, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 text-center border border-blue-100"
                    >
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        {formatHour(index)}
                      </p>
                      <div className="mb-1">
                        {getWeatherIconSmall(hour.condition.code, hour.is_day)}
                      </div>
                      <p className="text-sm font-bold text-gray-900 mb-1">
                        {getTemperature(hour.temp_c, hour.temp_f)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {hour.condition.text}
                      </p>
                      <div className="mt-1 text-xs text-gray-500">
                        <div className="flex items-center justify-center mb-1">
                          <FaTint className="text-blue-500 mr-1 text-xs" />
                          {hour.humidity}%
                        </div>
                        <div className="flex items-center justify-center">
                          <FaWind className="text-green-500 mr-1 text-xs" />
                          {hour.wind_kph}km/h
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7-Day Forecast Section */}
            {forecast && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaCalendarWeek className="mr-2 text-green-600 text-lg" />
                  ৭ দিনের পূর্বাভাস
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
                  {forecast.map((day, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 text-center border border-blue-100 hover:shadow-md transition-shadow"
                    >
                      <div className="mb-3">
                        <p className="text-base font-bold text-gray-900 mb-1">
                          {index === 0
                            ? "আজ"
                            : index === 1
                            ? "কাল"
                            : index === 2
                            ? "পরশু"
                            : formatDate(day.date).split(" ")[0]}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatDate(day.date)}
                        </p>
                      </div>

                      <div className="mb-3">
                        {getWeatherIconSmall(day.day.condition.code, true)}
                        <p className="text-xs text-gray-700 mt-1">
                          {day.day.condition.text}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-xs">সর্বোচ্চ</span>
                          <span className="font-bold text-red-600 flex items-center text-sm">
                            <FaArrowUp className="mr-1 text-xs" />
                            {getTemperature(day.day.maxtemp_c, day.day.maxtemp_f)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-xs">সর্বনিম্ন</span>
                          <span className="font-bold text-blue-600 flex items-center text-sm">
                            <FaArrowDown className="mr-1 text-xs" />
                            {getTemperature(day.day.mintemp_c, day.day.mintemp_f)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-xs">
                            বৃষ্টির সম্ভাবনা
                          </span>
                          <span className="font-bold text-green-600 text-sm">
                            {day.day.daily_chance_of_rain}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-xs">সর্বোচ্চ UV</span>
                          <span className="font-bold text-purple-600 text-sm">
                            {day.day.maxuv}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weather Tips */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaInfoCircle className="mr-2 text-lg" />
                আজকের আবহাওয়া পরামর্শ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <h4 className="font-semibold mb-1 text-sm">👕 পোশাক</h4>
                  <p className="text-xs opacity-90">
                    {weather.temp_c > 30
                      ? "হালকা সুতি কাপড় পরুন"
                      : weather.temp_c > 20
                      ? "সাধারণ পোশাক পরুন"
                      : weather.temp_c > 10
                      ? "গরম কাপড় পরুন"
                      : "মোটা শীতের কাপড় পরুন"}
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <h4 className="font-semibold mb-1 text-sm">🌂 বাইরে যাওয়া</h4>
                  <p className="text-xs opacity-90">
                    {weather.condition.includes("বৃষ্টি")
                      ? "ছাতা নিয়ে বের হন"
                      : weather.condition.includes("মেঘ")
                      ? "সাবধানে বের হন"
                      : "নিরাপদে বের হতে পারেন"}
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <h4 className="font-semibold mb-1 text-sm">🏠 ঘর</h4>
                  <p className="text-xs opacity-90">
                    {weather.humidity > 80
                      ? "ঘরে ফ্যান চালান"
                      : weather.humidity < 40
                      ? "হিউমিডিফায়ার ব্যবহার করুন"
                      : "সাধারণ বায়ু চলাচল রাখুন"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

