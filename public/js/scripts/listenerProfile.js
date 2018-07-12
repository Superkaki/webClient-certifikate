
//let wsUri = "ws://localhost:8080/";

let debug = true;

function init() {
  console.log("Todo guay!");
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3 = new Web3(web3.currentProvider);
  } else {
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    web3 = new Web3(new Web3.providers.HttpProvider(require('../../../conf/eth.json').url));
  }
  
  monitorAccountChanges();
  watchBlockInfo();
  getStatus();
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

function createContract(){
  // Each time you modify the DemoContract.sol and deploy it on the blockchain, you need to get the abi value.
  // Paste the abi value in web3.eth.contract(PASTE_ABI_VALUE);
  // When the contract is deployed, do not forget to change the contract address, see
  // formfield id 'contractAddress'
  // Replace contract address: 0xf1d2e0b8e09f4dda7f3fd6db26496f74079faeeb with your own.
  
  const abi = [{"constant":false,"inputs":[{"name":"_certUnique","type":"bytes32"}],"name":"removeCertificate","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"add","type":"address"}],"name":"getLastCert","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCreator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"accessLogs","outputs":[{"name":"date","type":"uint256"},{"name":"user","type":"address"},{"name":"certificate","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_certUnique","type":"bytes32"},{"name":"_newOwner","type":"address"}],"name":"addOwner","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"certUnique","type":"bytes32"}],"name":"isSenderInTheWhiteList","outputs":[{"name":"isAllowed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"certUnique","type":"bytes32"}],"name":"getCertByHash","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_certUnique","type":"bytes32"}],"name":"insertHistory","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"certs","outputs":[{"name":"issuer","type":"address"},{"name":"certName","type":"string"},{"name":"certType","type":"string"},{"name":"creationDate","type":"uint256"},{"name":"expirationDate","type":"uint256"},{"name":"isStilValid","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_add","type":"address"},{"name":"_userName","type":"bytes32"},{"name":"_userNid","type":"bytes9"}],"name":"setUser","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"nounce","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"add","type":"address"}],"name":"getUserByAddress","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_certUnique","type":"bytes32"},{"name":"_newEntity","type":"address"}],"name":"setEntityToWhiteList","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"add","type":"address"}],"name":"getAccessLogList","outputs":[{"name":"accessLogList","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"ConstructorCertifikate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMyAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"users","outputs":[{"name":"name","type":"bytes32"},{"name":"nid","type":"bytes9"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"certUnique","type":"bytes32"}],"name":"checkCert","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"accessLogUnique","type":"bytes32"}],"name":"getAccessLogByHash","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_certUnique","type":"bytes32"}],"name":"checkExpiration","outputs":[{"name":"isValid","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"add","type":"address"}],"name":"getCertList","outputs":[{"name":"ownCertsList","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_certType","type":"string"},{"name":"_certName","type":"string"},{"name":"_duration","type":"uint256"}],"name":"newCert","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];
  const contractAddress = '0xC676dD57e4fB4c800188C353c79f84BdEcf1B191';

  const contractSpec = web3.eth.contract(abi);
  return contractSpec.at(contractAddress);
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

  if(web3.isConnected()){
    let sender = $("#sender").text();
    //console.log("sender: " + sender);

    const contract = createContract();
    contract.getCertList(sender, {from: sender} ,function (err, res) {
      showResult(err, res, "Certificates");
    });
  } else {
    console.log("Web3 is not connected");
  }
  
  //let sender = $("#sender");
  //let data = {
  //  "sender": sender.text()
  //}
  //
  //let msg = {
  //  jsonrpc: '2.0',
  //  id: '0.1',
  //  method: 'getCertList',
  //  params: data
  //};
  //doSend(msg); 
}

/********************************************************************************************
Get the record of certificates owned by a user
/********************************************************************************************/
function getCheckingHistory() {

  if(web3.isConnected()){
    let sender = $("#sender").text();
    //console.log("sender: " + sender);

    const contract = createContract();
    contract.getAccessLogList(sender, {from: sender} ,function (err, res) {
      showResult(err, res, "Access logs");
    });
  } else {
    console.log("Web3 is not connected");
  }


  //let sender = $("#sender");
  //let data = {
  //  "sender": sender.text()
  //}
  //let msg = {
  //  jsonrpc: '2.0',
  //  id: '0.2',
  //  method: 'getAccessLogList',
  //  params: data
  //};
  //doSend(msg); 
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

  setNewCert(data).then(function(txhash){
    return getTransactionReceiptPromise(txhash)
  }).then(function(receipt){
    console.log("Transaction receipt object: " + JSON.stringify(receipt));
    //document.getElementById('log').innerText = "Transaction receipt object: \n"+JSON.stringify(receipt, null, "\t");
  }).catch(function(err){
    alert("Error: " +err);
  });

  //let msg = {
  //  jsonrpc: '2.0',
  //  id: '2',
  //  method: 'newCert',
  //  params: data
  //};
  //console.log("Making new certificate request")
  //doSend(msg);  
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


/********************************************************************************************/
/***********************************   Other functions   ************************************/
/********************************************************************************************/

function showResult(err, res, data){
  if(res) {
    console.log(data + ":");
    console.log(res)
  } else {
    alert("showResult: "+err);
  }
}