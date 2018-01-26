import * as util from './util';

export default function(context) {
  if (context.selection.count() == 0) {
    context.document.showMessage('Please select some objects.');
    return;
  }

  let layersToRename = util.arrayFromNSArray(context.selection);

  let name = null;
  layersToRename.forEach(layer => {
    if (name === null) {
      name = layer.name();
    } else if (name != layer.name()) {
      name = '';
    }
  });

  let sketch = context.api();
  let newName = sketch.getStringFromUser('Enter new name for layers', name);
  if (!newName) {
    return;
  }

  layersToRename.forEach(layer => layer.setName(newName));
};
