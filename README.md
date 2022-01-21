# gedcom

## Background

This is a simple HTML viewer for geneaology files written in the [GEDCOM](https://en.wikipedia.org/wiki/GEDCOM) format.

It works by converting the GED file to [XML](https://en.wikipedia.org/wiki/XML), and then using an [XML Stylesheet](https://en.wikipedia.org/wiki/XSLT) to render that to an HTML page.

An example stylesheet (inventory.xslt) is provided.

## Steps to Run

1. Install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git). The Windows version has many options, but choosing the defaults should be fine.
2. Move to a new directory in command prompt (Windows) or a shell.  You’ll be checking out this project into a subdirectory of the directory you choose.
3. Check out the source code using `git clone https://github.com/ipsin/gedcom.git`
4. Put your GED file in the same “gedcom” directory (for convenience)
5. Open devel.html in a web browser.  On Windows 10+ if your username is “Foo” the URL would be [file:///C:/Users/Foo/git/gedcom/devel.html](file:///C:/Users/Foo/git/gedcom/devel.html)
6. Use the “Choose file” button for “Select Stylesheet” and choose `inventory.xslt`
7. Use the “Choose file” button and select the GED file.  What should appear then is the transformed dump of the GED file in HTML.
8. To re-run the transformation, reload the page and select again.
