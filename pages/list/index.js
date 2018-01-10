// pages/list/index.js
const app = getApp()
var CategoryUrl = app.globalData.url + 'goodsCategory'
var goodListUrl = app.globalData.url + 'goodsList'
var obj = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagesize: 6,
    goodList: [],

    scrollHight: 0,//窗口高度
    currentType: 0, //预设当前项的值
    scrollLeft: 0 //tab标题的滚动条位置
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = {}
    var scrollHight = wx.getSystemInfoSync().windowHeight
    this.setData({
      scrollHight: scrollHight
    })

    wx.showLoading({
      title: '加载中...'
    })
    var idx = options.idx
    var cidx = options.cidx

    wx.request({
      url: CategoryUrl,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        var temp = res.data
        var category = []
        var index = 0
        var obj = null
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].level === 1) {
            index = i
            obj = temp[index]
            obj.list = []
          } else {
            obj.list.push(temp[i])
          }
        }
        category = temp.filter(function (cur) {
          return cur.level === 1
        })
       
        wx.setNavigationBarTitle({
          title: category[idx].name,
        })
        
        this.setData({
          category: category[idx],
          cid: category[idx].list[cidx].id,
          currentType: cidx
        })
        this.http(goodListUrl, category[idx].list[cidx].id, this.data.pagesize, this.goodList)
      }
    })
  },
  // 获取产品列表
  http: function (url, cid, pagesize, callback) {
    wx.request({
      url: url,
      data: {
        cid: cid,
        pagesize: pagesize
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        callback(res.data)
      }
    })
  },

  goodList: function (data) {
    // 将后台返回的数据整合进obj对象中
    obj[this.data.currentType] = data

    wx.hideLoading()
    wx.hideNavigationBarLoading()
    var pagesize = this.data.pagesize + 6
    if (data.length != 0) {
      this.setData({
        pagesize: pagesize,
        goodList: obj
      })
    } else {
      this.setData({
        pagesize: pagesize,
        goodList: obj
      })
    }
  },
  // 分类点击切换
  onNavBarTap: function (e) {
    wx.showLoading({
      title: '加载中...'
    })
    var id = e.currentTarget.dataset.id
    var idx = e.currentTarget.dataset.idx
    this.setData({
      pagesize: 6,
      cid: id,
      currentType: idx
    })
    this.http(goodListUrl, id, this.data.pagesize, this.goodList)
  },

  toDetailsTap: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../goods-details/index?id=' + id
    })
  },


  // 滚动切换标签样式
  switchTab: function (e) {
    wx.showNavigationBarLoading()
    var id = this.data.category.list[e.detail.current].id
    this.setData({
      currentType: e.detail.current,
      pagesize: 6
    });
    this.http(goodListUrl, id, this.data.pagesize, this.goodList)
    this.checkCor();
  },

  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentType > 0) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showNavigationBarLoading()
    var id = this.data.category.list[this.data.currentType].id
    this.http(goodListUrl, id, this.data.pagesize, this.goodList)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})