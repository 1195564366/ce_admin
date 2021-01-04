import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: localStorage.getItem('EC_userInfo') ? JSON.parse(localStorage.getItem('EC_userInfo')) : null
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    setToken(token);
    state.token = token;
  },
  SET_USERINFO: (state, userInfo) => {
    localStorage.setItem('EC_userInfo', JSON.stringify(userInfo));
    state.userInfo = userInfo;
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { name, pwd } = userInfo
    console.log(userInfo)
    return new Promise((resolve, reject) => {
      login({ account: name.trim(), password: pwd }).then(response => {
        console.log(response.data)
        const { token } = response.data;
        commit('SET_TOKEN', token);
        commit('SET_USERINFO', response.data);
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

