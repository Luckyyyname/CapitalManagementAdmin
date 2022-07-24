<template>
  <div class="index">
    <head-nav></head-nav>
    <left-menu @changeCollapse="changeCollapse" class="left-menu"></left-menu>
    <div :class="{ rightContainerCollapse: isCollapsed, rightContainer: true }">
      <!-- <router-view></router-view> -->
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import HeadNav from "../components/HeadNav";
import LeftMenu from "../components/LeftMenu";

const isCollapsed = ref("");
const changeCollapse = (val) => {
  isCollapsed.value = val;
};
</script>

<style scoped>
.index {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.left-menu {
  height: calc(100% - 70px);
}
.rightContainer {
  position: absolute;
  top: 70px;
  right: 0;
  width: calc(100% - 200px);
  height: calc(100% - 70px);
  overflow: auto;
  border-left: 25px solid #f0f2f5;
  border-right: 25px solid #f0f2f5;
  border-top: 40px solid #f0f2f5;
  padding: 25px;
  box-sizing: border-box;
}
.rightContainerCollapse {
  width: calc(100% - 64px);
}
</style>