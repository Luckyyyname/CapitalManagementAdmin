addEventListener('message', e => {
    const { data } = e;
    const datas = data.datas;
    const year = data.year;
    const resArray = [];
    for (let i = 1; i < 13; i++) {
        if (i < 10) {
            i = "0" + i;
        }
        // 当月净收入
        let sum = 0;
        // 计算当年每月净收入
        datas.forEach((item) => {
            if (item.date.startsWith(`${year}-${i}`)) {
                sum += item.income;
                sum -= item.expend;
            }
        });
        resArray.push(sum);
        sum = 0;
    }
    return postMessage(resArray);
})

export default {}