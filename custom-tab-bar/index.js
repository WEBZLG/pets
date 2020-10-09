Component({
  data: {
    selected: 0,
    color: "#717171",
    selectedColor: "#FF902D",
    icon: {
      normal: 'https://img.yzcdn.cn/vant/user-inactive.png',
      active: 'https://img.yzcdn.cn/vant/user-active.png',
    },
    list: [{
      pagePath: "/pages/home/home",
      iconPath: "/images/home1.png",
      selectedIconPath: "/images/home2.png",
      text: "首页"
    },
    {
      pagePath: "/pages/discover/discover",
      iconPath: "/images/discover1.png",
      selectedIconPath: "/images/discover2.png",
      text: "发现"
    },
    {
      pagePath: "/pages/message/message",
      iconPath: "/images/icon-message1.png",
      selectedIconPath: "/images/icon-message2.png",
      text: "消息"
    },
    {
      pagePath: "/pages/my/my",
      iconPath: "/images/my1.png",
      selectedIconPath: "/images/my2.png",
      text: "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})