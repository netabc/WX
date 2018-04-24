import Bluetooth from 'BluetoothService.js';
const METHOD = {
  init: 'init',
  search: 'search',
  connect: 'connect',
  write: 'write',
  addOnAdapterStateListener: 'addOnAdapterStateListener',
  addOnProgressListener: 'addOnProgressListener',
  addOnFindDeviceListener: 'addOnFindDeviceListener',
  addOnFindedDevicesListener: 'addOnFindedDevicesListener',
  addOnConnectStateListener: 'addOnConnectStateListener',
  addOnFindServiceListener: 'addOnFindServiceListener',
  addOnDeviceCharacteristicListener: 'addOnDeviceCharacteristicListener',
  addOnReceivedDataListener: 'addOnReceivedDataListener'
}
class CheckManager {
  static sss = 0;
  constructor() {
    if (!this.bluetooth) {
      this.bluetooth = new Bluetooth();
    }
    this.devices = [];
    console.log("创建了多少次" + (++CheckManager.sss));
  }
  getBlueState() {
    return {
      isDiscovering: this.bluetooth.discovering,
      isAvailable: this.bluetooth.available,
      isCanUsed: this.bluetooth.isCanUsed,
      isFonding: this.bluetooth.isFonding,
      isConnected: this.bluetooth.isFonding,
      isReadable: this.bluetooth.isReadable,
      isWirteable: this.bluetooth.isWirteable,
      isReading: this.bluetooth.isWirteable
    };
  }
  init() {
    this.bluetooth.init();
  }

  discoveryDevices() {

    this.bluetooth.searchBlue();
  }


  getConnectedDevice() {
    this.bluetooth.getConnectedDevices()
      .then(res => {
        console.log("输出：" + JSON.stringify(res));
      }).catch(res => {
        console.log("输出：" + JSON.stringify(res));
      });
  }

  getDevices() {
    var that = this;
    return that.bluetooth.getDevices()
      .then(devices => {
        var arr = [];
        for (var i = 0; i < devices.length; i++) {
          //{ id: '0', deviceName: '小米', deviceId: '32:43:32:22:32:32', isConnect: "已连接", }
          arr.push({ id: i, deviceName: devices[i].name, deviceId: devices[i].deviceId, isConnect: '' });
        }
        return new Promise(function (resolve, reject) {
          var res = that.removeRepait(arr)
          that.devices = res;
          resolve(res)
        });
      }).catch(res => {
        console.log("输出：" + JSON.stringify(res));
      });
  }
  getServices() {
    var that = this;
    return that.bluetooth.getDeviceServices()
      .then(services => {
        return new Promise(function (resolve, reject) {
          var arr;
          services.forEach((service, i) => {
            console.log("服务：uuid=" + service.uuid + ",isPrimary=" + service.isPrimary);
            var info = service.uuid.slice(4, 8);
            if (info == 'FEE0' || info == 'fee0') {
              that.serviceId = service.uuid;
            }
          });
          resolve(that.serviceId);
        });
      }).catch(res => {
        console.log("输出：" + JSON.stringify(res));
      });;
  }
  conncetBlue(deviceId) {
    var that = this;
    that.bluetooth.disconnectBlue(that.deviceId)
      .then(function () {
        that.bluetooth.addOnFindServiceListener(function () {
          that.getServices().then(uuid => {
            console.log('打开的接口', uuid);
            return that.bluetooth.getDeviceCharacteristic(deviceId, uuid);
          }).then(characteristics => {
            that.characteristic = characteristics;
            console.log("特征值提取-->", characteristics);
          });
        });
        that.bluetooth.connectBlue(deviceId).then(sta => {
        });
      });
    that.deviceId = deviceId;
  }
  search() {

  }
  stopSearch() {
    this.bluetooth.stopSearchBlue();
  }
  connect() { }
  write() { }
  addOnAdapterStateListener(callback) {
    this.bluetooth.addOnAdapterStateListener(callback);
  }
  addOnProgressListener(callback) {
    this.bluetooth.addOnProgressListener(callback);
  }
  addOnFindDeviceListener(callback) {
    this.bluetooth.addOnFindDeviceListener(callback);
  }
  addOnFindedDevicesListener() {
    this.bluetooth.addOnFindedDevicesListener(callback);
  }
  addOnConnectStateListener() {
    this.bluetooth.addOnConnectStateListener(callback);
  }
  addOnFindServiceListener() {

  }
  addOnDeviceCharacteristicListener() {
    this.bluetooth.addOnDeviceCharacteristicListener(callback);
  }
  addOnReceivedDataListener() {
    this.bluetooth.addOnReceivedDataListener(callback);
  }

  removeRepait(arr) {
    let result = [];
    arr = arr.sort();
    arr.forEach((device, i) => {
      if (result.length == 0) {
        result.push(device)
      } else {
        result.forEach((d, j) => {
          if (d.deviceId != device.deviceId) {
            result.push(device)
          }
        });
      }
    })
    return result;
  }
}
export default new CheckManager
export { METHOD }