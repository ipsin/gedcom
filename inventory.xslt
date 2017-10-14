<?xml version="1.0"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" encoding="ISO-8859-1"/>

  <xsl:template match="/">
    <h2>People</h2>

    <ul> 
      <xsl:for-each select="GEDCOM/INDI">
        <li>Name: <xsl:value-of select="NAME/VAL"/>
        <xsl:for-each select="RESI">
          <br/>
          <xsl:value-of select="DATE"/>: <xsl:value-of select="VAL"/>,
             <xsl:value-of select="PLAC"/>
        </xsl:for-each>
        </li>
      </xsl:for-each>
    </ul>

    <h2>Families</h2>

  </xsl:template>

</xsl:stylesheet>
