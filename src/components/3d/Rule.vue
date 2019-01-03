<template>
    <div class="three-rule">
        <div class="nav">
            <img src="../../assets/3d/image/back.png" alt="" class="back" @click="back">
            <span>投注记录</span>
        </div>
        <div class="content">
            <div class="line">
                <div class="title">3D玩法说明</div>
                <div>3D是指以三个号码排列或组合为一注进行单式投注，投注号码由000-999组成，三个位置从左至右分别为“百位”、“十位”、“个位”，一组三个号码的排列或组合称为一注。每注金额2wlc。购买者可对其选定的投，注号码进行多倍投注，投注倍数范围为2-99倍。单张彩票的投注金额最高不得超过20000wlc。3D每天销售一期，期号以开奖日界定，按日历年度编排。</div>
            </div>
            <div class="line">
                <div class="title">玩法说明</div>
                <div>(一) 直选投注：是指对三个号码以唯一的排列方式进行投注。</div>
                <div>(二) 组选投注：是指将三个号码的所有排列方式作为一注投注号码进行投注。如果一注组选的三个号码中有两个号码相同，则包括三种不同的排列方式，称为“组选3”；如果一注组选的三个号码各不相同，则包括六种不同的排列方式，称为“组选6”。</div>
                <div>(三) 单选投注：<span class="focus">单注奖金固定为1040wlc。</span></div>
                <div><span>(四) 组选投注：</span>① 组选3复式：<span class="focus">单注奖金固定为346wlc。</span></div>
                <div><span style="    visibility: hidden;">(四) 组选投注：</span>② 组选3单式：<span class="focus">单注奖金固定为346wlc。</span></div>
                <div><span style="    visibility: hidden;">(四) 组选投注：</span>③ 组选6：<span class="focus">单注奖金固定为173wlc。</span></div>
            </div>
            <div class="line">
                <div class="title">开奖</div>
                <div>3D由中福彩中心统一开奖，每天开奖一次。3D通过专用摇奖设备确定开奖号码。每期按百位、十位、个位的顺序从000-999中摇出一个三位数的号码，作为当期开奖号码。每期开奖后，福彩销售机构应向社会公布开奖号码点。</div>
            </div>
            <div class="line">
                <div class="title">中奖</div>
                <div>根据购买者选择的3D的投注号码和投注方式，与当期开奖号码的相符情况，确定相应的中奖资格。</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    methods:{
        back(){
             this.$router.go(-1)
        }
    }
}
</script>
<style lang="scss" scoped>
.three-rule {
    height: 100%;
    width: 100%;
    background-color: #FFEBC4;
    .nav {
        background-color: #71AB42;
        display: flex;
        height: 0.34rem;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 0.2rem;
        position: relative;
        .back {
            height: 0.56rem;
            width: 0.56rem;
            position: absolute;
            left: 0;
        }
        span {
            font-size: 0.36rem;
            color: #ffffff;
        }
    }
    .content {
        padding:  0 0.32rem;
        padding-top: 0.6rem;
        height: calc(100% - 0.94rem);
        overflow: auto;
        .line {
            margin-bottom: 0.6rem;
            text-align: left;
            color: #D0A370;
            line-height: 0.4rem;
            .title {
                color: #A86F16;
                font-size: 0.3rem;
                font-weight: bold;
                margin-bottom: 0.2rem;
            }
            .focus {
                color: #EF900F;
            }
        }
    }
}
</style>
