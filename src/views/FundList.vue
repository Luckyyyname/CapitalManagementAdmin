<template>
  <div class="fundlist">
    <!-- 头部 搜索和新增按钮 -->
    <el-row class="fundlist-head">
      <el-col :span="16">
        <el-form ref="searchFormRef" :model="searchForm.data" :rules="searchRules" :inline="true">
          <el-form-item :label="$t('fundlist.stime')">
            <el-form-item prop="startTime">
              <el-date-picker v-model="searchForm.data.startTime" type="datetime" :placeholder="$t('fundlist.ps')" />
            </el-form-item>
            <span style="margin-left: -25px; margin-right: 5px">--</span>
            <el-form-item prop="endTime">
              <el-date-picker v-model="searchForm.data.endTime" type="datetime" :placeholder="$t('fundlist.pe')" />
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-debounce="{ fn: handleSearch, event: 'click', delay: 200 }">
              {{ $t('fundlist.search') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2" :offset="6">
        <el-button type="primary" @click="handleAdd()">{{ $t('fundlist.add') }}</el-button>
      </el-col>
    </el-row>

    <!-- table表 -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column type="index" :label="$t('fundstatistics.index')" align="center" width="60">
        <template v-slot="scope">
          <span>{{ scope.$index + (paginations.data.page_index - 1) * paginations.data.page_size + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" :label="$t('fundstatistics.date')" align="center" width="175">
        <template v-slot="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ formatDate(scope.row.date) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" :label="$t('fundstatistics.type')" align="center" width="120">
      </el-table-column>
      <el-table-column prop="describe" :label="$t('fundstatistics.des')" align="center" width="180">
      </el-table-column>
      <el-table-column prop="income" :label="$t('fundstatistics.income')" align="center" width="90">
        <template v-slot="scope">
          <span style="color: #00d053">{{ scope.row.income }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="expend" :label="$t('fundstatistics.expend')" align="center" width="90">
        <template v-slot="scope">
          <span style="color: #f56767">{{ scope.row.expend }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cash" :label="$t('fundlist.cash')" align="center" width="110">
        <template v-slot="scope">
          <span style="color: #4db3ff">{{ scope.row.cash }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="$t('fundstatistics.remark')" align="center" width="120">
      </el-table-column>
      <el-table-column :label="$t('fundlist.operation')" prop="operation" fixed="right" align="center">
        <template v-slot="scope">
          <el-button type="warning" :icon="Edit" size="small" @click="handleEdit(scope.row)">{{ $t('fundlist.edit') }}
          </el-button>
          <el-button size="small" :icon="Delete" type="danger" @click="handleDelete(scope.row)">
            {{ $t('fundlist.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- pagination -->
    <div class="pagination">
      <el-pagination v-model:currentPage="paginations.data.page_index" v-model:page-size="paginations.data.page_size"
        :page-sizes="paginations.data.page_sizes" :layout="paginations.data.layout" :total="paginations.data.total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 新增，编辑弹窗 -->
    <add-or-update v-if="addOrUpdateVisible" ref="AddOrUpdateRef" :formData="formData" @refreshList="getTableData">
    </add-or-update>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onActivated } from "vue";
import { getCurrentInstance } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

// element-plus
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Edit } from "@element-plus/icons-vue";

// add-or-update
import AddOrUpdate from "@/views/FundList/AddOrUpdate";

// api
import { getTableList } from "@/api/index";
import { deleteData } from "@/api/index";

// i18n
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter();
const store = useStore();
const currentInstance = getCurrentInstance();

const ruleFormRef = ref("");
const AddOrUpdateRef = ref("");
const addOrUpdateVisible = ref(false);

const searchForm = reactive({
  data: {
    startTime: "",
    endTime: "",
  },
});
const searchRules = reactive({
  startTime: [
    {
      type: "date",
      required: true,
      message: "Please pick a date",
      trigger: "change",
    },
  ],
  endTime: [
    {
      type: "date",
      required: true,
      message: "Please pick a time",
      trigger: "change",
    },
  ],
});

const tableData = ref([]);
const allTableData = ref([]);
const fileterTableData = ref([]);

const paginations = reactive({
  data: {
    page_index: 1, //当前位于多少页
    total: 0, //总数
    page_size: 5, //一页显示多少条
    page_sizes: [5, 10, 15], //每页显示多少条
    layout: "total,sizes,prev,pager,next,jumper", // 翻页属性
  },
});

const formData = reactive({});

// 获取table数据
const getTableData = () => {
  getTableList().then((res) => {
    allTableData.value = res.data;
    fileterTableData.value = res.data;
    //设置分页数据
    setPaginations();
  });
};

const formatDate = (time) => {
  let date = new Date(new Date(time).getTime() + 8 * 3600 * 1000).toJSON();
  date = date.substring(0, 19).replace("T", " ");
  return date;
};

// 搜索
const handleSearch = () => {
  // 两个搜索条件都不能为空
  if (!searchForm.data.startTime || !searchForm.data.endTime) {
    ElMessage({
      message: t("fundlist.chooseTime"),
      type: "warning",
    });
    getTableData();
    return;
  }
  const sTime = searchForm.data.startTime.getTime();
  const eTime = searchForm.data.endTime.getTime();
  allTableData.value = fileterTableData.value.filter((item) => {
    let date = new Date(item.date);
    let time = date.getTime();
    return time >= sTime && time <= eTime;
  });
  setPaginations();
};

// 新增
const handleAdd = () => {
  // 初始化formData 因为只需要单向赋值所以不用toRefs
  formData.data = {
    type: "",
    describe: "",
    income: 0,
    expend: 0,
    cash: 0,
    remark: "",
  };
  addOrUpdateVisible.value = true;
  nextTick(() => {
    currentInstance.ctx.$refs.AddOrUpdateRef.init();
  });
};

// 编辑
const handleEdit = (row) => {
  // 初始化formData 因为只需要单向赋值所以不用toRefs
  formData.data = {
    type: row.type,
    describe: row.describe,
    income: row.income,
    expend: row.expend,
    cash: row.cash,
    remark: row.remark,
    _id: row._id,
  };
  addOrUpdateVisible.value = true;
  nextTick(() => {
    currentInstance.ctx.$refs.AddOrUpdateRef.init();
  });
};

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(t("fundlist.del"), t("fundlist.tip"), {
    confirmButtonText: t("fundlist.confirm"),
    cancelButtonText: t("fundlist.cancel"),
    type: "warning",
  }).then(() => {
    deleteData(row._id).then(() => {
      ElMessage({
        message: t("fundlist.success"),
        type: "success",
      });
      getTableData();
    });
  });
};

const setPaginations = () => {
  paginations.data.total = allTableData.value.length;
  paginations.data.page_index = 1;
  paginations.data.page_size = 10;
  //设置默认分页数据
  tableData.value = allTableData.value.filter((item, index) => {
    return index < paginations.data.page_size;
  });
};

const handleSizeChange = (page_size) => {
  paginations.data.page_index = 1;
  paginations.data.page_size = page_size;
  tableData.value = allTableData.value.filter((item, index) => {
    return index < page_size;
  });
};

const handleCurrentChange = (page) => {
  //截取数1
  let index = paginations.data.page_size * (page - 1);
  //截取数2
  let nums = paginations.data.page_size * page;
  tableData.value = allTableData.value.slice(index, nums);
};

// getTableData();
onActivated(() => {
  getTableData();
})
</script>

<style scoped>
.fundlist-head {
  margin-bottom: 20px;
  margin-top: 10px;
}

.pagination {
  float: right;
  margin-top: 10px;
}
</style>