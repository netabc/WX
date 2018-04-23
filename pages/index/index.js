//index.js

import _wx from '../../utils/wxutils.js';
import checkManager from "../../resources/public/bluetooth/CheckManager.js";
//获取应用实例
const app = getApp()
Page({
  write: function (str) {
    var that = this;
    var value = str;
    console.log('value', value);
    /* 将数值转为ArrayBuffer类型数据 */
    var typedArray = new Uint8Array(value.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }));
    var buffer = typedArray.buffer;
    wx.writeBLECharacteristicValue({
      deviceId: that.data.currentDeviceId,
      serviceId: that.data.currentServiceId,
      characteristicId: that.data.currentCharacteristicsId,
      value: buffer,
      success: function (res) {
        console.log('数据发送成功', res);
      },
      fail: function (res) {
        that.data.fialtry++;
        if (that.data.fialtry < 3) {
          that.write(str);
        } else {
          console.log('数据发送失败了ss', res);
        }
      }
    });
  },
  write16: function (data) {
    var that = this;
    if (data.length > 20) {
      var write_array = [];
      console.log('长度大于20', value);
      var value_initial_exceed = data; //将输入框的值取过来，方便循环
      var value_initial_average = Math.ceil(value_initial_exceed.length / 20); //将value_initial_exceed的长度除以20，余数再向上取一，确定循环几次
      console.log('需要循环的次数', value_initial_average);
      for (var i = 0; i < value_initial_average; i++) {
        if (value_initial_exceed.length > 20) {
          var value_initial_send = value_initial_exceed.slice(0, 20); //截取前20个字节
          console.log('截取到的值', value_initial_send);
          value_initial_exceed = value_initial_exceed.substring(20); //value_initial_exceed替换为取掉前20字节后的数据
          write_array.push(value_initial_send); //将所有截取的值放在一个数组
          console.log('write_array数组', write_array);
          write_array.map(function (val, index) {
            setTimeout(function () {
              var value_set = val;
              console.log('value_set', value_set);
              var write_function = that.write(value_set); //调用数据发送函数
            }, index * 100);
          });
        } else {
          write_array.push(value_initial_exceed);
        }
      }
    } else {
      var write_function = that.write(data); //调用数据发送函数
    }
  },
  writeBlue: function (data) {
    var that = this;
    var write_array = [];
    var charCodeAt = [];
    var recv_value_ascii = "";
    var string_value = "";
    var recve_value = "";
    console.log("sendData:" + data);
    if (!data) {
      wx.showToast({
        title: '发送的命令不能为空',
      })
      return;
    }
    if (!that.data.currentDeviceId) {
      wx.showToast({
        title: '请先搜索，再连接BLE开头的蓝牙',
      })
      return;
    }
    var value_initial_1 = data;
    var value_initial;
    if (value_initial_1.indexOf(' ') > 0) {
      value_initial = that.splitStr(value_initial_1, ' ');    //存在空格时
      console.log('删除掉空格', value_initial);
    } else {
      value_initial = value_initial_1;    //不存在空格时
    }
    /* 判断字节是否超过20字节 */
    var value_initial_exceed = value_initial;
    if (that.data.write_ascii) {
      value_initial_exceed = that.asciiTo16(value_initial);
    }

    that.write16(value_initial_exceed);
  },

  readBlue: function (data) {
    var that = this;
    console.log("ReadData:" + JSON.stringify(data));
    var hex = that.buf2hex(data);
    console.log('返回的值hex', hex);
    if (hex != '0xff') {
      that.data.receiveData.push(hex);
      if (that.data.receiveData.length > 0) {
        var temp = "";
        for (var i = 0; i < that.data.receiveData.length; i++) {
          temp += ' '+that.data.receiveData[i]
        }
        var start = temp.indexOf('0x2a');
        var end = temp.indexOf('0x0a');
        if (end > start) {
          var arr = temp.substring(start, end).split(' ');
          var val = []
          val[5]=0;
          for (var i = 0; i < 5; i++) {
            // var f = parseFloat(parseInt(arr[2 + (i * 4)], 16) + "." + parseInt(arr[3 + (i * 4)], 16) + parseInt(arr[4 + (i * 4)], 16))
            var f = parseFloat(String.fromCharCode(arr[2 + (i * 4)]) + "." + String.fromCharCode(arr[3 + (i * 4)]) + String.fromCharCode(arr[4 + (i * 4)]))
            val[i] = f
            val[5] += f
          }
          if (2.10 - val[0] >= 0.2 || 2.10 - val[1] >= 0.2 ||
            2.10 - val[2] >= 0.2 || 2.10 - val[3] >= 0.2 ||
            2.10 - val[4] >= 0.2) {
            if(!that.isStart){
              that.writeBlue('bb');
              that.isStart = true;
              setTimeout(function () {
                that.writeBlue('aa');
                that.data.isLLL = true;
              }, 200)
              
            }
          }
          if (that.data.isLLL)
          if (hex.indexOf('0x0a') > 0) {
            if (that.isStart) {
              setTimeout(function () {
                that.data.receiveData = [];
                that.writeBlue('aa');
              }, 200)
            }
          }
        }
        console.log("返回的数据>>>" + JSON.stringify(temp));
      }

    }




    // setTimeout(function () {
    // if (that.data.receiveData) {
    //   var temp = "";
    //   for (var i = 0; i < that.data.receiveData.length; i) {
    //     temp += that.data.receiveData[i]
    //   }

    //   var arr = temp.substring(temp.indexOf('2a'), temp.indexOf('0a')).split(' ');
    //   var val = []
    //   for (var i = 0; i < 6; i++) {

    //     var f = parseFloat(parseInt(arr[2 + (i * 4)], 16) + "." + parseInt(arr[3 + (i * 4)], 16) + parseInt(arr[4 + (i * 4)], 16))
    //     val[i] = f
    //     val[5] += f
    //   }


    // if (2.10 - val[0] >= 0.2 || 2.10 - val[1] >= 0.2 ||
    //   2.10 - val[2] >= 0.2 || 2.10 - val[3] >= 0.2 ||
    //   2.10 - val[4] >= 0.2) {
    // setTimeout(function () {
    //   that.writeBlue('bb');
    //   setTimeout(function () {
    //     that.wirteDD();
    //   }, 1000);
    // }, 1000);
    // }
    // }
    // }, 200);
  },
  //检查身体
  checkUp: function (e) {
    var that = this;
    that.setData({ page: 1 })
    that.isStart = false;
    that.writeBlue('aa');
    // that.writeBlue('bb');
  },
  wirteDD: function () {
    var that = this;
    that.writeBlue('aa');
    setTimeout(that.wirteDD, 50);
  },
  //连接蓝牙
  connectDevice: function () {
    var that = this;
    if (that.data.currentConnected) {
      wx.closeBLEConnection({
        deviceId: that.data.currentDeviceId,
        complete: function (res) {
          console.log("关闭" + that.data.currentDeviceId + "连接成功")
        }
      });
    }
    wx.createBLEConnection({
      deviceId: that.data.currentDeviceId,
      success: function (res) {
        console.log("创建连接成功" + JSON.stringify(res));
        that.setData({ currentState: "已连接", currentConnected: true })
        // that.setData({ currentDevice: { state: "已连接",connected: true} });

        wx.getBLEDeviceServices({
          deviceId: that.data.currentDeviceId,
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
                that.data.currentServiceId = all_UUID[index_uuid].uuid;
                that.setData({ currentServiceId: all_UUID[index_uuid].uuid })
              }
            }
            if (!that.data.currentServiceId) {
              //没有查找到合适的设备
              console.log("ServiceId为空" + that.data.currentServiceId);
              return;
            }
            wx.getBLEDeviceCharacteristics({
              deviceId: that.data.currentDeviceId,
              serviceId: that.data.currentServiceId,
              success: function (res) {
                console.log("接受的值:" + JSON.stringify(res));
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
                      currentNotycharacteristicsId: characteristics[index_uuid].uuid,    //需确定要的使能UUID
                      currentCharacteristicsId: characteristics[index_uuid].uuid         //暂时确定的写入UUID
                    });
                  }
                  if (characteristics_slice == 'FEE2' || characteristics_slice == 'fee2') {
                    var index_uuid = index;
                    that.setData({
                      currentCharacteristicsId: characteristics[index_uuid].uuid         //暂时确定的写入UUID
                    });
                  }
                }
                /* 遍历获取characteristicsId */
                // for (var index = 0; index < characteristics_length; index++) {
                //   var characteristics_UUID = characteristics[index].uuid;    //取出特征值里面的UUID
                //   var characteristics_slice = characteristics_UUID.slice(4, 8);   //截取4到8位
                //   /* 判断是否是我们需要的FEE2 */
                //   if (characteristics_slice == 'FEE2' || characteristics_slice == 'fee2') {
                //     var index_uuid = index;
                //     that.setData({

                //       currentCharacteristicsId: characteristics[index_uuid].uuid         //暂时确定的写入UUID

                //     });
                //   }
                // }
                console.log('使能characteristicsId', that.data.currentNotycharacteristicsId);
                console.log('写入characteristicsId', that.data.currentCharacteristicsId);
                wx.notifyBLECharacteristicValueChange({
                  deviceId: that.data.currentDeviceId,
                  serviceId: that.data.currentServiceId,
                  characteristicId: that.data.currentCharacteristicsId,
                  state: true,
                  success: function (res) {
                    console.log("notifyBLECharacteristicValueChange改变：" + JSON.stringify(res));

                  },
                })
              },

            })
          },
        })
      }, fail: function (res) {
        that.setData({ currentState: false })
      }
    })
  },
  //选择蓝牙保存
  chooseBlue: function (deviceId, deviceName) {
    this.setData({ currentDeviceId: deviceId, currentDeviceName: deviceName });
    console.log("选中" + JSON.stringify(this.data));
    this.dialog.hideDialog();
  },
  /**
   * 搜索设备
   */
  searchDevice: function (e) {
    var that = this;
    that.setData({ searching: true })
    that.dialog.showDialog();
    if (that.data.bluetoothState) {
      var p = _wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          return res;
        },
        fail: function (res) {
          that.setData({ searching: false })
          return res;
        }
      }).then(function (res) {
        // 开始搜寻附近的蓝牙外围设备
        wx.startBluetoothDevicesDiscovery({
          // services:[''],
          allowDuplicatesKey: false,
          interval: 0,
          success: function (res) {
            console.log("附近的蓝牙外围设备" + JSON.stringify(res));
          },
          fail: function (res) {
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
      }, function (res) {
        console.log("结束查找")
        that.setData({ searching: false })
      })
    } else {
      that.setData({ searching: false })
      wx.showModal({
        title: '查找失败',
        content: '请开启蓝牙后重新打开页面重试',
        showCancel: false
      })
    }
  },
  /**
   * 获取蓝牙状态
   */
  bluetoothState: function () {
    var that = this;
    return _wx.openBluetoothAdapter({
      complete: function (res) {
        return res;
      }
    }).then(function (res) {
      return wx.getBluetoothAdapterState({
        success: function (res) {
          that.setData({ bluetoothState: res.available });
        }, fail: function (res) {
          that.setData({ bluetoothState: res.available });
        }
      });
    }, function () {
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
    // var that = this;
    // this.bluetoothState()
    //   .then(function () {
    //     console.log("状态监听")
    //     wx.onBluetoothAdapterStateChange(function (res) {
    //       console.log("状态监听:" + JSON.stringify(res))
    //       that.setData({ adapterStateChange: res, bluetoothState: res.available });
    //     })
    //     wx.onBluetoothDeviceFound(function (device) {
    //       console.log("新找到的设备:" + JSON.stringify(device))
    //       var arr = that.data.devicesList == null ? [] : that.data.devicesList
    //       if (arr.length == 0) {
    //         arr.push(device);
    //       } else {
    //         arr.forEach(function (value, index, array) {
    //           if (arr[index].devices[0].deviceId != device.devices[0].deviceId) {
    //             arr.push(device);
    //           }
    //         });
    //       }
    //       console.log("所有设备:" + JSON.stringify(arr))
    //       that.dialog.setData({ devicesList: arr });
    //       that.setData({ devicesList: arr });
    //     });
    //     wx.onBLECharacteristicValueChange(function (res) {
    //       console.log(">>>返回的值:" + JSON.stringify(res));
    //       var result = res.value;
    //       that.readBlue(result);
    //     });
    //   }, function () {
    //     _wx.showModal({
    //       title: '蓝牙',
    //       content: '蓝牙没有打开',
    //       success: function (res) {
    //         if (res.confirm) {
    //           this.bluetoothState()
    //         }
    //       }
    //     })
    //   });
  },
  onShow: function () {
    // checkManager.init();
    console.log(JSON.stringify(checkManager));
    var that = this;
    if (!this.data.bluetoothState) {
      this.bluetoothState()
        .then(function () {
          console.log("状态监听")
          wx.onBluetoothAdapterStateChange(function (res) {
            console.log("状态监听:" + JSON.stringify(res))
            that.setData({ adapterStateChange: res, bluetoothState: res.available });
          })
          wx.onBluetoothDeviceFound(function (device) {
            console.log("新找到的设备:" + JSON.stringify(device))
            var arr = that.data.devicesList == null ? [] : that.data.devicesList
            if (arr.length == 0) {
              arr.push(device);
            } else {
              arr.forEach(function (value, index, array) {
                if (arr[index].devices[0].deviceId != device.devices[0].deviceId) {
                  arr.push(device);
                }
              });
            }
            console.log("所有设备:" + JSON.stringify(arr))
            that.dialog.setData({ devicesList: arr });
            that.setData({ devicesList: arr });
          });
          wx.onBLECharacteristicValueChange(function (res) {
            console.log(">>>返回的值:" + JSON.stringify(res));
            var result = res.value;
            that.readBlue(result);
          });
        }, function () {
          _wx.showModal({
            title: '蓝牙',
            content: '蓝牙没有打开',
            success: function (res) {
              if (res.confirm) {
                this.bluetoothState()
              }
            }
          })
        });
    }
  },
  // showDialog(){

  // },

  //取消事件
  _cancelEvent() {
    console.log('你点击了取消');
    this.dialog.hideDialog();
  },
  //确认事件
  _confirmEvent() {
    console.log('你点击了确定');
    this.dialog.hideDialog();
  },
  data: { page: 0, receiveData: [] },
  showErrorMsg: function (err, callback) {
    wx.showModal({
      title: '错误',
      content: err,

    })
  },
  //转成十六进制
  buf2hex: function (buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ("0x"+('00' + x.toString(16)).slice(-2))).join(' ');
  },
  asciiTo16: function (assii) {
    var value_ascii = "";
    /* 当选择以Ascii字符发送的时候 */
    var value_split = value_initial.split('');  //将字符一个一个分开
    console.log('value_split', value_split);
    for (var i = 0; i < value_split.length; i++) {
      value_ascii = value_ascii + value_split[i].charCodeAt().toString(16);     //转为Ascii字符后连接起
    }
    return value_ascii;
  },
})