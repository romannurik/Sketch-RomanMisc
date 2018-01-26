import * as util from './util';

export default function(context) {
  if (context.selection.count() == 0) {
    context.document.showMessage('Please select some layers.');
    return;
  }

  let parents = util.arrayFromNSArray(context.selection).map(layer => layer.parentGroup());

  util.setSelection(context, parents);
};
