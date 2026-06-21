export default {
    template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
                <h3 class="font-bold text-lg text-gray-900">Daftar Stok Inventaris Master</h3>
                <p class="text-xs text-gray-500 mt-0.5">Kelola data logistik, kategori, beserta informasi supplier terkait</p>
            </div>
            <button @click="ambilData" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm flex items-center gap-2">
                🔄 Ambil Ulang Data
            </button>
        </div>

        <div v-if="loading" class="p-12 text-center text-gray-500">
            <span class="animate-pulse">Menghubungi RESTful API Server...</span>
        </div>

        <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-100/70 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th class="px-6 py-4">Kode Barang</th>
                        <th class="px-6 py-4">Nama Barang</th>
                        <th class="px-6 py-4">Kategori</th>
                        <th class="px-6 py-4">Supplier</th>
                        <th class="px-6 py-4 text-right">Harga Satuan</th>
                        <th class="px-6 py-4 text-center">Stok Gudang</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 text-sm">
                    <tr v-for="item in barang" :key="item.id" class="hover:bg-gray-50/70 transition">
                        <td class="px-6 py-4 font-mono text-xs font-bold text-blue-600">{{ item.kode_barang }}</td>
                        <td class="px-6 py-4 font-medium text-gray-900">{{ item.nama_barang }}</td>
                        <td class="px-6 py-4">
                            <span class="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md border border-gray-200">
                                {{ item.nama_kategori }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-gray-600 text-xs">{{ item.nama_supplier }}</td>
                        <td class="px-6 py-4 text-right font-medium text-gray-900">
                            Rp {{ Number(item.harga).toLocaleString('id-ID') }}
                        </td>
                        <td class="px-6 py-4 text-center">
                            <span class="text-xs font-semibold px-2.5 py-1 rounded-full border bg-green-50 text-green-700 border-green-200">
                                {{ item.stok }} pcs
                            </span>
                        </td>
                    </tr>
                    <tr v-if="barang.length === 0">
                        <td colspan="6" class="px-6 py-12 text-center text-gray-400">Database kosong atau server mati.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `,
    setup() {
        const barang = Vue.ref([]);
        const loading = Vue.ref(true);

        const ambilData = () => {
            loading.value = true;
            axios.get('http://localhost:8080/api/barang')
                .then(response => {
                    barang.value = response.data;
                    loading.value = false;
                })
                .catch(error => {
                    console.error("Gagal memuat API:", error);
                    loading.value = false;
                });
        };

        Vue.onMounted(() => {
            ambilData();
        });

        return { barang, loading, ambilData };
    }
};
export default {
    template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
                <h3 class="font-bold text-lg text-gray-900">Daftar Stok Inventaris Master</h3>
                <p class="text-xs text-gray-500 mt-0.5">Kelola data logistik, kategori, beserta informasi supplier terkait</p>
            </div>
            <button @click="ambilData" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm flex items-center gap-2">
                🔄 Ambil Ulang Data
            </button>
        </div>

        <div v-if="loading" class="p-12 text-center text-gray-500">
            <span class="animate-pulse">Menghubungi RESTful API Server...</span>
        </div>

        <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-100/70 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th class="px-6 py-4">Kode Barang</th>
                        <th class="px-6 py-4">Nama Barang</th>
                        <th class="px-6 py-4">Kategori</th>
                        <th class="px-6 py-4">Supplier</th>
                        <th class="px-6 py-4 text-right">Harga Satuan</th>
                        <th class="px-6 py-4 text-center">Stok Gudang</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 text-sm">
                    <tr v-for="item in barang" :key="item.id" class="hover:bg-gray-50/70 transition">
                        <td class="px-6 py-4 font-mono text-xs font-bold text-blue-600">{{ item.kode_barang }}</td>
                        <td class="px-6 py-4 font-medium text-gray-900">{{ item.nama_barang }}</td>
                        <td class="px-6 py-4">
                            <span class="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md border border-gray-200">
                                {{ item.nama_kategori }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-gray-600 text-xs">{{ item.nama_supplier }}</td>
                        <td class="px-6 py-4 text-right font-medium text-gray-900">
                            Rp {{ Number(item.harga).toLocaleString('id-ID') }}
                        </td>
                        <td class="px-6 py-4 text-center">
                            <span class="text-xs font-semibold px-2.5 py-1 rounded-full border bg-green-50 text-green-700 border-green-200">
                                {{ item.stok }} pcs
                            </span>
                        </td>
                    </tr>
                    <tr v-if="barang.length === 0">
                        <td colspan="6" class="px-6 py-12 text-center text-gray-400">Database kosong atau server mati.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `,
    setup() {
        const barang = Vue.ref([]);
        const loading = Vue.ref(true);

        const ambilData = () => {
            loading.value = true;
            axios.get('http://localhost:8080/api/barang')
                .then(response => {
                    barang.value = response.data;
                    loading.value = false;
                })
                .catch(error => {
                    console.error("Gagal memuat API:", error);
                    loading.value = false;
                });
        };

        Vue.onMounted(() => {
            ambilData();
        });

        return { barang, loading, ambilData };
    }
};