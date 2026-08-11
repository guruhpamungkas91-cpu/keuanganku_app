import React, { useState, useEffect } from 'react';
import { 
  Wallet, Sparkles, Download, RotateCw, Palette, ChevronDown, 
  PlusCircle, BarChart3, Sliders, Target, FileText, Plus, 
  Trash2, Edit3, ArrowUpRight, TrendingDown, ArrowDownRight, 
  DollarSign, CheckCircle2, BarChart2, PieChart, PiggyBank, 
  AlertCircle, Info, Inbox 
} from 'lucide-react';

const defaultSampleData = [
  { id: 1, type: "pengeluaran_lainnya", title: "Setor Bank BSI untuk dana endap", amount: 99998, wallet: "ShopeePay", category: "Pengeluaran Lainnya", date: "2026-07-31" },
  { id: 2, type: "pengeluaran_lainnya", title: "Tambahan Dana Order Bak", amount: 500000, wallet: "ShopeePay", category: "Pengeluaran Lainnya", date: "2026-07-30" },
  { id: 3, type: "pengeluaran_harian", title: "Makan Siang Warteg", amount: 13999, wallet: "Tunai / Cash", category: "Makanan & Minuman", date: "2026-07-31" },
  { id: 4, type: "pengeluaran_harian", title: "Beli Rokok", amount: 18000, wallet: "Tunai / Cash", category: "Pengeluaran Lainnya", date: "2026-07-31" },
  { id: 5, type: "pengeluaran_harian", title: "Jajan telor gulung", amount: 10000, wallet: "Tunai / Cash", category: "Makanan & Minuman", date: "2026-07-30" },
  { id: 6, type: "pengeluaran_lainnya", title: "Infaq Penghasilan", amount: 50000, wallet: "Tunai / Cash", category: "Pengeluaran Lainnya", date: "2026-07-31" },
  { id: 7, type: "pengeluaran_lainnya", title: "Infaq Penghasilan", amount: 50000, wallet: "Tunai / Cash", category: "Pengeluaran Lainnya", date: "2026-07-30" },
  { id: 8, type: "pengeluaran_harian", title: "Beli Kopi", amount: 5000, wallet: "Tunai / Cash", category: "Makanan & Minuman", date: "2026-07-31" },
  { id: 9, type: "pengeluaran_harian", title: "Beli pomade rambut", amount: 33820, wallet: "ShopeePay", category: "Pengeluaran Lainnya", date: "2026-07-30" },
  { id: 10, type: "pengeluaran_harian", title: "Beli makan pagi", amount: 9000, wallet: "ShopeePay", category: "Makanan & Minuman", date: "2026-07-30" },
  { id: 11, type: "pengeluaran_harian", title: "Pembelian sabun mandi, karbol dan deterjen", amount: 34400, wallet: "Tunai / Cash", category: "Belanja Harian", date: "2026-07-30" },
  { id: 12, type: "pengeluaran_tetap", title: "Pembayaran Shopee Pay Later", amount: 607000, wallet: "ShopeePay", category: "Pengeluaran Tetap Lainnya", date: "2026-07-30" },
  { id: 13, type: "pemasukan", title: "Gaji Juli 2026", amount: 5968038, wallet: "Bank BCA", category: "Gaji Utama", date: "2026-07-30" }
];

const categoriesMap = {
  pemasukan: ["Gaji Utama", "Pekerjaan / Bisnis", "Bonus & Sampingan", "Transfer Masuk", "Lain-lain"],
  pengeluaran_tetap: ["Sewa Kos / Kontrakan", "Wi-Fi & Internet", "Tagihan Listrik & Air", "Cicilan / Paylater", "Asuransi", "Pengeluaran Tetap Lainnya"],
  pengeluaran_harian: ["Makanan & Minuman", "Belanja Harian", "Transportasi", "Rokok & Jajan", "Pengeluaran Harian Lainnya"],
  pengeluaran_lainnya: ["Pengeluaran Lainnya", "Sedekah & Infaq", "Belanja Non-Harian", "Hiburan & Rekreasi", "Lain-lain"]
};

