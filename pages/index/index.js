//index.js

import _wx from '../../utils/wxutils.js'; 
//获取应用实例
const app = getApp()
Page({
  //检查身体
  checkUp: function (e) {
    var that = this;
    that.setData({page:1})
  },
  //连接蓝牙
  connectDevice: function () {
    var that = this;
    if (that.data.currentDevice.connected){
      wx.closeBLEConnection({
        deviceId: that.data.currentDevice.deviceId,
        complete: function (res) {
          that.showErrorMsg(JSON.stringify("ssssss"));
          return res;
        }
      });
    }
    that.showErrorMsg(JSON.stringify("res"));
    _wx.createBLEConnection({
      deviceId: that.data.currentDevice.deviceId,
      success: function (res) {
        console.log(JSON.stringify(res));
        that.setData({ currentDevice: { state: "已连接" } });
        that.showErrorMsg(JSON.stringify("@@@"));
      }, fail: function (res) {
        that.setData({ currentDevice: { state: false } });
        that.showErrorMsg(JSON.stringify("1111"));
      }
    }).then(function () {
      wx.getBLEDeviceServices({
        deviceId: 'that.data.currentDevice.deviceId',
        success: function (service) {
          console.log(JSON.stringify(service));
          var all_UUID = service.services;    //取出所有的服务
          console.log('所有的服务', all_UUID);
          var UUID_lenght = all_UUID.length;  //获取到服务数组的长度
          /* 遍历服务数组 */
          for (var index = 0; index < UUID_lenght; index++) {
            var ergodic_UUID = all_UUID[index].uuid;    //取出服务里面的UUID
            var UUID_slice = ergodic_UUID.slice(4, 8);   //截取4到8位
            if (UUID_slice == 'FEE0' || UUID_slice == 'fee0') {
              var index_uuid = index;
              that.setData({ currentDevice: { serviceId: all_UUID[index_uuid].uuid } })
            }
          }
        },
      })
    }).then(function () {
      wx.getBLEDeviceCharacteristics({
        deviceId: that.data.currentDevice.deviceId,
        serviceId: that.data.currentDevice.serviceId,
        success: function (res) {
          var characteristics = res.characteristics;      //获取到所有特征值
          var characteristics_length = characteristics.length;    //获取到特征值数组的长度
          console.log('获取到特征值', characteristics);
          console.log('获取到特征值数组长度', characteristics_length);
          /* 遍历数组获取notycharacteristicsId */
          for (var index = 0; index < characteristics_length; index++) {
            var noty_characteristics_UUID = characteristics[index].uuid;    //取出特征值里面的UUID
            var characteristics_slice = noty_characteristics_UUID.slice(4, 8);   //截取4到8位
            /* 判断是否是我们需要的FEE1 */
            if (characteristics_slice == 'FEE1' || characteristics_slice == 'fee1') {
              var index_uuid = index;
              that.setData({
                currentDevice: {
                  notycharacteristicsId: characteristics[index_uuid].uuid,    //需确定要的使能UUID
                  characteristicsId: characteristics[index_uuid].uuid         //暂时确定的写入UUID
                }
              });
            }
          }
          /* 遍历获取characteristicsId */
          for (var index = 0; index < characteristics_length; index++) {
            var characteristics_UUID = characteristics[index].uuid;    //取出特征值里面的UUID
            var characteristics_slice = characteristics_UUID.slice(4, 8);   //截取4到8位
            /* 判断是否是我们需要的FEE2 */
            if (characteristics_slice == 'FEE2' || characteristics_slice == 'fee2') {
              var index_uuid = index;
              that.setData({
                currentDevice: {
                  characteristicsId: characteristics[index_uuid].uuid         //暂时确定的写入UUID
                }
              });
            }
          }
          console.log('使能characteristicsId', that.data.currentDevice.notycharacteristicsId);
          console.log('写入characteristicsId', that.data.currentDevice.characteristicsId);
        },

      })
    }).then(function () {
      wx.notifyBLECharacteristicValueChange({
        deviceId: that.data.currentDevice.deviceId,
        serviceId: that.data.currentDevice.serviceId,
        characteristicId: that.data.currentDevice.characteristicsId,
        state: true,
        success: function (res) {
          console.log(JSON.stringify(res));
        },
      })
      wx.onBLECharacteristicValueChange(function (res) {
        var length_hex = [];
        var turn_back = "";
        var result = res.value;
        var hex = that.buf2hex(result);
        console.log('返回的值', hex);
      });
    });
  },
  //选择蓝牙保存
  chooseBlue: function (deviceId, deviceName) {
    this.setData({ currentDevice: { deviceId: deviceId, deviceName: deviceName } });
    console.log("选中" + JSON.stringify(this.data));
    this.dialog.hideDialog();
  },
  /**
   * 搜索设备
   */
  searchDevice:function(e){
    var that = this;
    that.setData({searching:true})
    that.dialog.showDialog();
    if (that.data.bluetoothState){
      var p = _wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          return res;
        },
        fail:function (res){
          that.setData({ searching: false })
          return res;
        }
      }).then(function(res){
        // 开始搜寻附近的蓝牙外围设备
        wx.startBluetoothDevicesDiscovery({
          // services:[''],
          allowDuplicatesKey:false,
          interval:0,
          success: function(res) {
            console.log("附近的蓝牙外围设备" + JSON.stringify(res));
          }, 
          fail:function(res){
            console.log("附近的蓝牙外围设备 搜索失败" + JSON.stringify(res));
            that.setData({ searching: false })
          }
        })
        setTimeout(function () {
          _wx.stopBluetoothDevicesDiscovery({
            complete: function (res) {
              console.log("结束查找")
              that.setData({ searching: false })
            }
          })
        }, 10 * 1000);
      },function(res){
        console.log("结束查找")
        that.setData({ searching: false })
      })
    }else{
      that.setData({ searching: false })
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
    this.dialog.page = this;
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
  },
  data: { page:0},
  showErrorMsg: function (err, callback) {
    wx.showModal({
      title: '错误',
      content: err,
      
    })
  },
})