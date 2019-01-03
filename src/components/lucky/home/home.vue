<template>
  <div class="home container"> 
    <div ref="myHeader">
      <my-header :my-balance="myBalance | toFixeds" @jumpRecord="jumpRecord" @jumpRule="jumpRule"></my-header>
    </div>
    <div class="select-category">
      <div ref="selectTitle" :class="['h3', 'flex-cen', showType == 1 ? 'on' : '']"><div class="flex-cen" @click="choiceOfPlay">{{rule_toast[curIndex_rule_toast].type}}<img src="../../../assets/lucky/images/icon_05.png" alt="" /></div></div>
      <div ref="selectBox">
        <div class="select-category-box" v-show="showType == 1">
          <dl class="clearfix">
            <dd v-for="(item, index) in rule_toast" v-if="item.id != 0" :class="[item.id == curIndex_rule_toast ? 'cur' : '']" :data-id="item.id" @click="selectCategory">{{item.type}}</dd>
          </dl>
        </div>
        <div class="issue-number" v-show="showType >= 2">
          <div class="issue-number-title flex-cen"><p>期号</p><p>开奖号码</p><p>十位</p><p>个位</p><p>后三</p></div>
          <div :class="['issue-number-box', showType == 3 ? 'max-height' : '']">
            <scroll class="scroll-box" ref="scrollIssueNumber">
              <ul>
                <li v-for="item in issueNumberList" :class="['flex-cen', item.status != 100 ? '' : 'wait-for']">
                  <p>{{item.displayNumber || 88888}}期</p>
                  <p>{{item.status == 800 ? item.awardResult.join('') : (item.status == 400 ? '等待开奖...' : '进行中')}}</p>
                  <p>{{item.tensType || '--'}}</p>
                  <p>{{item.unitType || '--'}}</p>
                  <p>{{item.numberType ? (item.numberType == 10 ? '组三' : '组六') : '--'}}</p> 
                </li>
                <li class="toast">以上为最近{{issueNumberList.length}}条记录</li>
              </ul>
            </scroll> 
          </div>
        </div>
      </div>
    </div> 
    <div :class="['ball-selection', showType == 3 ? 'on' : '', calcTotalNotes > 0 ? 'isSatisfy' : '']" :style="{top: (isTakeBack ? initialBallSelection_top : ballSelection_top) + 'px'}" v-swipeup="swipeup" v-swipedown="swipedown" v-drag="drag" @touchstart="touchstart">
      <div class="timing" @click="openIssueNumber(false)">
        <div class="timing-con">
          <div class="flex-cen" v-show="!isInterval">
            <p>距{{currentIssueNumber}}期截止：</p>
            <div class="timing-box"><timing ref="timing" @realTime="myRealTime" @timingEnd="myTimingEnd"></timing></div>
          </div>
          <p v-show="isInterval">当期已截止，等待下期</p>
        </div>
      </div>
      <div class="ball-selection-box">
        <scroll class="scroll-box" :data="selectIndexList" ref="scrollSelect" :pulldown="isPulldown" :listenScroll="isPulldown" @pulldown="pulldown" @scroll="listenScroll">
          <div>
            <h3>{{rule_toast[curIndex_rule_toast].toast}}</h3>
            <img v-show="false" src="../../../assets/lucky/images/icon_07s.png" alt="" />
            <ul v-show="curIndex_rule_toast != 8">
              <li v-for="(item, index) in selectIndexList" v-show="index >= showSelectNumber">
                <p>{{(curIndex_rule_toast == 3 || curIndex_rule_toast == 4 || curIndex_rule_toast == 6) ? '选号' : item.type}}</p>
                <dl class="clearfix">
                  <dd v-for="(items, indexs) in 10" :class="[selectIndexList[index].selectNum.indexOf(indexs) != -1 ? 'cur' : '']" :data-type="index" :data-index="indexs" @click="selectNumber">{{items - 1}}</dd>
                </dl>
              </li>
            </ul>
            <ul v-show="curIndex_rule_toast == 8" class="alternative">
              <li v-for="(item, index) in selectIndexList" v-show="index >= showSelectNumber">
                <p>{{item.type}}</p>
                <dl class="clearfix">
                  <dd v-for="(items, indexs) in rule_toast[curIndex_rule_toast].alternative" :class="[selectIndexList[index].selectNum.indexOf(indexs) != -1 ? 'cur' : '']" :data-type="index" :data-index="indexs" @click="selectNumber">{{items}}</dd>
                </dl>
              </li>
            </ul>
          </div>
        </scroll>
      </div>
    </div>
    <div class="betting-list" v-show="isShowBettingList" @click="bounceUpBetting">
      <div class="betting-list-box" @click.stop>
        <h3>已选投注</h3>
        <div class="empty"><span @click="emptyBetting">清空全部</span></div>
        <div :class="['scroll-betting-list', betting.length >= 4 ? 'on' : '']">
          <scroll :data="betting" class="scroll-betting-con" ref="scrollBetting">
            <ul>
              <li v-for="(item, index) in betting" v-show="item.selectNum.length != 0">
                <div class="delete" @click="delegateBettingItem(index)"></div>
                <div class="num"><div><p>{{item.type}}</p><span v-for="items in item.selectNum">{{item.id != 8 ? items : switchNumber(items)}}</span></div></div>
                <h4>{{item.stage}}期<span>共{{item.notes}}注</span></h4>
                <div class="add-reduce flex-bet">
                  <div><h5>预计收入</h5><span>{{rule_toast[item.id].base * item.times}}&nbsp;WLC</span></div>
                  <div class="add-reduce-box flex-cen">
                    <div :class="['btn', 'reduce', (isAddReduce == 1 && item.clickActivate) ? 'on' : '']" @click="addReduceNotes(index, '-')"></div>
                    <div class="number"><input type="number" pattern="\d*" v-model="item.times" @blur="backPageTop(index)" @input="input(index)"/>倍</div>
                    <div :class="['btn', 'add', (isAddReduce == 2 && item.clickActivate) ? 'on' : '']" @click="addReduceNotes(index, '+')"></div>
                  </div>
                </div>
              </li>
            </ul>
          </scroll>
        </div>
      </div>
    </div>
    <div :class="['betting', calcTotalNotes > 0 ? 'on' : '']">
      <div class="betting-con flex-ali">
      <transition name="bottom-top">
        <div class="cur-betting" v-show="isSelectNumber"><span v-for="(item, index) in selectIndexList" v-show="index >= showSelectNumber">{{item.selectNum.length != 0 ? (curIndex_rule_toast != 8 ? item.selectNum.join('') : switchNumber(item.selectNum.join(''))) : '--'}}</span></div>
      </transition>
        <div class="betting-box flex-bet">
          <div class="left flex-ali" @click="bounceUpBetting">
            <span>{{calcTotalNotes}}注</span>
            <div>
              <h4>{{total_money}}WLC</h4>
              <p>预计收入：{{total_estimate}}WLC</p>
            </div>
          </div>
          <div class="right" @click="confirmBet">确认投注</div>
        </div>
      </div>
    </div>
    <div v-if="!isPageData" class="loading-pageData flex-cen"><loading is-full="1" is-icon="1" :title="loadingConductTitle"></loading></div>
    <transition name="fadeInOut">
    <div v-if="isGuide && isNewUserGuide" :class="['guide', guideBackTransparent ? 'on' : '']">
      <div class="guide-box" :style="{top: guideBoxTop + 'px'}"><img src="../../../assets/lucky/images/hand.png" alt="" /></div>
    </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import MyHeader from 'components/lucky/my-header/my-header'
