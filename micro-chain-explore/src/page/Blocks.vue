<template>
  <div>
    <Header></Header>
    <div class="blocks">
      <div class="block-div">
        <div class="block-title">
          <span>区块高度</span>
        </div>
      </div>
      <div>
        <div class="bock-list-data">
          <el-table
            :data="blocksList"
            style="width:100%"
            row-class-name="block-row-class"
            header-row-class-name="block-header-row-class"
          >
            <div slot="empty" style="font-size:18px;">
              <div
                v-if="loading"
                style="height:79px;width:100%"
                v-loading="true"
                element-loading-spinner="el-icon-loading"
                element-loading-text="加载中"
              ></div>
              <div
                v-else
                style="margin:114px 0 159px 0;font-size:14px;font-weight:400;color:#BBC7CE;"
              >
                <div style=" position: relative;">
                  <span style="position: relative;left:-9px;">无交易记录</span>
                </div>
              </div>
            </div>
            <el-table-column width="30px"></el-table-column>
            <el-table-column type="index" label="序号" min-width="8%"></el-table-column>
            <el-table-column
              prop="block_number"
              label="区块高度"
              min-width="17%"
              align="left"
              header-align="left"
            >
              <template slot-scope="scope">
                <span
                  class="hash-span"
                  @click="jumpDetailByBlockNum(scope.row.block_number)"
                >{{scope.row.block_number}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="hash"
              label="区块哈希值"
              id="ellipsis"
              align="center"
              header-align="center"
              min-width="57%"
            >
              <template slot-scope="scope">
                <span class="block-hash-span" @click="jumpDetail(scope.row.hash)">{{scope.row.hash}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="timestamp"
              label="时间"
              min-width="20%"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="transactions_num"
              min-width="7%"
              label="交易数"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <span class="block-num-span">{{scope.row.transactions_num}}</span>
              </template>
            </el-table-column>
            <el-table-column width="30px"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "../components/Header";
import { getBlocksList } from "../js/request";
export default {
  name: "Blocks",
  components: {
    Header
  },
  data() {
    return {
      blocksList: [],
      loading: false,
      page: 0, // 当前页
      seq: 20, // 每页展示条数
      total: 0 // 总条数
    };
  },
  created() {
    this.getBlockList(false, this.page, this.seq);
  },
  methods: {
    async getBlockList(isLatest, page, seq) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      let res = await getBlocksList(isLatest, page, seq);
      if (res.data.length > 0) {
        this.blocksList = res.data;
      } else {
        this.blocksList = [];
      }
      this.loading = false;
    },
    jumpDetail(hash) {
      this.$router.push({ path: "blockDetail", query: { hash: hash } });
    },
    jumpDetailByBlockNum(blockNum) {
      this.$router.push({ path: "blockDetail", query: { blockNum: blockNum } });
    }
  }
};
</script>
<style lang="scss" scoped>
.blocks {
  background-color: #f2f8fc;
  text-align: center;
  padding: 0 70px;
  min-width: 900px;
  height: 100%;
  min-height: 600px;
  .bock-list-data {
    border: 1px solid #c1e9f1;
  }
}
.block-div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .block-title {
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
.blocks .el-table .cell {
  .hash-span {
    color: #07c5f2;
  }
  .hash-span:hover {
    color: #06aaf9;
    font-size: 14px;
    cursor: pointer;
  }
  .block-num-span {
    color: #6f6868;
  }
  .block-hash-span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
  }
  .block-hash-span:hover {
    color: #06aaf9;
    cursor: pointer;
    font-weight: bold;
  }
}
.blocks .block-header-row-class {
  color: #3b3f4c;
  font-size: 14px;
  height: 40px;
}
.blocks .block-row-class:nth-child(odd) {
  background: #edf5fa;
  height: 40px;
}
</style>