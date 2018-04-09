// app.js
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

//         this.login({ username: "aaa", password: "userpase", data: [{ userid: "da11", src: wx.base64ToArrayBuffer("base64")}]});
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
//               //

//               console.log("返回数据："+JSON.stringify(res.userInfo));
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
//   },
// //  lazy loading openid
//   getUserOpenId: function (callback) {
//     var self = this

//     if (self.globalData.openid) {
//       callback(null, self.globalData.openid)
//     } else {

//       wx.login({
//         success: function (data) {
//           wx.request({
//             url: openIdUrl,
//             data: {
//               code: data.code
//             },
//             success: function (res) {
//               console.log('拉取openid成功', res)
//               self.globalData.openid = res.data.openid
//               callback(null, self.globalData.openid)
//             },
//             fail: function (res) {
//               console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
//               callback(res)
//             }
//           })
//         },
//         fail: function (err) {
//           console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
//           callback(err)
//         }
//       })
//     }
//   },
//   login:function(param){
//       wx.request({
//         url: this.requestUrl('User/login'),
//         method:"POST",
//         data:param,
//         dataType:"json",
//         header:{
//           'Content-Type': "application/json", 
//         },
//         success:function(res){
//           // var data = JSON.parse(res.data.trim())
//           console.log("data="+res.data);
//           // wx.setStorageSync('sessionid', data.sessionid);
//         }
//       })
//   },
//   requestUrl:function(url){
//     //"http://192.168.1.109:8080/Phone/Controller/test?test=sss";
//     return "http://127.0.0.1:3000/OLife/"+url;
//   }
// })
const openIdUrl = require('./config').openIdUrl
var getBluetooth = function (app) {
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
    this.initBluetooth();
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    this.closeBluetooth();
  },
  globalData: {
    hasLogin: false,
    openid: null,
    bluetooth: {},
    discovery: true,
    userInfo: {},
    available:false,
  },
  getUserInfo: function (cb) {
    var that = this
    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.login({
        success: function (r) {
          wx.getUserInfo({
            success: function (res) {
              console.log("ssssss");
              that.login({
                code: r.code,
                iv: res.iv,
                encryptedData: encodeURIComponent(res.encryptedData)
              });
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo);
            }
          })
        }
      })
    }
  },
  login: function (param) {
    wx.request({
      url: this.requestUrl('User/login'),
      data: param,
      header: {
        'Content-Type': "application/json",
      },
      success: function (res) {
        var data = JSON.parse(res.data.trim())
        wx.setStorageSync('sessionid', data.sessionid);
      }
    })
  },
  requestUrl: function (url) {
    return "http://127.0.0.1:3000/OLife" + url;
  },
  initBluetooth: function () {
    var that = this;
    wx.showLoading({
      title: '初始化蓝牙',
    })
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log("初始化蓝牙成功");
        wx.getBluetoothAdapterState({
          success: function (res) {
            if (res.available) {
              that.toast("蓝牙可用");
            } else {
              that.toast("蓝牙不可用");
            }
            typeof that.globalData.myCallback == "function"&&that.globalData.myCallback(res.available);
          },
        })
        wx.onBluetoothAdapterStateChange(function (res) {
         
          if (res.available) {
            that.toast("蓝牙可用");
          } else {
            that.toast("蓝牙不可用");
          }
          typeof that.globalData.myCallback == "function" && that.globalData.myCallback(res.available);
        })
      },
      fail: function () {
        that.showErrorMsg("请打开蓝牙", function () {
          console.log("正在重试 重新打开蓝牙");
          that.initBluetooth()
        });
      }, complete: function () {
        wx.hideLoading();
      }
    })
  },
  closeBluetooth: function () {
    wx.closeBluetoothAdapter({
      success: function (res) {
        console.log("关闭成功");
      }, fail: function () {
        console.log("关闭失败");
      }
    })
  },
  toast: function (msg) {
    wx.showToast({
      title: msg,
      duration: 1000,
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  showErrorMsg: function (err, callback) {
    wx.showModal({
      title: '错误',
      content: err,
      success: function (res) {
        if (res.confirm) {
          console.log('确定')
          callback();
          typeof callback == "function" &&
            console.log('确定');
        } else if (res.cancel) {
          console.log('取消')
          typeof callback == "function";
        }
      }
    })
  }
})
