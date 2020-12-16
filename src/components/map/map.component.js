const map = () => {
  // eslint-disable-next-line no-undef
  const mymap = L.map('mapid').setView([51.505, -0.09], 3);

  // eslint-disable-next-line no-undef
  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  }).addTo(mymap);
};

export default map;
