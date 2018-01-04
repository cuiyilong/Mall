// pages/getcoupons/index.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupons: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: app.globalData.url + 'allCoupons',
      data: {},
      success: (res) => {
        this.setData({
          coupons: res.data
        })
      }
    })
  },

  getCouponTap: function (e) {
    var couponid = e.currentTarget.dataset.couponid
    wx.request({
      url: app.globalData.url + 'getCoupons',
      data: {
        mid: app.globalData.userInfo.mid,
        coupon_id: couponid
      },
      success: (res) => {
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
        } else {
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})