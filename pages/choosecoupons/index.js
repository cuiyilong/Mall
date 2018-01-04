// pages/choosecoupons/index.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ids = options.ids
    var totalprice = options.totalprice
    wx.request({
      url: app.globalData.url + 'orderCoupons',
      data: {
        mid: app.globalData.userInfo.mid,
        ids: ids,
        total: totalprice
      },
      success: (res) => {
        this.setData({
          coupons: res.data,
        })
      }
    })
  },

  chooseCouponTap: function (e) {
    var id = e.currentTarget.dataset.id
    var coupon = this.data.coupons.filter(function (curCoupon) {
      return curCoupon.id == id
    })
    // 当前选中优惠券写入缓存
    wx.setStorage({
      key: "coupon",
      data: coupon[0]
    })
    wx.navigateBack({})
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