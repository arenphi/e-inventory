const LoginComp = {
    template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div class="text-center">
                <h2 class="text-3xl font-bold text-slate-800">E-Inventory Admin</h2>
                <p class="text-sm text-slate-500 mt-1">Silakan masuk untuk mengelola barang</p>
            </div>
            <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <input v-model="username" type="text" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input v-model="password" type="password" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                </div>
                <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors">
                    Masuk Sekarang
                </button>
            </form>
        </div>
    </div>
    `,
    data() {
        return { username: '', password: '' }
    },
    methods: {
        async handleLogin() {
            try {
                const response = await axios.post('login', {
                    username: this.username,
                    password: this.password
                });
                
                if(response.data.status === 200) {
                    // Simpan identitas & token otentikasi di localStorage
                    localStorage.setItem('isLoggedIn', 'true');
                    // Dukung format token baik di top-level atau di data.access_token
                    const token = response.data.token || (response.data.data && response.data.data.access_token) || '';
                    localStorage.setItem('token', token);
                    if(response.data.data && response.data.data.username) localStorage.setItem('username', response.data.data.username);
                    
                    alert('Selamat Datang Kembali!');
                    console.log('LoginComp: safeNavigate to /dashboard');
                    window.safeNavigate('/dashboard');
                }
            } catch (error) {
                alert('Otentikasi Gagal! Periksa kembali username dan password.');
            }
        }
    }
};