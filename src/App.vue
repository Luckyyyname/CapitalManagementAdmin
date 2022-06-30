<template>
  <router-view />
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import jwt_decode from "jwt-decode";

const router = useRouter();
const store = useStore();

// 判断解析的token是否为空
const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};
if (localStorage.eleToken) {
  // 解析token存到vuex中
  const decoded = jwt_decode(localStorage.eleToken);
  store.dispatch("setAuthenticated", !isEmpty(decoded));
  store.dispatch("setUser", decoded);
}
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
