<template>
  <div>
    <el-dialog
      v-model="dataFormVisible"
      :title="dataForm.data._id ? '编辑' : '新增'"
      :before-close="handleClose"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm.data"
        :rules="dataFormRules"
        label-width="100px"
      >
        <el-form-item label="收支类型：" prop="type">
          <el-input v-model="dataForm.data.type" maxlength="12" clearable />
        </el-form-item>
        <el-form-item label="收支描述：" prop="describe">
          <el-input
            v-model="dataForm.data.describe"
            :rows="2"
            type="textarea"
            clearable
          />
        </el-form-item>
        <el-form-item label="收入：" prop="income">
          <el-input-number v-model.number="dataForm.data.income" />
        </el-form-item>
        <el-form-item label="支出：" prop="expend">
          <el-input-number v-model.number="dataForm.data.expend" />
        </el-form-item>
        <el-form-item label="账户现金：" prop="cash">
          <el-input-number v-model.number="dataForm.data.cash" />
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="dataForm.data.remark"
            :rows="2"
            type="textarea"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleNotSaveClose">关闭</el-button>
          <el-button type="primary" @click="handleCommit(dataFormRef)"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>


<script setup>
import { reactive, ref, unref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { addData, editData } from "@/api/index";

const dataFormVisible = ref(false);
const dataFormRef = ref("");

const props = defineProps(["formData"]);
const emit = defineEmits(["refreshList"]);

const dataForm = reactive({
  data: {},
});
const dataFormRules = reactive({
  type: [
    {
      required: true,
      message: "收支类型不能为空",
      trigger: "blur",
    },
  ],
  describe: [
    {
      required: true,
      message: "收支描述不能为空",
      trigger: "blur",
    },
  ],
  income: [
    {
      type: "number",
      trigger: "blur",
    },
  ],
  expend: [
    {
      type: "number",
      trigger: "blur",
    },
  ],
  cash: [
    {
      type: "number",
      trigger: "blur",
    },
  ],
  remark: [
    {
      trigger: "blur",
    },
  ],
});

const init = () => {
  dataFormVisible.value = true;
  console.log(props.formData.data._id);
  // 新增窗口且localStorage里有saveForm
  if (props.formData.data._id == undefined && localStorage.saveForm) {
    // 从localstorage里读数据赋值
    dataForm.data = JSON.parse(localStorage.getItem("saveForm"));
  } else {
    dataForm.data = props.formData.data;
  }
  const { data } = toRefs(dataForm);
};

// 窗口关闭且非提交操作
const handleClose = () => {
  // 新增窗口 自动存储数据至localStorage
  if (!dataForm.data._id) {
    localStorage.setItem("saveForm", JSON.stringify(dataForm.data));
  }

  dataFormVisible.value = false;
};
const handleNotSaveClose = () => {
  // 清除localStorage
  if (localStorage.saveForm && !dataForm.data._id) {
    localStorage.removeItem("saveForm");
  }
  dataFormVisible.value = false;
};

// 提交
const handleCommit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (!dataForm.data._id) {
        // 新增
        // 覆盖合并，确保没有填写的项不是undefined -> 编辑弹窗就会有默认值不然是undefined
        let params = Object.assign(
          {
            type: "",
            describe: "",
            income: 0,
            expend: 0,
            cash: 0,
            remark: "",
          },
          dataForm.data
        );
        addData(params).then(() => {
          // 关闭弹窗
          dataFormVisible.value = false;
          // table更新
          emit("refreshList");

          ElMessage({
            message: "操作成功",
            type: "success",
          });

          // 清除localStorage
          if (localStorage.saveForm) {
            localStorage.removeItem("saveForm");
          }
        });
      } else {
        // 编辑
        editData(dataForm.data._id, dataForm.data).then(() => {
          // 关闭弹窗
          dataFormVisible.value = false;
          // table更新
          emit("refreshList");

          ElMessage({
            message: "操作成功",
            type: "success",
          });
        });
      }
    }
  });
};

defineExpose({
  dataFormVisible,
  init,
});
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>