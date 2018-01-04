// pages/list/list.js
const app = getApp()
var CategoryUrl = app.globalData.url + 'goodsCategory'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: [],
    currentType: 0,
    scrollHight: null,
    arr: [],
    toView: 'category1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var res = wx.getSystemInfoSync().windowWidth
    var scrollHight = Math.floor(750 / res * wx.getSystemInfoSync().windowHeight)
    this.setData({
      scrollHight: scrollHight
    })
    this.getCategory()
  },

  getCategory: function () {
    wx.request({
      url: CategoryUrl,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        var category = []
        // for(let idx in res.data) {
        //   var obj = res.data[idx]
        //   if (obj.level == 1) {
        //     var temp= {
        //       id: obj.id,
        //       name: obj.name, 
        //       pic: obj.pic
        //     }
        //     category.push(temp)
        //   }
        // }
        // console.log(category)
        // this.setData({
        //   category: category,
        //   currentType: category[0].id
        // })

        this.setData({
          category: res.data,
          currentType: res.data[0].id
        })
      }
    })
  },

  onNavBarTap: function (e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      currentType: id,
      toView: 'category' + id
    })
  },

  toListTap: function (e) {
    var id = e.currentTarget.dataset.id
    var title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '../list/index?id=' + id + '&title=' + title
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