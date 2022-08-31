<template>
  <div class="fundstatistics">
    <el-form :inline="true" :model="searchForm">
      <el-form-item :label="$t('fundstatistics.smonth')">
        <el-date-picker v-model="searchForm.month" type="month" :placeholder="$t('fundstatistics.pmonth')"
          value-format="YYYY-MM" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch" v-buried="{ type: 'search', event: 'click' }">
          {{ $t('fundchart.search') }}</el-button>
      </el-form-item>
      <el-form-item class="funSum">
        <template v-if="activeName == 'income'">
          {{ $t('fundstatistics.sincome') }}<span style="color: #00d053">{{ fundSum }}</span>
        </template>
        <template v-else>
          {{ $t('fundstatistics.sexpend') }}<span style="color: #f56767"> {{ fundSum }}</span>
        </template>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('fundstatistics.income')" name="income">
        <!-- table表 -->
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column type="index" :label="$t('fundstatistics.index')" align="center" width="60">
            <template v-slot="scope">
              <span>{{
                  scope.$index +
                  (paginations.data.page_index - 1) * paginations.data.page_size +
                  1
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="date" :label="$t('fundstatistics.date')" align="center">
            <template v-slot="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{
                  formatDate(scope.row.date)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" :label="$t('fundstatistics.type')" align="center">
          </el-table-column>
          <el-table-column prop="describe" :label="$t('fundstatistics.des')" align="center">
          </el-table-column>
          <el-table-column prop="income" :label="$t('fundstatistics.income')" align="center">
            <template v-slot="scope">
              <span style="color: #00d053">{{ scope.row.income }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" :label="$t('fundstatistics.remark')" align="center">
          </el-table-column>
        </el-table>

        <!-- pagination -->
        <div class="pagination">
          <el-pagination v-model:currentPage="paginations.data.page_index"
            v-model:page-size="paginations.data.page_size" :page-sizes="paginations.data.page_sizes"
            :layout="paginations.data.layout" :total="paginations.data.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('fundstatistics.expend')" name="expend">
        <!-- table表 -->
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column type="index" :label="$t('fundstatistics.index')" align="center" width="60">
            <template v-slot="scope">
              <span>{{
                  scope.$index +
                  (paginations.data.page_index - 1) * paginations.data.page_size +
                  1
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="date" :label="$t('fundstatistics.date')" align="center">
            <template v-slot="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{
                  formatDate(scope.row.date)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" :label="$t('fundstatistics.type')" align="center">
          </el-table-column>
          <el-table-column prop="describe" :label="$t('fundstatistics.des')" align="center">
          </el-table-column>
          <el-table-column prop="expend" :label="$t('fundstatistics.expend')" align="center">
            <template v-slot="scope">
              <span style="color: #f56767">{{ scope.row.expend }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" :label="$t('fundstatistics.remark')" align="center">
          </el-table-column>
        </el-table>

        <!-- pagination -->
        <div class="pagination">
          <el-pagination v-model:currentPage="paginations.data.page_index"
            v-model:page-size="paginations.data.page_size" :page-sizes="paginations.data.page_sizes"
            :layout="paginations.data.layout" :total="paginations.data.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onActivated } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

// api
import { getTableList } from "@/api/index";

// import Worker from "worker-loader!@/workers/statisticsWorker";

const router = useRouter();
const store = useStore();

const activeName = ref("income");

const searchForm = reactive({
  month: "",
});
const fundSum = computed(() => {
  let sum = 0;
  if (activeName.value == "income") {
    fileterTableData.value.forEach((item) => {
      sum += item.income;
    });
  } else {
    fileterTableData.value.forEach((item) => {
      sum += item.expend;
    });
  }
  return sum;
});

const tableData = ref([]);
const allTableData = ref([]);
const fileterTableData = ref([]);

const paginations = reactive({
  data: {
    page_index: 1, //当前位于多少页
    total: 0, //总数
    page_size: 10, //一页显示多少条
    page_sizes: [5, 10, 20], //每页显示多少条
    layout: "total,sizes,prev,pager,next,jumper", // 翻页属性
  },
});

// onMounted(() => {
//   // 默认获取
//   getTableData();
// });

// 获取table数据
const getTableData = () => {
  getTableList().then((res) => {
    allTableData.value = res.data;
    // 过滤得到收入/支出不为0的
    fileterTableData.value = allTableData.value.filter((item) => {
      return item[activeName.value] > 0;
    });
    // 对过滤后的数据从大到小排序
    fileterTableData.value.sort((a, b) => {
      return b[activeName.value] - a[activeName.value];
    });
    //设置分页数据
    setPaginations();

    // const worker = new Worker();
    // worker.postMessage({ datas: res.data, active: activeName.value });
    // worker.onmessage = (e) => {
    //   fileterTableData.value = e.data;
    //   console.log(fileterTableData.value)
    //   setPaginations();
    //   worker.terminate();
    // };
  });
};

// 切换el-tab
const handleClick = () => {
  // 先清空table数据，不然数据会突然改变
  tableData.value = [];
  // 清空分页器配置
  paginations.data = {
    page_index: 1, //当前位于多少页
    total: 0, //总数
    page_size: 10, //一页显示多少条
    page_sizes: [5, 10, 20], //每页显示多少条
    layout: "total,sizes,prev,pager,next,jumper", // 翻页属性
  };

  getTableData();
};

// 月份搜索
const handleSearch = () => {
  const pickedMonth = searchForm.month;

  if (pickedMonth) {
    tableData.value = fileterTableData.value.filter((item) => {
      return item.date.startsWith(pickedMonth);
    });
  } else {
    // 如果没有选择日期则显示全部
    tableData.value = fileterTableData.value;
  }
};

// 格式化表格中的日期
const formatDate = (time) => {
  let date = new Date(new Date(time).getTime() + 8 * 3600 * 1000).toJSON();
  date = date.substring(0, 19).replace("T", " ");
  return date;
};

const setPaginations = () => {
  paginations.data.total = fileterTableData.value.length;
  paginations.data.page_index = 1;
  paginations.data.page_size = 10;
  //设置默认分页数据
  tableData.value = fileterTableData.value.filter((item, index) => {
    return index < paginations.data.page_size;
  });
};

const handleSizeChange = (page_size) => {
  paginations.data.page_index = 1;
  paginations.data.page_size = page_size;
  tableData.value = fileterTableData.value.filter((item, index) => {
    return index < page_size;
  });
};

const handleCurrentChange = (page) => {
  //截取数1
  let index = paginations.data.page_size * (page - 1);
  //截取数2
  let nums = paginations.data.page_size * page;
  tableData.value = fileterTableData.value.slice(index, nums);
};

// getTableData();
onActivated(() => {
  getTableData();
})
</script>

<style scoped>
.funSum {
  margin-left: 315px;
}

.pagination {
  float: right;
  margin-top: 10px;
}
</style>