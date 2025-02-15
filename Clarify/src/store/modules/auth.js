// `src/store/modules/auth.js`
import axios from 'axios';

const state = {
    token: localStorage.getItem('token') || ''
};

const mutations = {
    SET_TOKEN(state, token) {
        state.token = token;
    }
};

const actions = {
    async login({ commit }, { email, password }) {
        try {
            const response = await axios.post('http://localhost:3000/api/login', { email, password });
            const token = response.data.token;
            commit('SET_TOKEN', token);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }
};

const getters = {
    isAuthenticated: state => !!state.token
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};