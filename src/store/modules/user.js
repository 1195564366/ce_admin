import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: localStorage.getItem('ZD_name') || '',
    avatar: localStorage.getItem('ZD_avatar') || '',
    id: localStorage.getItem('ZD_id') || '',
    role: localStorage.getItem('ZD_role') || ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
    localStorage.setItem('ZD_name', name)
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ID: (state, id) => {
    state.id = id
    localStorage.setItem('ZD_id', id)
  },
  SET_ROLE: (state, role) => {
    state.role = role
    localStorage.setItem('ZD_role', role)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { name, pwd } = userInfo
    console.log(userInfo)
    return new Promise((resolve, reject) => {
      login({ phone: name.trim(), pwd: pwd }).then(response => {
        console.log(response.data)
        const { token, name, phone, role, image, id } = response.data
        console.log(token, name, phone, role, image, id)
        commit('SET_TOKEN', token)
        setToken(token)
        commit('SET_NAME', name)
        commit('SET_AVATAR', image)
        commit('SET_ID', id)
        commit('SET_ROLE', role)
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

