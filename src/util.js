export function isArtboard(layer) {
  return layer.isMemberOfClass(MSArtboardGroup.class());
}

export function setSelection(context, layers) {
  context.document.currentPage().changeSelectionBySelectingLayers(null);
  layers.forEach(layer => layer.select_byExpandingSelection_(true, true));
}

export function sendAction(context, action) {
  NSApp.sendAction_to_from_(action, null, context.document);
}

export function makeTempFolder(key) {
  let guid = NSProcessInfo.processInfo().globallyUniqueString();
  let path = `/tmp/com.sketchplugins/${key}/${guid}`;
  NSFileManager.defaultManager()
      .createDirectoryAtPath_withIntermediateDirectories_attributes_error_(path, true, null, null);
  return path;
}


/**
 * Returns a JavaScript array copy of the given NSArray.
 */
export function arrayFromNSArray(nsArray) {
  let arr = [];
  for (let i = 0; i < nsArray.count(); i++) {
    arr.push(nsArray.objectAtIndex(i));
  }
  return arr;
}


/**
 * Reorders the given layers in the layer list based on their position in the array.
 * If they're in different containing groups, reorders locally within that group.
 */
export function reorderLayers(layers) {
  // rearrange in layer list
  let indexesInParents = {};

  layers.forEach((layer, index) => {
    let parent = layer.parentGroup();
    let parentId = String(parent.objectID());
    if (!(parentId in indexesInParents)) {
      let siblings = arrayFromNSArray(parent.layers());
      indexesInParents[parentId] = siblings.findIndex(
          l => l.parentGroup() === parent && layers.indexOf(l) >= 0);
    }
    parent.removeLayer(layer);
    parent.insertLayer_atIndex_(layer, indexesInParents[parentId]);
  });
}
