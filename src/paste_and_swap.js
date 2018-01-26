import * as util from './util';

export default function(context) {
  if (context.selection.count() == 0) {
    context.document.showMessage('Please select some objects.');
    return;
  }

  let layersToReplace = util.arrayFromNSArray(context.selection);

  // let undoManager = context.document.eventHandlerManager().normalHandler().undoManager();
  // undoManager.beginUndoGrouping();

  //coscript.scheduleWithInterval_jsFunction_(0, fn);

  let allPastedLayers = [];
  layersToReplace.forEach(layerToReplace => {
    // paste all layers in clipboard
    util.setSelection(context, [layerToReplace]); // to make sure paste happens on the right artboard
    util.sendAction(context, 'paste:');

    let pastedLayers = util.arrayFromNSArray(context.document.selectedLayers().layers());

    // compute offsets
    let topLeftMostPoint = pastedLayers.reduce((currentTopLeft, pastedLayer) => ({
      x: Math.min(currentTopLeft.x, pastedLayer.frame().x()),
      y: Math.min(currentTopLeft.y, pastedLayer.frame().y())
    }), {x: Infinity, y: Infinity});

    // re-position all layers
    pastedLayers.forEach(pastedLayer => {
      let deltaX = pastedLayer.frame().x() - topLeftMostPoint.x;
      let deltaY = pastedLayer.frame().y() - topLeftMostPoint.y;
      pastedLayer.frame().setX(layerToReplace.frame().x() + deltaX);
      pastedLayer.frame().setY(layerToReplace.frame().y() + deltaY);
      pastedLayer.parentGroup().resizeToFitChildrenWithOption(1);
    });

    // add to the list of all pasted layers
    allPastedLayers = allPastedLayers.concat(pastedLayers);

    // remove the target layer
    layerToReplace.removeFromParent();
  });

  util.setSelection(context, allPastedLayers);

  // undoManager.endUndoGrouping();
};
