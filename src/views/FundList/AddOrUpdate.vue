<template>
  <div>
    <el-dialog
      v-model="dataFormVisible"
      :title="dataForm.data._id ? '编辑' : '新增'"
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
          <el-button @click="dataFormVisible = false">关闭</el-button>
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
    data:{},
});
const dataFormRules = reactive({
  type: [
    {
      required: true,
      trigger: "blur",
    },
  ],
  describe: [
    {
      required: true,
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

  dataForm.data = props.formData.data;
  const { data } = toRefs(dataForm);
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

        });
      } else {
        // 编辑
        console.log(dataForm.data)
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