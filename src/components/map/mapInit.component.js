import Map from './map.component';

async function initMap(url) {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  const countries = data;
  const map = new Map('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=6da2f080-0b88-4c56-be28-3de3b9c9e2b5');
  map.init(countries);
}

export default initMap;
