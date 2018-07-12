
//let wsUri = "ws://localhost:8080/";

let debug = true;

function init() {
  console.log("Guay");
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3 = new Web3(web3.currentProvider);
  } else {
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    web3 = new Web3(new Web3.providers.HttpProvider(require('../../../conf/eth.json').url));
  }
  if(!web3.isConnected()){
    console.log("Web3 chachi!");
  }
  
  monitorAccountChanges();
  watchBlockInfo();
  reloadPageWhenNoNetwork();
}

// Check if an Ethereum node is available every 5 seconds.
// I have chosen arbritray 5 seconds.
function reloadPageWhenNoNetwork(){
  setInterval(function(){
    if(!web3.isConnected()){
      // If an Ethereum node is found, reload web page.
      init();
    }
  }, 5000);
}

function monitorAccountChanges() {
  // Check if an Ethereum node is found.
  if(web3.isConnected()){
    getCoinbasePromise()
    .then(function(fromAddress){
      console.log("Coinbase: " + fromAddress)
    })
    .catch(function(err){
      console.log("Error getting coinbase")
    });

    accountInterval = setInterval(function() {
      // Check which Ethereum network is used
      getNetworkPromise()
      .then(function(network){
        console.log("Used network: " + network);
      })
      .catch(function(err){
        console.log(err);
      });

    }, 1000); // end of accountInterval = setInterval(function()
  } else {
    console.log("Web3 is not connected");
  }
}

function watchBlockInfo(){
  if(web3.isConnected()){
    // Promise chain
    getBlockNumberPromise().then(function(blockNumber){
      return getBlockPromise(blockNumber);
    }).then(function(arr){
      const blockNumber = arr[0];
      const confirmedBlock = arr[1];
      console.log("Latest block number: " + blockNumber);
      console.log("Latest block hash: " + confirmedBlock.hash);
      console.log("Latest block timestamp: " + confirmedBlock.timestamp);
    }).catch(function(err){
      alert("Error: " +err);
    });
  } else {
    console.log("Web3 is not connected");
  }
}

/********************************************************************************************
Parse message yo json and send it
/********************************************************************************************/
function doSend(message) {
  let serializedData = JSON.stringify(message);
  writeToLog("----> REQUEST SENDED: " + serializedData);
  websocket.send(serializedData);
}

function writeToLog(message) {
  console.log(message)
}

window.addEventListener("load", init);



///domain specific functions

/********************************************************************************************
Get status from a user
/********************************************************************************************/
function getStatus() {
  console.log("Loading user data");
  getCertificatesRecord();
  getCheckingHistory();
}

/********************************************************************************************
Listener for testing button
/********************************************************************************************/
document.getElementById('btnTest').addEventListener('click', function(evt){
  evt.preventDefault();
  console.log("Testing network");

  console.log("###############  Runing test  ###############");

  let data = {
    "owner": "0x4eab0f78821612c0528f29fe1193c5d825616a74",
    "duration": 300,
    "certType": "Titulo marítimo",
    "certName": "Capitán",
    "sender": "0x86b53fd08baef3202ad2c4cb0b5d04384d2c8850"
  }
  newCert(data);
  
  data = {
    "owner": "0x86b53fd08baef3202ad2c4cb0b5d04384d2c8850",
    "duration": 300,
    "certType": "Titulo nobiliario",
    "certName": "Barón Rojo",
    "sender": "0x4eab0f78821612c0528f29fe1193c5d825616a74"
  }
  newCert(data);

  data = {
    "owner": "0xa416ea7ab365c38e5c39b6f06ae779bebe918328",
    "duration": 300,
    "certType": "Convenio Prácticas",
    "certName": "Tecnalia Junio2017",
    "sender": "0x86b53fd08baef3202ad2c4cb0b5d04384d2c8850"
  }
  newCert(data);

  console.log("TEST OK");
})

/********************************************************************************************
Get the record of certificates owned by a user
/********************************************************************************************/
function getCertificatesRecord() {
  let sender = $("#sender");
  let data = {
    "sender": sender.text()
  }
  let msg = {
    jsonrpc: '2.0',
    id: '0.1',
    method: 'getCertList',
    params: data
  };
  doSend(msg); 
}

/********************************************************************************************
Get the record of certificates owned by a user
/********************************************************************************************/
function getCheckingHistory() {
  let sender = $("#sender");
  let data = {
    "sender": sender.text()
  }
  let msg = {
    jsonrpc: '2.0',
    id: '0.2',
    method: 'getAccessLogList',
    params: data
  };
  doSend(msg); 
}

