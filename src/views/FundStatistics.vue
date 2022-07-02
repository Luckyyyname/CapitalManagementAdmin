<template>
  <div class="fundstatistics">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="查询月份：">
        <el-date-picker
          v-model="searchForm.month"
          type="month"
          placeholder="选择月份"
          value-format="YYYY-MM"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
      <el-form-item class="funSum">
        <template v-if="activeName == 'income'">
          总收入：<span style="color: #00d053">{{ fundSum }}</span>
        </template>
        <template v-else>
          总支出：<span style="color: #f56767"> {{ fundSum }}</span>
        </template>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="收入" name="income">
        <!-- table表 -->
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="60">
            <template v-slot="scope">
              <span>{{
                scope.$index +
                (paginations.data.page_index - 1) *
                  paginations.data.page_size +
                1
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="创建时间" align="center">
            <template v-slot="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{
                formatDate(scope.row.date)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="收支类型" align="center">
          </el-table-column>
          <el-table-column prop="describe" label="收支描述" align="center">
          </el-table-column>
          <el-table-column prop="income" label="收入" align="center">
            <template v-slot="scope">
              <span style="color: #00d053">{{ scope.row.income }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center">
          </el-table-column>
        </el-table>

        <!-- pagination -->
        <div class="pagination">
          <el-pagination
            v-model:currentPage="paginations.data.page_index"
            v-model:page-size="paginations.data.page_size"
            :page-sizes="paginations.data.page_sizes"
            :layout="paginations.data.layout"
            :total="paginations.data.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="支出" name="expend">
        <!-- table表 -->
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="60">
            <template v-slot="scope">
              <span>{{
                scope.$index +
                (paginations.data.page_index - 1) *
                  paginations.data.page_size +
                1
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="创建时间" align="center">
            <template v-slot="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{
                formatDate(scope.row.date)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="收支类型" align="center">
          </el-table-column>
          <el-table-column prop="describe" label="收支描述" align="center">
          </el-table-column>
          <el-table-column prop="expend" label="支出" align="center">
            <template v-slot="scope">
              <span style="color: #f56767">{{ scope.row.expend }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center">
          </el-table-column>
        </el-table>

        <!-- pagination -->
        <div class="pagination">
          <el-pagination
            v-model:currentPage="paginations.data.page_index"
            v-model:page-size="paginations.data.page_size"
            :page-sizes="paginations.data.page_sizes"
            :layout="paginations.data.layout"
            :total="paginations.data.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

// api
import { getTableList } from "@/api/index";

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

onMounted(() => {
  // 默认获取
  getTableData();
});

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
  });
};

// 切换el-tab
const handleClick = () => {
  // 先清空table数据，不然数据会突然改变
  tableData.value = [];
  // 清空分页器配置
  paginations.data= {
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