import { createStore } from 'vuex'

const types = {
  SET_AUTHENTICAED: 'SET_AUTHENTICAED',
  SET_USER: 'SET_USER',
}

export default createStore({
  state: {
    isAuthenticated: false,
    user: {},
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user,
  },
  mutations: {
    [types.SET_AUTHENTICAED](state, isAuthenticated) {
      if (isAuthenticated) {
        state.isAuthenticated = isAuthenticated;
      } else {
        state.isAuthenticated = false;
      }
    },
    [types.SET_USER](state, user) {
      if (user) {
        state.user = user;
      } else {
        state.user = {};
      }
    }
  },
  actions: {
    setAuthenticated: ({ commit }, isAuthenticated) => {
      commit(types.SET_AUTHENTICAED, isAuthenticated);
    },
    setUser: ({ commit }, user) => {
      commit(types.SET_USER, user);
    },
    clearCurrentState: ({commit})=>{
      commit(types.SET_AUTHENTICAED, false);
      commit(types.SET_USER, null);
    }
  },
})