import MyLoading from 'components/lucky/loading/loading'
import Timing from 'components/lucky/timing/timing'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import { distanceFromCurrent, accMul, musicPlay, backPageTop, combination, stringToNumber } from 'common/js/util'
import { ERR_Ok, TOAST } from 'api/config'
import { TweenMax, Power2, TimelineLite } from "gsap"
import { mapState, mapMutations } from 'vuex'
import { getUserInfo, getIsNewUser, getCurrentInstance, getRecentRecord, ssc_purchase } from "api/request"
  export default {
    name: 'App',
    data() {
      return { 
        isNewUserGuide: false,//是否是新手
        isGuide: true,//新手指引显示
        isCurrentPage: false,//是否在当前页面
        isInterval: false,//每期之间间隔
        pollingTimes: 5000,//当在每期时间间隔轮询时间
        isPageData: false,//页面数据是否初始化
        loadingConductTitle: '',
        dragTop: 0,//滑动下拉距离
        isPulldown: true,//选球区是否可以下拉
        showType: 1,//控制显示玩法选择区和开奖历史区
        guideBoxTop: 200,
        guideBackTransparent: false,
        isDrag: false,//是否在下拉滑动
        isDragIng: false,//是否在当前一次的下拉滑动
        allowDropDown: false,//是否允许触发下拉展开选号区
        dragConfig: [50, 30],//下拉滑动阀值
        myHeader_h: 40,//header头部高度
        selectTitle_h: 30,//选择玩法title高度
        selectBox_h: 0,//选择玩法、开奖历史区域总区域高度
        isTakeBack: false,//是否为在显示开奖历史时收起选择号码区（先收再隐效果）
        currentIssueNumber: '----',//当前期号
        isShowBettingList: false,//已选投注列表 
        recentRecordCount: 50,//近期开奖记录条数
        issueNumberList: 50,//近期开奖记录
        isAddReduce: 0,//加减按钮控制器
        notesRange: [1, 100],//下注倍数范围
        rule_toast: [//所有玩法
                     { type:'五星通选', id: 0, base:100000, minSelectNum: 1, toast: '每位至少选1个号，按位猜对开奖号最高奖20440WLC' },
                     { type:'五星直选', id: 1, base:100000, minSelectNum: 1,  toast: '每位至少选1个号，按位猜对开奖号即中10000WLC' },
                     { type:'三星直选', id: 2, base:1000, minSelectNum: 1,  toast: '每位至少选1个号，按位猜对开奖后3位即中1000WLC' },
                     { type:'三星组三', id: 3, base:1000, minSelectNum: 2,  toast: '至少选2个号，猜对开奖后3位（顺序不限）中320WLC' },
                     { type:'三星组六', id: 4, base:1000, minSelectNum: 3,  toast: '至少选3个号，猜对开奖后3位（顺序不限）中160WLC' },
                     { type:'二星直选', id: 5, base:100, minSelectNum: 1,  toast: '每位至少选1个号，按位猜对开奖后2位即中100WLC' },
                     { type:'二星组选', id: 6, base:50, minSelectNum: 2,  toast: '至少选2个号，猜对开奖后2位（顺序不限）中50WLC' },
                     { type:'一星直选', id: 7, base:10, minSelectNum: 1,  toast: '至少选1个号，猜对开奖号码最后1位即中10WLC' },
                     { type:'大小单双', id: 8, base:4, minSelectNum: 1,  toast: '每位至少选1个号，猜对开奖后2位的属性即中4WLC', alternative: ['大', '小', '单', '双'] },
                    ],            
        curIndex_rule_toast: 1,//当前选定玩法索引id
        showSelectNumber: 0,//用来控制显示万千百十个位
        selectIndexList: [
                           { type: '万位', selectNum: [] },
                           { type: '千位', selectNum: [] },
                           { type: '百位', selectNum: [] },
                           { type: '十位', selectNum: [] },
                           { type: '个位', selectNum: [] },
                         ],
        betting: [//已选投注列表
                   // { type:'五星通选', selectNum: [], stage: '20181204069', notes: 0, income: 0, times: 1},
                   // { type:'五星直选', selectNum: [], stage: '20181204069', notes: 0, income: 0, times: 1},
                   // { type:'三星直选', selectNum: [], stage: '20181204069', notes: 0, income: 0, times: 1},
                   // { type:'三星组三', selectNum: [], stage: '20181204069', notes: 0, income: 0, times: 1},
                   // { type:'三星组六', selectNum: [], stage: '20181204069', notes: 0, income: 0, times: 1},
                   // { type:'二星直选', selectNum: [], stage: '20181204069', notes: 0, income: 0, times: 1},
                   // { type:'二星组选', selectNum: [], stage: '20181204069', notes: 0, income: 0, times: 1},
                   // { type:'一星直选', selectNum: [], stage: '20181204069', notes: 0, income: 0, times: 1},
                   // { type:'大小单双', selectNum: [], stage: '20181204069', notes: 0, income: 0, times: 1}
                 ],
        isCurrentNote: false,//用来判断在改当前注         
        calcTotalNotes: 0,//总注数
        calcBettingNums: 0,//已选投注种类
        total_estimate: 0,//总预计收入                                      
        total_money: 0,//总投注金额 
        interval_updating: null//自动刷新当前期定时器                                     
      }    
    },
    beforeCreate() {
    },
    created() {  
    },
    activated() {
      this.getIsNewUser()
      this.isCurrentPage = true
      /*if (this.isNewUserGuide) {
        this.newUserGuide(() => {
          this.isNewUserGuide = false
          this.pageDataInit()
        })
      } else {
        this.pageDataInit()
      }*/
    },
    beforeMount() {

    },
    mounted() {
      this.getEleHeight()
      //this.$refs.scrollIssueNumber.refresh()
      //this.$refs.scrollSelect.refresh()
    },
    computed: {
      //判断是否选了一个号
      isSelectNumber() {
        for (let i = 0; i < this.selectIndexList.length; i++) {
          if (this.selectIndexList[i].selectNum.length != 0) {
            return true
          }
        }
        return false
      },
      //判断当前选号是否满足一注以上选号
      isSatisfy() {
        for (let i = this.showSelectNumber; i < this.selectIndexList.length; i++) {
          if (this.selectIndexList[i].selectNum.length < this.rule_toast[this.curIndex_rule_toast].minSelectNum) {
            return false
          }
        }
        return true
      },
      ballSelection_top() {
        return this.myHeader_h + this.selectTitle_h + this.selectBox_h + this.dragTop
      },
      initialBallSelection_top() {
         return this.myHeader_h + this.selectTitle_h + this.dragTop
      },
      ...mapState({
        isLoading: 'isLoading',
        myBalance: 'myBalance'    
      })
    },
    methods: {
      //页面数据初始化
      pageDataInit(isSilenceRefresh) {
        if (!isSilenceRefresh) this.isPageData = false
        this.getUserInfo()//获取用户个人信息
        this.getCurrentInstance()//获取当前期
        this.getRecentRecord()//获取近期开奖记录
      },
      //是否为新用户 
      getIsNewUser() {
        getIsNewUser().then(res => {
          console.log(res)
          if (res.code === ERR_Ok) {
            if (res.data.sscBetCount == 0) {
              this.isNewUserGuide = true
            } else {
              this.isNewUserGuide = false
            }
            this.isPageData = true
            if (this.isNewUserGuide) {
              this.newUserGuide(() => {
                this.isNewUserGuide = false
                this.pageDataInit()
              })
            } else {
              this.pageDataInit()
            } 
          }
        }).catch(err => {
          this.$toast(TOAST[0])
          this.isPageData = true
          console.log(err)
        })
      },
      //用户个人信息
      getUserInfo() {
        getUserInfo().then(res => {
          if (res.code === ERR_Ok) {
            this.updateBalance({myBalance: res.data.wlcBalance})
          }
        }).catch(err => {
          this.$toast(TOAST[0])
          console.log(err)
        }) 
      },
      //获取当前彩期
      getCurrentInstance(callback) {
        getCurrentInstance().then(res => {
          if (res.code === ERR_Ok) {
            setTimeout(() => { this.isPageData = true }, 500)
            this.currentIssueNumber = res.data.displayNumber
            if (distanceFromCurrent(res.data.endTime) > 0) {
              this.isInterval = false
              this.$refs.timing.start(distanceFromCurrent(res.data.endTime))
            } else {
              this.isInterval = true
              if (!this.isCurrentPage) return
              setTimeout(() => { this.getCurrentInstance() }, this.pollingTimes)
            }
            if (callback) callback()
          }
          console.log(res)
        }).catch(err => {
          this.$toast(TOAST[0])
          this.isPageData = true
          console.log(err)
        })
      },
      //获取近期开奖记录
      getRecentRecord() {
        getRecentRecord(this.recentRecordCount).then(res => {
          if (res.code === ERR_Ok) {
            this.issueNumberList = res.data
          }
          console.log(res)
        }).catch(err => {
          this.$toast(TOAST[0])
        }) 
      },
      //确认投注
      confirmBet() {
        if (this.betting.length == 0) return
        console.log(this.betting)
        this.isPageData = false
        this.loadingConductTitle = '下注中'
        let _data = []
        for (let i = 0; i < this.betting.length; i++) {
          let _item = this.betting[i]
          let _obj = {
            multiple: _item.times
          }
          //100-五星直选，200-三星直选，300-三星组六，310-三星组三，400-二星直选，500-二星组选，600-一星直选，700-大小单双
          if (_item.id == 1) {
            _obj.betRule = 100
          } else if (_item.id == 2) {
            _obj.betRule = 200
          } else if (_item.id == 3) {
            _obj.betRule = 310
          } else if (_item.id == 4) {
            _obj.betRule = 300
          } else if (_item.id == 5) {
            _obj.betRule = 400
          } else if (_item.id == 6) {
            _obj.betRule = 500
          } else if (_item.id == 7) {
            _obj.betRule = 600
          } else if (_item.id == 8) {
            _obj.betRule = 700
          }
          if (_item.id == 1 || _item.id == 2 || _item.id == 5 || _item.id == 7) {
            let _items = ['g', 's', 'b', 'q', 'w']
            let _selectNum = _item.selectNum.reverse()
            for (let i = 0; i < _selectNum.length; i++) {
              //_obj[_items[i]] = JSON.stringify(stringToNumber(_selectNum[i].split('')))
              _obj[_items[i]] = stringToNumber(_selectNum[i].split(''))
            }
          } else if (_item.id == 3 || _item.id == 4 || _item.id == 6) {
            //_obj.groupNumbers = JSON.stringify(stringToNumber(_item.selectNum[0].split(''))
            _obj.groupNumbers = stringToNumber(_item.selectNum[0].split(''))
          } if (_item.id == 8) {
            _obj.tensPlaceOption = stringToNumber(_item.selectNum[0].split('')),
            _obj.unitOption = stringToNumber(_item.selectNum[1].split(''))
          }
          _data.push(_obj)
        }
        console.log(_data)
        ssc_purchase(_data).then(res => {
          if (res.code === ERR_Ok) {
            setTimeout(() => {
              this.isPageData = true
              this.emptyList()
              this.$toast('下注成功')
            }, 500)
          } else {
            setTimeout(() => {
              this.isPageData = true
              this.$toast(TOAST[0])
            }, 500)
          }
        }).catch(err => {
          this.$toast(TOAST[0])
          this.isPageData = true
          console.log(err)
        }) 
      },
      //点击每个球进行选号
      selectNumber(e) {
        let _type = parseInt(e.target.dataset.type)
        let _index = parseInt(e.target.dataset.index)
        let _selectIndex = this.selectIndexList[_type].selectNum.indexOf(_index)
        if (_selectIndex == -1) {
          this.selectIndexList[_type].selectNum.push(_index)
        } else {
          this.selectIndexList[_type].selectNum.splice(_selectIndex, 1)
        }
        this.selectIndexListSort()
        if (this.isSatisfy) {
          let _selectNum = []
          for (let i = 0; i < this.selectIndexList.length; i++) {
            if (this.selectIndexList[i].selectNum.length == 0) continue
            _selectNum.push(this.selectIndexList[i].selectNum.join(''))
          }
          let _group = {
            type: this.rule_toast[this.curIndex_rule_toast].type,
            id: this.rule_toast[this.curIndex_rule_toast].id,
            selectNum: _selectNum,
            stage: this.currentIssueNumber,
            times: 1
          }
          if (!this.isCurrentNote) {
            //正序this.betting.push(_group)
            this.betting.unshift(_group)
            this.isCurrentNote = true
          } else {
            //正序this.betting.splice(this.betting.length - 1, 1, _group)
            this.betting.splice(0, 1, _group)
          }
        } else {
          if (!this.isCurrentNote) return
          //正序this.betting.splice(this.betting.length - 1, 1)
          this.betting.splice(0, 1)
          this.isCurrentNote = false
          //this.betting[this.curIndex_rule_toast] = { type: this.rule_toast[this.curIndex_rule_toast].type, selectNum: [] }
        }
        this.calcTotalNote()
      },
      //计算单项注数、总注数
      calcTotalNote() {
        let _total = 0
        for (var i = 0; i < this.betting.length; i++) {
          let _typeId = this.betting[i].id
          //if (this.betting[i].selectNum.length == 0) continue
          let _num = 1
          if (_typeId <= 2 || _typeId == 5 || _typeId == 7 || _typeId == 8) {
            for (let j = 0; j < this.betting[i].selectNum.length; j++) {
              _num *= this.betting[i].selectNum[j].length
            }  
          } else if (_typeId == 3 || _typeId == 6) {
            _num = combination(parseInt(this.betting[i].selectNum[0].length), 2)
          } else if (_typeId == 4) {
            _num = combination(parseInt(this.betting[i].selectNum[0].length), 3)
          } 
          this.betting[i].notes = _num
          _total += _num   
        }
        this.calcTotalNotes = _total
        //this.calcBettingNum()
      },
      //计算总预计收入、总投注金额
      calcTotalEstimate() {
        let _total_estimate = 0
        let _total_money = 0
        for (var i = 0; i < this.betting.length; i++) {
          _total_estimate += this.rule_toast[this.betting[i].id].base * this.betting[i].times
          _total_money += this.betting[i].notes * this.betting[i].times * 2
        }
        this.total_estimate = _total_estimate
        this.total_money = _total_money
      },
      //选择玩法
      selectCategory(e) {
        this.curIndex_rule_toast = e.target.dataset.id
        this.swipeup()
        this.isCurrentNote = false
      },
      //清空当前选号
      emptySelectNumber() {
        this.selectIndexList.forEach((item) => {
          item.selectNum = []
        })
      },
      //删除已选投注列表某项
      delegateBettingItem(index) {
        this.$messagebox.confirm('删除当前已选投注组将不可恢复，确定执行此操作?', '删除投注').then(action => {
          if (index == 0 && this.isCurrentNote) {
            this.emptySelectNumber()
            this.isCurrentNote = false
          }
          this.betting.splice(index, 1)
          this.calcTotalNote()
          this.calcTotalEstimate()
          this.$toast('删除成功')
        }, () => {})  
      },
      //清空所有已选投注列表
      emptyBetting() {
        this.$messagebox.confirm('清空所有已选投注列表将不可恢复，确定执行此操作?', '清空投注').then(action => {
          this.emptyList()
          this.$toast('清空成功')
        }, () => {})
      },
      emptyList() {
        this.betting = []
        this.calcTotalNote()
        this.calcTotalEstimate()
        this.emptySelectNumber()
      },
      //将所有选号排序
      selectIndexListSort() {
        for (let i = 0; i < this.selectIndexList.length; i++) {
          this.selectIndexList[i].selectNum.sort()
        }
      },
      //获取dom高度
      getEleHeight() {
        this.myHeader_h = this.$refs.myHeader.offsetHeight
        this.selectTitle_h = this.$refs.selectTitle.offsetHeight
      },
      //计算高度
      dynamicCalcEleHeight() {
        this.$nextTick(() => {
          this.selectBox_h = this.$refs.selectBox.offsetHeight
        })
      },
      //下拉事件
      pulldown() {
        //this.openIssueNumber(true)
      },
      //监听滚动事件
      listenScroll(e) {
        if (e.y >= 0) {
          this.allowDropDown = true
        } else {
          this.allowDropDown = false
        }
      },
      //监听开始触摸事件
      touchstart() {
        this.isDragIng = true
      },
      //监听滑动拖拽事件
      drag(e) {
        if (!this.allowDropDown) return
        if(e.y > 0) {
          if (this.isDragIng) {
            this.showType < 2 ? this.showType = 2 : this.showType = 3
            this.isDragIng = false
          }
        }
        if (e.y > this.dragConfig[0]) {
          this.dragTop = this.dragConfig[1]
          this.isDrag = true
        }
        if (e.drag) { 
          this.dragTop = 0 
          if (this.isDrag) {
            this.allowDropDown = false
            this.isDrag = false
            this.showType <= 2 ? this.showType = 1 : this.showType = 2
            this.openIssueNumber(true)
          }
        }
      },
      //自定义事件--下拉事件--下拉选号区
      swipedown(e) {
        //this.openIssueNumber(true)
      },
      //自定义事件--上拉事件-->上拉选号区
      swipeup() {
        if (this.showType == 0) return
        this.isTakeBack = true
        //this.$refs.scrollSelect.refresh()
        setTimeout(() => {
          this.showType = 0
          this.$refs.scrollSelect.refresh()
        }, 550)
      },
      //弹起已下注列表
      bounceUpBetting() {
        this.isShowBettingList = !this.isShowBettingList
        setTimeout(() => {
          this.$refs.scrollBetting.refresh()
        }, 500)
      },
      //加减注数
      addReduceNotes(index, type) {
        if (type == '-') {
          this.betting[index].times > 1 ? (this.takeInverse('isAddReduce', 1), this.betting[index].clickActivate = true, setTimeout(() => { this.betting[index].clickActivate = false }, 500), this.betting[index].times--) : (this.betting[index].times == this.notesRange[0], this.$toast(`最小输入为${this.notesRange[0]}`))
        } else if (type == '+') {
          this.betting[index].times < 100 ? (this.takeInverse('isAddReduce', 2), this.betting[index].clickActivate = true, setTimeout(() => { this.betting[index].clickActivate = false }, 500), this.betting[index].times++) : (this.betting[index].times == this.notesRange[1], this.$toast(`最大输入为${this.notesRange[1]}`))
        }
        this.calcTotalEstimate()
      },
      //展开选号区
      openIssueNumber(isTouch) {
        if (this.showType < 2) {
          this.showType = 2
          this.isTakeBack = false
        } else if (this.showType == 2) {
          this.showType = 3
          this.isTakeBack = false
        } else if (this.showType == 3 && !isTouch) {
          this.isTakeBack = true
          setTimeout(() => {
            this.showType = 0
          }, 550)
        }
        this.dynamicCalcEleHeight()
        setTimeout(() => {
          this.$refs.scrollIssueNumber.refresh()
        }, 50)
      },
      //展开选择玩法区
      choiceOfPlay() {
        this.isTakeBack = false
        //this.showType != 1 ? this.showType = 1 : this.showType = 0
        this.showType != 1 ? this.showType = 1 : (this.isTakeBack = true, setTimeout(() => { this.showType = 0 }, 550))
        this.dynamicCalcEleHeight()
      },
      //输入框输入处理
      input(index) {
        let _votes = this.betting[index].times
        if (_votes >= this.notesRange[1]) {
          this.betting[index].times = this.notesRange[1]
          this.$toast(`最大输入${this.notesRange[1]}`)  
        }
      },
      //输入框失焦页面回到顶部
      backPageTop(index) {
        let _votes = this.betting[index].times
        if (!_votes || _votes < this.notesRange[0]) {
          this.$toast(`最小输入${this.notesRange[0]}`)
          this.betting[index].times = this.notesRange[0]
        }
        backPageTop()
      },
      //数字转换成单双
      switchNumber(val) {
        //if (this.curIndex_rule_toast != 8) return val
        let _str = ''
        for (let i = 0; i < val.length; i++) {
          _str += this.rule_toast[8].alternative[parseInt(val[i])]
        }  
        return _str  
      },
      //取反
      takeInverse(variable, newValue){
        let _original = this[variable]
        this[variable] = newValue || true
        setTimeout(() => {
          newValue ? this[variable] = _original : this[variable] = false
        }, 50)
      },
      //新用户指引效果
      newUserGuide(callback) {
        setTimeout(() => {
          this.guideBackTransparent = true
        }, 500)
        setTimeout(() => {
          this.guideBoxTop = 250
          this.showType = 2
          this.dragTop = this.dragConfig[1]  
          setTimeout(() => { 
            this.dragTop = 0
            this.showType = 1
            this.openIssueNumber(true) 
          }, 1000) 
        }, 2000)
        setTimeout(() => {
          this.guideBoxTop = 408
        }, 4000)
        setTimeout(() => {
          this.guideBoxTop = 458
          this.showType = 3
          this.dragTop = this.dragConfig[1]  
          setTimeout(() => { 
            this.dragTop = 0
            this.showType = 2
            this.openIssueNumber(true) 
          }, 1000) 
        }, 5000)
        setTimeout(() => {
          this.guideBoxTop = 408 
          setTimeout(() => { 
            this.swipeup()
          }, 500) 
        }, 7000)
        setTimeout(() => {
          setTimeout(() => { this.swipeup() }, 500)         
          setTimeout(() => { this.isGuide = false }, 1000) 
          setTimeout(() => { if (callback) callback() }, 2500)         
        }, 7500)
      },
      //路由跳转
      jumpRecord(isLottery) {
        if (isLottery) {
          this.isShowModal = false
          this.$router.push({ name: 'lotteryHistory', params: { isLottery: true } })
        } else {
          this.$router.push("../lucky/record")
        }
      }, 
      myRealTime() {

      },
      myTimingEnd() {
       console.log('本期时间到')
       this.pageDataInit(true)
       setTimeout(() => {
         this.getCurrentInstance(() => {
           this.$toast(`本期已切换，当前是${this.currentIssueNumber}期`)
         })
       }, 1000)
      },
      jumpRule() {
        this.$router.push("../lucky/rule") 
      }, 
      ...mapMutations({
        updateIsLoading: 'updateIsLoading',
        updateBalance: 'updateBalance'
      })    
    },
    filters: {
      //向下保留两位小数
      toFixeds(val) {
        let _num = String(val)
        let _index = _num.indexOf('.')
        if (_index == - 1) { return _num + '.00' }
        if (_num.length - _index == 2) {
          return _num + '0'
        } else if (_num.length - _index == 3) {
          return _num
        } else  if (_num.length - _index > 3) {
          return _num.slice(0, _index + 3)
        }
      } 
    },
    watch: {
      //监听玩法选择
      curIndex_rule_toast(newValue) {
        let _newValue = parseInt(newValue)
        switch (_newValue){
          //case 0://五星通选
          //this.showSelectNumber = 0
          case 1://五星直选
          this.showSelectNumber = 0
          break
          case 2://三星直选
          this.showSelectNumber = 2
          break
          case 3://三星组选
          this.showSelectNumber = 4
          break
          case 4://三星组六
          this.showSelectNumber = 4
          break
          case 5://二星直选
          this.showSelectNumber = 3
          break
          case 6://二星组选
          this.showSelectNumber = 4
          break
          case 7://一星直选
          this.showSelectNumber = 4
          break          
          case 8://大小单双
          this.showSelectNumber = 3
          break
        }
        this.emptySelectNumber()
      },
      //监听总注数变化
      calcTotalNotes() {
        this.calcTotalEstimate()
      },
      //监听已选投注列表
      betting: {
        handler (newValue, oldValue) {
          //console.log(newValue)
          //console.log(oldValue)
          if (newValue.length == 0) {
            this.isShowBettingList = false
          }
        },
        deep: true
      }
    },
    components: { 
      MyHeader,
      MyLoading,
      Scroll,
      Timing,
      Loading
    },
    beforeDestroy() {

    },
    destroyed() {

    },
    deactivated() {
      this.isCurrentPage = false
      if (this.interval_updating) clearTimeout(this.interval_updating)
    }
  } 
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/style/mixin'
  .container
    background:linear-gradient(180deg,rgba(22,107,206,1) 0%,rgba(1,132,208,1) 100%)
    color: #fff 
    font-size: 0
    min-height: 100vh
    text-align: left
    .guide
      fixed-full(1000)
      transition-delay: .5s !important
      transition: all 1s
      .guide-box
        width: 1.03rem
        position: absolute
        left: calc(50% + .15rem)
        //top: 50%
        transform: translateX(-50%)
        transition: all .5s
        img
          width: 100%
          margin-left: 1rem
          transition: all .5s
      &.on
        background: rgba(0,0,0,.2)
        img
          margin-left: 0      
    .loading-pageData
      absolute-full(500)  
    .select-category
      .h3
        height: h =.24rem
        line-height: h
        text-align: center
        font-size: .17rem
        font-family: PingFangSC
        font-weight: 600
        color: #fff
        text-shadow:0px 1px 1px rgba(38,117,209,1)
        padding-bottom: .06rem
        &.on img
          transform: rotate(180deg)
        img
          width: .2rem
          height: .24rem
          transform-origin: center
          transition: all .5s
      .select-category-box
        padding: .05rem .17rem
        text-align: center
        dl dd   
          float: left
          width: 30%
          margin: .05rem 0
          height: h = .28rem    
          line-height: h 
          back-image('../../../assets/lucky/images/btn_01.png')
          font-size: .13rem
          font-weight: bold
          color: rgba(0,121,226,1)
          &:nth-child(3n - 1)
            margin: .05rem 5%
          &.cur
            background-image: url('../../../assets/lucky/images/btn_01s.png') 
      .issue-number
        padding: .1rem .22rem .13rem .16rem
        background: #1288DA url('../../../assets/lucky/images/bg_01.png') no-repeat center top
        background-size: 100%
        margin-top: .05rem
        text-align: left
        .issue-number-box
          height: 1.09rem
          //height: 2.24rem
          .scroll-box
            height: 100%
            overflow: hidden
          &.max-height
            height: 2.24rem  
        .issue-number-title
          height: h =.18rem
          line-height: h
          font-size: .13rem
          font-family: PingFangSC
          font-weight: bold;
          color: rgba(207,231,247,1)
          margin-bottom: .08rem
          white-space: nowrap
        p:first-child
          width: 22% 
        p:nth-child(2)
          width: 30%
        p:nth-child(3)
          width: 8%
        p:nth-child(4)
          width: 8%
          margin: 0 12%
        p:nth-child(5)
          width: 8% 
        ul li
          height: h = .17rem
          line-height: h
          color: rgba(137,195,236,1)
          font-size: .12rem
          white-space: nowrap
          &.toast
            padding: .15rem 0
            text-align: center
            color: #fff
          p:nth-child(2)~p
            color: rgba(207,231,247,1)                
          &:not(:last-child)
            margin-bottom: .06rem
          &.wait-for p:nth-child(2)
            color:rgba(255,186,106,1)
    .ball-selection
      position: fixed
      width: 100%
      left: 0
      //top: .7rem
      bottom: 0
      z-index: 200
      transition: top .5s
      &.isSatisfy
        bottom: .56rem
      .timing
        height: h = .3rem
        position: relative
        back-image('../../../assets/lucky/images/bg_03.png')
        z-index: 100
        p
          font-size: .11rem
          font-family: PingFangSC
          color: rgba(160,207,240,1)
          text-align: center
          height: _h = .23rem
          line-height: _h
          position: relative
          z-index: 5
        .timing-box
          position: relative
          z-index: 10  
          padding-left: .05rem
        &::before
          content: ''
          display: block
          width: 100%
          height: .23rem  
          background:linear-gradient(180deg,rgba(38,160,239,1) 0%,rgba(14,134,217,1) 10%,rgba(26,140,222,1) 86%,rgba(21,137,220,1) 100%)
          position: absolute
          left: 0
          top: 0
          z-index: 1
        &::after
          content: ''
          display: block
          width: .46rem
          height: .08rem
          back-image('../../../assets/lucky/images/icon_06.png')
          background-size: .16rem
          background-position: center top
          position: absolute
          left: calc(50% - .23rem)
          bottom: 0
          transform-origin: center
          z-index: 10
      &.on .timing::after
        transform: rotate(180deg)
        background-position: center bottom        
      .ball-selection-box
        back-image('../../../assets/lucky/images/bg_02.png')
        height: calc(100% - .23rem)
        margin-top: -.07rem
        .scroll-box
          height: 100%
          overflow: hidden
        h3
          height: h = .17rem
          line-height: h
          font-size: .12px
          font-family: PingFangSC
          color: #fff
          padding: .15rem 0 .1rem 
          text-align: center
        ul
          padding-bottom: .1rem
          &.alternative dd
            font-size: .24rem
            margin: 0 .13rem
          &.alternative li
            padding-bottom: .24rem   
          li
            padding: 0 0 .14rem .46rem
            position: relative
            p  
              width: .33rem
              padding: .08rem .115rem 0 .085rem
              box-sizing: border-box
              height: .58rem
              back-image('../../../assets/lucky/images/icon_08.png')
              position: absolute
              left: -.03rem
              top: -1px
              font-size: .13rem
              font-family: PingFangSC
              font-weight: bold
              line-height: .18rem
              color:rgba(37,120,210,1)
        dl 
          dd
            width: .52rem
            height: h =.52rem
            line-height: h
            text-align: center
            back-image('../../../assets/lucky/images/icon_07.png')
            box-shadow:0px 2px 2px rgba(50,135,191,0.6)
            float: left
            margin: .05rem
            border-radius: 50% 
            font-size: .27rem
            font-family: "DIN-BOLD"
            font-family: DIN-BOLD
            font-weight: bolder
            color: rgba(193,232,255,1)
            text-shadow: 0px 1px 3px rgba(60,138,214,1) 
            &.cur
              background-image: url('../../../assets/lucky/images/icon_07s.png')
              color: rgba(227,89,3,1)
              text-shadow: none
    .betting-list
      width: 100%
      height: 100%
      position: fixed
      left: 0
      bottom: 0
      padding-bottom: .56rem
      background:rgba(0,20,43,.5)
      box-sizing: border-box
      z-index: 300
      .betting-list-box
        position: absolute
        width: 100%
        left: 0
        bottom: .56rem
        padding: 0 .16rem
        box-sizing: border-box
        back-image('../../../assets/lucky/images/bg_05.png')
        animation: bottom-top .5s forwards
        h3
          width: 1.1rem
          height: h =.34rem
          line-height: h
          text-align: center
          back-image('../../../assets/lucky/images/bg_04.png')
          position: absolute
          top: -.02rem
          left: calc(50% - .55rem)
          font-size: .15rem
          font-family: PingFangSC;
          font-weight: 600
          color:rgba(180,222,255,1)
        .empty
          text-align: right
          height: h = .18rem
          line-height: h
          font-size: .13rem
          font-family: PingFangSC
          font-weight: bold
          color: rgba(223,236,249,1)
          padding: .15rem 0 
        ul
          padding-bottom: .3rem
          li
            padding: .12rem 0
            border-top: 1px solid #91C1ED
            border-bottom: 1px solid #91C1ED
            position: relative
            .delete
              width: .12rem
              height: .12rem
              back-image('../../../assets/lucky/images/btn_close.png')
              position: absolute
              right: 0
              top: .16rem 
            .num
              line-height: .21rem
              font-size: .15rem
              font-family: PingFangSC
              color:rgba(24,118,217,1)
              word-wrap: break-word;
              p
                margin-right: .16rem
                font-weight: bold
                display: inline-block
                vertical-aligen: top
            span
              color: #fff
              margin-right: .15rem
              display: inline-block
            h4
              height: h = .17rem
              line-height: h
              font-size: .12rem
              font-family: PingFangSC
              color: rgba(255,255,255,.6)
              margin: .04rem 0 .12rem
              span
                padding-left: .16rem
                color: rgba(255,255,255,.6)
            .add-reduce
              h5
                height: h = .16rem
                line-height: h
                font-size: .11rem
                font-family:  PingFangSC;
                color: rgba(255,255,255,.6) 
                margin-bottom: .04rem
              span
                display: block
                height: h = .17rem
                line-height: h
                font-size: .12rem
                font-family: PingFangSC
                font-weight: bold
                color: #fff
              .btn
                width: .28rem
                height: .28rem
                back-image('../../../assets/lucky/images/btn_04.png')
                &.on
                  back-image('../../../assets/lucky/images/btn_04s.png')
                &.add
                  back-image('../../../assets/lucky/images/btn_05.png')
                  &.on
                    back-image('../../../assets/lucky/images/btn_05s.png')
              .number
                width: .71rem
                height: h = .23rem
                line-height: h
                text-align: center
                background: linear-gradient(180deg,rgba(56,140,235,1) 0%,rgba(67,156,232,1) 100%)
                box-shadow: 0px 1px 1px rgba(154,210,255,1)
                border-radius: .05rem
                margin: 0 .05rem 
                font-size: 0
                input
                  width: 100%
                  height: h
                  line-height: h
                  text-align: center
                  font-size: .12rem
                  font-family: PingFangSC
                  font-weight: bold
                  background: none
                  color: #fff 
    .scroll-betting-list
      height: auto
      .scroll-betting-con 
        height: 100%
        overflow: hidden
      &.on
       height: 4.98rem                            
    .betting
      position: fixed
      width: 100%
      left: 0
      bottom: 0
      z-index: 400
      transform: translateY(100%)
      transition: all .5s
      &.on
        transform: translateY(0)
      .betting-con
        box-sizing: border-box
        position: relative
        z-index: 20
        .betting-box
          height: .56rem
          background: linear-gradient(360deg,rgba(22,107,206,1) 0%,rgba(42,163,234,1) 100%)
          padding:0 .1rem
          width: 100%
          position: relative
          z-index: 50
          text-align: left
          .left
            span
              display: block
              //width: .38rem
              height: h = .26rem
              line-height: h
              text-align: center
              //back-image('../../../assets/lucky/images/btn_02.png')
              //background-size: 100% 100%
              background: linear-gradient(180deg, #7172F1, #4646CE)
              border: .02rem solid #95C9E3
              box-shadow:0px 2px 2px rgba(13,75,147,0.31)
              border-radius: h
              margin-right: .1rem
              font-size: .11rem
              font-family: PingFangSC
              padding: 0 .1rem
            h4
              height: h = .2rem
              line-height: h  
              font-size: .14rem
              font-family: PingFangSC
              font-weight: bold
            p
              height: h = .18rem
              line-height: h
              font-size: .12rem
              font-family: PingFangSC;
              color: rgba(255,255,255,.6)
          .left
            flex: 1    
          .right
            width: 1.3rem
            height: h = .42rem
            line-height: h
            text-align: center
            back-image('../../../assets/lucky/images/btn_03.png')
            font-family: Helvetica
            font-weight: bold
            color:rgba(255,255,255,1)
            text-shadow:0px 1px 2px rgba(42,177,42,1)
            font-size: .17rem
          &.on
            background-image: url('../../../assets/lucky/images/btn_03s.png') 
        .cur-betting
          width: 100%
          height: h =.2rem
          line-height: h
          background: rgba(245,244,225,.95)
          position: absolute
          left:0
          bottom: 100%
          padding-left: .08rem
          box-sizing: border-box
          transition: all .5s
          z-index: 20
          text-align: left
          span
            font-size: .13rem
            font-family: PingFangSC
            font-weight: bold
            color: rgba(227,89,3,1)
            margin-right: .25rem
  .bottom-top-enter, .bottom-top-leave-active
    opcity: 0
    transform: translateY(100%)
  .fadeInOut-leave-active
    opcity: 0
    transform: translateX(100%)                     
</style>
 