<template>
    <div>
        <canvas ref="verify" id="canvas" :width="state.width" :height="state.height" @click="handleDraw"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
const verify = ref(null);

const state = reactive({
    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",   // 随机字符串
    width: 110,                                     //展示区域宽度
    height: 32,                                     //展示区域高度
});

const imgCode = ref("");

defineExpose({
    imgCode,
});

// 1、初始展示
onMounted(() => {
    draw();
    imgCode.value = draw();
});
// 2、点击图片重新绘制
const handleDraw = () => {
    draw();
    imgCode.value = draw();
};

//绘制随机内容
const draw = () => {
    const ctx = verify.value.getContext("2d");
    ctx.fillStyle = randomColor(180, 230);
    ctx.fillRect(0, 0, state.width, state.height);


    let imgCode = "";
    for (let i = 0; i < 4; i++) {
        const text = state.pool[randomNum(0, state.pool.length - 1)];

        const fontSize = randomNum(18, 35);
        const deg = randomNum(-30, 30);


        ctx.font = fontSize + "px Simhei";
        ctx.textBaseline = "top";
        ctx.fillStyle = randomColor(80, 150);


        ctx.save();
        ctx.translate(25 * i + 15, 15);
        ctx.rotate((deg * Math.PI) / 180);

        ctx.fillText(text, -15 + 5, -15);
        ctx.restore();
        imgCode += text;
    }

    /* 
    * 随机产生5条干扰线,干扰线的颜色要浅一点
    */
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(randomNum(0, state.width), randomNum(0, state.height));
        ctx.lineTo(randomNum(0, state.width), randomNum(0, state.height));
        ctx.strokeStyle = randomColor(180, 230);
        ctx.closePath();
        ctx.stroke();
    }

    /* 
    * 随机产生40个干扰的小点
    */
    for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        ctx.arc(
            randomNum(0, state.width),
            randomNum(0, state.height),
            1,
            0,
            2 * Math.PI
        );
        ctx.closePath();
        ctx.fillStyle = randomColor(150, 200);
        ctx.fill();
    }
    return imgCode;
};




//随机数
function randomNum(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min);
};
//随机颜色
function randomColor(min, max) {
    const r = randomNum(min, max);
    const g = randomNum(min, max);
    const b = randomNum(min, max);
    return `rgb(${r},${g},${b})`;
};
</script>

<style scoped>
</style>