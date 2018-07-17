pragma solidity ^0.4.13;

contract Certifikate {
    
    struct Certificate {
        address[] ownerList;    // Public address of the certificate's owner (user or entity)
        address issuer;         // Public address of the entity who issues the certificate
        string certName;        // Name of the certificate issued
        string certType;        // Short description of the certificate
        address[] whiteList;    // List of authorized entities to check the certificate
        uint creationDate;
        uint expirationDate;
        bool isStilValid;
    }

    struct User {
        //bytes10 type;           // Type of user: Entity or Individual
        bytes32 name;               // Owner's name
        //bytes32 surnames;       // Owner's surnames
        bytes9 nid;                 // Owner's national identity document
        bytes32[] ownCertsList;     // List of certificates owned by that user
        bytes32[] accessLogList;
    }

    struct AccessLog {
        uint date;              // Timestamp of the access
        address user;           // Address of the user who applies for the verification
        bytes32 certificate;    // Hash of the certificate which was verified
        // bool hadSuccess;
    }

    uint public nounce;
    address creator;
    
    mapping(bytes32 => AccessLog) public accessLogs;  // This creates an array with all the certificates
    mapping(bytes32 => Certificate) public certs;  // This creates an array with all the certificates

    mapping(address => User) public users;
    
    
    
    /********************************************Events******************************************
    Useful for saving information about blocks
    /********************************************************************************************/
    
    // event certList(bytes32[] certUnique);
    // event newCertCreated(bytes32 certUnique,  address sender, string certType, string certName, uint creationDate, uint expirationDate);
    // event checkOk(bytes32 certUnique, address sender, uint creationDate, bool success);



    /******************************************Modifiers*****************************************
    Useful for validating inputs
    /********************************************************************************************/
    
    /********************************************************************************************
    Check whether the sender is the really him*/
    modifier onlyUser(address add) {require(msg.sender == add/*, "Only creator can call this."*/); _;}

    /********************************************************************************************
    Check whether the sender is the creator of the contract*/
    modifier onlyCreator() {require(msg.sender == creator/*, "Only creator can call this."*/); _;}

    /********************************************************************************************
    Check whether the sender is the issuer of the certificate*/
    modifier onlyIssuer(address issuer) {require(msg.sender == issuer/*, "Only issuer can call this."*/); _;}

    /********************************************************************************************
    Check whether the sender is an owner of the certificate*/
    modifier onlyOwner(bytes32 certUnique) {
        bool isOwner = false;
        for (uint i = 0; i < certs[certUnique].ownerList.length; i++) {
            if(certs[certUnique].ownerList[i] == msg.sender) {
                isOwner = true;
                break;
            }
        }
        require(isOwner);
        _;
    }

    /********************************************************************************************
    Check whether the certificate has expired*/
    modifier afterExpirationDate(bytes32 certUnique) {
        if (now >= certs[certUnique].expirationDate && certs[certUnique].expirationDate != certs[certUnique].creationDate)
        _;
    }



    /***************************************Initializations**************************************/
    /********************************************************************************************
    Initializes contract with initial supply tokens to the creator of the contract
    /********************************************************************************************/
    function ConstructorCertifikate() public {
        nounce = 0;
        creator = msg.sender;
    }



    /************************************Getters and Setters*************************************/
    /********************************************************************************************
    Get creator address
    /********************************************************************************************/
    function getCreator() public view returns (address) {
        return creator;
    }

    /********************************************************************************************
    Get my own address
    /********************************************************************************************/
    function getMyAddress() public view returns (address) {
        return msg.sender;
    }

    /********************************************************************************************
    Create a new entity

    add             Addres of the new entity
    entityName      Name of the new entity
    /********************************************************************************************/
//    function setEntity(address add, bytes32 entityName) public {
//        entities[add].name = entityName;
//    }

    /********************************************************************************************
    Create a new user

    add             Addres of the new user
    userName        Name of the new user
    userNid         New user's National Identity Card number
    /********************************************************************************************/
    function setUser(address _add, bytes32 _userName, bytes9 _userNid) public returns (bool success) {
        users[_add].name = _userName;
        users[_add].nid = _userNid;
        return (true);
    }

    /********************************************************************************************
    Get the list of certificates owned by a user
    /********************************************************************************************/
    function getCertList() public view returns (bytes32[] ownCertsList) {
        return (users[msg.sender].ownCertsList);
    }

    /********************************************************************************************
    Get a certificate by knowing its hash
    /********************************************************************************************/
    function getCertByHash(bytes32 certUnique) public view returns (bytes32, address, string, string, uint, uint, bool) {
        return (certUnique,
        certs[certUnique].issuer, 
        certs[certUnique].certType, 
        certs[certUnique].certName,
        certs[certUnique].creationDate,
        certs[certUnique].expirationDate,
        certs[certUnique].isStilValid);
    }

    /********************************************************************************************
    Get the access log list of certificates
    /********************************************************************************************/
    function getAccessLogList() public view returns (bytes32[] accessLogList) {
        return (users[msg.sender].accessLogList);
    }

    /********************************************************************************************
    Get an access log by knowing its hash
    /********************************************************************************************/
    function getAccessLogByHash(bytes32 accessLogUnique) public view returns (bytes32, uint, address, bytes32) {
        return (accessLogUnique,
        accessLogs[accessLogUnique].date, 
        accessLogs[accessLogUnique].user, 
        accessLogs[accessLogUnique].certificate);
    }

    /********************************************************************************************
    Get a user's last certificate
    /********************************************************************************************/
    function getLastCert() public view returns (bytes32) {
        return (users[msg.sender].ownCertsList[users[msg.sender].ownCertsList.length-1]);
    }

    /********************************************************************************************
    Get the name of an entity by its address

    add             Address of the entity to be searched
    /********************************************************************************************/
//    function getEntityByAddress(address add) constant public returns (bytes32) {
//        return entities[add].name;
//    }

    /********************************************************************************************
    Get the info of a user by his address

    add             Address of the user to be searched
    /********************************************************************************************/
    function getUserByAddress(address add) public view returns (bytes32, bytes9) {
        return (users[add].name, users[add].nid);
    }

    //TODO: Get entity's and user's address by them names, if it's possible





    /*****************************************Functions*****************************************/
    /********************************************************************************************
    Create a new certificate to the blockchain

    _to             Address of new certificate's owner
    certName        Name of the new certificate
    certType        NType of the new certificate
    duration        Duration of the certificate's validity (seconds)
    /********************************************************************************************/
    function newCert(address _to, string _certType, string _certName, uint _duration) public returns (bool success) {
        require(msg.sender != _to);
        bytes32 certUnique = keccak256(msg.sender, nounce++, _certName);
        // Addidng information

        certs[certUnique].issuer = msg.sender;
        certs[certUnique].certType = _certType;
        certs[certUnique].certName = _certName;
        certs[certUnique].creationDate = now;
        certs[certUnique].expirationDate = certs[certUnique].creationDate + _duration;
        certs[certUnique].isStilValid = true;

        addOwner(certUnique, _to);
        addOwner(certUnique, msg.sender);
        
        return true;
    }

    /********************************************************************************************
    Add new owner to a certificate

    certUnique          Hash of the certificate is gonna check
    newOwner            Address of the new owner to be added
    /********************************************************************************************/
    function addOwner(bytes32 _certUnique, address _newOwner) public onlyIssuer(certs[_certUnique].issuer) returns (bool success) {
        certs[_certUnique].ownerList.push(_newOwner);         // Adding owner to the certificate
        users[_newOwner].ownCertsList.push(_certUnique);      // Adding certificates to the owner list
        certs[_certUnique].whiteList.push(_newOwner);         // The owner is allowed to check his own certificate
        return true;
    }

    /********************************************************************************************
    Check whether a certificate exist

    certUnique          Address of the certificate is gonna check
    /********************************************************************************************/
    function checkCert(bytes32 certUnique) public view returns (bool success) {
        // Check if certificate exist
        if (isSenderInTheWhiteList(certUnique)) {
            return true;
        }
        return false;
    }

    /********************************************************************************************
    Check whether the sender is allowed to check a certificate existence

    certUnique        Address of the certificate is gonna be checked
    /********************************************************************************************/
    function isSenderInTheWhiteList(bytes32 certUnique) public view returns (bool isAllowed) {
        for (uint i = 0; i < certs[certUnique].whiteList.length; i++) {
            if (certs[certUnique].whiteList[i] == msg.sender) {
                return(true);
            }
        }
        return (false);
    }

    /********************************************************************************************
    Check if the certificate is expired

    certUnique        Address of the certificate is gonna be checked
    /********************************************************************************************/
    function checkExpiration(bytes32 _certUnique) public afterExpirationDate(_certUnique) returns (bool isValid) {
        certs[_certUnique].isStilValid = false;
        return false;
    }
    
    /********************************************************************************************
    Add an entity to the whiteList

    certUnique          Address of the certificate is gonna check
    _newEntity          Address of the entity is gonna be added to the list
    /********************************************************************************************/
    function setEntityToWhiteList(bytes32 _certUnique, address _newEntity) public onlyOwner(_certUnique) returns (bool success) {
        if(msg.sender != _newEntity) {
            certs[_certUnique].whiteList.push(_newEntity);
            return true;
        }
        return false;
    }

    /********************************************************************************************
    Insert a new access log in the history registration

    certUnique          Address of the certificate is gonna regist
    /********************************************************************************************/
    function insertHistory(bytes32 _certUnique) public returns (bool success) {
        bytes32 accessLogUnique = keccak256(msg.sender, _certUnique);
        accessLogs[accessLogUnique].date = now;
        accessLogs[accessLogUnique].user = msg.sender;
        accessLogs[accessLogUnique].certificate = _certUnique;
        for (uint i = 0; i < certs[_certUnique].ownerList.length; i++) {
            users[certs[_certUnique].ownerList[i]].accessLogList.push(accessLogUnique);
        }
        return true;
    }

    /********************************************************************************************
    Remove a certificate

    certUnique          Address of the certificate is gonna check
    /********************************************************************************************/
    function removeCertificate(bytes32 _certUnique) public onlyOwner(_certUnique) returns (bool success) {
        if(msg.sender == certs[_certUnique].issuer) {
            certs[_certUnique].isStilValid = false;
            return true;
        }
        return false;
    }

    function kill() public onlyCreator {
        selfdestruct(creator);      // kills this contract and sends remaining funds back to creator
    }
}