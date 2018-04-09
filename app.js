App({
  onLaunch: function () {
    this.initBluetooth();
    console.log('App Launch')
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
