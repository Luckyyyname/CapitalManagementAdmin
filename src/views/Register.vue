<template>
  <div class="register">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">{{ $t('register.title') }}</span>
        <el-form ref="registerForm" :model="registerUser" :rules="rules" label-width="80px" class="registerForm">
          <el-form-item :label="$t('register.userLabel')" prop="name">
            <el-input v-model="registerUser.name" :placeholder="$t('register.userHolder')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('register.emailLabel')" prop="email">
            <el-input v-model="registerUser.email" :placeholder="$t('register.emailHolder')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('register.passwordLabel')" prop="password">
            <el-input type="password" v-model="registerUser.password" :placeholder="$t('register.passwordHolder')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('register.repeatedLabel')" prop="passwordRepeated">
            <el-input type="password" v-model="registerUser.passwordRepeated" :placeholder="$t('register.repeatedHolder')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('register.identityLabel')">
            <el-select v-model="registerUser.identity" :placeholder="$t('register.identityHolder')">
              <el-option :label="$t('register.managerLabel')" value="manager"></el-option>
              <el-option :label="$t('register.emplyeeLabel')" value="emplyee"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="submit_btn" @click="submitForm">{{ $t('register.register')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { registerSubmit } from '@/api/user'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// 校验两次密码输入是否一致
const validatePasswordRepeated = (rule, value, callback) => {
  if (value !== registerUser.password) {
    callback(new Error(t("register.repeatedError")));
  } else {
    callback();
  }
};
const router = useRouter();
const registerForm = ref(null);
const registerUser = reactive({
  name: "",
  email: "",
  password: "",
  passwordRepeated: "",
  identity: "",
});

const rules = reactive({
  name: [
    {
      required: true,
      message: t("register.userNotNull"),
      trigger: "blur",
    },
    {
      min: 2,
      max: 30,
      message: t("register.ulengthErr"),
      trigger: "blur",
    },
  ],
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
  passwordRepeated: [
    {
      required: true,
      message: t("register.reapeatedNotNull"),
      trigger: "blur",
    },
    {
      validator: validatePasswordRepeated,
      trigger: "blur",
    },
  ],
});

const submitForm = () => {
  registerForm.value.validate(async (isvalid) => {
    if (isvalid) {
      registerSubmit(registerUser)
        .then(() => {
          ElMessage({
            message: t("register.success"),
            type: "success",
          });
          router.push("/login");
        })
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
.register {
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
  top: 10%;
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

.registerForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit_btn {
  width: 100%;
}
</style>