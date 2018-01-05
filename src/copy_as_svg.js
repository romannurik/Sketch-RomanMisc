import * as util from './util';

export default function(context) {
  if (context.selection.count() == 0) {
    context.document.showMessage('Please select some objects.');
    return;
  }

  let layer = context.selection.objectAtIndex(0);

  // let slice = GKRect.rectWithRect(layer.absoluteInfluenceRect());
  let slice = MSExportRequest.exportRequestsFromExportableLayer(layer).objectAtIndex(0);
  slice.setShouldTrim(false);
  slice.setIncludeArtboardBackground(true);
  letpath = util.makeTempFolder('copyassvg') + '/export.svg';
  context.document.saveArtboardOrSlice_toFile_(slice, path);
  let url = NSURL.fileURLWithPath(path);
  let str = NSString.alloc().initWithContentsOfURL(url);
  copyStringToClipboard(str);
  // let pb = NSPasteboard.generalPasteboard();
  // pb.writeObjects(NSArray.arrayWithObject(url));

  context.document.showMessage('SVG copied to clipboard');
};

function copyStringToClipboard(str) {
  str = NSString.stringWithFormat('%@', str);
  let data = str.dataUsingEncoding(NSUTF8StringEncoding);
  let pb = NSPasteboard.generalPasteboard();
  pb.declareTypes_owner_(NSArray.arrayWithObject(NSPasteboardTypeString), null);
  pb.setData_forType_(data, NSPasteboardTypeString);
}
