//index.js
//获取应用实例
const app = getApp()
var bannerUrl = app.globalData.url + 'fetchSlide'
var goodListUrl = app.globalData.url + 'goodsList'

Page({
  data: {
    showResult: false,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    banner: [],
    goodList: [],
    cid: 0,
    pagesize: 6
  },

  onLoad: function () {
    this.http(bannerUrl, '', '', this.bannerData)
    this.http(goodListUrl, '58,59', this.data.pagesize, this.goodList1)
    this.http(goodListUrl, '15,16,17,20,21', this.data.pagesize, this.goodList2)
  },
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
  goodList1: function (data) {
    this.setData({
      goodList1: data
    })
  },
  goodList2: function (data) {
    this.setData({
      goodList2: data
    })
  },
  bannerData: function (data) {
    this.setData({
      banner: data
    })
  },
  onFocusTap: function (e) {
    wx.navigateTo({
      url: '../serach/index'
    })
  },

  bannerToDetail: function (e) {
    var url = e.currentTarget.dataset.url
    url = url.split('=')
    console.log(url)
    if (url[0] == 'id') {
      wx.navigateTo({
        url: '../goods-details/index?id=' + url[1]
      })
    } else if (url[0] == 'cid') {
      wx.navigateTo({
        url: '/pages/topic/index?cid=' + url[1] + '&category=' + url[3],
      })
    }
  },

  onTopicTap: function (e) {
    var cid = e.currentTarget.dataset.cid
    var category = e.currentTarget.dataset.category
    wx.navigateTo({
      url: '/pages/topic/index?cid=' + cid + '&category=' + category,
    })
  },

  toDetailsTap: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../goods-details/index?id=' + id
    })
  },
  
  onReachBottom: function() {
    
  },

  onShareAppMessage: function () {
    return {
      title: '华邦商城',
      path: '/pages/index/index'
    }
  }
})
