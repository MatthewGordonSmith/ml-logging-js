declareUpdate();
xdmp.setRequestTimeLimit(3600);
xdmp.documentInsert(
  uri,
  document,
  {
    "permissions": permissions,
    "collections": collections
  }
);
if(typeof properties != "undefined") {
  var documentProperties = [];
  properties.forEach(function(property){
    documentProperties.push(fn.head(xdmp.unquote("<"+property.name+">"+property.value+"</"+property.name+">")).root);
  });
  xdmp.documentSetProperties(
    uri,
    documentProperties
  );
}
