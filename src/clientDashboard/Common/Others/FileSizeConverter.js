const FileSizeConverter = (size) => {
  var fSExt = new Array("Bytes", "KB", "MB", "GB");
  var fSize = size;
  let i = 0;
  while (fSize > 900) {
    fSize /= 1024;
    i++;
  }
  return (Math.round(fSize * 100) / 100).toFixed(1) + " " + fSExt[i];
};
export default FileSizeConverter;