/********************************************************************************************
Listener for check certificate button
/********************************************************************************************/
document.getElementById('btnCheck').addEventListener('click', function(evt){
  evt.preventDefault();
  console.log("Certificate checking request detected!");
  let checkCertHash = $("#checkCertHash")[0].value;
  let sender = $("#sender");
  //read form data
  let data = {
    "certHash": checkCertHash,
    "sender": sender.text()
  }
  if(data.certHash != "") {
    checkCert(data);
  } else {
    $('#modalSend').modal('show');
  }
})

/********************************************************************************************
Parse check certificate to json and send it
/********************************************************************************************/
function checkCert(data){
  let msg = {
    jsonrpc: '2.0',
    id: '1',
    method: 'checkCert',
    params: data
  };
  console.log("Making certificate checking request")
  doSend(msg);  
}

/********************************************************************************************
Listener for new certificate button
/********************************************************************************************/
document.getElementById('btnSend').addEventListener('click', function(evt){
  evt.preventDefault();
  console.log("New cert request detected!")
  let owner = $("#owner")[0].value;
  let duration = $("#duration")[0].value;
  let certType = $("#certType")[0].value;
  let certName = $("#certName")[0].value;
  let sender = $("#sender");
  //read form data
  let data = {
    "owner": owner,
    "duration": duration,
    "certType": certType,
    "certName": certName,
    "sender": sender.text()
  }
  if(data.owner != "" && data.durantion != "" && data.certType != "" && data.certName != "" && data.sender != "") {
    newCert(data);
  } else {
    $('#modalSend').modal('show');
  }
})

/********************************************************************************************
Parse new certificate to json and send it
/********************************************************************************************/
function newCert(data){
  let msg = {
    jsonrpc: '2.0',
    id: '2',
    method: 'newCert',
    params: data
  };
  console.log("Making new certificate request")
  doSend(msg);  
}

/********************************************************************************************
Listener for new owner button
/********************************************************************************************/
document.getElementById('btnAddOwner').addEventListener('click', function(evt){
  evt.preventDefault();
  console.log("Add new owner request detected!")
  let e = document.getElementById("titleOption");
  let manageCertHash = e.options[e.selectedIndex].value;
  let address = $("#address")[0].value;
  let sender = $("#sender");
  //read form data
  let data = {
    "certHash": manageCertHash,
    "newOwner": address,
    "sender": sender.text()
  }
  if(data.certHash != "" && data.newOwner != "") {
    addNewOwner(data);
  } else {
    $('#modalSend').modal('show');
  }
})

/********************************************************************************************
Parse new owner to json and send it
/********************************************************************************************/
function addNewOwner(data){
  let msg = {
    jsonrpc: '2.0',
    id: '3',
    method: 'addOwner',
    params: data,
  };
  console.log("Making new owner request" )
  doSend(msg);  
}

/********************************************************************************************
Listener for new entity to white list button
/********************************************************************************************/
document.getElementById('btnAllow').addEventListener('click', function(evt){
  evt.preventDefault();
  console.log("Add entity to white list request detected!")
  let e = document.getElementById("titleOption");
  let manageCertHash = e.options[e.selectedIndex].value;
  let address = $("#address")[0].value;
  let sender = $("#sender");
  //read form data
  let data = {
    "certHash": manageCertHash,
    "address": address,
    "sender": sender.text()
  }
  if(data.certHash != "" && data.address != "") {
    addEntityToWhiteList(data);
  } else {
    $('#modalSend').modal('show');
  }
})

/********************************************************************************************
Parse new entity to white list to json and send it
/********************************************************************************************/
function addEntityToWhiteList(data){
  let msg = {
    jsonrpc: '2.0',
    id: '4',
    method: 'setEntityToWhiteList',
    params: data,
  };
  console.log("Making new entity to white list request" )
  doSend(msg);  
}

///********************************************************************************************
//Listener for remove certificate button
///********************************************************************************************/
//document.getElementById('btnRemove').addEventListener('click', function(evt){
//  evt.preventDefault();
//  console.log("Remove certificate request detected!")
//  let certHash = $("#toolong")[0].value;
//  //read form data
//  let data = {
//    "certHash": certHash
//  }
//  removeCertificate(data);
//})
//
///********************************************************************************************
//Parse remove certificate to json and send it
///********************************************************************************************/
//function removeCertificate(data){
//  let msg = {
//    jsonrpc: '2.0',
//    id: '5',
//    method: 'removeCertificate',
//    params: data,
//  };
//  console.log("Making remove certificate request" )
//  doSend(msg);  
//}


/********************************************************************************************/
/*****************************   Response message procesation   *****************************/
/********************************************************************************************/

