<template>
  <div class="three-home">
    <div class="nav">
      <img src="../../assets/3d/image/back.png" alt="" class="back" @click="goBack">
      <img src="../../assets/3d/image/coin.png" alt="" class="coin">
      <div class="balance">{{balance}}</div>
      <div class="pm">WLC</div>
      <div class="right">
        <img src="../../assets/3d/image/record.png" alt="" class="record" @click="goRecord">
        <img src="../../assets/3d/image/rule.png" alt="" class="rule" @click="goRule">
      </div>
    </div>
    <div class="tab">
      <div class="block" v-for="item in tabData" :key="item.id" :class="activeTab == item.id? 'active'+item.id:''" @click="tabChange(item.id)">
        {{item.name}}
      </div>
    </div>
    <div class="tab-content" :style="{backgroundImage:'url('+tabBk+')'}">
      <img src="../../assets/3d/image/bai.png" alt="" class="block" v-show="activeTab == 1 && expandHeight== '0'">
      <img src="../../assets/3d/image/xuan.png" alt="" class="block" v-show="(activeTab == 3&& expandHeight== '0') || (activeTab == 4&& expandHeight== '0')">
      <img src="../../assets/3d/image/chong.png" alt="" class="block" v-show="activeTab == 2 && expandHeight== '0'">
      <img :src="bk2" alt="" style="display:none;">
      <img :src="bk3" alt="" style="display:none;">
      
      <div class="ending">
        <span style="display:flex;align-items: center;">距{{issueNo}}期截止：
         <timing :times="times" ref="timing" class="three"></timing>
        </span>
      </div>
      <div class="record" @click="showHistory" id="record">开奖历史</div>
      <div class="history"  :style="{height:expandHeight}" id="history">
        <table class="head">
          <tr>
            <th style="width:40%;">期号</th>
            <th style="width:30%;">开奖号码</th>
            <th style="width:30%;">形态</th>
          </tr>
        </table>
        <div class="body">
          <table >
            <tr v-for="item in awardData" :key="item.id">
              <th style="width:40%;">{{item.issue}}期</th>
              <th style="width:30%;color:#EF900F;">{{item.awardCode.join('')}}</th>
              <th style="width:30%;" v-if="item.type == 300">组六</th>
              <th style="width:30%;" v-if="item.type == 200">组三</th>
              <th style="width:30%;" v-if="item.type == 100">豹子</th>
            </tr>
          </table>
        </div>
      </div>
      <div class="number">
        <div class="hundreds">
          <div class="line" v-for="item in numberData1" :key="item.name" :class="item.id" @click="hundredsClick(item)">
            <span>{{item.name}}</span>  
          </div>
        </div> 
        <div class="tenDigit" v-if="activeTab == 2 || activeTab == 1">
          <div class="line" v-for="item in numberData2" :key="item.name" :class="item.id" @click="tenClick(item)">
            <span>{{item.name}}</span>
          </div>
        </div> 
        <div class="singleDigit" v-if="activeTab == 1">
          <div class="line" v-for="item in numberData3" :key="item.name" :class="item.id" @click="singleClick(item)">
            <span>{{item.name}}</span>
          </div>
        </div>
      </div>
    </div> 
    <div class="select-bet" v-if="listShow">
      <div class="content">
        <div class="info">
          <span>已选投注</span>
          <span @click="clearAll">清空全部</span>
        </div>
        <div class="line" v-for="item in betArray" :key="item.id">
          <div class="title">
            <div class="flex-h-center">
              <div style="color:#A86F16;margin-right:0.32rem;">{{item.name}}</div>
              <div style="color:#EF900F;">
                <span v-for="value in item.number" :key="value.id" style="margin:0 0.1rem;">{{value}}</span>
              </div>
            </div>
           <div class="close">x</div>
          </div>
          <div class="num">
            <span style="margin-right:0.2rem;">{{issueNo}}期</span>
            <span>共{{item.betCount}}注</span>
          </div>
          <div class="expect">预计收入</div>
          <div class="price">
            <div style="color:#EF900F;">{{item.expected}}WLC</div>
            <div class="count">
              <v-touch class="cut"  @touchstart.native="cutStart" @touchend.native="cutEnd(item)" :style="{backgroundImage:'url('+mcBk+')'}">-</v-touch>
              <div class="val">{{item.multiple}}倍</div>
              <v-touch class="add"  @touchstart.native="addMStart" @touchend.native="addMEnd(item)" :style="{backgroundImage:'url('+maBk+')'}">+</v-touch>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <v-touch class="cart"  @touchstart.native="addStart" @touchend.native="addEnd" :style="{backgroundImage:'url('+cartBk+')'}">
        <img :src="cartA" alt="" style="display:none;">
        <img :src="betA" alt="" style="display:none;">
      </v-touch>
      <div class="amount">
        <div>{{totalPrice}}WLC</div>
        <div>预计收入：{{expected}}WLC</div>
      </div>  
      <v-touch class="bet" 
        @touchstart.native="betStart" 
        @touchend.native="betEnd" 
        :style="{backgroundImage:'url('+betBk+')'}">确认投注</v-touch>
    </div>
  </div>
