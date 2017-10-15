// Javascript to transform a .GED string to XML.

// TODO: Stop using a singleton for the stylesheet/file transform.
var GEDCOM = (function () {
  var my = {};
  var stylesheet;
  var loadTime;

  // Create a new Element based on a parsed line of the GED file.
  function createElement(doc, level, name, value) {
    var elem = doc.createElement(name.trim());
    if (value) { 
      if (value.charAt(0) == '@') { 
        // Only level 0 entities are the declaration, everything else
        // is a ref.
        if (level == 0) {
          elem.setAttribute('id', value);
        } else {
          elem.setAttribute('ref', value);
        }
      } else {
        var text = doc.createTextNode(value);
        var textElem = doc.createElement('VAL');
        textElem.appendChild(text);
        elem.appendChild(textElem);
      }
    }
    return elem;
  }

  // Create a new doc Element based on a line of GED file. Declarations
  // of primary entities should be marked with the unique "id"
  // attribute, and references to primary entities will use "ref".
  function createLineElement(doc, line) {
    var gedLineRe = /^([0-9]+)\s+([\-A-Z0-9_@]+)\s?(.*)\r?$/;
    var matched = line.match(gedLineRe);
    var newElem;
    if (matched) {
      var level = parseInt(matched[1]);
      if (level == 0 && matched[2].charAt(0) == '@') {
        newElem = createElement(doc, level, matched[3], matched[2]);
      } else {
        newElem = createElement(doc, level, matched[2], matched[3]);
      }
    }
    return [level, newElem];
  }

  // If the parent's first child is text, wrap it in an element.
  function wrapTextChild(doc, parent) {
    var children = parent.childNodes;
    if (children.length == 1 && parent.firstChild.nodeType == 3) {
      var valElem = doc.createElement('VAL');
      var text = doc.createTextNode(parent.firstChild.nodeValue);
      valElem.appendChild(text);
      parent.replaceChild(valElem, parent.firstChild);
    }
  }

  function insertElement(doc, treeStack, level, newElem) {
    // CONC nodes are concatenation of TEXT, so we append them.
    if (newElem.nodeName == 'CONC') {
      treeStack[level].firstChild.textContent +=
          newElem.firstChild.textContent;
      return;
    }
  
    // Mixing text and elements as children makes for harder-to-read
    // XML. If we're about to do that, wrap the text.
    wrapTextChild(doc, treeStack[level]);
  
    // Attach the new element and push it onto the stack.
    treeStack[level].appendChild(newElem);
    treeStack[level + 1] = newElem;
  }

  // Parse a GEDCOM 5.5 file an return an XML doc.
  my.readGedFromFileContents = function(fileStr) {
    var doc = document.implementation.createDocument(null, "GEDCOM");
    var treeStack = new Array(doc.documentElement);
    var lines = fileStr.split('\n')
    for (var p in lines) {
      var levelAndElement = createLineElement(doc, lines[p]);
      var level = levelAndElement[0];
      var newElem = levelAndElement[1];
      if (newElem === undefined) {
        continue;
      }
      insertElement(doc, treeStack, level, newElem);
    }
    return doc;
  };

  my.transformCallback = function(targetId, statusId) {
    var func = function(file_content) {
      if (stylesheet) {
        loadTime = Date.now();
        var gedDoc = my.readGedFromFileContents(file_content);
        var targetElem = document.getElementById(targetId);
        var statusElem = document.getElementById(statusId);

        statusElem.innerHTML = 'Reading file (elapsed time ' +
            ((Date.now() - loadTime) / 1000) + ' seconds)';
        var docFragment = stylesheet.transformToFragment(gedDoc, document);
        var transTime = Date.now();
        statusElem.innerHTML = 'Transforming (elapsed time ' +
            ((Date.now() - loadTime) / 1000) + ' seconds)';
        targetElem.innerHTML = '';
        statusElem.innerHTML = 'Writing result (elapsed time ' +
            ((Date.now() - loadTime) / 1000) + ' seconds)';
        targetElem.appendChild(docFragment);
        statusElem.innerHTML = 'Done after ' +
            ((Date.now() - loadTime) / 1000) + ' seconds, transform took ' +
            ((Date.now() - transTime) / 1000) + ' seconds';
      }
    };
    return func;
  };

  // Update the stylesheet.
  my.stylesheetSelect = function(files) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) {
        var xmlDoc = (new DOMParser()).parseFromString(
            evt.target.result, 'text/xml');
        stylesheet = new XSLTProcessor(xmlDoc);
        stylesheet.importStylesheet(xmlDoc);
        console.log(stylesheet);
      }
    };
    reader.readAsText(files[0]);
  }

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
    
  return my;
}());
