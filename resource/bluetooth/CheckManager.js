import Bluetooth  from 'BluetoothService.js';
const METHOD = {
  init: 'init',
  search: 'search',
  connect: 'connect',
  write: 'write',
  addOnAdapterStateListener:'addOnAdapterStateListener',
  addOnProgressListener: 'addOnProgressListener',
  addOnFindDeviceListener: 'addOnFindDeviceListener',
  addOnFindedDevicesListener: 'addOnFindedDevicesListener',
  addOnConnectStateListener: 'addOnConnectStateListener',
  addOnFindServiceListener: 'addOnFindServiceListener',
  addOnDeviceCharacteristicListener: 'addOnDeviceCharacteristicListener',
  addOnReceivedDataListener: 'addOnReceivedDataListener'
}
class CheckManager{
  static sss=0;
  constructor(){
    if (!this.bluetooth){
      this.bluetooth = new Bluetooth();
    }
    console.log("创建了多少次" + (++CheckManager.sss));
  }
  getBlueState(){
    return {
      isCanUsed: this.bluetooth.isCanUsed,
      isFonding: this.bluetooth.isFonding,
      isConnected: this.bluetooth.isFonding,
      isReadable: this.bluetooth.isReadable,
      isWirteable: this.bluetooth.isWirteable,
      isReading: this.bluetooth.isWirteable
    };
  }
  init(){
    this.bluetooth.init();
  }

  discoveryDevices(){
    this.bluetooth.searchBlue();
  }
  

  getConnectedDevice(){
    this.bluetooth.getConnectedDevices()
    .then(res=>{
        console.log("输出："+JSON.stringify(res));
    }).catch(res=>{
        console.log("输出：" + JSON.stringify(res));
    });
  }

  search() { }
  connect() { }
  write() { }
  addOnAdapterStateListener(callback) { 
    this.bluetooth.addOnAdapterStateListener(callback);
  }
  addOnProgressListener(callback) { 
    this.bluetooth.addOnProgressListener(callback);
  }
  addOnFindDeviceListener() { 
    this.bluetooth.addOnFindDeviceListener(callback);
  }
  addOnFindedDevicesListener() {
    this.bluetooth.addOnFindedDevicesListener(callback);
   }
  addOnConnectStateListener() { 
    this.bluetooth.addOnConnectStateListener(callback);
  }
  addOnFindServiceListener() { 
    this.bluetooth.addOnFindServiceListener(callback);
  }
  addOnDeviceCharacteristicListener(){
    this.bluetooth.addOnDeviceCharacteristicListener(callback);
  }
  addOnReceivedDataListener(){
    this.bluetooth.addOnReceivedDataListener(callback);
  }
}
export default new CheckManager
export { METHOD }