</template>

<script>
import Timing from 'components/lottery/timing/timing';
import bk1 from '../../assets/3d/image/number-bk1.png';
import bk2 from '../../assets/3d/image/number-bk2.png';
import bk3 from '../../assets/3d/image/number-bk3.png';
import cart from '../../assets/3d/image/cart.png';
import cartA from '../../assets/3d/image/cart-active.png';
import bet from '../../assets/3d/image/bet.png';
import betA from '../../assets/3d/image/bet-active.png';
import m from '../../assets/3d/image/action.png';
import mA from '../../assets/3d/image/action-active.png';
import { threeBet,threeAwardRecord,get3dCurrent,getUserInfo} from "api/request"
import { combination} from "api/config"
import { distanceFromCurrent } from 'common/js/util'
import bridge from '@/tools/bridge.js'
export default {
  name: 'home',
  components: {
    Timing
  },
  data(){
    return {
      activeTab:1,
      numberData1:[{
        name:0,
        id:''
      },{
        name:1,
        id:''
      },{
        name:2,
        id:''
      },{
        name:3,
        id:''
      },{
        name:4,
        id:''
      },{
        name:5,
        id:''
      },{
        name:6,
        id:''
      },{
        name:7,
        id:''
      },{
        name:8,
        id:''
      },{
        name:9,
        id:''
      }],
      numberData2:[{
        name:0,
        id:''
      },{
        name:1,
        id:''
      },{
        name:2,
        id:''
      },{
        name:3,
        id:''
      },{
        name:4,
        id:''
      },{
        name:5,
        id:''
      },{
        name:6,
        id:''
      },{
        name:7,
        id:''
      },{
        name:8,
        id:''
      },{
        name:9,
        id:''
      }],
      numberData3:[{
        name:0,
        id:''
      },{
        name:1,
        id:''
      },{
        name:2,
        id:''
      },{
        name:3,
        id:''
      },{
        name:4,
        id:''
      },{
        name:5,
        id:''
      },{
        name:6,
        id:''
      },{
        name:7,
        id:''
      },{
        name:8,
        id:''
      },{
        name:9,
        id:''
      }],
      times:'',
      balance:0,
      awardData:[],
      issueNo:0,
      listShow:false,
      mcBk:m,
      maBk:m,
      betArray:[],
      orderSelectArray:[],
      groupThreeSingleArray :[],
      groupThreeDoubleArray :[],
      groupSixArray :[],
      expandHeight: '0',
      selectNum3:[],//组三选号
      selectNum6:[],//组6选号
      doubleNum:[],//重号
      singleNum:[],//单号
      hundreds:[],//百位
      ten:[],//十位
      single:[],//个位
      totalPrice:0,
      expected:0,
      tabBk:bk1,
      bk2:bk2,
      bk3:bk3,
      cartA:cartA,
      cartBk:cart,
      betBk:bet,
      betA:betA,
      tabData:[{
        name:'直选',
        id:1
      },{
        name:'组三单式',
        id:2
      },{
        name:'组三复式',
        id:3
      },{
        name:'组六',
        id:4
      }]
    }
  },
  watch:{
    activeTab(newVal,oldVal){
      if (newVal == 1) {
        this.tabBk = bk1;
        this.setArr(this.single,this.numberData3)
        this.setArr(this.ten,this.numberData2)
        this.setArr(this.hundreds,this.numberData1)
      } else if (newVal == 2) {
        this.tabBk = bk2;
        this.setArr(this.doubleNum,this.numberData1)
        this.setArr(this.singleNum,this.numberData2)
      } else if(newVal == 3){
        this.tabBk = bk3
        this.setArr(this.selectNum3,this.numberData1)
      } else if (newVal == 4){
        this.tabBk = bk3
        this.setArr(this.selectNum6,this.numberData1)
      }
    },
    orderSelectArray(newVal,oldVal) {
      console.log(newVal)
    }
  },
  mounted() {
    const self = this;
    this.addScript();
    get3dCurrent().then(res=>{
      this.issueNo = res.data.issueNo;
      this.$refs.timing.start(distanceFromCurrent(res.data.deadline))    
    })
    getUserInfo().then(res=>{
      this.balance = Math.floor(res.data.wlcBalance * 100) / 100;;
    });
    this.$nextTick(function() {
      document.addEventListener("touchstart",function(e){
        if (!document.getElementById('history').contains(e.target) && e.target !== document.getElementById('record')) {
          self.expandHeight = '0'
        }
      });
    })
  },
  activated() {
    this.addScript();
  },
  methods:{
    addScript() {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "./static/js/dice.js";
      document.body.appendChild(script);
    },
    goBack(){
      if (typeof wayki != 'undefined') {
        wayki.finishActivity()
      } else {
          bridge.callhandler("notifyAppPop")
      }
    },
    tabChange(id) {
      this.activeTab = id;
      this.clearAll();
      this.calculatePrice();
    },
    singleClick(i) {
      for (const v of this.numberData3) {
        if (v.name == i.name && i.id == 'active') {
          v.id = '';
          this.single.splice(this.single.findIndex(item => item.name === i.name), 1)
        } else if (v.name == i.name && i.id == '') {
          v.id = 'active';
          this.single.push(v.name);
        }
      }
      this.calculatePrice();
    },
    // 清空已选数据
    clearAll() {
      this.single = this.ten = this.hundreds = this.singleNum = this.doubleNum = this.selectNum3 = this.selectNum6 =[];
    },
    tenClick(i) {
      for (const v of this.numberData2) {
        if (v.name == i.name && i.id == 'active') {
          v.id = '';
          if (this.activeTab == 1) {
            this.ten.splice(this.ten.findIndex(item => item.name === i.name), 1)
          } else if (this.activeTab == 2) {
            this.singleNum.splice(this.ten.findIndex(item => item.name === i.name), 1)
          }
        } else if (v.name == i.name && i.id == '') {
          v.id = 'active';
          if (this.activeTab == 1) {
            this.ten.push(v.name);
          } else if (this.activeTab == 2) {
            this.singleNum.push(v.name);
          }
        }
      }
      this.calculatePrice();
    },
    hundredsClick(i) {
      for (const v of this.numberData1) {
        if (v.name == i.name && i.id == 'active') {
          v.id = '';
          if (this.activeTab == 1) {
            this.hundreds.splice(this.hundreds.findIndex(item => item.name === i.name), 1)
          } else if (this.activeTab == 2) {
            this.doubleNum.splice(this.hundreds.findIndex(item => item.name === i.name), 1)
          } else if (this.activeTab == 3){
            this.selectNum3.splice(this.hundreds.findIndex(item => item.name === i.name), 1)
          } else if (this.activeTab == 4){
            this.selectNum6.splice(this.hundreds.findIndex(item => item.name === i.name), 1)
          }
        } else if (v.name == i.name && i.id == '') {
          v.id = 'active';
          if (this.activeTab == 1) {
            this.hundreds.push(v.name);
          } else if (this.activeTab == 2) {
            this.doubleNum.push(v.name);
          } else if (this.activeTab == 3){
            this.selectNum3.push(v.name); 
          } else if (this.activeTab == 4){
            this.selectNum6.push(v.name);
          }
        }
      }
      this.calculatePrice();
    },
    showHistory() {
      this.expandHeight = this.expandHeight == '0'? '80%':'0';
      // 获取数据
      const data = {
        "currentPage": 1,
        "pageSize": 20
      }
      if(this.expandHeight == '80%') {

        threeAwardRecord(data).then(res=>{
          this.awardData = res.data.data;
        })
      }
    },
    // 计算当前下注金额并自动加注
    calculatePrice() {
      this.totalPrice =0;
      this.expected =0;
      if (this.activeTab == 1) {
        if (this.ten.length>0&&this.single.length>0&&this.hundreds.length>0) {
          this.totalPrice = this.ten.length*this.single.length*this.hundreds.length*2;
          this.expected = this.ten.length*this.single.length*this.hundreds.length*1040;
          this.orderSelectArray.push({
            name:'直选',
            number:[this.hundreds.sort().join(''),this.ten.sort().join(''),this.single.sort().join('')],
            betCount: this.ten.length*this.single.length*this.hundreds.length,
            multiple:1,
            expected:this.ten.length*this.single.length*this.hundreds.length*1040
          });
          this.addBet();
        } 
      } else if (this.activeTab == 2) {
        if (this.singleNum.length >0&&this.doubleNum.length>0) {
          this.totalPrice = this.singleNum.length*this.doubleNum.length*2;
          this.expected = this.singleNum.length*this.doubleNum.length*346;
          this.groupThreeSingleArray = [{
            name:'组三单式',
            number:[this.doubleNum.sort().join(''),this.singleNum.sort().join('')],
            betCount: this.doubleNum.length*this.singleNum.length,
            multiple:1,
            expected:this.singleNum.length*this.doubleNum.length*346
          }]
        }else {
          this.groupThreeSingleArray=[]
        }
      } else if (this.activeTab == 3){
        if (this.selectNum3.length >= 2) {
          this.totalPrice = combination(this.selectNum3.length,2)*2;
          this.expected = combination(this.selectNum3.length,2)*346;
          this.groupThreeDoubleArray = [{
            name:'组三复式',
            number:[this.selectNum3.sort().join('')],
            betCount: combination(this.selectNum3.length,2),
            multiple:1,
            expected:combination(this.selectNum3.length,2)*346
          }]
        } else {
          this.groupThreeDoubleArray =[];
        }
      } else if (this.activeTab == 4) {
        if (this.selectNum6.length >= 3) {
          this.totalPrice = combination(this.selectNum6.length,3)*2;
          this.expected = combination(this.selectNum6.length,3)*173;
          this.groupSixArray = [{
            name:'组六',
            number:[this.selectNum6.sort().join('')],
            betCount: combination(this.selectNum6.length,3),
            multiple:1,
            expected:combination(this.selectNum6.length,3)*173
          }]
        } else {
          this.groupSixArray = [];
        }
      }
    },
    // 自动加注
    addBet(){
      this.betArray = this.betArray.concat(this.orderSelectArray,this.groupThreeSingleArray,this.groupThreeDoubleArray,this.groupSixArray);
      this.setTotal();
    },
    // 校验直选
    checkorderSelect() {
      if(this.single.length == 0) {this.$toast('请选择个位数字'); return false;}
      if(this.ten.length == 0) {this.$toast('请选择十位数字'); return false;}
      if(this.hundreds.length == 0) {this.$toast('请选择百位数字'); return false;}
      return true;
    },
    // 校验组三单式
    checkgroupThreeSingle() {
      if(this.doubleNum.length == 0) {this.$toast('请选择重号数字'); return false;}
      if(this.singleNum.length == 0) {this.$toast('请选择单号数字'); return false;}
      return true;
    },
    // 校验组三复式
    checkgroupThreeDouble() {
      if(this.selectNum3.length < 2) {this.$toast('至少选择两个数'); return false;}
      return true;
    },
    // 校验组6
    checkgroupSix() {
      if(this.selectNum6.length < 3) {this.$toast('至少选择三个数'); return false;}
      return true;
    },
    addStart() {
      this.cartBk = cartA;
    },
    addEnd() {
      this.cartBk = cart;
      this.listShow = !this.listShow;
    },
    setTotal() {
      let price = 0,expected=0;
      for(const v of this.betArray) {
        price += v.betCount*v.multiple*2;
        expected += v.expected*v.multiple;
      }
      // this.totalPrice = price;
      // this.expected = expected;
    },
    cutStart() {
      this.mcBk = mA;
    },
    // 倍数-1
    cutEnd(i) {
      this.mcBk = m;
      console.log(i,this.betArray)
      for (const v of this.betArray) {
        if (i.name == v.name) {
          v.multiple = v.multiple>1? v.multiple-1:1;
        }
      }
      this.setTotal();
    },
    addMStart() {
      this.maBk = mA;
    },
    // 倍数+1
    addMEnd(i) {
      this.maBk = m;
      for (const v of this.betArray) {
        if (i.name == v.name) {
          v.multiple = v.multiple+1;
        }
      }
      this.setTotal();
    },
    betStart() {
      this.betBk = betA;
    },
    betEnd() {
      this.betBk = bet;
      // 下注
      const data = {
        "data":[],
        "price":0
      };
      if (this.listShow) {
        data.price = this.totalPrice;
        console.log(this.betArray)
        for (const v of this.betArray) {
          const obj ={};
          obj.betCount = v.betCount;
          obj.multiple = v.multiple;
          obj.price = v.betCount*2;
          if (v.name == '直选') {
            obj.orderSelect = {};
            obj.orderSelect.decade = this.ten;
            obj.orderSelect.hundreds = this.hundreds;
            obj.orderSelect.units = this.single;
            obj.type = 10;
            data.data.push(obj);
          } else if (v.name == '组三单式') {
            obj.groupThreeSingle = {};
            obj.groupThreeSingle.repetition = this.doubleNum;
            obj.groupThreeSingle.single = this.singleNum;
            obj.type = 20;
          } else if (v.name == '组三复式') {
            obj.groupThreeDouble = this.selectNum3;
            obj.type = 30;
          } else if (v.name == '组六') {
            obj.groupSix = this.selectNum6;
            obj.type = 40;
          }
          data.data.push(obj);
        }
      } else {
        if (this.activeTab == 1) {
            if(this.checkorderSelect()) {
              const obj ={};
              obj.betCount = this.ten.length*this.single.length*this.hundreds.length;
              obj.multiple = 1;
              obj.price = this.ten.length*this.single.length*this.hundreds.length*2;
              obj.orderSelect = {};
              obj.orderSelect.decade = this.ten;
              obj.orderSelect.hundreds = this.hundreds;
              obj.orderSelect.units = this.single;
              obj.type = 10;
              data.data.push(obj);
              data.price = this.ten.length*this.single.length*this.hundreds.length*2;
            } else {
              return;
            }
        } else if (this.activeTab == 2) {
           if(this.checkgroupThreeSingle()) {
              const obj ={};
              obj.betCount = this.doubleNum.length*this.singleNum.length;
              obj.multiple = 1;
              obj.price = this.doubleNum.length*this.singleNum.length*2;
              obj.groupThreeSingle = {};
              obj.groupThreeSingle.repetition = this.doubleNum;
              obj.groupThreeSingle.single = this.singleNum;
              obj.type = 20;
              data.data.push(obj);
              data.price = this.doubleNum.length*this.singleNum.length*2;
           }else {
             return;
           }
        } else if (this.activeTab == 3) {
          if (this.checkgroupThreeDouble()) {
            const obj = {};
            obj.betCount = combination(this.selectNum3.length,2);
            obj.multiple = 1;
            obj.price = combination(this.selectNum3.length,2)*2;
            obj.groupThreeDouble = this.selectNum3;
            obj.type = 30;
            data.data.push(obj);
            data.price = combination(this.selectNum3.length,2)*2;
          }else {
            return;
          }
        } else if (this.activeTab == 4) {
          if (this.checkgroupSix()) {
            const obj = {};
            obj.betCount = combination(this.selectNum6.length,3);
            obj.multiple = 1;
            obj.price = combination(this.selectNum6.length,3)*2;
            obj.groupSix = this.selectNum6;
            obj.type = 40;
            data.data.push(obj);
            data.price = combination(this.selectNum6.length,3)*2;
          } else {
            return;
          }
        }
      }
      threeBet(data).then(res =>{
        console.log(res)
        if (res.code == 0) {
          this.$toast('下注成功')
        } else{
          this.$toast('下注失败')
        }
      })
      .catch(error=>{
        this.$toast('下注失败,服务器错误')
      })
    },
    // 跳转投注记录
    goRecord() {
      this.$router.push({ name: '3dRecord'})
    },
    goRule() {
      this.$router.push({ name: '3dRule'})
    },
    // 还原已选项
    setArr(arr,target) {
      for(const v of target) {
        if (v.id != '') {
          v.id = '';
        }
      }
      if (arr.length != 0) {
        for (const v of arr) {
          for (const x of target) {
            if(v == x.name) {
              x.id = 'active';
            }
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.flex-h-center {
  display: flex;
  align-items: center;
}
.three-home {
  height: 100%;
  width: 100%;
  color: #ffffff;
  background-image: url('../../assets/3d/image/bk.png');
  background-size: 100% 100%;
  .nav {
    display: flex;
    align-items: center;
    font-size: 0.26rem;
    padding: 0.1rem 0;
    .coin {
      height: 0.32rem;
      width: 0.32rem;
      margin-left: 0.24rem;
      z-index: 10;
    }
    .back {
      height: 0.56rem;
      width: 0.56rem;
    }
    .balance {
      margin-left: -0.2rem;
      background-color: #5C9331;
      border-radius: 0.22rem;
      color: #ffffff;
      padding: 0.1rem 0.3rem 0.1rem 0.4rem;
    }
    .pm {
      margin-left: 0.12rem;
      color: #B8D5A1;
    }
    .right {
      margin-left: auto;
      img {
        height: 0.56rem;
        width: 0.56rem;
      }
      .rule {
        margin-right: 0.2rem;
        margin-left: 0.5rem;
      }
    }
  }
  .tab {
    background-image: url('../../assets/3d/image/tab.png');
    background-size: 100% 100%;
    width: 90%;
    margin: auto;
    // margin-top: 0.3rem;
    height: 0.44rem;
    display: flex;
    .block {
      width: 25%;
      font-size: 0.28rem;
      color: #EABC7B;
      font-weight: bold;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      &.active1 {
        background-image: url('../../assets/3d/image/tab1.png');
        color: #ffffff;
        background-size: 100% 100%;
      }
      &.active2,&.active3{
        background-image: url('../../assets/3d/image/tab2.png');
        color: #ffffff;
        background-size: 100% 100%;
      }
      &.active4{
        background-image: url('../../assets/3d/image/tab3.png');
        color: #ffffff;
        background-size: 100% 100%;
      }
    }
  }
  .tab-content {
    background-size: 100% 100%;
    width: 95%;
    margin: auto;
    height: 78%;
    position: relative;
    .block {
      position: absolute;
      width: 1.06rem;
      height: 0.71rem;
      left: 0.3rem;
      top: 0.7rem;
      z-index: 90;
    }
    .ending {
      position: absolute;
      top: 0.2rem;
      left: 0.4rem;
      .time {
        background-color: #9F6625;
        border-radius: 4px;
        color: #FFD800;
        padding: 2px 4px;
      }
    }
    .record {
      position: absolute;
      top: 0.3rem;
      right: 0.3rem;
      font-size: 0.24rem;
    }
    .history {
      background-color: #F7D596;
      width: 90%;
      // padding: 0.34rem 0.42rem;
      height: 0;
      position: absolute;
      left: 5%;
      z-index: 100;
      top: 0.8rem;
      border: 1px solid #B17024;
      overflow: hidden;
      transition: height 666ms cubic-bezier(.466,0,.333,1),background-color 666ms linear;
      table {
        width: 95%;
        margin: auto;
        color: #D0A370;
      }
      .body {
          max-height: calc(100% - 1.2rem);
          overflow: auto;
        tr {
          height: 0.5rem;
          line-height: 0.5rem;
          &:nth-child(odd) {
            background:rgba(255,230,183,1);
          }
        }
      }
      .head {
        margin-top: 0.4rem;
        margin-bottom: 0.2rem;
        th {
          color: #A86F16;
          font-size: 0.26rem;
          font-weight: bold;
        }
      }
    }
    .number {
      .line {
        width: 0.96rem;
        height: 1.02rem;
        font-size: 0.62rem;
        text-align: center;
        line-height: 1.02rem;
        margin: 0 0.08rem;
        margin-bottom: 0.18rem;
        position: relative;
        span {
          position: relative;
        }
        &::before{
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          z-index: 0;
          width: 0.96rem;
          height: 1.02rem;
          background-size: 100% 100%;
          background-image: url('../../assets/3d/image/number.png');
          // transition: transform 666ms cubic-bezier(.466,0,.333,1),background-color 666ms linear;
          transform: rotateY(0deg);
        }
        &.active {
          color: #E35903;
        }
        &.active::before {
          background-image: url('../../assets/3d/image/number-active.png');
          transition: transform 666ms cubic-bezier(.466,0,.333,1),background-color 666ms linear;
          transform: rotateY(180deg);
        }
      }
      .hundreds {
        display: flex;
        flex-wrap: wrap;
        width: 80%;
        position: absolute;
        top: 1.15rem;
        left: 0.76rem;
      }
      .tenDigit {
        display: flex;
        flex-wrap: wrap;
        width: 80%;
        position: absolute;
        top: 4rem;
        left: 0.76rem;
      }
      .singleDigit {
        display: flex;
        flex-wrap: wrap;
        width: 80%;
        position: absolute;
        top: 6.9rem;
        left: 0.76rem;
      }
    }
    .round {
      width: 100%;
      height: 0.8rem;
      position: absolute;
      left: 0;
      bottom: -0.44rem;
      border-radius: 0.06rem;
      background-color: #D19B3C;
    }
  }
  .select-bet {
    height: 100%;
    width: 100%;
    background:rgba(0,0,0,0.5);
    position: fixed;
    bottom: 0;
    left:0;
    z-index: 100;
    .content {
      height: 80%;
      width: 100%;
      background: #F5D08C;
      position: absolute;
      bottom: 0;
      .info {
        width: 94%;
        margin: 0.36rem 3%;
        font-size: 0.28rem;
        color: #A86F16;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span:nth-child(2){
          color: #D0A370;
        }
      }
      .line {
        background:rgba(255,235,196,1);
        box-shadow:0px 0.06rem 0px rgba(245,208,140,1);
        // height: 2.26rem;
        border-radius: 0.12rem;
        width: 94%;
        margin: 0.16rem 3%;
        font-size: 0.25rem;
        color: #D0A370;
        .title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 90%;
          font-size: 0.3rem;
          padding: 0.2rem 0;
          margin: auto;
        }
        .num {
          width: 90%;
          padding-bottom: 0.44rem;
          padding-top: 0.1rem;
          margin: auto;
          text-align: left;
        }
        .expect {
          width: 90%;
          // padding-bottom: 0.24rem;
          margin: auto;
          text-align: left;
        }
        .price {
          width: 90%;
          padding-bottom: 0.24rem;
          margin: auto;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          .count {
            display: flex;
            align-items: center;
            .cut {
              background-size: 100% 100%;
              height: 0.56rem;
              width: 0.56rem;
              display: flex;
              // align-items: center;
              justify-content: center;
              font-size: 0.5rem;
              color:#ffffff;
            }
            .val{
              height: 0.46rem;
              width: 1.42rem;
              background-color: #F7D390;
              border-radius: 0.12rem;
              color: #A86F16;
              display: flex;
              align-items: center;
              margin: 0 0.1rem;
              justify-content: center;
            }
            .add {
              background-size: 100% 100%;
              height: 0.56rem;
              width: 0.56rem;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.5rem;
              color:#ffffff;
            }
          }
        }
      }
    }
  }
  .bottom {
    width: calc(100% - 0.4rem);
    height: 1.84rem;
    padding: 0 0.2rem;
    background-image: url('../../assets/3d/image/bottom.png');
    position: fixed;
    bottom: 0;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    z-index: 300;
    .cart {
      width: 0.82rem;
      height: 0.82rem;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 0.4rem;
      .cart-icon {
        height: 0.39rem;
        width: 0.54rem;
      }
    }
    .amount {
      margin-top: 0.4rem;
      text-align: left;
      margin-left: 0.4rem;
      &>div:nth-child(1) {
        color: #ffffff;
        font-size: 0.3rem;
        margin-bottom: 0.1rem;
      }
      &>div:nth-child(2) {
        color: #E2EED9;
        font-size: 0.24rem;
      }
    }
    .bet{
      margin-top: 0.4rem;
      // background-image: url('../../assets/3d/image/bet.png');
      background-size: 100% 100%;
      width: 2.64rem;
      height: 0.94rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #C56B33;
      font-size: 0.34rem;
      font-weight: bold;
      margin-left: auto;
    }
  }
  
}
</style>

