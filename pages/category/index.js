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
    // toView: 'category1',
    // heightArr: [],
    top: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var res = wx.getSystemInfoSync().windowWidth
    // var scrollHight = Math.floor(750 / res * wx.getSystemInfoSync().windowHeight)
    wx.showNavigationBarLoading()
    var scrollHight = wx.getSystemInfoSync().windowHeight
    this.setData({
      // res: res,
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
        wx.hideNavigationBarLoading()
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
        // 计算右边分类数组区间
        // var heigth = 0
        // var heightArr = []
        // heightArr.push(heigth)
        // for (let i = 0; i < category.length; i++) {
        //   heigth = this.data.scrollHight * (i + 1)
        //   heightArr.push(heigth)
        // }
        this.setData({
          category: category
          // heightArr: heightArr
        })
      }
    })
  },

  onNavBarTap: function (e) {
    var idx = e.currentTarget.dataset.idx
    var top = this.data.scrollHight * idx
    this.setData({
      top: top,
      currentType: idx
      // toView: 'category' + idx
    })
  },

  // scroll: function (e) {
  //   var scrollTop = e.detail.scrollTop
  //   // 一级菜单和二级菜单联动
  //   for (let i = 0; i < this.data.category.length; i++) {
  //     let heightUp = this.data.heightArr[i]
  //     let heightDown = this.data.heightArr[i + 1]
  //     if (!heightDown || scrollTop >= heightUp && scrollTop < heightDown) {
  //       this.setData({
  //         currentType: i
  //       })
  //     }
  //   }
  // },

  toListTap: function (e) {
    var idx = e.currentTarget.dataset.idx
    var cidx = e.currentTarget.dataset.cidx
    wx.navigateTo({
      url: '../list/index?idx=' + idx + '&cidx=' + cidx
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