<template>
  <header class="head-nav">
    <el-row>
      <el-col :span="16" class="logo-container" v-once>
        <img src="../assets/logo.png" class="logo" alt="logo" />
        <span class="title">米修在线后台管理系统</span>
      </el-col>
      <el-col :span="8" class="user">
          <el-avatar :size="50" :src="user.avatar" class="avatar" />
          <div class="welcome">
            <p class="name comenname">欢迎</p>
            <p class="name avatarname">{{ user.name }}</p>
          </div>
          <span class="dropdown-area">
            <el-dropdown trigger="click" @command="setDialogInfo">
              <span>
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="info">个人信息</el-dropdown-item>
                  <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </span>
      </el-col>
    </el-row>
  </header>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";

const router = useRouter();
const store = useStore();

const user = computed(() => {
  return store.getters.user;
});

// nav右侧下拉框函数
const setDialogInfo = (cmdItem) => {
  switch (cmdItem) {
    case "info":
      showIndoList();
      break;
    case "logout":
      logout();
      break;
  }
};

// 下拉框-个人信息选项
const showIndoList = () => {
  router.push("/infoshow");
};

// 下拉框-退出登录选项
const logout = () => {
  //清除token
  localStorage.removeItem("eleToken");
  store.dispatch("clearCurrentState");
  router.push("/login");
};
</script>

<style scoped>
.head-nav {
  width: 100%;
  height: 70px;
  min-width: 580px;
  padding: 5px;
  background: #324057;
  color: #fff;
  box-sizing: border-box;
}
.logo-container {
  /* border-box内容高度为60px */
  line-height: 60px;
  min-width: 400px;
}
.logo {
  height: 50px;
  width: 50px;
  margin-right: 5px;
  vertical-align: middle;
  display: inline-block;
}
.title {
  vertical-align: middle;
  font-size: 22px;
  font-family: "Microsoft YaHei";
  letter-spacing: 3px;
}
.user {
  position: relative;
  line-height: 60px;
  text-align: right;
  float: right;
  padding-right: 25px;
}
.avatar {
  vertical-align: middle;
  display: inline-block;
}
.welcome {
  display: inline-block;
  width: auto;
  vertical-align: middle;
  padding: 0 5px;
}
.name {
  line-height: 20px;
  text-align: center;
  font-size: 14px;
}
.comename {
  font-size: 12px;
}
.avatarname {
  color: #409eff;
  font-weight: bolder;
}
.dropdown-area {
  display: inline-block;
  position: absolute;
  top: 25px;
  cursor: pointer;
}
.el-dropdown {
  color: #fff;
}
</style>