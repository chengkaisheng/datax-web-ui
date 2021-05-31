<template>
  <div id="app">
    <router-view style="user-select: none" />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('_store')) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem('_store'))
        )
      )
    }

    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('_store', JSON.stringify(this.$store.state))
    })
  },
}
</script>

<style lang="scss">
.el-popover {
  .el-slider__marks-text {
    width: 40px;
  }
  p {
    margin: 0px;
    padding: 14px 0px;
    cursor: pointer;
    i {
      margin: 0px 20px;
    }
  }
  p:hover {
    cursor: pointer;
    background-color: rgb(235, 232, 232);
  }
}
</style>

<style>
.el-dialog {
  border-radius: 4px;
}
</style>
