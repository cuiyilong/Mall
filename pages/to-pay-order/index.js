//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    goodsList: [],
    isNeedLogistics: 0,
    allGoodsPrice: 0,
    orderType: "",  //  订单类型,默认是购物车
    addrs: [],
    curAddressData: '',
    coupons: [], //所有可用优惠券
    coupon: {},
    couponPrice: 0,
    ids: null
  },

  onLoad: function (e) {
    var that = this
    //显示收货地址标识
    that.setData({
      isNeedLogistics: 1,
      orderType: e.orderType
    })
  },

  onShow: function () {
    // 获取当前选择优惠券
    var coupon = wx.getStorageSync('coupon')
    if (coupon) {
      this.setData({
        coupon: coupon,
        couponPrice: coupon.price
      })
    }

    var that = this
    var shopList = []
    //立即购买下单
    if ("buyNow" == that.data.orderType) {
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo')
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        shopList = buyNowInfoMem.shopList
      }
    } else {
      //购物车下单
      var shopCarInfoMem = wx.getStorageSync('shopCarInfo')
      if (shopCarInfoMem && shopCarInfoMem.shopList) {
        shopList = shopCarInfoMem.shopList.filter(entity => {
          return entity.active
        })
      }
    }
    that.setData({
      goodsList: shopList
    })
    that.initShippingAddress()
  },

  // 初始化地址信息
  initShippingAddress: function () {
    var that = this
    wx.request({
      url: app.globalData.url + 'listAddress',
      data: {
        mid: app.globalData.userInfo.mid
      },
      success: (res) => {
        var addrsList = res.data
        for (let i = 0; i < addrsList.length; i++) {
          var temp = addrsList[i]
          if (temp.status == 1) {
            that.setData({
              addrs: addrsList,
              curAddressData: temp
            })
          }
        }
        that.totalPrice()
      }
    })
  },
  // 计算订单总价
  totalPrice: function () {
    var goodsList = this.data.goodsList
    var isNeedLogistics = 0
    var allGoodsPrice = 0

    for (let i = 0; i < goodsList.length; i++) {
      let carShopBean = goodsList[i]
      if (carShopBean.logistics) {
        isNeedLogistics = 1
      }
      allGoodsPrice += carShopBean.goods.price * carShopBean.goods_num
    }
    allGoodsPrice = allGoodsPrice.toFixed(2)
    this.setData({
      allGoodsPrice: allGoodsPrice
    })

    this.getCoupons()
  },

  // 获取优惠券信息
  getCoupons: function (e) {
    var templist = this.data.goodsList
    var temp = []
    for (let i = 0; i < templist.length; i++) {
      let curItem = templist[i]
      temp.push(curItem.goods_id)
    }
    temp = temp.toString()
    this.setData({
      ids: temp
    })
    wx.request({
      url: app.globalData.url + 'orderCoupons',
      data: {
        mid: app.globalData.userInfo.mid,
        ids: temp,
        total: this.data.allGoodsPrice
      },
      success: (res) => {
        this.setData({
          coupons: res.data,
          // couponPrice: res.data[0].price
        })
      }
    })
  },

  chooseCouponTap: function (e) {
    var ids = e.currentTarget.dataset.ids
    var totalprice = e.currentTarget.dataset.totalprice
    wx.navigateTo({
      url: '/pages/choosecoupons/index?ids=' + ids + '&totalprice=' + totalprice,
    })
  },

  // 提交订单
  createOrder: function (e) {

    wx.showLoading()
    var that = this
    var remark = ""
    if (e) {
      remark = e.detail.value.remark // 备注信息
    }
    var postData = {
      mid: app.globalData.userInfo.mid,
      total: this.data.allGoodsPrice - this.data.couponPrice,
      remarks: remark,
      coupon: this.data.coupons[0].id ? this.data.coupons[0].id : '',
      bonus: this.data.coupons[0].title ? this.data.coupons[0].title : ''
    }
    if (that.data.isNeedLogistics > 0) {
      if (!that.data.curAddressData) {
        wx.hideLoading()
        wx.showModal({
          title: '错误',
          content: '请先设置您的收货地址！',
          showCancel: false
        })
        return
      }

      var goodslist = this.data.goodsList
      // console.log(goodslist)
      var templist = []
      for (var idx in goodslist) {
        var obj = goodslist[idx]
        var temp = {
          id: obj.goods_id,
          price: obj.goods.price,
          num: obj.goods_num,
          name: obj.title
        }
        templist.push(temp)
      }

      postData.goods = JSON.stringify(templist)
      postData.address = JSON.stringify({
        name: this.data.curAddressData.name,
        tel: this.data.curAddressData.tel,
        address: this.data.curAddressData.province + this.data.curAddressData.city + this.data.curAddressData.area + this.data.curAddressData.address
      })
    }

    wx.request({
      url: app.globalData.url + 'add2Order',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: postData,
      success: (res) => {
        wx.hideLoading()
        if (res.data.code == 1) {
          // 微信支付
          var out_trade_no = res.data.order.order_id
          var total_fee = res.data.order.price * 100
          var goodslist = this.data.goodsList
          var body = ''
          if (goodslist.length > 1) {
            body = goodslist[0].goods.title + '...等' + goodslist.length + '件商品'
          } else {
            body = goodslist[0].goods.title
          }
          wx.request({
            url: app.globalData.url + 'unifiedOrder',
            data: {
              openid: app.globalData.userInfo.openid,
              body: body,
              out_trade_no: out_trade_no,
              total_fee: total_fee
            },
            success: (res) => {
              wx.requestPayment({
                'timeStamp': res.data.timeStamp,
                'nonceStr': res.data.nonceStr,
                'package': res.data.package,
                'signType': res.data.signType,
                'paySign': res.data.paySign,
                'success': function (res) {
                  wx.navigateBack({})
                },
                'fail': function (res) {
                  wx.redirectTo({
                    url: '/pages/orders/index',
                  })
                }
              })
            }
          })
          // 清空购物车已购买商品
          wx.removeStorageSync('shopCarInfo')
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({})
              }
            }
          })
        }
      }
    })
  },

  addAddress: function () {
    wx.navigateTo({
      url: "/pages/address/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/address/index"
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 清空当前选中优惠券缓存，防止其他商品下单购物券错误
    wx.removeStorageSync('coupon')
  }
})
