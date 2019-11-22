<template>
  <div>
    <Header></Header>
    <div class="wallet-detail">
      <div class="wallet-detail-header">
        <div style="font-weight: 600;">
          钱包地址:
          <span style="color:#06aaf9;padding-left:10px;">{{address}}</span>
        </div>
        <div>
          余额：
          <span style="padding-left:10px;margin-right:20px;">{{blance}}</span>
        </div>
      </div>
      <div>
        <div class="trade-list-header">交易记录</div>
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
            ></div>
            <div class="noDataHome" v-else>暂无数据</div>
          </ul>
          <el-table-column width="30px"></el-table-column>
          <el-table-column type="index" label="序号" min-width="10%" align="left" header-align="left"></el-table-column>
          <el-table-column
            prop="time"
            label="交易时间"
            min-width="20%"
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
            prop="from"
            label="交易发起方"
            id="ellipsis"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <span
                class="wallet-detail-click-span"
                @click="jumpWalletDetail(scope.row.from)"
              >{{scope.row.from}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="to"
            label="交易对家"
            id="ellipsis"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <span
                class="wallet-detail-click-span"
                @click="jumpWalletDetail(scope.row.to)"
              >{{scope.row.to}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="hash"
            label="交易哈希"
            id="ellipsis"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <span
                class="wallet-detail-click-span"
                @click="jumpTradeDetail(scope.row.hash)"
              >{{scope.row.hash}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "../components/Header";
import { getTradeAndBlanceByAddress } from "../js/request";
export default {
  name: "WalletDetail",
  components: {
    Header
  },
  data() {
    return {
      address: "",
      blance: "",
      tradeList: [],
      loadingTrade: false
    };
  },
  created() {
    this.address = this.$route.query.address;
    this.getWalletDetail();
  },
  methods: {
    async getWalletDetail() {
      let res = await getTradeAndBlanceByAddress(this.address);
      this.blance = res.blance;
      this.tradeList = res.trade;
      console.log(res);
    },
    rowStyle({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "background:#EDF5FA;color:#3b3f4c;font-size:14px;";
      } else {
        return "color:#3b3f4c;font-size:14px;";
      }
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
.wallet-detail {
  text-align: center;
  min-width: 900px;
  padding: 0 70px;
  padding-bottom: 50px;
  .trade-list-header {
    background: linear-gradient(to right, #0ab1f2, #26e0cc);
    height: 40px;
    line-height: 40px;
    width: 100%;
    text-align: center;
    color: #ffffff;
    font-size: 16px;
  }
  .wallet-detail-click-span {
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
  }
  .wallet-detail-click-span:hover {
    color: #06aaf9;
    cursor: pointer;
    font-weight: bold;
  }
}
.wallet-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  font-size: 15px;
  color: #3e3f45;
}
</style>