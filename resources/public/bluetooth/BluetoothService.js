
class Bluetooth {
  // static BluetoothSearch = "搜索蓝牙"
  // static instance;
  
  constructor() {
    // if (instance) return instance;
    this.isCanUsed = false;//蓝牙是否可用
    this.isFonding = false;//是否在搜索中
    this.findDevice = null;//已找到的设备
    this.MaxSearchTime = 10 * 1000//最大搜索时间 ，到了停止搜索
    this.findedDevices = []//所有已找到的设备
    this.isConnected = false//是否已经连接
    this.deviceServices = [];//当前所有的服务
    this.characteristics = [];//某个服务的特征值
    this.isReadable = false//读取值
    this.isWirteable = false//写入值
    this.cacheData=[];//缓存读取到的值
    this.isReading =true;//正在读取中
  }
  // static getInstance() {
  //   instance = new Instance();
  // }
  /**
   * 写入到特征中的数据
   */
  write(raw) {
    var that = this
    if (raw && that.deviceId && that.serviceId && that.characteristicsId) {
      var value = raw
      var typedArray = new Uint8Array(value.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
      }));
      var buffer = typedArray.buffer;
      wx.writeBLECharacteristicValue({
        deviceId: that.deviceId,
        serviceId: that.serviceId,
        characteristicId: that.characteristicsId,
        value: buffer,
        success: function (res) {
          that.print('数据发送成功', res);
        }, fail(res) {
          that.print('数据发送失败', res);
        }
      })
    } else {
      wx.showModal({
        title: '蓝牙',
        content: '无法写入:' + raw,
        showCancel: false
      })
      this.isWirteable = false//写入值
      that.print("写入数据失败", raw);
    }
  }
  /**
   * 从特征中读取到的数据
   */
  read(raw) {
    this.readBlue(raw)
  }
  /**
   * 通知特征改变
   * 并读取数据
   */
  notifyCharacteristicChange(deviceId, serviceId, characteristicsId) {
    var that = this;
    this.deviceId = deviceId;
    this.serviceId = serviceId;
    this.characteristicsId = characteristicsId;

    if (that.isConnected) {
      that.isReadable = true
      that.isWirteable = true;
      wx.notifyBLECharacteristicValueChange({
        deviceId: deviceId,
        serviceId: serviceId,
        characteristicId: characteristicsId,
        state: true,
        success: function (res) {
          console.log("notifyBLECharacteristicValueChange改变：" + JSON.stringify(res));
        },
      })
      wx.onBLECharacteristicValueChange(function (res) {
        that.print("特征值提取", res)
        var result = res.value
        that.read(result)
      })
    } else {
      typeof that.OnConnectStateListener === 'function' && that.OnConnectStateListener(that.isConnected)
      that.isReadable = false
      that.isWirteable = false;
    }
  }
  /**
   * 获取蓝牙设备某个服务特征值
   */
  getDeviceCharacteristic(deviceId, serviceId) {
    var that = this;
    // this.deviceId = deviceId;
    // this.serviceId = serviceId;
    if (that.isConnected) {
      wx.getBLEDeviceCharacteristics({
        deviceId: deviceId,
        serviceId: serviceId,
        success: function (res) {
          that.print("特征值提取", res)
          that.characteristics = res.characteristics
          typeof that.OnDeviceCharacteristicListener === 'function' && that.OnDeviceCharacteristicListener(that.characteristics)


        }, fail: function (res) {
          that.print("特征值提取 err", res);
        }
      })

    } else {
      typeof that.OnConnectStateListener === 'function' && that.OnConnectStateListener(that.isConnected)
    }

  }

  /**
   * 重连蓝牙
   */
  reConnectBlue(deviceid) {
    var that = this;
    // this.deviceId = deviceId;
    if (that.isConnected) {
      that.disconnectBlue(deviceid, that.connectBlue)
    } else {
      connectBlue(deviceid)
    }
  }
  /**
   * 连接蓝牙
   */
  connectBlue(deviceId) {
    var that = this;
    // this.deviceId = deviceId;
    if (that.isCanUsed) {
      typeof that.OnProgressListener === 'function' && that.OnProgressListener(true)
      wx.createBLEConnection({
        deviceId: deviceId,
        success: function (res) {
          that.isConnected = true
          typeof this.OnConnectStateListener === 'function' && that.OnConnectStateListener(that.isConnected)
          wx.getBLEDeviceServices({
            deviceId: deviceId,
            success: function (res) {
              that.print("所有的service", res);
              typeof that.OnFindServiceListener === 'function' && that.OnFindServiceListener(res.services);
            }, fail: function (res) {
              that.print("所有的service err", res);
            }
          })
        }, fail: function (res) {
          that.isConnected = false
          typeof this.OnConnectStateListener === 'function' && that.OnConnectStateListener(that.isConnected)
        }, complete: function () {
          typeof that.OnProgressListener === 'function' && that.OnProgressListener(false)
        }
      })
      wx.onBLEConnectionStateChange(function (res) {
        that.isConnected = res.connected
        typeof this.OnConnectStateListener === 'function' && that.OnConnectStateListener(that.isConnected)
      })

    } else {
      typeof that.OnAdapterStateListener === 'function' && that.OnAdapterStateListener(that.isCanUsed)
    }
  }
  /**
   * 断开蓝牙链接
   */
  disconnectBlue(deviceid, func) {
    var that = this;
    if (that.isConnected) {
      wx.closeBLEConnection({
        deviceId: deviceid,
        success: function (res) {
          that.print("链接设备成功：", res)
          typeof func === 'function' && func(deviceid)
        },
      })
    } else {
      typeof that.OnConnectStateListener === 'function' && that.OnConnectStateListener(that.isConnected)
    }
  }
  /**
   * 重新搜索蓝牙
   */
  researchBlue() {
    var that = this;
    if (that.isCanUsed) {
      that.stopSearchBlue(that.searchBlue());
    } else {
      typeof that.OnAdapterStateListener === 'function' && that.OnAdapterStateListener(that.isCanUsed)
    }
  }
  /**
   * 搜索蓝牙
   */
  searchBlue() {
    var that = this;
    if (that.isCanUsed) {
      typeof that.OnProgressListener === 'function' && that.OnProgressListener(true)
      wx.startBluetoothDevicesDiscovery({
        // services: [''],
        allowDuplicatesKey: false,
        interval: 0,
        success: function (res) {
          //已找到的蓝牙
          /**
           * Bug & Tip
              tip: Mac系统可能无法获取advertisData及RSSI，请使用真机调试
              tip: 开发者工具和 Android 上获取到的deviceId为设备 MAC 地址，iOS 上则为设备 uuid。因此deviceId不能硬编码到代码中
              tip: 若在onBluetoothDeviceFound回调了某个设备，则此设备会添加到 wx.getBluetoothDevices 接口获取到的数组中
           */
          wx.onBluetoothDeviceFound(function (res) {
            that.print("已发现设备：", res)
            that.isFonding = true;
            findDevice = res;
            typeof that.OnFindDeviceListener === 'function' && that.OnFindDeviceListener(res)
          });
          setTimeout(that.stopSearchBlue, that.MaxSearchTime);
        }, fail: function (res) {
          that.print("已发现设备 error：", res)
        }, complete: function () {
          typeof that.OnProgressListener === 'function' && that.OnProgressListener(false)
        }
      })
    } else {
      typeof that.OnAdapterStateListener === 'function' && that.OnAdapterStateListener(that.isCanUsed)
    }
  }
  /**
   * 停止搜索蓝牙
   */
  stopSearchBlue(resreach) {
    var that = this;
    if (that.isCanUsed) {
      that.isFonding = false;
      wx.stopBluetoothDevicesDiscovery({
        complete: function (res) {
          typeof that.OnProgressListener === 'function' && that.OnProgressListener(false)
          wx.getBluetoothDevices({
            success: function (res) {
              that.print("全部已发现的设备：", res)
              if (typeof resreach === 'function') {
                resreach();
              } else {
                typeof that.OnFindedDevicesListener === 'function' && that.OnFindedDevicesListener(res)
              }
            }
          })
        }
      })
    } else {
      typeof that.OnAdapterStateListener === 'function' && that.OnAdapterStateListener(that.isCanUsed)
    }
  }
  /**
   * 初始化蓝牙设备
   * 
   */
  init() {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.openBluetoothAdapter({
        success: function (res) {
          console.log("初始化成功");
          resolve(true);
        }, fail: function (res) {
          console.log("初始化失败");
          resolve(false);
        }
      })
    }).then(function (isInit) {
      if (isInit) {
        wx.getBluetoothAdapterState({
          success: function (res) {
            that.isCanUsed = true
            typeof this.OnAdapterStateListener === 'function' && this.OnAdapterStateListener(that.isCanUsed)
          }, fail: function (res) {
            that.isCanUsed = false
            typeof this.OnAdapterStateListener === 'function' && this.OnAdapterStateListener(that.isCanUsed)
          },
          complete(res) {
            that.print("蓝牙状态", res)
          }
        });
        /**
        * 蓝牙状态监听
        */
        wx.onBluetoothAdapterStateChange(function (res) {
          console.log("蓝牙状态改变:", res)
          that.isCanUsed = res.available
          typeof this.OnAdapterStateListener === 'function' && this.OnAdapterStateListener(that.isCanUsed)
        })

      } else {
        that.isCanUsed = false;
        typeof this.OnAdapterStateListener === 'function' && this.OnAdapterStateListener(that.isCanUsed)
        that.print("初始化", res)
      }

    });
  }
  /**
   * 蓝牙状态监听
   */
  addOnAdapterStateListener(callback) {
    this.OnAdapterStateListener = callback;
  }
  /**
   * 蓝牙进度监听
   */
  addOnProgressListener(callback) {
    this.OnProgressListener = callback;
  }
  /**
   * 发现的蓝牙设备监听
   */
  addOnFindDeviceListener(callback) {
    this.OnFindDeviceListener = callback;
  }
  /**
   * 所有已发现的蓝牙设备
   */
  addOnFindedDevicesListener(callback) {
    this.OnFindedDevicesListener = callback;
  }
  /**
   * 连接状态监听
   */
  addOnConnectStateListener(callback) {
    this.OnConnectStateListener = callback;
  }
  /**
   *已经查找的所有服务监听
   */
  addOnFindServiceListener(callback) {
    this.OnFindServiceListener = callback;
  }
  /**
   * 特征值获取监听
   */
  addOnDeviceCharacteristicListener(callback) {
    this.OnDeviceCharacteristicListener = callback;
  }
  /**
   * 特征值获取监听
   */
  addOnReceivedDataListener(callback) {
    this.OnReceivedDataListener = callback;
  }
  /**
   * 写入蓝牙数据
   * 
   */
  writeBlue(data) {
    var that = this;
    if (data.length > 20) {
      var write_array = [];
      that.print('长度大于20', value);
      var value_initial_exceed = data; //将输入框的值取过来，方便循环
      var value_initial_average = Math.ceil(value_initial_exceed.length / 20); //将value_initial_exceed的长度除以20，余数再向上取一，确定循环几次
      that.print('需要循环的次数', value_initial_average);
      for (var i = 0; i < value_initial_average; i++) {
        if (value_initial_exceed.length > 20) {
          var value_initial_send = value_initial_exceed.slice(0, 20); //截取前20个字节
          console.log('截取到的值', value_initial_send);
          value_initial_exceed = value_initial_exceed.substring(20); //value_initial_exceed替换为取掉前20字节后的数据
          write_array.push(value_initial_send); //将所有截取的值放在一个数组
        }else{
          write_array.push(value_initial_exceed);
        }
      }
      write_array.map(function (val, index){
        var value_set = val
        that.write(value_set)
      })
    } else {
      that.write(data)
    }
  }
  /**
   * 读取蓝牙数据
   */
  readBlue(raw) {
    this.cacheData.push(raw)
    var value =this.buf2hex(raw)
    // if (value.substring(value.length - 2).toLowerCase()==='0a'){
    //   if (this.isReading){
    //     this.writeBlue("aa");
    //   }
    // }
    typeof this.OnReceivedDataListener === 'function' && this.OnReceivedDataListener(raw)
  }
  /** 
  *   打印日志
  */
  print(flag, obj) {
    console.log(flag, JSON.stringify(obj));
  }
  ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join(' ');
  }
  buf2hex(buffer){
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join(' ');
  }
}

export default Bluetooth;