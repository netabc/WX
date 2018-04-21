import Bluetooth  from 'BluetoothService.js'; 
var getInstance = function () {
  var result;
  return function () {
    return result || (result = new Bluetooth());
  };
}

module.exports={
  getInstance:getInstance,
}