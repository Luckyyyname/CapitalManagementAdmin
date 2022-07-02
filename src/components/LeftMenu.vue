<template>
  <el-aside :width="isCollapse ? '64px' : '200px'">
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <!-- 侧边栏菜单区域 -->
    <el-menu
      active-text-color="#409Eff"
      background-color="#324057"
      text-color="#fff"
      unique-opened
      :router="true"
      :collapse="isCollapse"
      :collapse-transition="false"
    >
      <el-menu-item index="/index">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-sub-menu index="1">
        <template #title>
          <el-icon><TrendCharts /></el-icon>
          <span>资金管理</span>
        </template>
        <el-menu-item-group title="table">
          <el-menu-item index="/index/fundlist">资金流水</el-menu-item>
          <el-menu-item index="/index/fundstatistics">收支统计</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="chart">
          <el-menu-item index="/index/fundchart">月净收入统计</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>信息管理</span>
        </template>
        <el-menu-item-group title="Group One">
          <el-menu-item index="/index/infoshow">个人信息</el-menu-item>
          <el-menu-item index="/index/sysinfoshhow">系统信息</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref, reactive } from "vue";
import {
  House,
  TrendCharts,
  Setting,
} from '@element-plus/icons-vue'

const emit = defineEmits(["changeCollapse"]);
// 是否折叠
const isCollapse = ref(false);

const changeCollapse = (isCollapse) => {
  emit("changeCollapse", isCollapse);
};
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
  changeCollapse(isCollapse.value);
};
</script>
<style scoped>
.el-aside {
  background-color: #324057;
  height: calc(100%-70px);
}
.el-aside .el-menu {
  border-right: none;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #324057;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>