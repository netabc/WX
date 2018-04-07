App({
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
    if (this.discovery) {
      wx.stopBluetoothDevicesDiscovery({
        success: function(res) {},
        complete:function(res){
          wx.closeBluetoothAdapter({
            success: function (res) {

            }, fail: function () {

            }
          });
        }
      });
    }else{
      wx.closeBluetoothAdapter({
        success: function (res) {

        }, fail: function () {

        }
      });
    }
   
  },
  globalData: {
    hasLogin: false,
    openid: null,
    bluetooth: {},
    discovery: true,
    userInfo: {}
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
  }
})
