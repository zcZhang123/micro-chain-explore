<template>
  <div>
    <Header></Header>
    <div class="trade_detail_title">
      <span class="trade_detail_title_span">
        当前交易哈希:
        <span style="color:#06aaf9;padding-left:10px;">{{tradeDetail.hash}}</span>
      </span>
      <ul class="trade_detail_ul">
        <li>
          <span style="font-weight:600;">账本号</span>
          <span style="font-size:12px;">{{tradeDetail.block_number}}</span>
        </li>
        <li>
          <span style="font-weight:600;">交易发起方</span>
          <span
            @click="jumpWalletDetail(tradeDetail.from)"
            class="trade_from_address"
          >{{tradeDetail.from}}</span>
        </li>
        <li>
          <span style="font-weight:600;">交易接收方</span>
          <span
            @click="jumpWalletDetail(tradeDetail.to)"
            class="trade_from_address"
          >{{tradeDetail.to}}</span>
        </li>
        <!-- <li>
          <span style="font-weight:600;">燃料费用</span>
          <span style="font-size:12px;">{{tradeDetail.gas}}</span>
        </li> -->
        <li>
          <span style="font-weight:600;">交易类型</span>
          <span style="font-size:12px;">{{tradeDetail.trade_type}}</span>
        </li>
        <li>
          <span style="font-weight:600;">成交金额</span>
          <span style="font-size:12px;">{{tradeDetail.value}}</span>
        </li>
        <li>
          <span style="font-weight:600;">input</span>
          <span style="font-size:12px;">{{tradeDetail.input}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Header from "../components/Header";
import { getTradeDetailByHash } from "../js/request";
export default {
  name: "TransactionDetail",
  components: {
    Header
  },
  data() {
    return {
      tradeDetail: {},
      hash: "",
      latestdeal: [],
      loadingTrade: false
    };
  },
  created() {
    this.hash = this.$route.query.hash;
    this.getTradeDetail(this.hash);
  },
  methods: {
    async getTradeDetail(hash) {
      let res = await getTradeDetailByHash(hash);
      console.log(res)
      this.tradeDetail = res;
      console.log(this.tradeDetail);
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
.trade_detail_title {
  text-align: left;
  width: 90%;
  margin-left: 60px;
  div {
    display: inline-block;
  }
  .trade_detail_title_span {
    padding: 16px 0;
    overflow: hidden;
    font-weight: 600;
    white-space: nowrap;
    font-size: 16px;
    color: #3e3f45;
    float: left;
  }
  .trade_detail_title_span:nth-child(2) {
    color: #18c9dd;
    font-size: 14px;
    font-weight: 400;
    white-space: nowrap;
    width: calc(75% - 22px);
    text-align: right;
  }
  .trade_detail_ul {
    width: 100%;
    overflow: hidden;
    border: 1.8px solid #c1e9f1;
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
  }
}

.trade_detail_list {
  background-color: #f2f8fc;
  border: 1px solid #d0eef5;
  width: 93%;
  margin-left: 60px;
}

.trade_detail_list_title {
  background: linear-gradient(to right, #0ab1f2, #26e0cc);
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #ffffff;
  font-size: 16px;
  border-bottom: 1px #d0eef5;
}

.trade_from_address {
  color: #636161;
  font-size: 12px;
  font-family: PingFangSC-Regular;
}
.trade_from_address:hover {
  color: #06aaf9;
  cursor: pointer;
  font-weight: 600;
}
</style>