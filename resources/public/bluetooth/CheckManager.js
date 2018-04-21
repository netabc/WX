import * as BluetoothService from 'BluetoothService.js'; 
var getInstance = function () {
  var result;
  return function () {
    return result || (result = new BluetoothService());
  };
}

module.exports={
  getInstance:getInstance,
}