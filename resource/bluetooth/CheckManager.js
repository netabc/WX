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
  connect(){
    var that =this;
    if (that.deviceId){
      that.conncetBlue(that.deviceId);
    }else{
      wx.redirectTo({
        url: '../../pages/welcome/sreachbluetooth',
      })
    }
  }
  init() {
    this.bluetooth.init();
  }

  discoveryDevices() {
    if (this.bluetooth.discovering){
      this.bluetooth.stopSearchBlue();
    }
    this.bluetooth.searchBlue();
  }

  startCounter() {
    // clearInterval();
    var that = this;
    if (that.startCheck) {
      if (that.rightCheckCount == 10) {
        that.leftCheckCount++;
        if (that.leftCheckCount == 12 || (that.leftCheckCount == 11 && that.checkAage < 12)) {
          that.startCheck = false;
          that.checkFinish = true;
          clearInterval(startCounter);
        } else {
          that.rightCheckCount = 1;
        }
      } else {
        that.rightCheckCount++;
      }
    }
  }
  start() {
    if (!that.checkStart) {
      that.bluetooth.writeBlue('aa');
      that.checkStart = true;
      setInterval(this.doWhile.bind(this), 100)
    }
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
            console.log("特征值提取-->", characteristics);
            characteristics.forEach((characteristic, i) => {
              let uuid = characteristic.uuid;
              let id = uuid.slice(4, 8);
              if ('FEE1' == id || 'fee1' == id) {
                if (that.characteristicId != uuid) {
                  that.bluetooth.notifyCharacteristicChange(deviceId, that.serviceId, uuid);
                }
                that.characteristicId = uuid;
                that.notycharacteristicsId = uuid;
              }
              if ('FEE2' == id || 'fee2' == id) {
                if (that.characteristicId != uuid) {
                  that.bluetooth.notifyCharacteristicChange(deviceId, that.serviceId, uuid);
                }
                that.characteristicId = uuid;
              }
            })
          });
        });
        that.bluetooth.connectBlue(deviceId).then(sta => {
          that.addOnReceivedDataListener();
        });
      });
    that.deviceId = deviceId;
  }
  doWhile() {
    var that = this;
    if (that.isReceiveData) {
      that.isReceiveData = false;
      if (that.checkStart) {
        let received = that.bluetooth.cacheData;
        let sendCmd = 'aa';
        if (received.indexOf('0x2a') == 0 && received.lastIndexOf('0x0a') == 85) {

          let valuef = that.hex2Float(received);
          if (2.10 - valuef[0] >= 0.2 || 2.10 - valuef[1] >= 0.2 ||
            2.10 - valuef[2] >= 0.2 || 2.10 - valuef[3] >= 0.2 ||
            2.10 - valuef[4] >= 0.2) {
            if (!that.checkStarting) {
              that.checkStarting = true;
              sendCmd = 'bb';//开始
            }
            if (that.checkPause){
              sendCmd = 'dd';//继续
              that.checkPause =false;
            }

          }else{
            that.checkPause = true;
            sendCmd = 'cc' //时间计时暂停指令
          }
        } else {
          if (received.indexOf('0xbb') >= 0 || received.indexOf('0xcc') >= 0 || received.indexOf('0xdd') >= 0) {//接收到开始、暂停、继续
              //暂停

          } else {//其他指令
          
          }
          console.log('状态：' + received);
        }
        
        setTimeout(function () {
          that.bluetooth.writeBlue(sendCmd);
        }, 50);
      } else {
        clearInterval(that.doWhile);
        that.bluetooth.writeBlue('ee');
        setTimeout(function () {
          that.bluetooth.writeBlue('ff');
        }, 500);
      }
    }
  }
  search() {

  }
  stopSearch() {
    this.bluetooth.stopSearchBlue();
  }
  connect() { }
  // write() { }
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
    var that = this;
    that.bluetooth.addOnReceivedDataListener(function (received) {
      that.isReceiveData = true;


      // if (that.checkFinish) {//检测完成
      //     that.wirte('ee');
      //     setTimeout(function () {
      //       that.wirte('ff');//归0
      //     }, 500);
      //   } else {//检测开始
      //     setTimeout(function(){
      //       that.wirte('aa')
      //     },100);
      //   }
      // if (received.indexOf('0x2a') == 0 && received.lastIndexOf('0x0a') == 85) {
      //   let valuef = that.hex2Float(received);
      //   if (2.10 - valuef[0] >= 0.2 || 2.10 - valuef[1] >= 0.2 ||
      //     2.10 - valuef[2] >= 0.2 || 2.10 - valuef[3] >= 0.2 ||
      //     2.10 - valuef[4] >= 0.2) {

      //     if (!that.startCheck) {
      //       that.wirte('bb');
      //       that.startCheck = true;
      //     }

      //     if (that.checkPause) {//暂停状态
      //       that.checkPause = false;
      //       that.write('dd');
      //     }


      //   } else {
      //     if (that.startCheck) {
      //       that.checkPause = true;
      //       that.write('cc');
      //     }
      //   }
      // }



      // console.log('接受数据<<<<' + received);
      // that.wirte('aa');
      //     // getReceiveData().then(function(rec){

      //     //   return new Promise(function(resolve,reject){
      //     //     if (that.checkPause){
      //     //       resolve('cc');//暂停命令
      //     //     } else if (that.checkStop){
      //     //       resolve('ee');//停止命令
      //     //     } else if (that.checkFinish){
      //     //       resolve('ff');//重置命令
      //     //     } else if (that.checkContinue){
      //     //       resolve('dd');//继续命令
      //     //     }else if(that.checkStart){
      //     //       resolve('bb');//开始命令
      //     //     }
      //     //   });

      //     // });
      //       // setTimeout(function(){
      //       //   that.wirte('aa');
      //       // },1000);
      //       // that.doData(received)
      //       // .then(function (msg) {
      //       //   console.log("处理成功" + msg)
      //       // }, function (msg) {
      //       //   console.log("处理失败" + msg)
      //       // });
    });
  }
  doData(data) {
    var that = this;
    let received = data;
    // console.log('接受数据<<<<' + received);
    // setTimeout(function () {
    //   // if (that.checkFinish) {//检测完成
    //   //   that.wirte('ee');
    //   //   setTimeout(function () {
    //   //     that.wirte('ff');//归0
    //   //   }, 500);
    //   // } else {//检测开始

    //   // }
    //   that.wirte('aa');
    // }, 10000);

    // return new Promise(function(resolve,reject){
    //   console.log('接受数据<<<<' + received);
    //   setTimeout(function(){
    //     if (that.checkFinish) {//检测完成
    //       that.wirte('ee');
    //       setTimeout(function () {
    //         that.wirte('ff');//归0
    //       }, 500);
    //     } else {//检测开始
    //       that.wirte('aa');
    //     }
    //   },2000);
    //   resolve(received);

    // if (received.indexOf('0x2a') == 0 && received.lastIndexOf('0x0a') == 85) {
    //   let valuef = that.hex2Float(received);
    //   if (2.10 - valuef[0] >= 0.2 || 2.10 - valuef[1] >= 0.2 ||
    //     2.10 - valuef[2] >= 0.2 || 2.10 - valuef[3] >= 0.2 ||
    //     2.10 - valuef[4] >= 0.2) {

    //     if (!that.startCheck) {
    //       that.wirte('bb');
    //       that.startCheck = true;
    //     }

    //     if (that.checkPause) {//暂停状态
    //       that.checkPause = false;
    //       that.write('dd');
    //     }


    //   } else {
    //     if (that.startCheck) {
    //       that.checkPause = true;
    //       that.write('cc');
    //     }
    //   }
    // }
    // resolve(data);
    // });

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
  hex2Float(arr) {
    let valuef = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    let data = arr.split(' ');
    for (var i = 0; i < valuef.length - 1; i++) {
      var f = parseFloat(String.fromCharCode(data[1 + (i * 3)]) + "." + String.fromCharCode(data[2 + (i * 3)]) + String.fromCharCode(data[3 + (i * 3)]))
      valuef[i] = f;
      valuef[5] += f;
    }
    return valuef;
  }
}
export default new CheckManager
export { METHOD }