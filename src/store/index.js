import { createStore } from 'vuex'

const types = {
  SET_AUTHENTICAED: 'SET_AUTHENTICAED',
  SET_USER: 'SET_USER',
  // SET_LANGUAGE: 'SET_LANGUAGE',
}

export default createStore({
  state: {
    isAuthenticated: false,
    user: {},
    // language: 'zh'
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user,
    // language: state => localStorage.getItem('my_locale') ? localStorage.getItem('my_locale') : state.language,
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
    },
    // [types.SET_LANGUAGE](state, language) {
    //   if (language) {
    //     state.language = language;
    //   } else {
    //     state.language = 'zh';
    //   }
    // }
  },
  actions: {
    setAuthenticated: ({ commit }, isAuthenticated) => {
      commit(types.SET_AUTHENTICAED, isAuthenticated);
    },
    setUser: ({ commit }, user) => {
      commit(types.SET_USER, user);
    },
    // setLanguage: ({ commit }, language) => {
    //   commit(types.SET_LANGUAGE, language);
    // },
    clearCurrentState: ({ commit }) => {
      commit(types.SET_AUTHENTICAED, false);
      commit(types.SET_USER, null);
    }
  },
})
