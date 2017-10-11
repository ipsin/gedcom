// Javascript to transform a .GED string to XML.

var GEDCOM = (function () {
  var my = {};

  my.convertToXml = function(gedcom_data) {
    var document.implementation.createDocument(null, "books");
    alert(gedcom_data);
  };

  // A GED file is selected.
  my.fileSelect = function(files, load_callback) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) {
        load_callback(evt.target.result);
      }
    };
    reader.readAsText(files[0]);
  };
    
  my.readFile = function(filename, load_callback) {
    var req = new XMLHttpRequest();
    req.addEventListener("load", function() { load_callback(this.responseText); });
    req.open("GET", filename);
    req.send();
  };

  return my;
}());
