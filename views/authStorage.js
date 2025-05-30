let token = null;

const authStorage = {
    setToken: (t) => (token = t),
    getToken: () => token,
    clearToken: () => (token = null),
};

export default authStorage;