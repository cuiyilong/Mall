// pages/coupons/index.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusType: ["未使用", "已使用", "已失效"],
    currentType: 0,
    pagesize: 8,
    coupons: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  showCoupons: function (status, pagesize) {
    var used = 0
    if (status == 0 || status == 2) {
      used = 0
    } else {
      used = status
    }
    wx.request({
      url: app.globalData.url + 'listCoupons',
      data: {
        mid: app.globalData.userInfo.mid,
        used: used,
        page: 1,
        pagesize: pagesize
      },
      success: (res) => {
        // console.log(res.data)
        wx.hideLoading()
        wx.hideNavigationBarLoading()
        var coupons = res.data

        var pagesize = this.data.pagesize + 8
        this.setData({
          pagesize: pagesize
        })

        if (status == 0) {
          var temp = []
          for (let i in coupons) {
            if (coupons[i].used == 0 && coupons[i].status == 1 && coupons[i].expired !== 1) {
              temp.push(coupons[i])
            }
          }
          this.setData({
            coupons: temp
          })
        } else if (status == 1) {
          this.setData({
            coupons: coupons
          })
        } else if (status == 2) {
          var temp = []
          for (let i in coupons) {
            if (coupons[i].used == 0 && coupons[i].expired === 1) {
              temp.push(coupons[i])
            }
          }
          this.setData({
            coupons: temp
          })
        }
      }
    })
  },

  onNavBarTap: function (e) {
    wx.showLoading({
      title: '加载中...',
    })
    var idx = e.currentTarget.dataset.index
    this.setData({
      currentType: idx,
      pagesize: 8
    })
    this.showCoupons(this.data.currentType, this.data.pagesize)
  },

  onGetCouponTap: function (e) {
    wx.navigateTo({
      url: '/pages/getcoupons/index'
    })
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
    wx.showLoading({
      title: '加载中...',
    })
    this.showCoupons(this.data.currentType, this.data.pagesize)
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
    this.showCoupons(this.data.currentType, this.data.pagesize)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})