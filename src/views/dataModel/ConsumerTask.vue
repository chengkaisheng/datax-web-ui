<template>
  <div>
    <!-- header导航开始 -->
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
          <router-link to="/asset/ConsumerLoanCustomer">
            <el-menu-item class="el-icon-arrow-right"></el-menu-item>
          </router-link>
          <el-menu-item class="el-icon-text">待处理业务</el-menu-item>
        </div>

        <div class="consumer-right">
          <!-- <router-link to="/di/property/pm/ConsumerTask" style="text-decoration: none;color:#fff"> -->
          <div class="consumer-icon-one">
            <!-- <img src="@/assets/img/icon9.png" alt /> -->
          </div>
          <div class="consumer-span">
            <span>帮助</span>
          </div>
          <div class="consumer-icon-tow">
            <!-- <img src="@/assets/img/icon8.png" alt /> -->
          </div>

          <!-- <el-menu-item class="el-icon-bell"></el-menu-item> -->
          <!-- </router-link> -->
        </div>
      </div>
    </el-menu>
    <!-- header导航结束 -->

    <div class="consumer-table">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="质检异常标签(0)" name="first">
          <el-row class="content">
            <!-- <img src="@/assets/img/empty.png" /> -->
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="待审批标签(0)" name="second">
          <el-row class="content">
            <!-- <img src="@/assets/img/empty.png" /> -->
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConsumerTask",
  data() {
    return {
      activeIndex: "1",
      activeName: "first"
    };
  }
};
</script>

<style scoped>
.consumer-table {
  padding: 10px 0 20px 20px;
}
.content {
  width: 100%;
  min-height: 200px;
  background: #fff;
  margin-top: 86px;
  height: calc(100vh - 400px);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 导航样式开始 */
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
.consumer-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* width: 300px; */
}
.consumer-icon-one {
  text-align: center;
  width: 40px;
}
.consumer-span {
  text-align: center;
  width: 40px;
  color: #fff;
}
.consumer-icon-tow {
  text-align: center;
  width: 50px;
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
/* 导航样式结束 */
</style>