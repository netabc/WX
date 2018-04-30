// pages/hostory/main.js
//获取应用实例  
var app = getApp()
import ProgressBar from "../../resource/progressbar/progressbar.js"
const Check = require('../check/check.js')
var bar = new ProgressBar('progressCanvas');
var wxCharts = require('../../resource/table/wxcharts.js');
var lineChart = null;
Page({
  data: {
    /** 
     * 页面配置 
     */
    winWidth: app.globalData.winWidth,
    winHeight: app.globalData.winHeight,
    // tab切换  
    currentTab: 1,
    watchCase: false,
    state:'开始检测'

  },
  createSimulationData: function () {
    var categories = [];
    var data = [];
    for (var i = 0; i < 50; i++) {
      categories.push('2016-' + (i + 1));
      data.push(Math.random() * (20 - 10) + 10);
    }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },
  updateData: function () {
    var simulationData = this.createSimulationData();
    var series = [{
      name: '成交量1',
      data: simulationData.data,
      format: function (val, name) {
        return val.toFixed(2) + '万';
      }
    }];
    lineChart.updateData({
      categories: simulationData.categories,
      series: series
    });
  },
  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },    
  onLoad: function () {
    var that = this;
    console.log("sssss");
    var windowWidth = that.data.winWidth;
    var simulationData = this.createSimulationData();
    wxCharts = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: false,
      background: '#f5f5f5',
      series: [{
        name: '成交量1',
        color:'#E80F1F',
        data: simulationData.data,
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }],
      xAxis: {
        disableGrid: true,
        disabled:true,
        
        // gridColor:'rgba(0,0,0,0)',
        // fontColor:'rgba(0,0,0,0)',
      },
      yAxis: {
        disabled:true,
        gridColor:'rgba(0,0,0,0)'
      },
      width: windowWidth+20,
      height: 210,
      dataLabel: false,
      legend:false,
      dataPointShape: false,
      extra: {
        lineStyle: 'curve'
      }
    }); 
    bar.addOnListener(function () {
      bar.stop();
      that.setData({ state: "开始检测", watchCase: true});
    });
  },
  onReady:function(){
    bar.show();
    // liner.show();
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
    let tab = e.detail.current;
    this.setData({
      currentTab: tab
    })
    if (this.data.currentTab === tab) {
      return false;
    } else{
      
      this.chooseItem(tab);
     
    }
   
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    let tab = e.target.dataset.current;
    this.setData({
      currentTab: tab
    })
    this.chooseItem(e.detail.current);
    if (this.data.currentTab === tab) {
      return false;
    } else {
     
     
     
    }
    
  },
  chooseItem:function(item){
   
    switch(item){
      case 0:
        this.hostory();
        break;
      case 1:
        bar.show();
        wxCharts = new wxCharts({
          canvasId: 'lineCanvas',
          type: 'line',
          categories: simulationData.categories,
          animation: false,
          background: '#f5f5f5',
          series: [{
            name: '成交量1',
            color: '#E80F1F',
            data: simulationData.data,
            format: function (val, name) {
              return val.toFixed(2) + '万';
            }
          }],
          xAxis: {
            disableGrid: true,
            disabled: true,

            // gridColor:'rgba(0,0,0,0)',
            // fontColor:'rgba(0,0,0,0)',
          },
          yAxis: {
            disabled: true,
            gridColor: 'rgba(0,0,0,0)'
          },
          width: windowWidth + 20,
          height: 210,
          dataLabel: false,
          legend: false,
          dataPointShape: false,
          extra: {
            lineStyle: 'curve'
          }
        }); 
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
      this.setData({ state: "开始检测", watchCase:true });
    } else if (this.data.state == "开始检测") {
      bar.restart();

      this.setData({ state: "暂停检测", watchCase: false });
    }
  },
  hostory:function(){

  },
  check:function(){

  },
  more:function(){

  },

  
})