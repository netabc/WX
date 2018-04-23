// pages/welcome/sreachbluetooth.js
var app = getApp()
import checkManager from "../../resource/bluetooth/CheckManager.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cunrentSelcted: true,
    currentId: 0,
    winWidth: app.globalData.winWidth,
    winHeight: app.globalData.winHeight,
    devices: [{ id: '0', deviceName: '小米', deviceId: '32:43:32:22:32:32',isConnect:"已连接", },
      { id: '1', deviceName: '小米', deviceId: '32:43:32:22:32:32', isConnect: "", },
      { id: '2', deviceName: '小米', deviceId: '32:43:32:22:32:32', isConnect: "", }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    checkManager.getConnectedDevice();
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
  connectTo: function (e) {
    console.log("sssssss" + JSON.stringify(e));
    this.modifyConnect(this.data.currentId,"");   
    this.setData({ cunrentSelcted: true, currentId: e.currentTarget.dataset.id });
    this.modifyConnect(e.currentTarget.dataset.id, "正在连接");
  },

  modifyConnect:function(id,value){
    var that = this;
    if (that.data.devices && that.data.devices.length>0){
      for (var i=0; i < that.data.devices.length;i++){
        if (id == that.data.devices[i].id){
          that.data.devices[i].isConnect=value;
        }
      }
    }
    that.setData({devices:that.data.devices});
  }
})