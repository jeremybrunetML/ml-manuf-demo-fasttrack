xquery version "1.0-ml";

module namespace decolibsearch = "http://marklogic.com/demo/decolibsearch";

declare namespace sarqlRes = "http://www.w3.org/2005/sparql-results#";

import module namespace sem = "http://marklogic.com/semantics"
at "/MarkLogic/semantics.xqy";

import module namespace functx = "http://www.functx.com" at "/MarkLogic/functx/functx-1.0-nodoc-2007-01.xqy";

declare function decolibsearch:decorator($uri as xs:string) as node()*
{
  let $format := xdmp:uri-format($uri)
  let $mimetype := xdmp:uri-content-type($uri)
  let $collection := xdmp:document-get-collections($uri)[1]
  let $doc := fn:doc($uri)
  
  return (

  (:href attribute:)
  attribute href {fn:concat("/v1/documents?uri=", $uri)},

  (:mime attribute:)
  if (fn:empty($mimetype)) then ()
  else attribute mimetype {$mimetype},

  (:format attribute:)
  if (fn:empty($format)) then ()
  else attribute format {$format},


  (: Part metas :)
  attribute IDPI {$doc/envelope/instance/Part/IDPI/string()},
  attribute PieceNom {$doc/envelope/instance/Part/PieceNom/string()},
  attribute Materiau {$doc/envelope/instance/Part/Materiau/string()},
  attribute MasseKg {$doc/envelope/instance/Part/MasseKg/string()},
  attribute VolumeMm3 {$doc/envelope/instance/Part/VolumeMm3/string()},
  attribute partDescription {$doc/envelope/instance/Part/partDescription/string()},
  attribute partDescriptionEN {$doc/envelope/instance/Part/partDescriptionEN/string()},
  attribute partType {$doc/envelope/instance/Part/partType/string()},
  attribute partCategory {$doc/envelope/instance/Part/partCategory/string()},
  attribute partImage {$doc/envelope/instance/Part/partImage/string()}
)
};