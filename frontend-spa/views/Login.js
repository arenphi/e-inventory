export default {
    template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <div class="text-center mb-6">
                <span class="text-4xl">📦</span>
                <h2 class="text-2xl font-bold text-gray-900 mt-2">E-Inventory Login</h2>
                <p class="text-sm text-gray-500">Gunakan akun admin untuk masuk ke sistem</p>
            </div>
            <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Username</label>
                    <input v-model="username" type="text" required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <input v-model="password" type="password" required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </div>
                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition shadow-sm">
                    Masuk ke Dashboard
                </button>
            </form>
        </div>
    </div>
    `,
    setup() {
        const username = Vue.ref('');
        const password = Vue.ref('');
        const router = VueRouter.useRouter();

        const handleLogin = () => {
            axios.post('http://localhost:8080/api/login', {
                username: username.value,
                password: password.value
            })
            .then(response => {
                const resData = response.data;
                const token = resData.token || (resData.data && resData.data.token);
                const isSuccess = response.status === 200 || resData.status === 200;

                if (isSuccess && token) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('token', token);
                    console.log('Login (view): token saved, redirecting to /dashboard/barang');
                    router.push('/dashboard/barang');
                } else {
                    alert('Username atau Password salah!');
                }
            })
            .catch(error => {
                console.error('Login error', error);
                const msg = error.response && error.response.data && error.response.data.messages ? error.response.data.messages.error : 'Username atau Password admin salah!';
                alert('Login Gagal: ' + msg);
            });
        };

        return { username, password, handleLogin };
    }
};