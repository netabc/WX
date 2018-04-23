// pages/user/useradd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    woman_image_url:'image/woman_select.png',
    man_image_url: 'image/man_unselect.png',
    radioCheckVal:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }, 
  radioChange(e){
    if (e.detail.value==1){
      this.setData({ woman_image_url: 'image/woman_select.png', man_image_url: 'image/man_unselect.png', radioCheckVal: e.detail.value}) 
    }else{
      this.setData({ woman_image_url: 'image/woman_unselect.png', man_image_url: 'image/man_select.png', radioCheckVal: e.detail.value})
    }
   
  } 
})