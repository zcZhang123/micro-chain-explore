<template>
  <div id="header">
    <div @click="backHome()">井创moac子链浏览器</div>
    <div style="display:flex;align-items:center;">
      <div class="header-search-box">
        <SearchBox></SearchBox>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBox from "./SearchBox.vue";
export default {
  name: "Header",
  components: {
    SearchBox
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  methods: {
    backHome() {
      this.$router.push({ path: "/" });
    }
  }
};
</script>

<style lang="scss" scoped>
#header {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 70px;
  min-width: 900px;
  padding: 0 70px;
  background: #409eff;
  color: #f4f4fb;
}
.header-search-box {
  display: inline-block;
  position: relative;
  white-space: nowrap;
  margin-right: 40px;
}
</style>