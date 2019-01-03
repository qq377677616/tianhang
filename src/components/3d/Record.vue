<template>
    <div class="three-record">
        <div class="three-record-nav">
            <img src="../../assets/3d/image/back.png" alt="" class="back" @click="back">
            <span>投注记录</span>
        </div>
        <div class="content">
            <div class="line">
                <div class="block1 block">
                    <div class="left">
                        <div>3D直选</div>
                        <div>
                            <span>13</span>
                            <span>134</span>
                            <span>1345</span>
                        </div>
                    </div>
                    <div class="right">开奖中...</div>
                </div>
                <div class="block block2">
                    <div class="left">
                        <div>20181204069期</div>
                        <div>
                            <span>共15注</span>
                            <span>2倍</span>
                        </div>
                    </div>
                    <div class="right">投注金额：2123 WLC</div>
                </div>
                <div class="block block3">
                    <div class="left">
                        <div>投注时间：11-14  10:23</div>
                    </div>
                    <div class="right">投注时间：11-14  10:23</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { get3dRecord} from "api/request"
export default {
    mounted() {
        get3dRecord().then(res=>{
            
        })
    },
    methods:{
        back(){
             this.$router.go(-1)
        }
    }
}
</script>
<style lang="scss" scoped>
.three-record {
    height: 100%;
    width: 100%;
    background-color: #FFEBC4;
    .three-record-nav {
        background-color: #71AB42;
        display: flex;
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
        .line {
            // display: flex;
            padding: 0.32rem 0.28rem;
            width: calc(100% - 0.56rem);
            border-bottom: 1px solid #FADCA5;
            .block1 {
                margin-bottom: 0.4rem;
                color: #A86F16;
            }
            .block2 {
                color: #D0A370;
                margin-bottom: 0.25rem;
            }
            .block3 {
                color: #D0A370;
            }
            .block {
                display: flex;
                width: 100%;
                justify-content: space-between;
                .left {
                    display: flex;
                    font-size: 0.28rem;
                    
                    &>div:nth-child(1) {
                        margin-right: 0.32rem;
                    }
                }
                .right {
                }
            }
        }
    }
}
</style>
