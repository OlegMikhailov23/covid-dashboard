class Map {
  constructor(layout) {
    this.layout = layout;
    this.map = L.map('mapid').setView([59.534, 31.172], 3.5);
    this.intensityRadCoefficient = 1500;
    this.intensityOpacityCoefficient = 0.01;
  }

  addLayout() {
    L.tileLayer(this.layout, {
      maxZoom: 20,
    }).addTo(this.map);
  }

  putPoint(lat, lon, color, fillColor, opacity, rad) {
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
}

export default Map;
