<template>
  <div>
    <Header></Header>
    <div class="block-detail">
      <div class="block-detail-title">
        <span class="block-detail-title-span">
          当前区块:
          <span style="color:#06aaf9;padding-left:10px;">{{this.blockData.block_number}}</span>
        </span>
        <span class="block-detail-title-span">
          区块哈希值:
          <span style="padding-left:10px;text-align:right;">{{blockData.hash}}</span>
        </span>
        <i class></i>
        <ul class="block-detail-header">
          <li>
            <span style="font-weight:600;">关闭时间</span>
            <span style="font-size:12px;">{{blockData.timestamp}}</span>
          </li>
          <li>
            <span style="font-weight:600;">交易数量</span>
            <span style="font-size:12px;">{{blockData.transactions_num}}</span>
          </li>
          <li>
            <span style="font-weight:600;">上一区块哈希值</span>
            <span
              @click="jumpBlockDetail(blockData.parent_hash)"
              class="block-detail-parent-hash"
            >{{blockData.parent_hash}}</span>
          </li>
        </ul>
      </div>

      <div class="block-detail-list">
        <div>
          <div class="block-detail-list-top">交易记录</div>
          <el-table
            :data="tradeList"
            style="width:100%"
            :row-style="rowStyle"
            header-row-class-name="homeHeaderRowclass"
          >
            <ul slot="empty" style="background-color:#fff;margin:0 60px;">
              <div
                v-if="loadingTrade"
                style="height:100px;width:100%"
                v-loading="true"
                element-loading-spinner="el-icon-loading"
                element-loading-text="加载中"
              ></div>
              <div class="noDataHome" v-else>暂无数据</div>
            </ul>
            <el-table-column width="30px"></el-table-column>
            <el-table-column
              type="index"
              label="序号"
              min-width="8%"
              align="left"
              header-align="left"
            ></el-table-column>
            <el-table-column
              prop="trade_type"
              label="交易类型"
              id="ellipsis"
              width="130px"
              align="left"
              header-align="left"
            ></el-table-column>
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
                  class="block-detail-hash"
                  @click="jumpTradeDetail(scope.row.hash)"
                >{{scope.row.hash}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="from"
              label="发起方"
              id="ellipsis"
              align="right"
              header-align="right"
              min-width="28%"
            >
              <template slot-scope="scope">
                <span
                  class="block-detail-hash"
                  @click="jumpWalletDetail(scope.row.from)"
                >{{scope.row.from}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="to"
              label="接收方"
              id="ellipsis"
              align="right"
              header-align="right"
              min-width="28%"
            >
              <template slot-scope="scope">
                <span
                  class="block-detail-hash"
                  @click="jumpWalletDetail(scope.row.to)"
                >{{scope.row.to}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="gas" label="费用" id="fee" min-width="10%" align="center"></el-table-column>
            <el-table-column width="30px"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "../components/Header";
import { getBlockDetailByHash, getBlockDetailByBlockNum } from "../js/request";
export default {
  name: "BlockDetail",
  components: {
    Header
  },
  data() {
    return {
      hash: "",
      blockData: {},
      tradeList: [],
      loadingTrade: false
    };
  },
  created() {
    this.hash = this.$route.query.hash;
    if (this.hash) {
      this.getBlockDetail(this.hash);
    } else {
      let blockNum = this.$route.query.blockNum;
      this.getBlockDetailByNum(blockNum);
    }
  },
  methods: {
    async getBlockDetail(hash) {
      let res = await getBlockDetailByHash(hash);
      this.blockData = res.detail;
      this.tradeList = res.tradeList;
      console.log(this.tradeList);
    },
    async getBlockDetailByNum(blockNum) {
      let res = await getBlockDetailByBlockNum(blockNum);
      this.blockData = res.detail;
      this.tradeList = res.tradeList;
    },
    clearGopage() {
      this.gopage = "";
    },
    rowStyle({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "background:#EDF5FA;color:#3b3f4c;font-size:14px;";
      } else {
        return "color:#3b3f4c;font-size:14px;";
      }
    },
    jumpBlockDetail(hash) {
      let url = window.location.origin + `/#/blockDetail/?hash=${hash}`;
      window.open(url, "_blank");
    },
    jumpTradeDetail(hash) {
      let url = window.location.origin + `/#/tradeDetail/?hash=${hash}`;
      window.open(url, "_blank");
    },
    jumpWalletDetail(address) {
      let url = window.location.origin + `/#/walletDetail/?address=${address}`;
      window.open(url, "_blank");
    }
  }
};
</script>

<style lang="scss" scoped>
.block-detail {
  text-align: center;
  min-width: 900px;
  padding: 0 70px;
  padding-bottom: 50px;
  background: #f2f8fc;
}
.block-detail-title {
  text-align: left;
  div {
    display: inline-block;
  }
  .block-detail-title-span {
    width: 25%;
    padding: 16px 0;
    overflow: hidden;
    font-weight: 600;
    white-space: nowrap;
    font-size: 16px;
    color: #3e3f45;
    float: left;
  }
  .block-detail-title-span:nth-child(2) {
    color: #18c9dd;
    font-size: 14px;
    font-weight: 400;
    white-space: nowrap;
    width: calc(75% - 22px);
    text-align: right;
  }
  .block-detail-header {
    width: 97%;
    overflow: hidden;
    border: 1.8px solid #c1e9f1;
    height: 120px;
    border-radius: 8px;
    background: #ffffff;
    margin-bottom: 20px;
    li {
      display: flex;
      justify-content: space-between;
      height: 40px;
      overflow: hidden;
      font-size: 14px;
      line-height: 40px;
      padding: 0 20px;
      color: #5f5d5d;
      border-bottom: 1px solid #e0e8ed;
    }
    li:nth-child(3) {
      border-bottom: 0;
    }
  }
}
.block-detail-list {
  background-color: #f2f8fc;
  border: 1px solid #d0eef5;
}
.block-detail-list {
  background: linear-gradient(to right, #0ab1f2, #26e0cc);
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #ffffff;
  font-size: 16px;
  border-bottom: 1px #d0eef5;
}
.block-detail-parent-hash {
  color: #636161;
  font-size: 12px;
  font-family: PingFangSC-Regular;
}
.block-detail-parent-hash:hover {
  color: #06aaf9;
  cursor: pointer;
  font-weight: 600;
}
.block-detail-hash {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #6f6868;
  font-size: 14px;
  cursor: pointer;
}
.block-detail-hash:hover {
  color: #06aaf9;
  font-weight: bold;
}
</style>