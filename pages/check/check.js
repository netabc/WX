// pages/check/check.js
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数  
  },
  onReady: function () {

    // 页面渲染完成  
    var cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。  
    cxt_arc.setLineWidth(10);
    cxt_arc.setStrokeStyle('#d2d2d2');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径  
    cxt_arc.arc(106, 106, 100, 0, 2 * Math.PI, false);//设置一个原点(106,106)，半径为100的圆的路径到当前路径  
    cxt_arc.stroke();//对当前路径进行描边  

    cxt_arc.setLineWidth(10);
    cxt_arc.setStrokeStyle('#3ea6ff');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径  
    cxt_arc.arc(106, 106, 100, 0, Math.PI * 30/360, false);
    cxt_arc.stroke();//对当前路径进行描边  
    cxt_arc.draw();
    // function rotate(){
    //   cxt_arc.rotate( Math.PI / 53)
    //   cxt_arc.draw();
    //   setTimeout(function () {
    //     rotate();
    //   }, 200);
    // }
    
    // rotate();
  },
  onShow: function () {
    // 页面显示  
  },
  onHide: function () {
    // 页面隐藏  
  },
  onUnload: function () {
    // 页面关闭  
  }
})
