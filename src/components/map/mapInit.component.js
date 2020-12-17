import Map from './map.component';

async function initMap(url) {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  const map = new Map('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png');
  map.addLayout();
  const countries = data;
  countries.forEach((country) => {
    const countryName = country.country;
    const { population } = country;
    const totalCases = country.cases;
    const totalDeaths = country.deaths;
    const currLat = country.countryInfo.lat;
    const currLon = country.countryInfo.long;
    let intensity = (totalCases / population) * 1000;
    if (intensity === Infinity) {
      intensity = 1;
    }
    map.putPoint(currLat, currLon, '#cc22f1', '#ec0b2b', intensity, intensity);
    map.showPopup(`<div class="map__country-name">${countryName}</div>
    <div class="map__total-cases">Total cases: ${totalCases}</div><div class="map__total-deaths">Total deaths: ${totalDeaths}</div>`);
  });
}

export default initMap;
