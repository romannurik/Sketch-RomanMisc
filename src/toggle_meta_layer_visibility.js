import * as util from './util';

const META_LAYER_NAME_PREFIX = "meta";

let visibility = null;

export default function(context) {
  let pages = context.document.pages().objectEnumerator();
  while (page = pages.nextObject()) {
    toggleMetaVisibility(page);
  }
}

function toggleMetaVisibility(layer) {
  //show or hide layer if it matches prefix
  let layername = String(layer.name());
  if (layername.substr(0, META_LAYER_NAME_PREFIX.length).toLowerCase() == META_LAYER_NAME_PREFIX.toLowerCase()) {
    // determine whether to toggle all specs on or off
    if (visibility == null) {
      visibility = !layer.isVisible();
    }

    layer.setIsVisible(visibility);
  }

  // iterate over children recursively if we can
  if (layer instanceof MSArtboardGroup || layer instanceof MSLayerGroup || layer instanceof MSPage) {
    let childLayers = util.arrayFromNSArray(layer.layers());
    childLayers.forEach(layer => toggleMetaVisibility(layer));
  }
}
