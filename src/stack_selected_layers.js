import * as util from './util';

export function onStackSimple(context) {
  stackLayers(context, 0);
};

export function onStackCustom(context) {
  let spacingStr = context.document.askForUserInput_initialValue('Enter spacing in pixels', '0');
  let spacing = parseInt(spacingStr, 10) || 0;
  stackLayers(context, spacing);
};

function stackLayers(context, spacing) {
  if (context.selection.count() == 0) {
    context.document.showMessage('Please select some objects.');
    return;
  }

  let selectionMetas = [];

  // locally cache layer positions
  util.arrayFromNSArray(context.selection).forEach(layer => {
    let frame = layer.frame();
    selectionMetas.push({
      layer: layer,
      l: frame.minX(),
      t: frame.minY(),
      r: frame.maxX(),
      b: frame.maxY(),
      midX: frame.midX(),
      midY: frame.midY()
    });
  });

  // determine if we're horizontally or vertically stacking. algorithm:
  // look at each layer's midpoint. draw a horizontal line and a vertical line
  // intersecting this midpoint, and count the number of other selected layers
  // that intersect these lines. choose the direction that intersects the fewest
  // additional layers, otherwise choose a default.
  let horizontalIntersections = 0;
  let verticalIntersections = 0;

  // find row-starting artboards
  selectionMetas.forEach(meta => {
    selectionMetas.forEach(otherMeta => {
      if (meta === otherMeta) {
        return;
      }

      if (meta.midY <= otherMeta.b && otherMeta.t <= meta.midY) {
        ++horizontalIntersections;
      }
      if (meta.midX <= otherMeta.r && otherMeta.l <= meta.midX) {
        ++verticalIntersections;
      }
    });
  });

  let stackVertically = (horizontalIntersections < verticalIntersections);

  // sort metas by X or Y position
  // and stack the layers
  let nextX, nextY;
  if (stackVertically) {
    selectionMetas.sort((a, b) => a.t - b.t);
    nextX = selectionMetas[0].l;
    nextY = selectionMetas[0].b + spacing;
  } else {
    selectionMetas.sort((a, b) => a.l - b.l);
    nextX = selectionMetas[0].r + spacing;
    nextY = selectionMetas[0].t;
  }

  // rearrange in layer list
  let layersToSort = selectionMetas.map(meta => meta.layer);
  util.reorderLayers(layersToSort);
  
  // stack the layers
  selectionMetas.slice(1).forEach(meta => {
    // if (!stackVertically) meta.layer.frame().setX(nextX);
    // if (stackVertically) meta.layer.frame().setY(nextY);
    meta.layer.frame().setX(nextX);
    meta.layer.frame().setY(nextY);
    if (stackVertically) {
      nextY += (meta.b - meta.t) + spacing;
    } else {
      nextX += (meta.r - meta.l) + spacing;
    }

    meta.layer.parentGroup().resizeToFitChildrenWithOption(1);
  });
}
