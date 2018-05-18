import * as util from './util';

export default function(context) {
  if (context.selection.count() == 0) {
    context.document.showMessage('Please select some objects.');
    return;
  }

  let sketch = context.api();
  let padding = parseInt(sketch.getStringFromUser('Set padding (in pixels)', '100'), 10);
  if (isNaN(padding)) {
    return;
  }

  let selectedArtboards = [];

  util.arrayFromNSArray(context.selection).forEach(layer => {
    while (layer && !util.isArtboard(layer)) {
      layer = layer.parentGroup();
    }

    if (layer) {
      if (selectedArtboards.indexOf(layer) < 0) {
        selectedArtboards.push(layer);
      }
    }
  });

  selectedArtboards.forEach(artboard => {
    let childBounds = {l: Infinity, t: Infinity, r: -Infinity, b: -Infinity};
    let childFrames = util.arrayFromNSArray(artboard.layers()).map(l => l.frame());
    if (!childFrames.length) {
      return;
    }

    let resizesContent = !!artboard.resizesContent();
    artboard.setResizesContent(false);

    childFrames.forEach(frame => {
      childBounds.l = Math.min(childBounds.l, frame.x());
      childBounds.t = Math.min(childBounds.t, frame.y());
      childBounds.r = Math.max(childBounds.r, frame.x() + frame.width());
      childBounds.b = Math.max(childBounds.b, frame.y() + frame.height());
    });

    let deltaLeft = padding - childBounds.l;
    let deltaTop = padding - childBounds.t;

    childFrames.forEach(frame => {
      frame.setX(frame.x() + deltaLeft);
      frame.setY(frame.y() + deltaTop);
    });

    let artboardFrame = artboard.frame();
    artboardFrame.setX(artboardFrame.x() - deltaLeft);
    artboardFrame.setY(artboardFrame.y() - deltaTop);
    artboardFrame.setWidth(childBounds.r - childBounds.l + padding * 2);
    artboardFrame.setHeight(childBounds.b - childBounds.t + padding * 2);

    artboard.setResizesContent(resizesContent);
  });
};