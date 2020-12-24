const markupPopup = {
  createTotalPopup(name, cases, deaths, recovered, active, flagSrc) {
    return (`
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
  },

  createIncidenceRatePopup(name, perThousand, flagSrc) {
    return (`
    <img src="${flagSrc}" class="map__country-flag">
    <div class="map__country-name">
        ${name}
    </div>
    <div class="map__total-cases">
        ${perThousand} cases per 100000 people
    </div>
    `);
  },

  createTodayPopup(name, cases, deaths, recovered, flagSrc, date) {
    return (`
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
  },
};

export default markupPopup;
