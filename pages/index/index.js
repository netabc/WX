//index.js

import _wx from '../../utils/wxutils.js'; 
//获取应用实例
const app = getApp()
Page({
  /**
   * 
   */
  searchDevice:function(e){
    var that = this;
    this.setData({searching:true})
    this.dialog.showDialog();
    if (that.data.bluetoothState){
      var p = _wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          return res;
        },
        fail:function (res){
          return res;
        }
      }).then(function(res){
        // 开始搜寻附近的蓝牙外围设备
        return _wx.startBluetoothDevicesDiscovery({
          // services:[''],
          allowDuplicatesKey:false,
          interval:0,
          success: function(res) {
            console.log("附近的蓝牙外围设备" + JSON.stringify(res));
            setTimeout(function(){
              _wx.stopBluetoothDevicesDiscovery({
                success: function(res) {
                  console.log("结束查找")
                  this.setData({ searching: false })
                }
              })
            },60*1000);
          }, 
          fail:function(res){
            console.log("附近的蓝牙外围设备 搜索失败" + JSON.stringify(res));
          }
        })
      })
    }else{
      wx.showModal({
        title: '查找失败',
        content: '请开启蓝牙后重新打开页面重试',
        showCancel:false
      })
    }
    
   
  },
  /**
   * 获取蓝牙状态
   */
  bluetoothState:function(){
   var that = this;
   return _wx.openBluetoothAdapter({
      complete: function(res) {
        return res;
      }
    }).then(function(res){
      return wx.getBluetoothAdapterState({
        success: function (res) {
          that.setData({ bluetoothState: res.available });
        }, fail: function (res) {
          that.setData({ bluetoothState: res.available });
        }
      });
    },function(){
      that.setData({ bluetoothState: false });
    });
  },
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {
    //获得dialog组件
   
    this.dialog = this.selectComponent("#dialog");
    var that = this;
    this.bluetoothState()
    .then(function(){
      console.log("状态监听")
      wx.onBluetoothAdapterStateChange(function (res) {
        console.log("状态监听:" + JSON.stringify(res))
          that.setData({ adapterStateChange: res, bluetoothState: res.available });
        })
      wx.onBluetoothDeviceFound(function(device){
        console.log("新找到的设备:" + JSON.stringify(device))
        var arr = that.data.devicesList == null ? [] : that.data.devicesList
        if (arr.length == 0) {
          arr.push(device);
        } else {
          arr.forEach(function (value, index, array){
            if (arr[index].devices[0].deviceId != device.devices[0].deviceId){
              arr.push(device);
            }
          });
        }
        console.log("所有设备:" + JSON.stringify(arr))
        that.dialog.setData({devicesList:arr});
        that.setData({ devicesList: arr});
      });
    },function(){
        _wx.showModal({
          title: '蓝牙',
          content: '蓝牙没有打开',
          success: function (res) {
            if (res.confirm){
              this.bluetoothState()
            }
          }
        })
    });
  },
  // showDialog(){
    
  // },

   //取消事件
  _cancelEvent(){
    console.log('你点击了取消');
    this.dialog.hideDialog();
  },
  //确认事件
  _confirmEvent(){
    console.log('你点击了确定');
    this.dialog.hideDialog();
  }

})