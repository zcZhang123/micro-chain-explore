<template>
  <div>
    <Header></Header>
    <div class="transaction">
      <div class="transaction-div">
        <div class="transaction-title">
          <span>最新交易</span>
        </div>
      </div>
      <div>
        <div class="transaction-list-data">
          <el-table
            :data="transactionList"
            style="width:100%"
            :row-style="rowStyle"
            row-class-name="transaction-row-class"
            header-row-class-name="transaction-header-row-class"
          >
            <div slot="empty" style="font-size:18px;">
              <div
                v-if="loading"
                style="height:79px;width:100%"
                v-loading="true"
                element-loading-spinner="el-icon-loading"
                element-loading-text="加载中"
              ></div>
              <div v-else class="transaction-nodata">
                <div style=" position: relative;">
                  <i class="iconfont icon-wujiaoyijilu" style="font-size:155px;"></i>
                  <br />
                  <span style="position: relative;left:-9px;">无交易信息</span>
                </div>
              </div>
            </div>
            <el-table-column width="30px">
              <template slot-scope="scope">
                <div style="overflow:visible;">
                  <i
                    class="iconfont"
                    :class="scope.row.matchFlag"
                    style="font-size:15px;color: #18c9dd;"
                  ></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" min-width="8%"></el-table-column>
            <el-table-column
              prop="hash"
              label="交易哈希"
              id="ellipsis"
              align="center"
              header-align="center"
              min-width="37%"
            >
              <template slot-scope="scope">
                <span
                  class="transaction-hash-span"
                  @click="jumpDetail(scope.row.hash)"
                >{{scope.row.hash}}</span>
              </template>
            </el-table-column>
            <el-table-column width="30px"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <Pagination
      :defaultPageSize="defaultPageSize"
      :total="total"
      :currentPage="currentPage"
      @changeSize="changeDefaultSize"
      @changCurrentPage="changCurrentPage"
    ></Pagination>
  </div>
</template>
<script>
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import { getTransactionsList } from "../js/request";
export default {
  name: "Transactions",
  components: {
    Header,
    Pagination
  },
  data() {
    return {
      transactionList: [],
      loading: false,
      currentPage: 1,
      defaultPageSize: 20,
      total: 0 // 总条数
    };
  },
  created() {
    this.getLatestTransactionsList(
      false,
      this.currentPage,
      this.defaultPageSize
    );
  },
  methods: {
    async getLatestTransactionsList(isLatest, page, seq) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      let res = await getTransactionsList(isLatest, page, seq);
      if (res.data.length > 0) {
        this.transactionList = res.data;
        this.total = res.count;
      } else {
        this.transactionList = [];
      }
      this.loading = false;
    },
    changeDefaultSize(size) {
      this.defaultPageSize = size;
      this.getLatestTransactionsList(
        false,
        this.currentPage,
        this.defaultPageSize
      );
    },
    changCurrentPage(page) {
      this.currentPage = page;
      this.getLatestTransactionsList(
        false,
        this.currentPage,
        this.defaultPageSize
      );
    },
    jumpDetail(hash) {
      this.$router.push({ path: "tradeDetail", query: { hash: hash } });
    },
    rowStyle({ row, rowIndex }) {
      return "height:40px";
    }
  }
};
</script>
<style lang="scss" scoped>
.transaction {
  background-color: #f2f8fc;
  text-align: center;
  padding: 0 70px;
  min-width: 900px;
  height: 100%;
  min-height: 600px;
  .transaction-list-data {
    border: 1px solid #c1e9f1;
  }
}
.transaction-div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .transaction-title {
    display: flex;
    align-items: center;
    margin: 20px 20px 20px 0px;
    span {
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
  }
}
.transaction-nodata {
  margin: 114px 0 159px 0;
  font-size: 14px;
  font-weight: 400;
  color: #bbc7ce;
}

.transaction .transaction-header-row-class {
  color: #3b3f4c;
  font-size: 14px;
  height: 40px;
}
.transaction .transaction-row-class:nth-child(odd) {
  background: #edf5fa;
  height: 40px;
}
.transaction .transaction-row-class td:nth-child(2) {
  color: #3b3f4c;
  font-size: 14px;
}
.transaction-hash-span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  cursor: pointer;
}
.transaction-hash-span:hover {
  color: #06aaf9;
  font-weight: bold;
}
</style>