export default function App() {
  const [activeTab, setActiveTab] = useState('tab-transaksi');
  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem('keuanganku_txs_v4')) || defaultSampleData;
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('keuanganku_theme_v4') || 'theme-pure-black');
  const [monthFilter, setMonthFilter] = useState('2026-07');
  const [search, setSearch] = useState('');
  const [filterWallet, setFilterWallet] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  
  // Form State
  const [formType, setFormType] = useState('pengeluaran_harian');
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formWallet, setFormWallet] = useState('Bank BCA');
  const [formCategory, setFormCategory] = useState(categoriesMap['pengeluaran_harian'][0]);
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    document.body.className = `${theme} min-h-screen flex flex-col justify-between`;
    localStorage.setItem('keuanganku_theme_v4', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('keuanganku_txs_v4', JSON.stringify(transactions));
  }, [transactions]);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setFormType(type);
    setFormCategory(categoriesMap[type][0]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formTitle || !formAmount || formAmount <= 0) return;

    if (editId) {
      setTransactions(prev => prev.map(t => t.id === editId ? {
        id: editId, type: formType, title: formTitle, amount: parseFloat(formAmount), wallet: formWallet, category: formCategory, date: formDate
      } : t));
      setEditId(null);
    } else {
      const newTx = {
        id: Date.now(), type: formType, title: formTitle, amount: parseFloat(formAmount), wallet: formWallet, category: formCategory, date: formDate
      };
      setTransactions(prev => [newTx, ...prev]);
    }

    setFormTitle('');
    setFormAmount('');
  };

  const editTransaction = (tx) => {
    setEditId(tx.id);
    setFormType(tx.type);
    setFormTitle(tx.title);
    setFormAmount(tx.amount);
    setFormWallet(tx.wallet);
    setFormCategory(tx.category);
    setFormDate(tx.date);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const filteredTx = transactions.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchWal = filterWallet === 'ALL' || t.wallet === filterWallet;
    const matchCat = filterCategory === 'ALL' || t.category === filterCategory;
    const matchMonth = t.date.startsWith(monthFilter);
    return matchSearch && matchWal && matchCat && matchMonth;
  });

  const totalIncome = filteredTx.filter(t => t.type === 'pemasukan').reduce((a, b) => a + b.amount, 0);
  const totalExpense = filteredTx.filter(t => t.type !== 'pemasukan').reduce((a, b) => a + b.amount, 0);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header */}
      <header className="header-bg border-b sticky top-0 z-50 px-4 lg:px-8 py-3.5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white">KeuanganKu</h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Pembukuan Real-Time & Rekap Financial</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <input 
              type="month" 
              value={monthFilter} 
              onChange={(e) => setMonthFilter(e.target.value)} 
              className="input-bg rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 mt-6 mb-12 flex-grow w-full">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-800/60">
          <button onClick={() => setActiveTab('tab-transaksi')} className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 input-bg ${activeTab === 'tab-transaksi' ? 'tab-btn-active' : 'text-slate-400'}`}>
            <PlusCircle className="w-4 h-4" />
            <span>1. Transaksi</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-slate-950 text-white rounded-md font-bold">{filteredTx.length}</span>
          </button>
          <button onClick={() => setActiveTab('tab-laporan')} className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 input-bg ${activeTab === 'tab-laporan' ? 'tab-btn-active' : 'text-slate-400'}`}>
            <BarChart3 className="w-4 h-4" />
            <span>2. Laporan Bulanan</span>
          </button>
        </div>

        {/* Tab Transaksi */}
        {activeTab === 'tab-transaksi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Input */}
            <div className="lg:col-span-5">
              <div className="card-bg p-6 rounded-2xl border shadow-xl">
                <h2 className="text-base font-bold text-white mb-4">{editId ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Jenis Transaksi</label>
                    <select value={formType} onChange={handleTypeChange} className="w-full input-bg rounded-xl px-3.5 py-2.5 text-xs focus:outline-none">
                      <option value="pemasukan">🟢 Pemasukan</option>
                      <option value="pengeluaran_tetap">🔵 Pengeluaran Tetap</option>
                      <option value="pengeluaran_harian">🔴 Pengeluaran Harian</option>
                      <option value="pengeluaran_lainnya">🟣 Pengeluaran Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Judul Transaksi</label>
                    <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required placeholder="Contoh: Beli Token Listrik" className="w-full input-bg rounded-xl px-3.5 py-2.5 text-xs focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Nominal (Rp)</label>
                    <input type="number" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} required placeholder="0" className="w-full input-bg rounded-xl px-3.5 py-2.5 text-xs focus:outline-none" />
                  </div>
                  <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all">
                    {editId ? 'Update Transaksi' : 'Simpan Transaksi'}
                  </button>
                </form>
              </div>
            </div>

            {/* Table */}
            <div className="lg:col-span-7">
              <div className="card-bg p-6 rounded-2xl border shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-800 input-bg">
                        <th className="py-3 px-3">TANGGAL</th>
                        <th className="py-3 px-3">TRANSAKSI</th>
                        <th className="py-3 px-3">KATEGORI</th>
                        <th className="py-3 px-3 text-right">NOMINAL</th>
                        <th className="py-3 px-3 text-center">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredTx.map(t => (
                        <tr key={t.id} className="hover:bg-slate-800/30">
                          <td className="py-3 px-3 text-slate-400">{t.date}</td>
                          <td className="py-3 px-3 font-semibold text-white">{t.title}</td>
                          <td className="py-3 px-3 text-slate-300">{t.category}</td>
                          <td className={`py-3 px-3 text-right font-bold ${t.type === 'pemasukan' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            Rp {t.amount.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3 text-center flex justify-center gap-2">
                            <button onClick={() => editTransaction(t)} className="text-slate-400 hover:text-blue-400"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => deleteTransaction(t.id)} className="text-slate-400 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-500">
        <p>KeuanganKu PRO EDITION &copy; 2026</p>
      </footer>
    </div>
  );
}