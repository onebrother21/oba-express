class CreasyAppVarsMgr {
  _creasyConfig = {
    apiKey: "AIzaSyDrVriUAjBONjx06y3NnGJc7tTyzN-5kUw",
    authDomain: "http://localhost:3001/creasy/v1/en",
    senderId: "1098794307295",
    appId: "1:1098794307295:web:6bb0f39b1762f70193e36a"
  };
  _firebaseConfig = {
    apiKey: "AIzaSyDrVriUAjBONjx06y3NnGJc7tTyzN-5kUw",
    authDomain: "cctx-apps.firebaseapp.com",
    projectId: "cctx-apps",
    storageBucket: "cctx-apps.appspot.com",
    messagingSenderId: "1098794307295",
    appId: "1:1098794307295:web:6bb0f39b1762f70193e36a"
  };
  _stripeConfig = {
    apiKey:"pk_test_ErDEtj7JQVsfuMVXmwkq68pj",
    pmtUrl:"http://localhost:3001/creasy/v1/en/payments/checkout"
  };
  _encryptionHash = '9c4e89d6-9676-4e28-aa73-9c26ce3105a8';
  get hash(){return this._encryptionHash;}
  get firebaseConfig(){return this._firebaseConfig;}
  get stripeConfig(){return this._stripeConfig;}
  get creasyConfig(){return this._creasyConfig;}
}
(async function(){
  var loadCreasyVars = function(){return new CreasyAppVarsMgr();}
	window.CreasyVars = loadCreasyVars;
})(window);