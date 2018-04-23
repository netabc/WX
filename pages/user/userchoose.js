// pages/user/userchoose.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cunrentSelcted: true, 
    currentId: 0,
    winWidth: app.globalData.winWidth,
    winHeight: app.globalData.winHeight,
    userinfos: [
      { id:0, username: "新人", birthday: '1965年1月8日', sex: 1, empty: true },
      { id:1, username: "母亲", birthday: '1965年1月8日', sex: 1, empty: false, phone: 18923456721 },
      { id:2, username: "哥哥", birthday: '1965年1月8日', sex: 2, empty: false, phone: 18923456721 },
      { id:3, username: "弟弟", birthday: '1965年1月8日', sex: 2, empty: false, phone: 18923456721 },
      { id:4, username: "父亲", birthday: '1965年1月8日', sex: 2, empty: false, phone: 18923456721 },
    ],
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

  userAdd: function (e) {
    console.log(JSON.stringify(e))
    this.setData({ cunrentSelcted: true, currentId: e.currentTarget.dataset.id});
    if (e.currentTarget.dataset.id==0){
      wx.navigateTo({
        url: 'useradd',
      })
    }
  }
})