
/********************************************************************************************/
/***********************************   Response actions   ***********************************/
/********************************************************************************************/

/********************************************************************************************
Show all the certificates from a user
/********************************************************************************************/
function processCertificatesRecord(data) {
  if(data){
    addNewCertRow(data);
    addOptionToManager(data[0],data[3]);
  }
}

/********************************************************************************************
Show all the checkings from a user's certificates
/********************************************************************************************/
function processAccessLogRecord(data) {
  //XSS vulnerable
  let rowdata = undefined;
  rowdata = "<tr>\
  <td>"+epochDate(data[1])+"</td>\
  <td>"+epochTime(data[1])+"</td>\
  <td id='toolong'>"+data[3]+"</td>\
  <td id='toolong'>"+data[2]+"</td>\
  </tr>";
  rowdata = rowdata.replace("", "");
  let table = $("#logHistory")[0];
  table.innerHTML = rowdata + table.innerHTML;
}

/********************************************************************************************
Show success icon
Insert a new certificate checking into the record
/********************************************************************************************/
function processCheckCertResponse(data) {
  console.log("Cert checked");

  let iconVerify = undefined;
  if(!data[6]) {
    iconVerify = "<h6 class='title'>\
                    <button class='btn btn-danger btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i> Expired certificate\
                    </button>\
                  </h6>";
  } else if(data[4].c[0] == data[5].c[0]) {
    iconVerify = "<h6 class='title'>\
                    <button class='btn btn-success btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_check'></i> Valid certificate\
                    </button>\
                  </h6>\
                  <h6 class='title'>Expiration Date: --</h6>";
  } else {
    iconVerify = "<h6 class='title'>\
                    <button class='btn btn-success btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_check'></i> Valid certificate\
                    </button>\
                  </h6>\
                  <h6 class='title'>Expiration Date: " + epochToDateTime(data[5]) + "</h6>";
  }

  rowdata = "<h6 class='title'>Creation Date: " + epochToDateTime(data[4]) + "</h6>\
  <h6 class='title'>Issuer: " + data[1] + "</h6>\
  <h6 class='title'>Type: " + data[2] + "</h6>\
  <h6 class='title'>Title: " + data[3] + "</h6>\
  " + iconVerify;

  rowdata = rowdata.replace("", "");
  let info = $("#certInfo")[0];
  info.innerHTML = rowdata;
}

function processCheckCertErrorResponse(err) {
  iconVerify = "<button class='btn btn-danger btn-round' type='button'>\
                    <i class='now-ui-icons ui-1_simple-remove'></i> "+err+"\
                </button>";
  iconVerify = iconVerify.replace("", "");
  let checking = $("#certInfo")[0];
  checking.innerHTML = iconVerify;
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

function processNewCertErrorResponse(err) {

  iconSended = "<button class='btn btn-danger btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i> "+err+"\
                  </button>";

  iconSended = iconSended.replace("", "");
  let creating = $("#formSend")[0];
  creating.innerHTML = iconSended;
}

/********************************************************************************************
Show success icon
/********************************************************************************************/
function processNewOwnerResponse() {

  console.log("New owner added");
  iconAdded = "<button class='btn btn-success btn-round' type='button'>\
                    <i class='now-ui-icons ui-1_check'></i> Added!\
              </button>";

  iconAdded = iconAdded.replace("", "");
  let creating = $("#formAdd")[0];
  creating.innerHTML = iconAdded;
}

function processNewOwnerErrorResponse(err) {

  console.log("Error: " + err);
  iconAdded = "<button class='btn btn-danger btn-round' type='button'>\
                    <i class='now-ui-icons ui-1_simple-remove'></i> "+err+"\
              </button>";

  iconAdded = iconAdded.replace("", "");
  let creating = $("#formAdd")[0];
  creating.innerHTML = iconAdded;
}

/********************************************************************************************
Show success icon
/********************************************************************************************/
function processEntityToWhiteListResponse() {

  console.log("New entity allowed");
  iconAdded = "<button class='btn btn-success btn-round' type='button'>\
                    <i class='now-ui-icons ui-1_check'></i> Allowed!\
              </button>";

  iconAdded = iconAdded.replace("", "");
  let creating = $("#formAdd")[0];
  creating.innerHTML = iconAdded;
}

function processEntityToWhiteListErrorResponse(err) {

  iconAdded = "<button class='btn btn-danger btn-round' type='button'>\
                    <i class='now-ui-icons ui-1_simple-remove'></i> "+err+"\
              </button>";

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
  if(data[6]) {
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
  if(data[4].c[0] != data[5].c[0]) {
    expDate = epochToDateTime(data[5]);
  } else {
    expDate = "-";
  }

  rowdata = "<tr>\
  <td id='toolong'>"+data[0]+"</td>\
  <td id='toolong'>"+data[1]+"</td>\
  <td>"+data[2]+"</td>\
  <td>"+data[3]+"</td>\
  <td>"+epochToDateTime(data[4])+"</td>\
  <td>"+expDate+"</td>\
  <td>"+iconValid+"</td>\
  </tr>";

  rowdata = rowdata.replace("", "");
  let table = $("#logCert")[0];
  table.innerHTML = rowdata + table.innerHTML;
}

/********************************************************************************************
Add new certificate option to the list of certificates in 
/********************************************************************************************/
function addOptionToManager(certHash,certName) {
  let option = undefined;
  option = "<option id='manageCertHash' value="+certHash+">"+certName+"</option>";

  option = option.replace("", "");
  let opt = $("#titleOption")[0];
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