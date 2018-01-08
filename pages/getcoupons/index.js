// pages/getcoupons/index.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupons: null,
    pagesize: 8
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  getAllCoupons: function (pagesize) {
    var _this = this
    wx.request({
      url: app.globalData.url + 'allCoupons',
      data: {
        page: 1,
        pagesize: pagesize
      },
      success: (res) => {
        var allcoupon = res.data

        var pagesize = this.data.pagesize + 8
        _this.setData({
          pagesize: pagesize
        })
        // console.log(res.data)
        // 获取用户以获取的优惠券
        wx.request({
          url: app.globalData.url + 'listCoupons',
          data: {
            mid: app.globalData.userInfo.mid
          },
          success: (res) => {
            wx.hideLoading()
            wx.hideNavigationBarLoading()

            var usercoupon = res.data
            // console.log(usercoupon)
            if (usercoupon.legth == 0) {
              _this.setData({
                coupons: allcoupon
              })
            } else {
              // 筛选当前用户可领优惠券
              for (let i = 0; i < usercoupon.length; i++) {
                let key = usercoupon[i].coupon_id
                for (let j = 0; j < allcoupon.length; j++) {
                  let temp = allcoupon[j]
                  if (key === temp.id) {
                    allcoupon.splice(j, 1)
                  }
                }
              }
              _this.setData({
                coupons: allcoupon
              })
            }
          }
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
          this.getAllCoupons(this.data.pagesize)
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
    wx.showLoading({
      title: '加载中...',
    })
    this.getAllCoupons(this.data.pagesize)
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
    this.getAllCoupons(this.data.pagesize)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})