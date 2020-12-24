import markupPopup from './map.markup';
import helperMap from './map.helper';

class Map {
  constructor(layout, data) {
    this.layout = layout;
    this.theme = {
      dark: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=6da2f080-0b88-4c56-be28-3de3b9c9e2b5',
      bright: 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=6da2f080-0b88-4c56-be28-3de3b9c9e2b5',
      mid: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=6da2f080-0b88-4c56-be28-3de3b9c9e2b5',
      land: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png?api_key=6da2f080-0b88-4c56-be28-3de3b9c9e2b5',
    };
    this.data = data;
    this.today = new Date();
    this.date = this.today.getDate();
    this.month = this.today.getMonth() + 1;
    this.year = this.today.getFullYear();
    this.fullDate = `${helperMap.addZero(this.date)}.${helperMap.addZero(this.month)}.${this.year}`;

    // eslint-disable-next-line no-undef
    this.map = L.map('mapid').setView([59.534, 31.172], 2);
    this.intensityRadCoefficient = 1800;
    this.intensityOpacityCoefficient = 0.01;
    this.incedenceCoefficient = 2;
    this.todayDeathsCoefficient = 0.4;

    this.maxTileArea = [
      [85, -180],
      [-85, 180],
    ];
    this.screen = null;

    this.totalColor = '#cc22f1';
    this.totalFillColor = '#ec0b2b';

    this.incidenceColor = '#f6db2b';
    this.incidenceFillColor = '#f19544';

    this.todayColor = '#569EF5';
    this.todayFillColor = '#112fee';
  }

  addLayout() {
    // eslint-disable-next-line no-undef
    this.currentLayout = L.tileLayer(this.layout, {
      maxZoom: 10,
    }).addTo(this.map);
  }

  putPoint(lat, lon, color, fillColor, opacity, rad) {
    // eslint-disable-next-line no-undef
    this.circle = L.circle([lat, lon], {
      className: 'pulse',
      color,
      fillColor,
      fillOpacity: opacity * this.intensityOpacityCoefficient,
      radius: rad * this.intensityRadCoefficient,
    }).addTo(this.map);
  }

  putPointFromTable(name, data) {
    helperMap.removeMarker('.marker');
    const obj = data.filter((it) => it.country === name);
    const { lat, long, flag } = obj[0].countryInfo;
    this.map.setView([lat, long], 5);
    // eslint-disable-next-line no-undef
    this.circle = L.circle([lat, long], {
      className: 'marker',
      color: 'red',
      fillColor: 'red',
      fillOpacity: 1,
      radius: 100000,
    }).addTo(this.map);
    const customOptions = {
      className: 'popup',
      keepInView: true,
    };
    const {
      cases, deaths, active, recovered,
    } = obj[0];
    this.map.openPopup(markupPopup.createTotalPopup(obj[0]
      .country, cases, deaths, recovered, active, flag), [lat, long], customOptions);
  }

  showPopup(message) {
    const customPopup = message;
    const customOptions = {
      className: 'popup',
      keepInView: true,
    };
    this.circle.bindPopup(customPopup, customOptions);
  }

  fitBounds() {
    this.map.setMaxBounds(this.maxTileArea);
    this.map.options.minZoom = this.map.getZoom();
  }

  renderMarker(data) {
    data.forEach((country) => {
      const countryName = country.country;
      const {
        cases, deaths, population, active, recovered, todayCases, todayDeaths, todayRecovered,
      } = country;
      const { flag, lat, long } = country.countryInfo;
      let int = (cases / population) * 1000;
      const perThousand = parseInt((cases / population) * 100000, 10);
      if (int === Infinity) {
        int = 1;
      }
      if (this.screen === 'total') {
        this.putPoint(lat, long, this.totalColor, this.totalFillColor, int, int);
        this.showPopup(markupPopup
          .createTotalPopup(countryName, cases, deaths, recovered, active, flag));
      }
      if (this.screen === 'incidenceRate') {
        this.putPoint(lat, long, this.incidenceColor, this.incidenceFillColor,
          int, int * this.incedenceCoefficient);
        this.showPopup(markupPopup.createIncidenceRatePopup(countryName, perThousand, flag));
      }
      if (this.screen === 'today') {
        this.putPoint(lat, long, this.todayColor, this.todayFillColor,
          todayDeaths * 0.1, todayDeaths * this.todayDeathsCoefficient);
        this.showPopup(markupPopup.createTodayPopup(countryName, todayCases,
          todayDeaths, todayRecovered, flag, this.fullDate));
      }
    });
  }

  toFullScreen() {
    const map = document.querySelector('.map');
    const screenButton = document.querySelector('.map__full-screen');
    screenButton.addEventListener('click', () => {
      map.classList.toggle('to-full-screen');
      setTimeout(() => { this.map.invalidateSize(); }, 400);
    });
  }

  changeLayout(layout) {
    this.map.removeLayer(this.currentLayout);
    this.layout = this.theme[layout];
    this.addLayout();
  }

  init(countries) {
    this.screen = 'total';
    this.addLayout();
    this.fitBounds();
    this.renderMarker(countries);
    this.toFullScreen();
    helperMap.showLayer();
    document.addEventListener('click', (e) => {
      if (e.target.hasAttribute('mapId')) {
        helperMap.activateTab(e.target, '.map__tabs-wrapper__tab', 'map__tabs-wrapper__tab--active');
        helperMap.removeMarker('.pulse');
        this.screen = e.target.getAttribute('mapId');
        this.renderMarker(countries);
      }
      if (e.target.hasAttribute('idLayout')) {
        helperMap.activateTab(e.target, '.map__layout-container__layout-button', 'map__layout-container__layout-button--active');
        const target = e.target.getAttribute('idLayout');
        this.changeLayout(target);
      }
    });
  }
}

export default Map;
