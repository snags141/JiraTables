window.onload = function() {
    getVar("enabledStatus_conf").then(function(isEnabled) {
        console.log("enabledStatus is "+isEnabled);
        if(isEnabled == "true") {
            getVar("unit_conf").then(function(unit_conf) {
                getVar("tableWidth_conf").then(function(tableWidth_conf) {
                  console.log("[JiraTables] Enabling table formatting");
                  document.getElementsByClassName("ak-renderer-document")[0].setAttribute("style","overflow-x:auto;overflow-y:auto");
                  if(unit_conf == "Pixels") {
                    tableWidth_conf = tableWidth_conf + "px";
                  } else if(unit_conf == "Percent") {
                    tableWidth_conf = tableWidth_conf + "%";
                  }
                  console.log("[JiraTables] Setting table width to "+tableWidth_conf);
                  document.querySelectorAll("[class*=pm-table-container]").forEach(x => x.setAttribute("style","width:"+tableWidth_conf+";"));
                });
            });
        }
    });
        
      
        
};

function getVar(varToGet) {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get([varToGet], function(items){
        console.log("Returning promise for "+varToGet + ", value is "+items[varToGet]);
        resolve(items[varToGet]);
      });
    });
}