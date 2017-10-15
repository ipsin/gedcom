<?xml version="1.0"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" encoding="ISO-8859-1"/>

  <xsl:key name="person" match="GEDCOM/INDI" use="@id"/>

  <!-- This is how a person is rendered by default. -->
  <xsl:template match="INDI">
    <li>Name: <xsl:value-of select="NAME/VAL"/>
      <xsl:if test="BIRT/DATE != '' or DEAT/DATE != ''">
      (<xsl:if test="BIRT/DATE">Born <xsl:value-of select="BIRT/DATE"/></xsl:if>
       <xsl:if test="DEAT/DATE"><xsl:if test="BIRT/DATE">, </xsl:if>Died <xsl:value-of select="DEAT/DATE"/></xsl:if>)
      </xsl:if>
    </li>
  </xsl:template>

  <!-- This is how a family is rendered by default. -->
  <xsl:template match="FAM">
    <li>
      <xsl:if test="WIFE">
        Wife: <xsl:value-of select="key('person',WIFE/@ref)/NAME/VAL"/>
        <br/>
      </xsl:if>
      <xsl:if test="HUSB">
        Husband: <xsl:value-of select="key('person',HUSB/@ref)/NAME/VAL"/>
        <br/>
      </xsl:if>
      <xsl:for-each select="CHIL">
        Child: <xsl:value-of select="key('person',@ref)/NAME/VAL"/>
        <br/>
      </xsl:for-each>
    </li>
  </xsl:template>

  <!-- This is how a repository is rendered by default. -->
  <xsl:template match="REPO">
    <li>Name: <xsl:value-of select="NAME/VAL"/></li>
  </xsl:template>

  <!-- This is how a source is rendered by default. -->
  <xsl:template match="SOUR">
    <li>Name: <xsl:value-of select="TITL/VAL"/></li>
  </xsl:template>
         
  <xsl:template match="/">
    <h2>People</h2> 
    <ol>
      <xsl:apply-templates select="GEDCOM/INDI"/>
    </ol>

    <h2>Families</h2>
    <ol> 
      <xsl:apply-templates select="GEDCOM/FAM"/>
    </ol>

    <h2>Repositories</h2>
    <ol> 
      <xsl:apply-templates select="GEDCOM/REPO"/>
    </ol>

    <h2>Sources</h2>
    <ol> 
      <xsl:apply-templates select="GEDCOM/SOUR"/>
    </ol>
  </xsl:template>

</xsl:stylesheet>
