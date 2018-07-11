let wsUri = "ws://localhost:8080/";
let debug = true;

function init() {
  websocket = new WebSocket(wsUri);
  websocket.onopen = function(evt) { onOpen(evt) };
  websocket.onclose = function(evt) { onClose(evt) };
  websocket.onmessage = function(evt) { onMessage(evt) };
  websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt) {

  writeToLog("Websocket opened!");
}

function onClose(evt) {
  writeToLog("DISCONNECTED");
}

function onMessage(evt) {
  if(evt && evt.data){
    let jsonData = JSON.parse(evt.data);
    if(jsonData){
      processMessageProtocol(jsonData);
    }
    else{
      console.log(jsonData.id + jsonData.result + jsonData.jsonrpc);
    }
  }
  //websocket.close();
}

function onError(evt) {
  writeToLog(evt.data);
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

window.addEventListener("load", init, false);


/********************************************************************************************
Listener for new user button
/********************************************************************************************/
document.getElementById('btnNewUser').addEventListener('click', function(evt){
  evt.preventDefault();
  console.log("New user request detected!")
  let newUserName = $("#newUserName")[0].value;
  let userNID = $("#userNID")[0].value;
  let newAddress = $("#newAddress")[0].value;
  //read form data
  let data = {
    "sender": newAddress,
    "userName": newUserName,
    "userNID": userNID
  }
  if(data.sender != "" && data.userName != "" && data.userNID != "") {
    createNewUser(data);
  } else {
    $('#modalSend').modal('show');
  }
})

/********************************************************************************************
Parse new user to json and send it
/********************************************************************************************/
function createNewUser(data){
  let msg = {
    jsonrpc: '2.0',
    id: '0',
    method: 'setUser',
    params: data,
  };
  console.log("Making new user request" )
  doSend(msg);  
}


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
      case "0":
        processNewUserResponse(json);
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
Show success icon
Insert a new certificate checking into the record
/********************************************************************************************/
function processNewUserResponse(json) {
  if(json.result) {
    let data = json.result;
    console.log("User created")

    newUser = "<h2 id='userName' class='title'>New user</h2>"
    newUser = newUser.replace("", "");
    let creating = $("#userName")[0];     // TODO: userName is taken from another mustache
    creating.innerHTML = newUser;

    btnGoToUser = "<button class='btn btn-success btn-round' type='button'>\
                    <i class='now-ui-icons ui-1_check'></i> Successfully created! Click to go to user "+$("#newUserName")[0].value+" \
                </button>"
    btnGoToUser = btnGoToUser.replace("", "");
    creating = $("#goProfile")[0];
    creating.innerHTML = btnGoToUser;

    creating = $("#remove")[0];
    creating.innerHTML = "";

  } else {
    console.log("User not created")
  }
  
}