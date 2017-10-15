// Simple Rhino file that reads and transforms a GEDCOM file, dumping the
// XML.

function createDocument() {
  var dbf = javax.xml.parsers.DocumentBuilderFactory.newInstance();
  dbf.setNamespaceAware(false);
  var db = dbf.newDocumentBuilder();
  var document = db.newDocument();
  document.appendChild(document.createElement('GEDCOM'));
  return document;
}

function dumpXml(node) {
  var transformer =
      javax.xml.transform.TransformerFactory.newInstance().newTransformer();
  transformer.transform(
    new javax.xml.transform.dom.DOMSource(node),
    new javax.xml.transform.stream.StreamResult(java.lang.System.out)
  );
}

function createElement(doc, level, name, value) {
  var elem = doc.createElement(name.trim());
  if (value) { 
    if (value.charAt(0) == '@') { 
      // Only level 0 entities are the declaration, everything else is
      // a reference.
      if (level == 0) {
        elem.setAttribute('id', value);
      } else {
        elem.setAttribute('ref', value);
      }
    } else {
      var textElem = doc.createElement('VAL');
      var text = doc.createTextNode(value);
      textElem.appendChild(text);
      elem.appendChild(textElem);
    }
  }
  return elem;
}

// Create a new doc Element based on the level, first keyword and line.
// Declarations of primary entities should be marked with the unique
// "id" attribute.
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

function readGed(doc, str) {
  var treeStack = new Array(doc.documentElement);
  var lines = str.split('\n')
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
}

var doc = createDocument();
var fileData = readFile('input2.ged');
readGed(doc, fileData);
dumpXml(doc);
