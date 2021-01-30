import Map from './map.component';

const getCurrentCountry = (obj, data) => {
  const list = document.querySelector('.cases');
  list.addEventListener('click', (e) => {
    if (e.target.classList.contains('tabulator-cell')) {
      const row = e.target.parentNode;
      const currentCountry = row.children[1].textContent;
      obj.putPointFromTable(currentCountry, data);
    }
  });
};

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
  getCurrentCountry(map, countries);
}

export default initMap;
