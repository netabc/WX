// pages/hostory/main.js
//获取应用实例  
var app = getApp()
import Bar from "../../resource/progressbar/progressbar.js"
const Check = require('../check/check.js')
var bar = new Bar('progressCanvas');
Page({
  data: {
    /** 
     * 页面配置 
     */
    winWidth: app.globalData.winWidth,
    winHeight: app.globalData.winHeight,
    // tab切换  
    currentTab: 1,
    state:'开始检测'
  },
  onLoad: function () {
    var that = this;
    console.log("sssss");
   
    bar.addOnListener(function () {
      bar.stop();
      that.setData({ state: "开始检测" });
    });
  },
  onReady:function(){
    bar.show();
   
  },
  onShow:function(){
    console.log("连接蓝牙");
    Check.connectBlue();
  },

  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else{
      that.setData({ currentTab: e.detail.current });
      this.chooseItem(e.detail.current);
    }
  
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      this.chooseItem(e.detail.current);
    }
    
  },
  chooseItem:function(item){
    switch(item){
      case 0:
        this.hostory();
        break;
      case 1:
        this.check();
        break;
      case 2:
        this.more();
        break;
    }
  },
  checkAndStop:function(){
    if (this.data.state == "暂停检测") {
      bar.puase();
      this.setData({ state: "开始检测" });
    } else if (this.data.state == "开始检测") {
      bar.restart();
      this.setData({ state: "暂停检测" });
    }
  },
  hostory:function(){

  },
  check:function(){

  },
  more:function(){

  },

  
})