<template>
  <div class="login">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">{{ $t('register.title') }}</span>
        <el-form ref="loginForm" :model="loginUser" :rules="rules" label-width="60px" class="loginForm">
          <el-form-item :label="$t('register.emailLabel')" prop="email">
            <el-input v-model="loginUser.email" :placeholder="$t('register.emailHolder')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('register.passwordLabel')" prop="password">
            <el-input type="password" v-model="loginUser.password" :placeholder="$t('register.passwordHolder')">
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('register.verificationCode')" prop="verify">
            <el-row>
              <el-col :span="12">
                <el-input v-model="verifyInput" :placeholder="$t('register.verificationCodeHolder')"></el-input>
              </el-col>
              <el-col :span="12">
                <img-verify ref="verifyRef"></img-verify>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="submit_btn" v-debounce="{ fn: submitForm, event: 'click', delay: 200 }">{{
                $t('register.login')
            }}
            </el-button>
          </el-form-item>
          <div class="tiparea">
            <p>
              {{ $t('register.lead') }}<router-link to="/register">{{ $t('register.register') }}</router-link>
            </p>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import jwt_decode from "jwt-decode";
import { loginSubmit } from "@/api/user";
import ImgVerify from "@/components/ImgVerify.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter();
const store = useStore();

const loginForm = ref(null);
const loginUser = reactive({
  email: "",
  password: "",
});

const verifyRef = ref(null);
const verifyInput = ref("");

const rules = reactive({
  email: [
    {
      type: "email",
      required: true,
      message: t("register.emailErr"),
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: t("register.passwordNotNull"),
      trigger: "blur",
    },
    {
      min: 6,
      max: 30,
      message: t("register.plengthErr"),
      trigger: "blur",
    },
  ],
});

// 判断解析的token是否为空
const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};
const submitForm = () => {
  loginForm.value.validate(async (isvalid) => {
    if (isvalid) {
      console.log(verifyInput.value);
      console.log(verifyRef.value.imgCode);
      if (verifyInput.value.toLowerCase() !== verifyRef.value.imgCode.toLowerCase()) {
        ElMessage({
          type: "error",
          message: t("register.verificationCodeErr"),
          showClose: true,
        });
        return false;
      }
      loginSubmit(loginUser).then((res) => {
        // 从res.data里获取token存储到localStorage
        const { token } = res.data;
        localStorage.setItem("eleToken", token);

        // 解析token存到vuex中
        const decoded = jwt_decode(token);
        store.dispatch("setAuthenticated", !isEmpty(decoded));
        store.dispatch("setUser", decoded);

        // 登录成功消息提示
        ElMessage({
          message: t("register.loginsuccess"),
          type: "success",
        });

        //页面跳转
        router.push("/");
      });
    } else {
      ElMessage({
        type: "error",
        message: t("register.err"),
        showClose: true,
      });
      return false;
    }
  });
};
</script>

<style scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}

.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 20%;
  left: 34%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}

.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}

.loginForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}


.submit_btn {
  width: 100%;
}

.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
}

.tiparea p a {
  color: #409eff;
}
</style>