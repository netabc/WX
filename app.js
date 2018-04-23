import checkManager from "resources/public/bluetooth/CheckManager.js";
App({
  onLaunch: function () {
   // this.initBluetooth();
    console.log('App Launch')
  },
  onShow: function () {
   // console.log('App Show')
    checkManager.addOnAdapterStateListener(function(state){
      console.log("初始化状态:"+state);
    });
    checkManager.init();
    console.log(JSON.stringify(checkManager.getBlueState()));
  },
  onHide: function () {
    //this.closeBluetooth();
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
