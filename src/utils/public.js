/**
 * 设置浏览器session缓存，用于刷新后加载标题
 * @params
 *  keyName: sessionKey
 *  ...params
 *      [0]: 标题
 *      [1]: 当前激活标题下标
 *      [2]: 当前激活标题的面包屑导航信息
 * */
function setSessionStorage(...params) {
    sessionStorage.setItem('titleItem', JSON.stringify({
        titleItem: params[0],
        activeIndex: params[1],
        crumbs: params[2]
    }))
}

export { setSessionStorage }