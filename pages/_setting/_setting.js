var dataSession = require("../../utils/localdb.js");
Page({
  data: {
    list: [
      {
        id: 'bluetooth',
        name: '蓝牙设置',
        open: false,
        value: getApp().globalData.bluetooth,
        pages: [{ url: '../../resources/public/bluetooth/bluetooth', name:"设置蓝牙" }]
      }, {
        id: 'file',
        name: '文件管理',
        value: {},
        pages: [{ url: 'file', name:"清除缓存" }]
      }, {
        id: 'info',
        name: '个人信息',
        value: {},
        pages: [{ url: 'infohead', name:"修改头像" },
          { url: 'infoname', name:"修改昵称" },
          { url: 'infophone', name:"修改电话" },
          { url: 'logout', name: "退出" }]
      }
    ]
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    if (id == list[0].id && list[0].value.flag==-1){

      return ;
    }
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  }
})