addEventListener('message', e => {
    const { data } = e;
    const datas = data.datas;
    const activeName = data.active;
    let resData = [];
    resData = datas.filter((item) => {
        return item[activeName] > 0;
    });
    resData.sort((a, b) => {
        return b[activeName] - a[activeName];
    });
    setTimeout(() => {
        return postMessage(resData);
    },2000)

})

export default {}