document.addEventListener('DOMContentLoaded', () => {
  const apiKey = '01f7efb81e543884be50db1d21e5aa65'; // Replace with your OpenWeather API key
  const city = 'Busan'; // You can change this to any city you prefer
  const lat = '35'; // Latitude for Busan
  const lon = '129'; // Longitude for Busan

  let pm25Data = [];
  let pm10Data = [];
  let noxData = [];
  let nh3Data = [];
  let co2Data = [];
  let so2Data = [];
  let vocData = [];
  let temperatureData = [];
  let humidityData = [];
  let daysOfWeek = [];

  // Initialize Chart.js charts
  const ctxLine = document.getElementById('lineChart').getContext('2d');
  const lineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: ["7d ago", "6d ago", "5d ago", "4d ago", "3d ago", "2d ago", "1d ago", "Today"], // Placeholder for x-axis labels (time of day)
      datasets: [
        {
          label: 'Temperature (°C)',
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          data: [],
          fill: true,
          yAxisID: 'y-axis-1'
        },
        {
          label: 'Humidity (%)',
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          data: [],
          fill: true,
          yAxisID: 'y-axis-2'
        }
      ]
    },
    options: {
      
      scales: {
        'y-axis-1': {
          type: 'linear',
          position: 'left'
        },
        'y-axis-2': {
          type: 'linear',
          position: 'right'
        }
      }
    }
  });

  const ctxBar = document.getElementById('barChart').getContext('2d');
  const barChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: ['PM2.5(ug/m^3)', 'PM10(ug/m^3)', 'NOx(ppb)', 'NH3(ppb)', 'CO2(ppm)', 'SO2(ppb)', 'VOC(ppb)'],
      datasets: [{
        label: 'Pollutant Levels',
        data: [],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 206, 86)', 'rgb(75, 192, 192)', 'rgb(153, 102, 255)', 'rgb(255, 159, 64)', 'rgb(255, 99, 132)'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  const ctxDonut = document.getElementById('donutChart').getContext('2d');
  const donutChart = new Chart(ctxDonut, {
    type: 'doughnut',
    data: {
      labels: ['PM2.5(ug/m^3)', 'PM10(ug/m^3)', 'NOx(ppb)', 'NH3(ppb)', 'CO2(ppm)', 'SO2(ppb)', 'VOC(ppb)'],
      datasets: [{
        data: [],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        hoverOffset: 4
      }]
    }
  });

  // Fetch weather and air quality data from OpenWeather API
  async function fetchAirQualityData() {
    try {
      // Fetch current weather data (temperature and humidity)
      const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
      const weatherData = await weatherResponse.json();

      // Check if the weather data response is successful
      if (weatherResponse.ok) {
        // Update temperature and humidity
        document.getElementById('temperature').textContent = weatherData.main.temp.toFixed(1);
        document.getElementById('humidity').textContent = weatherData.main.humidity;
        temperatureData.push(weatherData.main.temp.toFixed(1));
        humidityData.push(weatherData.main.humidity);
      } else {
        console.error('Error fetching weather data:', weatherData.message);
      }

        // Today's Temperature & Humidity
        const todayTemp = weatherData.main.temp.toFixed(1);  // 오늘의 온도 (섭씨)
        const todayHumidity = weatherData.main.humidity;  // 오늘의 습도 (%)

        // Function for generating data over 8 days
        function generateWeatherData(baseTemp, baseHumidity) {
          const temperatures = [];
          const humidities = [];
          
          for (let i = 0; i < 7; i++) {
            // 온도와 습도에 -2에서 +2의 랜덤 값을 더함
            const randomTemp = (Math.random() * 4 - 2).toFixed(1);  // -2 ~ +2 랜덤 온도
            const randomHumidity = Math.floor(Math.random() * 5 - 2);  // -2 ~ +2 랜덤 습도

            temperatures.push((parseFloat(baseTemp) + parseFloat(randomTemp)).toFixed(1));  // 온도 값
            humidities.push(Math.min(100, Math.max(0, baseHumidity + randomHumidity)));  // 습도 값 (0~100 범위)
          }

          temperatures.push(baseTemp);
          humidities.push(baseHumidity);

          return { temperatures, humidities };
        }

        // 8일 간의 온도와 습도 데이터 생성
        const { temperatures, humidities } = generateWeatherData(todayTemp, todayHumidity);

        lineChart.data.datasets[0].data = temperatures; // 온도
        lineChart.data.datasets[1].data = humidities; // 습도
        lineChart.update();

      

      // Fetch air quality data (pollutants)
      const airQualityResponse = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
      const airQualityData = await airQualityResponse.json();
      
      

      // Check if the air quality response is successful
      if (airQualityResponse.ok) {
        const airComponents = airQualityData.list[0].components;

        // Update pollutant data
        document.getElementById('pm25').textContent = airComponents.pm2_5.toFixed(1);
        document.getElementById('pm10').textContent = airComponents.pm10.toFixed(1);
        document.getElementById('nox').textContent = airComponents.no2.toFixed(1);
        document.getElementById('nh3').textContent = airComponents.nh3.toFixed(1);
        document.getElementById('co2').textContent = airComponents.co.toFixed(1);
        document.getElementById('so2').textContent = airComponents.so2.toFixed(1);
        document.getElementById('voc').textContent = airComponents.o3.toFixed(1);

        // Update chart data
        pm25Data.push(airComponents.pm2_5.toFixed(1));
        pm10Data.push(airComponents.pm10.toFixed(1));
        noxData.push(airComponents.no2.toFixed(1));
        nh3Data.push(airComponents.nh3.toFixed(1));
        co2Data.push(airComponents.co.toFixed(1));
        so2Data.push(airComponents.so2.toFixed(1));
        vocData.push(airComponents.o3.toFixed(1));

        // Update bar chart and donut chart
        barChart.data.datasets[0].data = [
          airComponents.pm2_5.toFixed(1),
          airComponents.pm10.toFixed(1),
          airComponents.no2.toFixed(1),
          airComponents.nh3.toFixed(1),
          airComponents.co.toFixed(1),
          airComponents.so2.toFixed(1),
          airComponents.o3.toFixed(1)
        ];
        donutChart.data.datasets[0].data = [
          airComponents.pm2_5.toFixed(1),
          airComponents.pm10.toFixed(1),
          airComponents.no2.toFixed(1),
          airComponents.nh3.toFixed(1),
          airComponents.co.toFixed(1),
          airComponents.so2.toFixed(1),
          airComponents.o3.toFixed(1)
        ];

        barChart.update();
        donutChart.update();

        //The color changer depending on AQI (PM2.5)
        //광주 미세먼지모니터링센터 왈, PM2.5의 경우 15까진 좋음, 50까진 보통, 100까진 나쁨, 그 이후론 매우 나쁨

        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        if (airComponents.pm2_5.toFixed(1) <= 15) { 
          header.style.backgroundColor = '#007bff';
          footer.style.backgroundColor = '#007bff';
        } else if (airComponents.pm2_5.toFixed(1) <= 50) {
          header.style.backgroundColor = 'green';
          footer.style.backgroundColor = 'green';
        } else if (airComponents.pm2_5.toFixed(1) <= 100) {
          header.style.backgroundColor = 'yellow';
          footer.style.backgroundColor = 'yellow';
        } else {
          header.style.backgroundColor = 'red';
          footer.style.backgroundColor = 'red';
        }


      } else {
        console.error('Error fetching air quality data:', airQualityData.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Fetch data every 30 minutes
  fetchAirQualityData();
  setInterval(fetchAirQualityData, 1800000); // Update data every 30 minutes
});
