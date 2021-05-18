<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      class="el-menu-di"
      @select="handleSelect"
      background-color="#333333"
      text-color="#9597a6"
      text-size="18px"
      router
    >
      <div class="consumer-header">
        <div class="consumer-left">
          <router-link to="/asset/portrait">
          <el-menu-item class="el-icon-arrow-left"></el-menu-item>
          </router-link>
          <el-menu-item class="el-icon-text">消费贷客户</el-menu-item>
        </div>

        <div class="consumer-right">
          <router-link to="/ConsumerTask">
            <el-menu-item class="el-icon-bell"></el-menu-item>
          </router-link>
        </div>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "ConsumerHeader",
  data() {
    return {
      activeIndex: "1"
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.el-menu-di {
  display: flex;
  padding-left: 2%;
  padding-right: 1%;
}
.el-icon-bell {
  font-size: 17px;
}
.el-icon-arrow-left {
  font-size: 17px;
  color: #fff;
}
.el-icon-text {
  font-size: 16px;
  color: #fff;
}
.consumer-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>

