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
          <span style="padding-left:10px;margin-right:20px;">{{balance}}</span>
        </div>
      </div>
      <div>
        <div class="trade-list-header">交易记录</div>
        <div class="trade-list-search">
          <div style="float:left">
            <span>日期:</span>
            <el-date-picker v-model="tradeStart" size="medium" type="date" placeholder="开始日期"></el-date-picker>
            <el-date-picker v-model="tradeEnd" size="medium" type="date" placeholder="结束日期"></el-date-picker>
          </div>
          <div style="float:right">
            <span>交易对家:</span>
            <div style="width: 200px;height:60px;float: right">
              <el-input v-model="tradePartner" size="medium" placeholder="请输入交易对家"></el-input>
            </div>
          </div>
        </div>
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
          <el-table-column
            type="index"
            :index="indexMethod"
            label="序号"
            min-width="10%"
            align="left"
            header-align="left"
          ></el-table-column>
          <el-table-column
            prop="trade_type"
            label="区块号"
            id="ellipsis"
            width="130px"
            align="left"
            header-align="left"
          >
            <template slot-scope="scope">
              <span
                class="wallet-detail-click-span"
                @click="scope.row.block_number"
              >{{scope.row.block_number}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="time"
            label="交易时间"
            min-width="40%"
            align="left"
            header-align="left"
          >
            <template slot-scope="scope">
              <span class="wallet-detail-click-span">{{formatTime(scope.row.time)}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="trade_type"
            label="交易类型"
            id="ellipsis"
            width="130px"
            align="left"
            header-align="left"
          ></el-table-column>-->
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
                @click="jumpTradeDetail(scope.row.transaction_hash)"
              >{{scope.row.transaction_hash}}</span>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :defaultPageSize="defaultPageSize"
          :total="total"
          :currentPage="currentPage"
          @changeSize="changeDefaultSize"
          @changCurrentPage="changCurrentPage"
        ></Pagination>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import { formatTime } from "../js/utils";
import { getTradeAndBalanceByAddress } from "../js/request";
export default {
  name: "WalletDetail",
  components: {
    Header,
    Pagination
  },
  data() {
    return {
      address: "",
      balance: "",
      tradeList: [],
      loadingTrade: false,
      tradeStart: "", // 交易时间
      tradeEnd: "", // 交易时间
      tradePartner: "", // 交易对家
      currentPage: 1, // 当前页
      defaultPageSize: 20, // 每页展示条数
      total: 0 // 总条数
    };
  },
  created() {
    this.address = this.$route.query.address;
    this.getWalletDetail();
  },
  methods: {
    async getWalletDetail() {
      let res = await getTradeAndBalanceByAddress(
        this.address,
        this.tradePartner,
        this.currentPage,
        this.defaultPageSize
      );
      this.balance = res.balance;
      this.tradeList = res.trade;
      this.total = res.count;
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
    },
    async changeDefaultSize(size) {
      this.defaultPageSize = size;
      let res = await getTradeAndBalanceByAddress(
        this.address,
        this.tradePartner,
        this.currentPage,
        this.defaultPageSize
      );
      this.balance = res.balance;
      this.tradeList = res.trade;
      this.total = res.count;
    },
    async changCurrentPage(page) {
      this.currentPage = page;
      let res = await getTradeAndBalanceByAddress(
        this.address,
        this.tradePartner,
        this.currentPage,
        this.defaultPageSize
      );
      this.balance = res.balance;
      this.tradeList = res.trade;
      this.total = res.count;
    },
    formatTime(timestamp) {
      return formatTime(timestamp);
    },
    indexMethod(index) {
      return this.defaultPageSize * (this.currentPage - 1) + index + 1;
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
    background: #0ab1f2;
    height: 40px;
    line-height: 40px;
    width: 100%;
    text-align: center;
    color: #ffffff;
    font-size: 16px;
  }
  .trade-list-search {
    height: 60px;
    line-height: 60px;
    width: 100%;
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