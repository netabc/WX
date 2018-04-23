// pages/welcome/welcome.js
var app = getApp()
import checkManager from "../../resource/bluetooth/CheckManager.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: app.globalData.winWidth,
    winHeight: app.globalData.winHeight,
  },
  /**
   * 跳转到蓝牙搜索页面
   */
  sreachBlue:function(){
    wx.redirectTo({
      url: 'sreachbluetooth',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.globalData.notifyStateChange=function(){
      that.setData({ bluetoothState: checkManager.getBlueState().isCanUsed });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
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
  
  }
})