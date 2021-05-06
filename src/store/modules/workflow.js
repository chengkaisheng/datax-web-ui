const state = {
    tabsList: [], // tab窗口数组
    ltList: [] , // 左侧tree型数据
    currentData: {}, // 当前选择工作流的数据
}

const mutations = {
    getTabsList : (state, payload) => {
        state.tabsList = payload
    },
    getltsList : (state, payload) => {
        state.ltList = payload
    },
    changeCurrent : (state, payload) => {
        state.currentData = payload
    }
}

const actions = {

}

export default {
    state,
    mutations,
    actions
}
  