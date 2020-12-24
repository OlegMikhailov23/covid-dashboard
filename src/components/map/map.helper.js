const helperMap = {
  showLayer() {
    const layerContainer = document.querySelector('.map__layout-container');
    const layerButton = document.querySelector('.map__layout-container__action-button');
    layerButton.addEventListener('click', () => {
      layerContainer.classList.toggle('show-layout-container');
    });
  },

  removeMarker(el) {
    document.querySelectorAll(el).forEach((it) => {
      it.remove();
    });
  },

  addZero(numb) {
    // eslint-disable-next-line no-unused-expressions
    (parseInt(numb, 10) < 10 ? '0' : '') + numb;
  },

  activateTab(obj, all, toAdd) {
    document.querySelectorAll(all).forEach((it) => {
      it.classList.remove(toAdd);
    });
    obj.classList.add(toAdd);
  },

  clearStar() {
    document.querySelectorAll('.game-board__star-container__star').forEach((it) => {
      it.remove();
    });
  },

  disableIt(el) {
    el.classList.add('disabled');
  },
};

export default helperMap;
