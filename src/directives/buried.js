import { submitTrigger } from "@/api/trigger";

let map = new Map();

// 上报数据
function submitData() {
    if (map.size !== 0) {
        let submitParams = [];
        for (const [key, value] of map) {
            submitParams.push({
                ...JSON.parse(key),
                times: value,
            })
        }
        submitTrigger(submitParams);
    }
}

export default {
    mounted(el, binding) {
        // 至少需要监听类型以及监听事件类型
        if (!binding.value.type || !binding.value.event) return;

        let param = JSON.stringify({
            event: binding.value.event,
            type: binding.value.type,
        });

        el.handler = () => {
            map.has(param) ? map.set(param, map.get(param) + 1) : map.set(param, 1);
            // 超过五个则发送请求
            if (map.size >= 5) {
                submitData();
                map.clear();
            }
        }

        el.addEventListener(binding.value.event, el.handler);

        // 没到五个就离开
        window.addEventListener('beforeunload', submitData);
    },
    // 元素卸载前清理定时器并且移除监听事件
    beforeUnmounted(el, binding) {
        el.removeEventListener(binding.value.event, el.handler)
        map.clear();
    }
}