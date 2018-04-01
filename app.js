//app.js
// App({
//   onLaunch: function () {
//     // 展示本地存储能力
//     var logs = wx.getStorageSync('logs') || []
//     logs.unshift(Date.now())
//     wx.setStorageSync('logs', logs)

//     // 登录
//     wx.login({
//       success: res => {
//         // 发送 res.code 到后台换取 openId, sessionKey, unionId
//       }
//     })
//     // 获取用户信息
//     wx.getSetting({
//       success: res => {
//         if (res.authSetting['scope.userInfo']) {
//           // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
//           wx.getUserInfo({
//             success: res => {
//               // 可以将 res 发送给后台解码出 unionId
//               this.globalData.userInfo = res.userInfo

//               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//               // 所以此处加入 callback 以防止这种情况
//               if (this.userInfoReadyCallback) {
//                 this.userInfoReadyCallback(res)
//               }
//             }
//           })
//         }
//       }
//     })
//   },
//   globalData: {
//     userInfo: null
//   }
// })
const openIdUrl = require('./config').openIdUrl
var getBluetooth = function (app) {
  // this.get
  /**
   * tooth蓝牙设备信息
   * name、deviceId、RSSI、advertisData、advertisServiceUUIDs、localName
   */
  var tooth = wx.getStorageSync('tooth');
  if (tooth) {
    return { flag: 1, value: tooth.name };
  }
  return { flag: 22, value: "请扫描" };
}
App({
  onLaunch: function () {
    var tooth = getBluetooth(this);
    this.globalData.bluetooth = tooth;
    if (tooth) {
      var code =wx.openBluetoothAdapter({
        success: function (res) {//成功则返回本机蓝牙适配器状态
          //是否正在搜索设备 discovering
          //蓝牙适配器是否可用available
          //成功：ok，错误：详细信息 errMsg
          console.log("discovering:" + discovering + ">>available:" + available + ">>错误信息:" + JSON.stringify(errMsg));
          
        }, fail: function () {
          //接口调用失败的回调函数
        }, complete: function () {
          //接口调用结束的回调函数（调用成功、失败都会执行）
        }
      });

      if (code == 10001){

      }else if(code==10000){

      }
    }
  },
  onShow: function () {
    console.log('App Show')
    
  },
  onHide: function () {
    console.log('App Hide')
    if (this.discovery){
      wx.stopBeaconDiscovery({
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
      wx.closeBluetoothAdapter({
        success: function (res) {

        }, fail: function () {

        }
      });
  },
  globalData: {
    hasLogin: false,
    openid: null,
    bluetooth: {},
    discovery:true
  },
  // lazy loading openid
  getUserOpenId: function (callback) {
    var self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success: function (data) {
          wx.request({
            url: openIdUrl,
            data: {
              code: data.code
            },
            success: function (res) {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.data.openid
              callback(null, self.globalData.openid)
            },
            fail: function (res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail: function (err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  }
})
