class CreasyConnect {
  _data = "a8f89461-a4b7-9e14-be27-431aa14c8197";
  _pi = 3.14151927;
  get pi(){return this._pi;}
  get data(){return this._data;}
  constructor(key,opts){this.publicKey = key;this.options = opts;}
  connect(){console.log("this is my public key",this.publicKey);}
  e(){return Math.E;}
  doThis(n){
    if(typeof n !== "number") return null;
    return this._pi * 5;
  }
  getRates(){return JSON.parse('{"taxRate":0.0825,"taxDomain":"TX"}');}
}
(async function(){
  var loadCreasy = function(key,opts){
    opts = opts || {};
    return new CreasyConnect(key,opts);
  }
	window.Creasy = loadCreasy;
})(window);