<template>
  <div>
    <template v-for="(item,index) in list">
　　　 <!-- 标题 -->
        <router-link :to="returnPath(item.path)">
            <template v-if="item.children">
                <el-submenu :key="index" :index="index + ''">
                <template :index="item.path" slot="title">
                    <svg-icon style="fontSize: 20px;text-align: center;" :icon-class="item.icon" />
                    <span>{{item.title}}</span>
                </template>
                <el-menu-item-group>
                    <sideBar :list="item.children"></sideBar>
                </el-menu-item-group>
                </el-submenu>
            </template>
        　　　 <!-- 选项 -->
            <template v-else>
                <el-menu-item :key="index" :index="item.path">
                <svg-icon style="fontSize: 20px;text-align: center;" :icon-class="item.icon" />
                <span>{{item.title}}</span>
                </el-menu-item>
            </template>
        </router-link>
    </template>
  </div>
</template>
<script>
export default {
  name: 'sideBar',
  props: {
    list: Array
  },
  methods: {
      returnPath(path) {
      if (path) {
        return path
      } else {
        return ''
      }
    },
  }
};
</script>
<style>
</style>