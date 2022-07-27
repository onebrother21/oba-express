class OBAConnect {
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
}
(async function(){
  var loadOBA = function(key,opts){
    opts = opts || {};
    return new OBAConnect(key,opts);
  }
	window.OBA = loadOBA;
})(window);