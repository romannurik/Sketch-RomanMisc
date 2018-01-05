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

Array.fromNSArray = function(nsArray) {
  let arr = [];
  let count = nsArray.count();
  for (let i = 0; i < count; i++) {
    arr.push(nsArray.objectAtIndex(i));
  }
  return arr;
};
