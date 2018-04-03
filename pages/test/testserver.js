// pages/test/testserver.js
Page({
  /**
   * 页面的初始数据
   * ?user_id=1&value=999
   * ?user_id=1
   */
  data: {
    url_save:"http://192.168.1.109:8080/Phone/Controller/testUp",
    url_get:"http://192.168.1.109:8080/Phone/Controller/testDown",
    param:{}
  },
  userid: function (e) {
    // this.setData({
    // param: { user_id:  }
    // })
    this.data.param.user_id = e.detail.value;
  },
  inputdata:function(e){
    this.data.param.value = e.detail.value;
  },
  sendData:function(e){
    var that =this ;
    console.log(JSON.stringify(that.data.param));
    wx.request({
      url: that.data.url_save + "?user_id=" + this.data.param.user_id+"&value="+this.data.param.value,
        method:"GET",
        header:{
          'Content-Type': "application/json", 
        },
        success:function(res){
          // var data = JSON.parse(res.data.trim())
          wx.showModal({
            title: '返回',
            content: res.data,
          })

          // wx.setStorageSync('sessionid', data.sessionid);
        }
    })
  },
  getData: function (e){
    var that = this;
    console.log(JSON.stringify(that.data.param));
    wx.request({
      url: that.data.url_get + "?user_id=" + this.data.param.user_id,
      method: "GET",
      header: {
        'Content-Type': "application/json",
      },
      success: function (res) {
        // var data = JSON.parse(res.data.trim())
        console.log("data=" + res.data);
        // wx.setStorageSync('sessionid', data.sessionid);
        wx.showModal({
          title: '返回',
          content: res.data,
        })
      }
    })
  }
})