const alert = require("/MarkLogic/alert.xqy")

var configUri 
var doc
var rule 
var action 

xdmp.log("alert triggered")
xdmp.log("configUri: " +configUri)
xdmp.log("doc: " +doc)
xdmp.log("rule: " +rule)
xdmp.log("action: " +action)
xdmp.log("alert ended")