let accessToken = null;
let refreshToken = null;
let refreshInterval = null;

const authStorage = {
    setTokens: (access, refresh) => {
        accessToken = access;
        refreshToken = refresh;
        authStorage.startAutoRefresh();
    },
    getAccessToken: () => accessToken,
    getRefreshToken: () => refreshToken,
    clearTokens: () => {
        accessToken = null;
        refreshToken = null;
        clearInterval(refreshInterval);
    },
    startAutoRefresh: () => {
        clearInterval(refreshInterval);
        refreshInterval = setInterval(async () => {
            try {
                const res = await fetch('http://localhost:5000/api/auth/refresh-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                });
                const data = await res.json();
                if (res.ok) {
                    accessToken = data.accessToken;
                    console.log('🔁 Access token refreshed');
                    console.log('🧾 New Access Token:', accessToken);
                } else {
                    console.log('❌ Failed to refresh token:', data.message);
                }
            } catch (err) {
                console.log('❌ Error refreshing token:', err.message);
            }
        }, 1 * 60 * 1000);
    },
};

export default authStorage;