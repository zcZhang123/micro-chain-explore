<template>
  <div id="home-page">
    <div class="home-header">
      <Header></Header>
    </div>
    <MicroChainInfo></MicroChainInfo>
    <LatestBlock></LatestBlock>
    <LatestTransaction></LatestTransaction>
  </div>
</template>
<script>
import Header from "../components/Header";
import MicroChainInfo from "../components/MicroChainInfo";
import LatestBlock from "../components/LatestBlock.vue";
import LatestTransaction from "../components/LatestTransaction.vue";
export default {
  name: "HomePage",
  components: {
    Header,
    MicroChainInfo,
    LatestBlock,
    LatestTransaction
  },
  data() {
    return {};
  }
};
</script>
<style  lang="scss" scoped>
.home-header {
  width: 100%;
  height: 150px;
}
.home-search {
  float: right;
  margin: 60px 60px 0 0;
}
</style>