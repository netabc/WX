class ProgressBar {
  constructor(id) {
    //id, x, y, r, start, end, bool
    this.id = id;
    this.cxt_arc = wx.createCanvasContext(id);//创建并返回绘图上下文context对象。
    this.number = 0;
    this.bg = "#d2d2d2"//渐变
    this.fg = "#3ea6ff"
    this.isDrawing = true;
    this.width = 140;
    this.heigth = 140;
    this.radius = 135;
    // this.draw(0)

  }
  show() {
    this.draw(0);
  }
  draw(number) {
    // console.log("xx" + this.maxWidth)
    if (!this.isDrawing) {
      return;
    }
    this.number = number
    this.cxt_arc.setLineWidth(6);//设置线条的宽度
    this.cxt_arc.setStrokeStyle(this.bg);//设置边框颜色 默认颜色
    this.cxt_arc.setLineCap('round');//设置线条的端点样式
    this.cxt_arc.arc(this.width, this.heigth, this.radius, 0, 2 * Math.PI, false);//设置一个原点(106,106)，半径为100的圆的路径到当前路径
    this.cxt_arc.stroke();//对当前路径进行描边
    
    this.cxt_arc.setLineWidth(10);
    this.cxt_arc.setStrokeStyle(this.fg);
    this.cxt_arc.setLineCap('round')
    this.cxt_arc.beginPath();//开始一个新的路径  
    this.cxt_arc.arc(this.width, this.heigth, this.radius, -1 / 2 * Math.PI, Math.PI * number / 180 - 1 / 2 * Math.PI, false);
    this.cxt_arc.stroke();//对当前路径进行描边 

    this.cxt_arc.setStrokeStyle('#ffffff');//设置边框颜色 默认颜色
    this.cxt_arc.beginPath();//开始一个新的路径
    this.cxt_arc.setLineWidth(6);
    this.cxt_arc.arc(this.width, this.heigth, this.radius, Math.PI * number / 180 - 1 / 2 * Math.PI, Math.PI * number / 180 - 1 / 2 * Math.PI, false);
    this.cxt_arc.stroke();
    this.cxt_arc.draw();

    // 

    if (number == 360) {
      this.number = 0;
      this.puase();
      typeof this.callback == 'function' && this.callback()
    }
    
  }

  puase() {
    this.isDrawing = false;
  }

  start() {
    this.isDrawing = true
  }
  addOnListener(callback) {
    this.callback = callback;
  }
  restart() {
    this.isDrawing = true
    this.animation()
  }
  animation() {
    if (this.isDrawing) {
      var that = this;
      this.number += 2;
      this.draw(this.number)
      setTimeout(function () {
        that.animation();
      }, 20);
    }
  }
  stop() {
    this.isDrawing = false;
    this.number = 0;
    // this.draw(0);
  }
}
export default ProgressBar;