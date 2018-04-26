import checkManager from "../../resource/bluetooth/CheckManager.js";
module.exports = {
  connectBlue:function(){

    return new Promise(function(resolve,reject){
      checkManager.connect();
      resolve();
    });
  }
}
