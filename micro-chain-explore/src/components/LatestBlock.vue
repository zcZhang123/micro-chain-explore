<template>
  <section class="block">
    <div class="block-header">
      <div class="block-title">
        <span class="block-span">区块高度</span>
      </div>
      <div class="block-show-more-btn" @click="showAllBlock()">
        <div class="block-show-more-content">
          <i class="iconfont el-icon-arrow-right"></i>
          查看更多
        </div>
      </div>
    </div>
    <div class="latest-block-list" v-show="LatestBlockList.length !==0">
      <div class="latest-block-list-div">
        <li v-for="(item,index) of  LatestBlockList" :key="index">
          <div class="latest-block-list-content">
            <div class="latest-block-list-num">
              <span style="margin-right:10px;">高度</span>
              {{item.number}}
            </div>
            <div>
              <span style="color:#93A3B7;margin-right:10px;">交易数</span>
              <span>{{item.transactions.length}}</span>
            </div>
            <div class="latest-block-hash" @click="jumpDetail(item.hash)">{{item.hash}}</div>
            <div class="latest-block-time">{{formatTime(item.timestamp)}}</div>
          </div>
        </li>
      </div>
    </div>
    <div
      v-show="LatestBlockList.length === 0"
      class="v-show"
      style="background-color:#fff;margin:0 60px;border: 1px solid #C1E9F1;"
    >
      <div class="latest-block-nodata">暂无数据</div>
    </div>
  </section>
</template>
<script>
import { getBlocksList } from "../js/request";
import { formatTime } from "../js/utils";
export default {
  name: "LatestBlock",
  data() {
    return {
      loadingBlock: false,
      LatestBlockList: []
    };
  },
  created() {
    this.getLatestBlocksList();
  },
  methods: {
    async getLatestBlocksList() {
      if (this.loadingBlock) {
        return;
      }
      this.loadingBlock = true;
      let res = await getBlocksList(true, 0, 0);
      if (res.data.length > 0) {
        this.LatestBlockList = res.data;
      } else {
        this.LatestBlockList = [];
      }
      this.loadingBlock = false;
    },
    showAllBlock() {
      this.$router.push({ path: "block" });
    },
    jumpDetail(hash) {
      this.$router.push({ path: "blockDetail", query: { hash: hash } });
    },
    formatTime(timestamp) {
      return formatTime(timestamp);
    }
  }
};
</script>

<style lang="scss" scoped>
.block {
  font-size: 14px;
}
.block-header {
  margin: 10px 60px 10px 60px;
  height: 22%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.block-title {
  display: flex;
  align-items: center;
  justify-content: center;
}
.block-span {
  height: 28px;
  min-width: 100px;
  padding: 0 3px;
  background: #409eff;
  border-radius: 0px 13px 13px 0px;
  color: #f2f8fc;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.block-show-more-btn {
  width: 150px;
  color: #9daebb;
  font-size: 14px;
  position: relative;
}
.block-show-more-btn:hover {
  color: #18c9dd;
  cursor: pointer;
}
.block-show-more-content {
  position: absolute;
  right: 0;
}
.latest-block-list {
  margin: 0 60px;
  text-align: left;
  background-color: #fff;
  .latest-block-list-div {
    display: flex;
    border: 1px solid #409eff;
  }
  .latest-block-list-content {
    padding: 20px;
  }
  .latest-block-list-num {
    color: #303052;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    margin-bottom: 8px;
  }
  li {
    width: 16.6%;
    list-style-type: none;
    border-right: 1px solid #e3eef0;
  }
  li:nth-last-child(1) {
    border: 0;
  }
}
.latest-block-hash {
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 12px;
  margin: 10px 0;
  color: #409eff;
}
.latest-block-hash:hover {
  color: #06aaf9;
  cursor: pointer;
  font-weight: bold;
}
.latest-block-time {
  color: #8a8d90;
  font-size: 12px;
}
.latest-block-nodata {
  color: #cbd4e2;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 27px 0;
}
</style>