
// ===================================================
// Promises
// ===================================================

const getCoinbasePromise = function(){
    return new Promise(function(resolve, reject){
      web3.eth.getCoinbase(function(err, res){
        if (!res) {
          reject("No accounts found");
        } else {
          resolve(res);
        }
      });
    });
}

const getNetworkPromise = function() {
    return new Promise(function(resolve, reject){
      // Check which Ethereum network is used
      web3.version.getNetwork(function(err, res){
        let selectedNetwork = "";
  
        if (!err) {
          if(res > 1000000000000) {
            // I am not sure about this. I maybe wrong!
            selectedNetwork = "Testrpc";
          } else {
            switch (res) {
              case "1":
                selectedNetwork = "Quorum de Eneko";
                break
              case "2":
                selectedNetwork = "Morden";
                break
              case "3":
                selectedNetwork = "Ropsten";
                break
              case "4":
                selectedNetwork = "Rinkeby";
                break
              default:
                selectedNetwork = "Unknown network = "+res;
            }
          }
          resolve(selectedNetwork);
        } else {
          reject("getBlockTransactionCountPromise: "+err);
        }
      });
    });
  }