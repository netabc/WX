// pages/check/check.js
import Bar from "../../resources/public/progressbar/progressbar.js"
var bar = new Bar('canvasArc');
Page({
  data: { pc:"开始"},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数  
  },
  onReady: function () {
    // this.aa(0);
  },
  onShow: function () {
    // 页面显示  
    var that =this;
    bar.addOnListener(function(){
      bar.stop();
      that.setData({ pc: "结束"});
    });
  },
  onHide: function () {
    // 页面隐藏  
  },
  onUnload: function () {
    // 页面关闭  
  },
  pauseContinue:function(e){
    if (this.data.pc=="暂停"){
      bar.puase();
      this.setData({ pc: "继续" });
    } else if (this.data.pc =="继续"){
      bar.restart();
      this.setData({ pc: "暂停" });
    }
  },
  start:function(){
    if (this.data.pc == "结束") {
      this.setData({ pc: "开始" });
      // bar.animation();
      bar.stop();
    } else if (this.data.pc == "开始") {
      bar.start();
      bar.animation();
      this.setData({ pc: "暂停" });
    }
     
  }
})
