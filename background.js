'use strict';

var timerid;
// Initialize startup values
setVar("enabledStatus_conf", "false");
setVar("tableWidth_conf", "300");
setVar("unit_conf","Percent");

// Dynamic function to set variable to local storage
function setVar(varToSet, valueToSet) {
  var setObj = {};
  setObj[varToSet] = valueToSet;
  chrome.storage.local.set({ [varToSet]: valueToSet }, function(){});
}
// Dynamic function to get variable from local storage
function getVar(varToGet) {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get([varToGet], function(items){
      resolve(items[varToGet]);
    });
  });
}
