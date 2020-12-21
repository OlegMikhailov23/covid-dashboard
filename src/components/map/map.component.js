const createTotalPopup = (name, cases, deaths, recovered, active, flagSrc) => (`
    <img src="${flagSrc}" class="map__country-flag">
    <div class="map__country-name">
        ${name}
    </div>
    <div class="map__total-cases">
        Total cases: ${cases}
    </div>
    <div class="map__total-deaths">
        Total deaths: ${deaths}
    </div>
    <div class="map__total-recovered">
        Recovered: ${recovered}
    </div>
    <div class="map__total-active">
        Active: ${active}
    </div>
    `);

const createIncidenceRatePopup = (name, perThousand, flagSrc) => (`
    <img src="${flagSrc}" class="map__country-flag">
    <div class="map__country-name">
        ${name}
    </div>
    <div class="map__total-cases">
        ${perThousand} cases per 100000 people
    </div>
    `);

const createTodayPopup = (name, cases, deaths, recovered, flagSrc, date) => (`
    <date class="map__country-name">
        ${date}
    </date>
    <img src="${flagSrc}" class="map__country-flag">
    <div class="map__country-name">
        ${name}
    </div>
    <div class="map__total-cases">
        Cases: ${cases}
    </div>
    <div class="map__total-deaths">
        Deaths: ${deaths}
    </div>
    <div class="map__total-recovered">
        Recovered: ${recovered}
    </div>
    `);

const removeMarker = () => {
  document.querySelectorAll('.pulse').forEach((it) => {
    it.remove();
  });
};

const addZero = (numb) => (parseInt(numb, 10) < 10 ? '0' : '') + numb;

const activateTab = (obj) => {
  const tabs = document.querySelectorAll('.map__tabs-wrapper__tab');
  tabs.forEach((it) => {
    it.classList.remove('map__tabs-wrapper__tab--active');
  });
  obj.classList.add('map__tabs-wrapper__tab--active');
};

class Map {
  constructor(layout) {
    this.layout = layout;

    this.today = new Date();
    this.date = this.today.getDate();
    this.month = this.today.getMonth() + 1;
    this.year = this.today.getFullYear();
    this.fullDate = `${addZero(this.date)}.${addZero(this.month)}.${this.year}`;

    // eslint-disable-next-line no-undef
    this.map = L.map('mapid').setView([59.534, 31.172], 2);
    this.intensityRadCoefficient = 1800;
    this.intensityOpacityCoefficient = 0.01;
    this.incedenceCoefficient = 2;

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
    L.tileLayer(this.layout, {
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
        this.showPopup(createTotalPopup(countryName, cases, deaths, recovered, active, flag));
      }
      if (this.screen === 'incidenceRate') {
        this.putPoint(lat, long, this.incidenceColor, this.incidenceFillColor,
          int, int * this.incedenceCoefficient);
        this.showPopup(createIncidenceRatePopup(countryName, perThousand, flag));
      }
      if (this.screen === 'today') {
        this.putPoint(lat, long, this.todayColor, this.todayFillColor, todayDeaths, todayDeaths);
        this.showPopup(createTodayPopup(countryName, todayCases,
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

  init(countries) {
    this.screen = 'total';
    this.addLayout();
    this.fitBounds();
    this.renderMarker(countries);
    this.toFullScreen();
    document.addEventListener('click', (e) => {
      if (e.target.hasAttribute('mapId')) {
        activateTab(e.target);
        removeMarker();
        this.screen = e.target.getAttribute('mapId');
        this.renderMarker(countries);
      }
    });
  }
}

export default Map;