//message protocol handler
function processMessageProtocol(json){
  if(debug){
    console.log("<---- RESPONSE RECEIVED: " + JSON.stringify(json))
  }
  if(json){
    switch(json.id){
      case "0.1":
        processCertificatesRecord(json.result);
        break;
      case "0.2":
        processAccessLogRecord(json.result);
        break; 
      case "1.0":
        showWaitingIcon(json,"#certInfo");
        break;
      case "1.1":
        processCheckCertResponse(json);
        break;
      case "2.0":
        showWaitingIcon(json,"#formSend");
        break;
      case "2.1":
        processNewCertCreatedResponse(json);
        break;
      case "3.0":
        showWaitingIcon(json,"#formAdd");
        break;
      case "3.1":
        processEntityToWhiteListResponse(json);
        break;
      case "3.2":
        processNewOwnerResponse(json);
        break;
      case "5":
        processRemoveCertificateResponse(json.result);
        break;
      default:
        console.log(json.params);
    }
  }
}


/********************************************************************************************/
/***********************************   Response actions   ***********************************/
/********************************************************************************************/

/********************************************************************************************
Show all the certificates from a user
/********************************************************************************************/
function processCertificatesRecord(data) {
  if(data){
    addNewCertRow(data);
    addOptionToManager(data.certHash,data.certName);
  }
}

/********************************************************************************************
Show all the checkings from a user's certificates
/********************************************************************************************/
function processAccessLogRecord(data) {
  if(data){
    addAccessLogRow(data);
  }
}

/********************************************************************************************
Show success icon
Insert a new certificate checking into the record
/********************************************************************************************/
function processCheckCertResponse(json) {
  console.log("Cert checked");
  
  if(json.result){
    let data = json.result;
    //addAccessLogRow(data);

    let iconVerify = undefined;
    if(data.isStilValid) {
      iconVerify = "<button class='btn btn-success btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_check'></i> Valid certificate\
                  </button>";
    } else {
      iconVerify = "<button class='btn btn-danger btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i> Expired certificate\
                  </button>";
    }

    
    rowdata = "<h6 class='title'>Creation Date: " + epochToDateTime(data.creationDate) + "</h6>\
    <h6 class='title'>Issuer: " + data.issuer + "</h6>\
    <h6 class='title'>Type: " + data.certType + "</h6>\
    <h6 class='title'>Title: " + data.certName + "</h6>\
    <h6 class='title'>" + iconVerify + "</h6>";
    rowdata = rowdata.replace("", "");
    let info = $("#certInfo")[0];
    info.innerHTML = rowdata;
    
  
  } else {
    let data = json.error;
    iconVerify = "<button class='btn btn-danger btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i> "+data.message+"\
                  </button>";
    iconVerify = iconVerify.replace("", "");
    let checking = $("#certInfo")[0];
    checking.innerHTML = iconVerify;
  }
}

/********************************************************************************************
Show success icon
Insert a new certificate creation into the record
/********************************************************************************************/
function processNewCertCreatedResponse(json) {
  if(json.result) {
    let data = json.result;
    console.log("New cert added");

    if(data.certHash) {
      iconSended = "<button class='btn btn-success btn-round' type='button'>\
                        <i class='now-ui-icons ui-1_check'></i> Created!\
                    </button>";
    } else {
      iconSended = "<button class='btn btn-danger btn-round' type='button'>\
                        <i class='now-ui-icons ui-1_simple-remove'></i> Error creating certificate!\
                    </button>";
    }

    if(data){
      addNewCertRow(data);
      addOptionToManager(data.certHash, data.certName);
    }
  } else {
    let data = json.error;
    console.log("Error: " + data.message);
    iconSended = "<button class='btn btn-danger btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i> "+data.message+"\
                  </button>";
  }

  iconSended = iconSended.replace("", "");
  let creating = $("#formSend")[0];
  creating.innerHTML = iconSended;
}

/********************************************************************************************
Show success icon
/********************************************************************************************/
function processNewOwnerResponse(json) {
  if(json.result) {
    console.log("New owner added");
    iconAdded = "<button class='btn btn-success btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_check'></i> Added!\
                </button>";
  } else {
    let data = json.error;
    console.log("Error: " + data.message);
    iconAdded = "<button class='btn btn-danger btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i> "+data.message+"\
                </button>";
  }
  iconAdded = iconAdded.replace("", "");
  let creating = $("#formAdd")[0];
  creating.innerHTML = iconAdded;
}

