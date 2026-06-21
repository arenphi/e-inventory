const BarangComp = {
    template: `
    <div class="flex min-h-screen bg-slate-100">
        <!-- Sidebar / Menu Samping -->
        <aside class="w-64 bg-slate-800 text-white p-6 space-y-6">
            <h1 class="text-xl font-bold tracking-wider">E-INVENTORY</h1>
            <nav class="space-y-2">
                <a href="#/dashboard" class="block py-2.5 px-4 rounded transition hover:bg-slate-700">Dashboard</a>
                <a href="#/barang" class="block py-2.5 px-4 rounded bg-indigo-600 font-medium">Data Inventaris</a>
            </nav>
            <button @click="logout" class="w-full text-left block py-2.5 px-4 rounded text-rose-400 hover:bg-rose-900/30 transition mt-auto font-semibold">
                Keluar (Logout)
            </button>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 p-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-slate-800">Manajemen Inventaris Barang</h2>
                <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow transition">
                    + Tambah Barang
                </button>
            </div>

            <!-- Tabel Data Master (Tailwind CSS) -->
            <div class="bg-white rounded-xl shadow overflow-hidden">
                <table class="min-w-full divide-y divide-slate-200">
                    <thead class="bg-slate-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kode</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Barang</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stok</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Supplier</th>
                            <th class="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-slate-200 text-sm">
                        <tr v-for="item in items" :key="item.id">
                            <td class="px-6 py-4 whitespace-nowrap font-mono text-indigo-600 font-bold">{{ item.item_code }}</td>
                            <td class="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{{ item.item_name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                                    {{ item.stock }} Unit
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-slate-500">{{ item.supplier }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                <button class="text-indigo-600 hover:text-indigo-900">Ubah</button>
                                <button class="text-rose-600 hover:text-rose-900">Hapus</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
    `,
    data() {
        return { items: [] }
    },
    mounted() {
        this.fetchItems();
    },
    methods: {
        async fetchItems() {
            try {
                // Otomatis menyertakan token berkat Axios Interceptor
                const response = await axios.get('items');
                this.items = response.data;
            } catch (error) {
                console.error("Gagal memuat inventaris:", error);
            }
        },
        logout() {
            localStorage.clear(); // Otomatis menghapus seluruh sesi token di penyimpanan lokal
            alert('Anda telah keluar dari aplikasi.');
            window.safeNavigate('/login'); // Kembalikan ke form login
        }
    }
};