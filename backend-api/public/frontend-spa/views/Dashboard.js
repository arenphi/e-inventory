export default {
    template: `
    <div class="min-h-screen flex bg-gray-100 text-gray-800 font-sans">
        <aside class="w-64 bg-slate-900 text-white flex flex-col shadow-lg">
            <div class="p-6 border-b border-slate-800">
                <h1 class="text-xl font-bold flex items-center gap-2">📦 E-Inventory</h1>
                <p class="text-xs text-slate-400 mt-1">Admin Panel SPA</p>
            </div>
            <nav class="flex-1 p-4 space-y-2">
                <router-link to="/dashboard/barang" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition" active-class="bg-blue-600 text-white">
                    <span>🗃️</span> Data Inventaris Barang
                </router-link>
            </nav>
            <div class="p-4 border-t border-slate-800">
                <button @click="handleLogout" class="w-full flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white text-sm font-medium py-2 rounded-lg transition border border-red-600/30">
                    🚪 Keluar Sistem (Logout)
                </button>
            </div>
        </aside>

        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
                <h2 class="text-sm font-medium text-gray-500">Selamat datang kembali, <span class="font-bold text-gray-800">Admin</span></h2>
                <span class="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">Server Terhubung (CORS OK)</span>
            </header>
            <main class="flex-1 overflow-x-hidden overflow-y-auto p-8">
                <router-view></router-view>
            </main>
        </div>
    </div>
    `,
    setup() {
        const router = VueRouter.useRouter();
        const { onMounted } = Vue;

        // Pastikan pengguna sudah terautentikasi saat memasuki Dashboard
        onMounted(() => {
            const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
            if (!isAuthenticated) {
                console.log('Dashboard: user not authenticated — redirecting to /login');
                alert('Akses Ilegal Ditolak! Sila Login Dahulu.');
                window.safeNavigate('/login');
            } else {
                console.log('Dashboard: user authenticated');
            }
        });

        const handleLogout = () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('token'); // Menghapus seluruh sesi token [cite: 35]
            window.safeNavigate('/login');
        };
        return { handleLogout };
    }
};
