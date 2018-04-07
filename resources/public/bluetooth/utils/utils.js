var Promise = require("../../es6-promise.min.js").Promise
/**启动蓝牙适配器 */
var count = 0;
function initBluetooth() {
  console.log("init");
  wx.onBluetoothAdapterStateChange(function (res) {
    console.log("蓝牙状态=" + JSON.stringify(res));
  })
  initAdapter(3);
}
/**关闭蓝牙适配器 */
function destroyBluetooth() {
  wx.closeBluetoothAdapter({
    success: function (res) {
      console.log(res.errMsg);
    },
  })
}
function showModal(title, content, callbak) {
  wx.showModal({
    title: title,
    content: content,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        typeof callbak == "function" && callbak();
      }
    }
  });
}
function initAdapter(count) {
  wx.closeBluetoothAdapter({
    complete: function (res) {
      console.log(count + "次 蓝牙关闭初始化=" + JSON.stringify(res));
    }
  })
  return new Promise(function (resolve, reject) {
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log("蓝牙初始化成功=" + JSON.stringify(res));
        resolve(res);
      },
      fail: function (res) {
        console.log("蓝牙初始化失败1=" + JSON.stringify(res));
        if (res.errCode == 10001) {
          if (count > 0) {
            showModal("蓝牙", "请开启蓝牙", function () {
              initAdapter(--count);
            })
          } else {
            reject(res);
          }
        } else {
          showModal("蓝牙", "暂时不支持:" + res.errMsg);
          reject(res);
        }
      }
    });
  });
}
function getState() {
  return new Promise(function (resolve, reject) {
    wx.getBluetoothAdapterState({
      success: function (res) {
        resolve(res);
      }, fail: function (res) {
        if (res.errCode == 10001) {
          showModal("蓝牙", "请先开启蓝牙");
        } else if (res.errCode == 10000) {
          showModal("蓝牙", "请初始化蓝牙");
        }
        reject(res);
      }
    })
  });
}
function found() {
  return discovery()
    .then(function (res) {
      return new Promise(function (resolve, reject) {
        if (res.isDiscovering && res.errCode == 0) {
          wx.onBluetoothDeviceFound(function (res) {
            console.log("找到设备:" + JSON.stringify(res));
            resolve(res.devices);
          });
        } else {
          console.log("无法找到设备:" + JSON.stringify(res));
          reject(res);
        }
      });
    });
}
function discovery() {
  return getState()
    .then(function (res) {
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          console.log("蓝牙扫描关闭成功=" + JSON.stringify(res));
        }, fail: function (res) {
          console.log("蓝牙扫描关闭失败=" + JSON.stringify(res));
        }
      })
      return new Promise(function (resolve, reject) {
        wx.startBluetoothDevicesDiscovery({
          success: function (res) {
            console.log("蓝牙扫描成功=" + JSON.stringify(res));
            resolve(res);
          }, fail: function (res) {
            console.log("蓝牙扫描失败=" + JSON.stringify(res));
            reject(res);
          }
        })
      });
    }, function (res) {
      console.log("获取蓝牙状态失败=" + JSON.stringify(res));
    });
}
function startDiscovery() {
  console.log("开始扫描。。。");
  return discovery();
}
function findDevices() {
  found()
    .then(function (res) {
      console.log("设备：" + res);
    }, function (res) {
      console.log(JSON.stringify(res));
    });
}
module.exports = { initBluetooth, destroyBluetooth, startDiscovery, findDevices }