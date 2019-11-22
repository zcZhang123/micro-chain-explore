<template>
  <section>
    <div class="latest-trade">
      <div class="latest-trade-header">
        <div class="latest-trade-div">
          <span class="latest-trade-title">最新交易</span>
        </div>
        <div class="show-more-trade" @click="showAllTransaction('trade')">
          <div class="show-more-trade-title">
            <i class="iconfont el-icon-arrow-right"></i>
            查看更多
          </div>
        </div>
      </div>
      <div class="latest-trade-table">
        <el-table
          :data="latestTransactionList"
          :row-style="rowStyle"
          header-row-class-name="homeHeaderRowclass"
        >
          <ul slot="empty" style="background-color:#fff;margin:0 60px;">
            <div
              v-if="loadingTransaction"
              v-loading="true"
              element-loading-spinner="el-icon-loading"
              element-loading-text="加载中"
            ></div>
            <div class="latest-trade-nodata" v-else>
              <i class="iconfont icon-zanwushuju1"></i>
              暂无数据
            </div>
          </ul>
          <el-table-column width="30px"></el-table-column>
          <el-table-column type="index" label="序号" min-width="8%" align="left" header-align="left"></el-table-column>
          <el-table-column
            prop="hash"
            label="交易哈希"
            id="ellipsis"
            align="center"
            header-align="center"
            min-width="47%"
          >
            <template slot-scope="scope">
              <span
                class="latest-trade-hash"
                @click="jumpDetail(scope.row.hash)"
              >{{scope.row.hash}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="trade_type"
            label="交易类型"
            id="ellipsis"
            align="right"
            header-align="right"
            min-width="22%"
          ></el-table-column>
          <el-table-column width="30px"></el-table-column>
        </el-table>
      </div>
    </div>
  </section>
</template>
<script>
import { getTransactionsList } from "../js/request";
export default {
  name: "LatestTransaction",
  data() {
    return {
      loadingTransaction: false,
      latestTransactionList: []
    };
  },
  created() {
    this.getLatestTransactionsList();
  },
  methods: {
    async getLatestTransactionsList() {
      if (this.loadingTransaction) {
        return;
      }
      this.loadingTransaction = true;
      let res = await getTransactionsList(true, 0, 0);
      if (res.data.length > 0) {
        this.latestTransactionList = res.data;
      } else {
        this.latestTransactionList = [];
      }
      this.loadingTransaction = false;
    },
    showAllTransaction() {
      this.$router.push({ path: "trade" });
    },
    rowStyle({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "background:#EDF5FA;color:#3b3f4c;font-size:14px;";
      } else {
        return "color:#3b3f4c;font-size:14px;";
      }
    },
    jumpDetail(hash) {
      this.$router.push({ path: "tradeDetail", query: { hash: hash } });
    }
  }
};
</script>

<style lang="scss" scoped>
.latest-trade {
  margin: 0 60px;
}
.latest-trade-header {
  height: 22%;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.latest-trade-div {
  display: flex;
  align-items: center;
}
.latest-trade-title {
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
.show-more-trade {
  width: 150px;
  color: #9daebb;
  font-size: 14px;
  position: relative;
}
.show-more-trade:hover {
  color: #18c9dd;
  cursor: pointer;
}
.show-more-trade-title {
  position: absolute;
  right: 0;
}
.latest-trade-table {
  margin-top: 10px;
  border: 1px solid #c1e9f1;
}
.latest-trade-hash {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #6f6868;
  font-size: 14px;
  cursor: pointer;
}
.latest-trade-hash:hover {
  color: #06aaf9;
  font-weight: bold;
}
.latest-trade-nodata {
  color: #cbd4e2;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 27px 0;
  i {
    font-size: 50px;
  }
}
</style>