<template>
  <div class="fundstatistics">
    <!-- 查询 -->
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="查询年份：">
        <el-date-picker 
        v-model="searchForm.year"
        type="year" 
        placeholder="选择年份" 
        value-format="YYYY" 
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- echarts图表 -->
    <div id="main" style="width: 100%; height: 500px"></div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onBeforeUnmount, onActivated } from "vue";
import { ElMessage } from "element-plus";
import Worker from "worker-loader!@/workers/chartWorker";
// api
import { getTableList } from "@/api/index";
//echarts
import * as echarts from "echarts";
let echart = echarts;

const computedNum = computed(() => {
  return chartData.value;
});

const searchForm = reactive({
  year: new Date().getFullYear().toString(),
});

// echarts配置
const isFirstRender = ref(true);
const chartData = ref([]);
const options = reactive({
  xAxis: {
    type: "category",
    data: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ],
  },
  tooltip: {
    trigger: "axis",
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: computedNum,
      type: "line",
      smooth: true,
    },
  ],
});

const openWorker = (paramObj) => {
  const worker = new Worker();
  worker.postMessage(paramObj);
  worker.onmessage = (e) => {
    chartData.value = e.data;
    renderChart();
    worker.terminate();
  };
};

// echarts渲染
let chart = {};
const renderChart = () => {
  // 第一次渲染
  if (isFirstRender.value) {
    chart = echart.init(document.getElementById("main"));
    isFirstRender.value = false;
  }
  // 非第一次渲染只改变配置
  chart.setOption(options);
};

// 获取chart数据
const getChartData = () => {
  getTableList().then((res) => {
    chartData.length = 0;
    openWorker({ datas: res.data, year: searchForm.year });
  });
};

// 年份搜索
const handleSearch = () => {
  if (!searchForm.year) {
    // 消息提示
    ElMessage({
      message: "查询年份不能为空",
      type: "error",
    });
    searchForm.year = new Date().getFullYear().toString();
  }
  getChartData();
};

// getChartData();
onActivated(() => {
  getChartData();
})

onBeforeUnmount(() => {
  chart.clear();
});
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