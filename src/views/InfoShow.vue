<template>
  <div class="infoshow">
    <el-row type='flex' class="row-bg" justify='center'>
      <el-col :span='8'>
        <div class="user">
          <el-avatar :size="70" :src="user.avatar" class="avatar" />
        </div>
      </el-col>
      <el-col :span='16'>
        <div class="userinfo">
          <div class="user-item">
            <i class="iconfont icon-yonghu"></i>
            <span>{{ user.name }}</span>
          </div>
          <div class="user-item">
            <i class="iconfont icon-shezhi"></i>
            <span>{{ identity }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
// i18n
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useStore();

const user = computed(() => store.getters.user);
const identity = computed(() => {
  return user.identity == 'manager' ? t('infe.manager') : t('info.user');
})
</script>


<style scoped>
.infoshow {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  /* padding: 16px; */
}

.row-bg {
  width: 100%;
  height: 100%;
}

.user {
  text-align: center;
  position: relative;
  top: 35%;
  left: 65%;
}

.user span {
  display: block;
  text-align: center;
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
}

.userinfo {
  height: 100%;
  background-color: #eee;
}

.user-item {
  position: relative;
  top: 30%;
  padding: 26px;
  font-size: 28px;
  color: #333;
}
</style>