/********************************************************************************************
Show success icon
/********************************************************************************************/
function processEntityToWhiteListResponse(json) {
  if(json.result) {
    console.log("New entity allowed");

    iconAdded = "<button class='btn btn-success btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_check'></i> Allowed!\
                </button>";
  } else {
    let data = json.error;
    console.log("Error: " + data.message);
    iconAdded = "<button class='btn btn-danger btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i> "+data.message+"\
                </button>";
  }
  iconAdded = iconAdded.replace("", "");
  let creating = $("#formAdd")[0];
  creating.innerHTML = iconAdded;
}

/********************************************************************************************
Show success icon
/********************************************************************************************/
function processRemoveCertificateResponse(data) {
  console.log("Certificate removed");

  iconVerify = "<button class='btn btn-danger btn-round' type='button'>\
                  <i class='now-ui-icons ui-1_simple-remove'></i>\
              </button>";
  iconVerify = iconVerify.replace("\
  ", "");
  let creating = $("#iconValid")[0];
  creating.innerHTML = iconVerify;

  iconRemove = "<button id='btnRemove' class='btn btn-danger btn-round'>Removed!</button>";
  iconRemove = iconRemove.replace("", "");
  creating = $("#iconRemove")[0];
  creating.innerHTML = iconRemove;
}


/********************************************************************************************/
/***********************************   Other functions   ************************************/
/********************************************************************************************/

function epochToDateTime(epoch) {
  var myDate = new Date( epoch *1000);
  return(myDate.toLocaleString());
}

function epochDate(epoch) {
  var myDate = new Date( epoch *1000);
  return myDate.toDateString();
}

function epochTime(epoch) {
  var myDate = new Date( epoch *1000);
  return myDate.toLocaleTimeString();
}

/********************************************************************************************
Add new certificate to the certificates record
/********************************************************************************************/
function addNewCertRow(data) {
  //XSS vulnerable
  let rowdata = undefined;
  if(data.isStilValid) {
    iconValid = "<button class='btn btn-success btn-icon btn-round'>\
                    <i class='now-ui-icons ui-1_check'></i>\
                </button>";
    iconRemove = "<button id='btnRemove' class='btn btn-warning btn-round'>Remove</button>";
  } else {
    iconValid = "<button class='btn btn-danger btn-icon btn-round'>\
                    <i class='now-ui-icons ui-1_simple-remove'></i>\
                </button>";
    iconRemove = "";
  }

  let expDate;
  if(data.creationDate != data.expirationDate) {
    expDate = epochToDateTime(data.expirationDate);
  } else {
    expDate = "-";
  }

  rowdata = "<tr>\
  <td id='toolong'>"+data.certHash+"</td>\
  <td id='toolong'>"+data.issuer+"</td>\
  <td>"+data.certType+"</td>\
  <td>"+data.certName+"</td>\
  <td>"+epochToDateTime(data.creationDate)+"</td>\
  <td>"+expDate+"</td>\
  <td>"+iconValid+"</td>\
  </tr>";

  rowdata = rowdata.replace("", "");
  let table = $("#logCert")[0];
  console.log(table);
  table.innerHTML = rowdata + table.innerHTML;
}

/********************************************************************************************
Add new access log to the history record
/********************************************************************************************/
function addAccessLogRow(data) {
  //XSS vulnerable
  let rowdata = undefined;
  rowdata = "<tr>\
  <td>"+epochDate(data.creationDate)+"</td>\
  <td>"+epochTime(data.creationDate)+"</td>\
  <td id='toolong'>"+data.certHash+"</td>\
  <td id='toolong'>"+data.user+"</td>\
  </tr>";
  rowdata = rowdata.replace("", "");
  let table = $("#logHistory")[0];
  table.innerHTML = table.innerHTML + rowdata;
}

/********************************************************************************************
Add new certificate option to the list of certificates in 
/********************************************************************************************/
function addOptionToManager(certHash,certName) {
  let option = undefined;
  option = "<option id='manageCertHash' value="+certHash+">"+certName+"</option>";

  option = option.replace("", "");
  let opt = $("#titleOption")[0];
  console.log(opt);
  opt.innerHTML = opt.innerHTML + option;
}

/********************************************************************************************
Show waiting icon
/********************************************************************************************/
function showWaitingIcon(json, place) {
  if(json.result) {
    console.log("Waiting block");
    if(json.result.success) {
      iconSended = "</br><i class='now-ui-icons loader_refresh spin'></i>";
    }
  } else {
    let data = json.error;
    console.log("Error: " + data.message);
    iconSended = "<button class='btn btn-danger btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i> "+data.message+"\
                  </button>";
  }
  iconSended = iconSended.replace("", "");
  let creating = $(place)[0];
  creating.innerHTML = iconSended;
}