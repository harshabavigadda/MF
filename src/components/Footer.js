import React from 'react'

function Footer() {
  const temperature = 12;
  const weatherDescription = 'Mostly Cloudy';
  const rainChance = '30%';
  const todayDate = new Date();
  const highTemperature = 15;
  const lowTemperature = 3;
  const humidity = 12;
  const windStatus = '7.70 km/h WSW';
  const visibility = '5.2 km';
  const airQuality = 105;
  const uvIndex = 3;

  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  }).format(todayDate);

  const highLowTemperatures = `High: ${highTemperature}°C / Low: ${lowTemperature}°C`;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="text-xl font-bold">Location</div>
      <div className="text-4xl font-bold mt-2">{temperature}°C</div>
      <div className="text-lg font-bold mt-4">{weatherDescription}</div>
      <div className="text-gray-500 mt-4">Rain - {rainChance}</div>
      <div className="text-sm text-gray-500 mt-4">{today}</div>
      <div className="text-sm text-gray-500 mt-4">{highLowTemperatures}</div>
      <div className="text-sm text-gray-500 mt-4">Humidity: {humidity}% (Normal)</div>
      <div className="text-sm text-gray-500 mt-4">
        Wind: {windStatus}
        <span className="ml-2">({visibility} Visibility)</span>
      </div>
      <div className="text-sm text-gray-500 mt-4">
        Air Quality: {airQuality} (Unhealthy)
        <span className="ml-2">UV Index: {uvIndex}</span>
      </div>
    </div>
  );
}

export default Footer
