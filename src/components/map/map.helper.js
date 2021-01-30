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
};

export default helperMap;
