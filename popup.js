{
  'use strict';

  // If x is null, update UI from current conf
  // if x == "toggle", then reverse current UI and conf values
  function set_btnEnable(x) {
    getVar("enabledStatus_conf").then(function(value) {
      if(x == null) {
        if (value == "true"){
          console.log("[JiraTables] Promise value is true");
          document.getElementById('txtTableWidth').value = getVar("tableWidth_conf");
         } else {
          console.log("[JiraTables] Promise value is false");
          document.getElementById('txtTableWidth').disabled = false;
         }
      } else if(x == "toggle") {
        getVar("enabledStatus_conf").then(function(value) {
          console.log("[JiraTables] current enable status = "+value);
        });
        if(value == "true") {
          console.log("[JiraTables] enabledStatus_conf = true, disabling table formatting");
          setVar("enabledStatus_conf","false");
          disableFormatting();
         } else {
          console.log("[JiraTables] enabledStatus_conf = false, enabling table formatting");
          setVar("enabledStatus_conf","true");
          enableFormatting();
         }
      }
    });
  }

  // Update UI for unit combo box
  function set_cboxUnit(x) {
    console.log("[JiraTables] Setting CBox units");
    if(x == "Pixels") {
      setVar("unit_conf", "Pixels");
      document.getElementById('cboxUnit').value = "Pixels";
    } else if(x == "Percent") {
      setVar("unit_conf", "Percent");
      document.getElementById('cboxUnit').value = "Percent";
    }
  }

  // Update UI for width value
  function set_txtTableWidth(x) {
    if(x == null) {
      getVar("tableWidth_conf").then(function(value) {
        document.getElementById("txtTableWidth").value = value;
      });
    } else {
      document.getElementById("txtTableWidth").value = x;
    }
  }

  // Function to handle showing banners
  function disableFormatting() {
    console.log("[JiraTables] Disabling table formatting");
    runCode('document.getElementsByClassName("ak-renderer-document")[0].setAttribute("style","");');
    runCode('document.querySelectorAll("[class*=pm-table-container]").forEach(x => x.setAttribute("style","width:100%;"));');
  }
  // Function to handle hiding banners
  function enableFormatting() {
    getVar("unit_conf").then(function(unit_conf) {
      getVar("tableWidth_conf").then(function(tableWidth_conf) {
        console.log("[JiraTables] Enabling table formatting");
        runCode('document.getElementsByClassName("ak-renderer-document")[0].setAttribute("style","overflow-x:auto;overflow-y:auto");');
        if(unit_conf == "Pixels") {
          tableWidth_conf = tableWidth_conf + "px";
        } else if(unit_conf == "Percent") {
          tableWidth_conf = tableWidth_conf + "%";
        }
        console.log("[JiraTables] Setting table width to "+tableWidth_conf);
        runCode('document.querySelectorAll("[class*=pm-table-container]").forEach(x => x.setAttribute("style","width:'+tableWidth_conf+';"));');
      });
    });
  }
  // Run query in all tabs - Used to hide/show specific HTML elements as per disableFormatting() and enableFormatting()
  function runCode(codeString) {
    chrome.tabs.query({},function(tabs) {
      for (var i = 0; i < tabs.length; i++) {
        if(tabs[i].url.match(/(http:\/\/|https:\/\/)(.*\.atlassian\.net.*)/i)) {
          chrome.tabs.executeScript(tabs[i].id, {code: codeString});
        } else {
          console.log("[JiraTables] No atlassian.net site found at tab[" + i + "]");
        }

      }
    });
  }
  // Set initial values if not configured, else load in current settings from local storage & update UI
  getVar("enabledStatus_conf").then(function(value) {
    console.log("[JiraTables] enabledStatus_conf = "+value);
    if(value == undefined) {
      // Set enabled status
      setVar("enabledStatus_conf", "false");
      // Set table width
      setVar("tableWidth_conf", "300");
      // Set units
      setVar("unit_conf","Percent");
    } else { 
      // Get enabled status
      set_btnEnable();
      // Get cboxUnit
      set_cboxUnit();
      // Get pres. second count
      set_txtTableWidth();
    }
  });

  // Define UI elements in popup
  let btnEnable = document.getElementById('btnEnable');
  let cboxBtnPixels = document.getElementById('cboxBtnPixels');
  let cboxBtnPercent = document.getElementById('cboxBtnPercent');
  let txtTableWidth = document.getElementById('txtTableWidth');
  let btnDropdown = document.getElementById('btnDropdown');

  // Enable button onclick handler
  btnEnable.onclick = function(element) {
    console.log("[JiraTables] BtnEnable was clicked");
    set_btnEnable("toggle");
  };
  // Enable button onclick handler
  btnDropdown.onclick = function(element) {
    alert("Currently only percentage is supported.");
  };
  // Enable button onclick handler
  cboxBtnPixels.onclick = function(element) {
    set_cboxUnit("Pixels");
  };
  // Enable button onclick handler
  cboxBtnPercent.onclick = function(element) {
    set_cboxUnit("Percent");
  };
  // Presentation mode timer onchange handler
  txtTableWidth.onchange = function(element) {
    // Validate that an integer was given
    if( Number.isInteger(parseInt(element.target.value))) {
      setVar("tableWidth_conf",element.target.value);
    }
  }
  // Dynamic function to set variable to local storage
  function setVar(varToSet, valueToSet) {
    console.log("[JiraTables] setVar(): Setting "+varToSet+" with value "+valueToSet);
    var setObj = {};
    setObj[varToSet] = valueToSet;
    chrome.storage.local.set({ [varToSet]: valueToSet }, function(){});
  }
  // Dynamic function to get variable from local storage and return promise
  function getVar(varToGet) {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get([varToGet], function(items){
        resolve(items[varToGet]);
      });
    });
    return result;
  }
}