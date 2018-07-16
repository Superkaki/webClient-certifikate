/********************************************************************************************/
/*****************************   Response message procesation   *****************************/
/********************************************************************************************/

//message protocol handler
// TODO: use them!
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
                showWaitingIcon("#certInfo");
                break;
            case "1.1":
                processCheckCertResponse(json);
                break;
            case "2.0":
                showWaitingIcon("#formSend");
                break;
            case "2.1":
                processNewCertCreatedResponse();
                break;
            case "3.0":
                showWaitingIcon("#formAdd");
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
function processNewCertCreatedResponse() {
  console.log("New cert added");

  iconSended = "<button class='btn btn-success btn-round' type='button'>\
                  <i class='now-ui-icons ui-1_check'></i> Created!\
               </button>";

  iconSended = iconSended.replace("", "");
  let creating = $("#formSend")[0];
  creating.innerHTML = iconSended;
}

function processNewCertErrorResponse() {
  let data = json.error;
  console.log("Error: " + data.message);
  iconSended = "<button class='btn btn-danger btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i> "+data.message+"\
                  </button>";

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
const showWaitingIcon = function(place) {
    let iconSended = "</br><i class='now-ui-icons loader_refresh spin'></i>";

    iconSended = iconSended.replace("", "");
    let creating = $(place)[0];
    creating.innerHTML = iconSended;
}