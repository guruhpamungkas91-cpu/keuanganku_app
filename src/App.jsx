import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieIcon, 
  BarChart3, 
  Calendar, 
  PlusCircle, 
  Trash2, 
  Wallet, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  RefreshCw,
  Search,
  CalendarDays,
  FileSpreadsheet,
  Award,
  Layers,
  Download,
  Target,
  Sliders,
  CreditCard,
  PiggyBank,
  AlertCircle,
  Check,
  Edit3,
  Palette,
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie, 
  Legend,
  LineChart,
  Line
} from 'recharts';

const CATEGORIES = {
  income: [
    'Gaji Utama', 
    'Usaha & Freelance', 
    'Hasil Investasi', 
    'Bonus & Komisi', 
    'Pemasukan Lainnya'
  ],
  fixed_expense: [
    'Sewa Tempat & Kost', 
    'Tagihan (Listrik, Air, Wifi)', 
    'Cicilan & Hutang', 
    'Asuransi', 
    'Langganan & Rutin'
  ],
  daily_expense: [
    'Makanan & Minuman', 
    'Belanja Harian', 
    'Transportasi & Bensin', 
    'Hiburan & Hobi', 
    'Kesehatan', 
    'Pengeluaran Lainnya'
  ]
};

const WALLETS = [
  { id: 'bca', name: 'Bank BCA', color: 'bg-blue-600/20 text-blue-400 border-blue-500/30' },
  { id: 'mandiri', name: 'Bank Mandiri', color: 'bg-amber-600/20 text-amber-400 border-amber-500/30' },
  { id: 'ewallet', name: 'E-Wallet (GoPay/OVO/DANA)', color: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' },
  { id: 'cash', name: 'Tunai / Cash', color: 'bg-purple-600/20 text-purple-400 border-purple-500/30' }
];

/* DEFAULT INITIAL BUDGET LIMITS (Per Bulan) */
const DEFAULT_BUDGET_LIMITS = {
  'Sewa Tempat & Kost': 2000000,
  'Tagihan (Listrik, Air, Wifi)': 600000,
  'Cicilan & Hutang': 1000000,
  'Makanan & Minuman': 1500000,
  'Belanja Harian': 800000,
  'Transportasi & Bensin': 500000,
  'Hiburan & Hobi': 400000,
  'Kesehatan': 300000
};

/* DEFAULT FINANCIAL GOALS */
const INITIAL_GOALS = [
  { id: 'g1', title: 'Dana Darurat (3 Bulan)', target: 15000000, current: 7500000, category: 'Darurat' },
  { id: 'g2', title: 'DP Rumah / Apartemen', target: 50000000, current: 12000000, category: 'Investasi' },
  { id: 'g3', title: 'Upgrade Laptop Kerja', target: 12000000, current: 4500000, category: 'Karir' }
];

const INITIAL_TRANSACTIONS = [
  // Juli 2026
  { id: '1', date: '2026-07-01', title: 'Gaji Bulanan', amount: 8500000, type: 'income', category: 'Gaji Utama', wallet: 'Bank BCA' },
  { id: '2', date: '2026-07-02', title: 'Sewa Kost / Kontrakan', amount: 1800000, type: 'fixed_expense', category: 'Sewa Tempat & Kost', wallet: 'Bank BCA' },
  { id: '3', date: '2026-07-02', title: 'Tagihan Listrik & WiFi', amount: 450000, type: 'fixed_expense', category: 'Tagihan (Listrik, Air, Wifi)', wallet: 'Bank Mandiri' },
  { id: '4', date: '2026-07-03', title: 'Makan Siang & Kopi', amount: 75000, type: 'daily_expense', category: 'Makanan & Minuman', wallet: 'E-Wallet (GoPay/OVO/DANA)' },
  { id: '5', date: '2026-07-04', title: 'Belanja Bulanan Supermarket', amount: 650000, type: 'daily_expense', category: 'Belanja Harian', wallet: 'Bank BCA' },
  { id: '6', date: '2026-07-05', title: 'Proyek Side Job', amount: 2000000, type: 'income', category: 'Usaha & Freelance', wallet: 'Bank Mandiri' },
  { id: '7', date: '2026-07-06', title: 'Isi Bensin & Tol', amount: 120000, type: 'daily_expense', category: 'Transportasi & Bensin', wallet: 'E-Wallet (GoPay/OVO/DANA)' },
  { id: '8', date: '2026-07-07', title: 'Cicilan HP', amount: 500000, type: 'fixed_expense', category: 'Cicilan & Hutang', wallet: 'Bank BCA' },
  { id: '9', date: '2026-07-08', title: 'Nonton Bioskop & Snack', amount: 150000, type: 'daily_expense', category: 'Hiburan & Hobi', wallet: 'Tunai / Cash' },
  
  // Juni 2026
  { id: '10', date: '2026-06-01', title: 'Gaji Juni', amount: 8500000, type: 'income', category: 'Gaji Utama', wallet: 'Bank BCA' },
  { id: '11', date: '2026-06-02', title: 'Sewa Kost Juni', amount: 1800000, type: 'fixed_expense', category: 'Sewa Tempat & Kost', wallet: 'Bank BCA' },
  { id: '12', date: '2026-06-05', title: 'Makan & Jajanan Juni', amount: 1200000, type: 'daily_expense', category: 'Makanan & Minuman', wallet: 'E-Wallet (GoPay/OVO/DANA)' },
  { id: '13', date: '2026-06-15', title: 'Belanja Baju', amount: 400000, type: 'daily_expense', category: 'Belanja Harian', wallet: 'Bank Mandiri' },

  // Mei 2026
  { id: '14', date: '2026-05-01', title: 'Gaji Mei', amount: 8500000, type: 'income', category: 'Gaji Utama', wallet: 'Bank BCA' },
  { id: '15', date: '2026-05-02', title: 'Sewa Kost Mei', amount: 1800000, type: 'fixed_expense', category: 'Sewa Tempat & Kost', wallet: 'Bank BCA' },
  { id: '16', date: '2026-05-10', title: 'Bonus Tahunan Perusahaan', amount: 4000000, type: 'income', category: 'Bonus & Komisi', wallet: 'Bank BCA' },
  { id: '17', date: '2026-05-20', title: 'Servis Kendaraan', amount: 600000, type: 'daily_expense', category: 'Transportasi & Bensin', wallet: 'Bank Mandiri' },
];

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
};

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/* THEME PALETTES */
const THEMES = {
  indigo: {
    id: 'indigo',
    name: 'Indigo Velvet',
    iconBg: 'from-indigo-500 to-purple-600 shadow-indigo-500/20',
    titleGradient: 'from-indigo-400 via-purple-300 to-pink-400',
    activeTab: 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30',
    accentColor: 'text-indigo-400',
    accentBg: 'bg-indigo-600',
    accentBorder: 'border-indigo-500/30',
    buttonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30',
    focusBorder: 'focus:border-indigo-500',
    hex: '#6366f1',
    badge: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Mint',
    iconBg: 'from-emerald-500 to-teal-600 shadow-emerald-500/20',
    titleGradient: 'from-emerald-400 via-teal-300 to-cyan-400',
    activeTab: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30',
    accentColor: 'text-emerald-400',
    accentBg: 'bg-emerald-600',
    accentBorder: 'border-emerald-500/30',
    buttonPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30',
    focusBorder: 'focus:border-emerald-500',
    hex: '#10b981',
    badge: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
  },
  cyan: {
    id: 'cyan',
    name: 'Ocean Cyan',
    iconBg: 'from-cyan-500 to-blue-600 shadow-cyan-500/20',
    titleGradient: 'from-cyan-400 via-sky-300 to-indigo-400',
    activeTab: 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30',
    accentColor: 'text-cyan-400',
    accentBg: 'bg-cyan-600',
    accentBorder: 'border-cyan-500/30',
    buttonPrimary: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30',
    focusBorder: 'focus:border-cyan-500',
    hex: '#06b6d4',
    badge: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300'
  },
  rose: {
    id: 'rose',
    name: 'Sunset Rose',
    iconBg: 'from-rose-500 to-pink-600 shadow-rose-500/20',
    titleGradient: 'from-rose-400 via-pink-300 to-purple-400',
    activeTab: 'bg-rose-600 text-white shadow-lg shadow-rose-600/30',
    accentColor: 'text-rose-400',
    accentBg: 'bg-rose-600',
    accentBorder: 'border-rose-500/30',
    buttonPrimary: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30',
    focusBorder: 'focus:border-rose-500',
    hex: '#f43f5e',
    badge: 'bg-rose-500/20 border-rose-500/30 text-rose-300'
  },
  amber: {
    id: 'amber',
    name: 'Golden Amber',
    iconBg: 'from-amber-500 to-orange-600 shadow-amber-500/20',
    titleGradient: 'from-amber-400 via-yellow-300 to-orange-400',
    activeTab: 'bg-amber-600 text-white shadow-lg shadow-amber-600/30',
    accentColor: 'text-amber-400',
    accentBg: 'bg-amber-600',
    accentBorder: 'border-amber-500/30',
    buttonPrimary: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30',
    focusBorder: 'focus:border-amber-500',
    hex: '#f59e0b',
    badge: 'bg-amber-500/20 border-amber-500/30 text-amber-300'
  }
};

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('keuanganku_transactions_v2');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgetLimits, setBudgetLimits] = useState(() => {
    const saved = localStorage.getItem('keuanganku_budgets');
    return saved ? JSON.parse(saved) : DEFAULT_BUDGET_LIMITS;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('keuanganku_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  // State Tema Warna
  const [themeKey, setThemeKey] = useState(() => {
    const savedTheme = localStorage.getItem('keuanganku_theme');
    return savedTheme && THEMES[savedTheme] ? savedTheme : 'indigo';
  });

  const [showThemePicker, setShowThemePicker] = useState(false);

  const theme = THEMES[themeKey];

  useEffect(() => {
    localStorage.setItem('keuanganku_theme', themeKey);
  }, [themeKey]);

  const [activeTab, setActiveTab] = useState('transaksi');
  const [selectedMonth, setSelectedMonth] = useState('2026-07');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [walletFilter, setWalletFilter] = useState('all');

  // New Goal Input Modal/State
  const [newGoal, setNewGoal] = useState({ title: '', target: '', category: 'Tabungan' });
  const [showGoalForm, setShowGoalForm] = useState(false);

  // Form State Transaksi
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'daily_expense',
    category: 'Makanan & Minuman',
    wallet: 'Bank BCA',
    date: new Date().toISOString().split('T')[0]
  });

  const [notification, setNotification] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('keuanganku_transactions_v2', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('keuanganku_budgets', JSON.stringify(budgetLimits));
  }, [budgetLimits]);

  useEffect(() => {
    localStorage.setItem('keuanganku_goals', JSON.stringify(goals));
  }, [goals]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchMonth = t.date.startsWith(selectedMonth);
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === 'all' || t.category === categoryFilter;
      const matchWallet = walletFilter === 'all' || t.wallet === walletFilter;
      return matchMonth && matchSearch && matchCategory && matchWallet;
    });
  }, [transactions, selectedMonth, searchQuery, categoryFilter, walletFilter]);

  // Wallet Total Balances Breakdown
  const walletBalances = useMemo(() => {
    const balances = {
      'Bank BCA': 0,
      'Bank Mandiri': 0,
      'E-Wallet (GoPay/OVO/DANA)': 0,
      'Tunai / Cash': 0
    };

    transactions.forEach(t => {
      const w = t.wallet || 'Bank BCA';
      const val = Number(t.amount) || 0;
      if (t.type === 'income') {
        balances[w] = (balances[w] || 0) + val;
      } else {
        balances[w] = (balances[w] || 0) - val;
      }
    });

    return balances;
  }, [transactions]);

  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalFixedExpense = 0;
    let totalDailyExpense = 0;

    filteredTransactions.forEach(t => {
      const val = Number(t.amount) || 0;
      if (t.type === 'income') totalIncome += val;
      if (t.type === 'fixed_expense') totalFixedExpense += val;
      if (t.type === 'daily_expense') totalDailyExpense += val;
    });

    const totalExpense = totalFixedExpense + totalDailyExpense;
    const netSavings = totalIncome - totalExpense;
    
    let savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
    let healthStatus = { label: 'Stabil', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: CheckCircle2, msg: 'Pengeluaran terdistribusi dengan aman.' };

    if (totalIncome === 0 && totalExpense > 0) {
      savingsRate = -100;
      healthStatus = { label: 'Defisit (Bahaya)', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: ShieldAlert, msg: 'Ada pengeluaran tanpa adanya pemasukan sama sekali!' };
    } else if (savingsRate >= 30) {
      healthStatus = { label: 'Sangat Sehat', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2, msg: 'Luar biasa! Kamu sanggup menyisihkan >=30% dari total pemasukan.' };
    } else if (savingsRate >= 10) {
      healthStatus = { label: 'Sehat & Cukup', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: CheckCircle2, msg: 'Kondisi aman, usahakan tingkatkan porsi tabungan hingga 30%.' };
    } else if (savingsRate >= 0) {
      healthStatus = { label: 'Waspada (Tipis)', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle, msg: 'Keuangan pas-pasan. Kurangi pengeluaran harian yang kurang penting.' };
    } else {
      healthStatus = { label: 'Defisit / Krusial', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: ShieldAlert, msg: 'Pengeluaran membengkak melebihi total pemasukan bulan ini!' };
    }

    // Rule 50/30/20 Calculation
    // Ideal: Needs (50%), Wants (30%), Savings (20%)
    const needsTarget = totalIncome * 0.50;
    const wantsTarget = totalIncome * 0.30;
    const savingsTarget = totalIncome * 0.20;

    // Actual Needs: Pengeluaran Tetap + Makanan & Belanja Harian + Kesehatan
    let actualNeeds = totalFixedExpense;
    let actualWants = 0;

    filteredTransactions.forEach(t => {
      if (t.type === 'daily_expense') {
        if (['Makanan & Minuman', 'Belanja Harian', 'Kesehatan', 'Transportasi & Bensin'].includes(t.category)) {
          actualNeeds += Number(t.amount);
        } else {
          actualWants += Number(t.amount);
        }
      }
    });

    return {
      totalIncome,
      totalFixedExpense,
      totalDailyExpense,
      totalExpense,
      netSavings,
      savingsRate: Math.max(-100, Math.min(100, Math.round(savingsRate))),
      healthStatus,
      rule503020: {
        needsTarget,
        wantsTarget,
        savingsTarget,
        actualNeeds,
        actualWants,
        actualSavings: netSavings
      }
    };
  }, [filteredTransactions]);

  const categorySpending = useMemo(() => {
    const spending = {};
    filteredTransactions.forEach(t => {
      if (t.type !== 'income') {
        spending[t.category] = (spending[t.category] || 0) + Number(t.amount);
      }
    });
    return spending;
  }, [filteredTransactions]);

  const budgetAnalysis = useMemo(() => {
    const analysis = [];
    const allExpenseCats = [...CATEGORIES.fixed_expense, ...CATEGORIES.daily_expense];

    allExpenseCats.forEach(cat => {
      const spent = categorySpending[cat] || 0;
      const limit = budgetLimits[cat] || 0;
      const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
      const isOver = limit > 0 && spent > limit;

      analysis.push({
        category: cat,
        spent,
        limit,
        percent,
        isOver
      });
    });

    return analysis;
  }, [categorySpending, budgetLimits]);

  const annualSummary = useMemo(() => {
    const yearTx = transactions.filter(t => t.date.startsWith(selectedYear));

    let totalYearIncome = 0;
    let totalYearFixed = 0;
    let totalYearDaily = 0;

    const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => {
      const monthNum = String(i + 1).padStart(2, '0');
      const monthPrefix = `${selectedYear}-${monthNum}`;
      
      let inc = 0;
      let fix = 0;
      let dai = 0;

      yearTx.forEach(t => {
        if (t.date.startsWith(monthPrefix)) {
          const val = Number(t.amount) || 0;
          if (t.type === 'income') inc += val;
          if (t.type === 'fixed_expense') fix += val;
          if (t.type === 'daily_expense') dai += val;
        }
      });

      const exp = fix + dai;
      const net = inc - exp;

      return {
        monthKey: monthPrefix,
        monthName: MONTH_NAMES[i],
        income: inc,
        fixedExpense: fix,
        dailyExpense: dai,
        totalExpense: exp,
        netSavings: net
      };
    });

    monthlyBreakdown.forEach(m => {
      totalYearIncome += m.income;
      totalYearFixed += m.fixedExpense;
      totalYearDaily += m.dailyExpense;
    });

    const totalYearExpense = totalYearFixed + totalYearDaily;
    const totalYearNet = totalYearIncome - totalYearExpense;
    const yearSavingsRate = totalYearIncome > 0 ? (totalYearNet / totalYearIncome) * 100 : 0;

    return {
      yearTx,
      totalYearIncome,
      totalYearFixed,
      totalYearDaily,
      totalYearExpense,
      totalYearNet,
      yearSavingsRate: Math.round(yearSavingsRate),
      monthlyBreakdown
    };
  }, [transactions, selectedYear]);

  const pieChartData = useMemo(() => {
    return Object.keys(categorySpending).map(cat => ({
      name: cat,
      value: categorySpending[cat]
    }));
  }, [categorySpending]);

  const barChartData = useMemo(() => {
    return [
      { name: 'Pemasukan', Total: stats.totalIncome, fill: '#10b981' },
      { name: 'Pengeluaran Tetap', Total: stats.totalFixedExpense, fill: '#f59e0b' },
      { name: 'Pengeluaran Harian', Total: stats.totalDailyExpense, fill: '#ef4444' }
    ];
  }, [stats]);

  const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#14b8a6', '#f43f5e'];

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      showToast('Tidak ada transaksi untuk diekspor pada bulan ini', 'error');
      return;
    }

    const headers = ['ID', 'Tanggal', 'Judul Transaksi', 'Jenis', 'Kategori', 'Sumber Dana / Dompet', 'Nominal (Rp)'];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.date,
      `"${t.title.replace(/"/g, '""')}"`,
      t.type === 'income' ? 'Pemasukan' : t.type === 'fixed_expense' ? 'Pengeluaran Tetap' : 'Pengeluaran Harian',
      `"${t.category}"`,
      `"${t.wallet || 'Bank BCA'}"`,
      t.amount
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_KeuanganKu_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Laporan berhasil diunduh dalam format CSV/Excel!');
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || formData.amount <= 0) {
      showToast('Mohon isi judul dan nominal transaksi dengan benar', 'error');
      return;
    }

    const newTx = {
      id: Date.now().toString(),
      ...formData,
      amount: Number(formData.amount)
    };

    setTransactions([newTx, ...transactions]);
    setFormData({
      title: '',
      amount: '',
      type: 'daily_expense',
      category: 'Makanan & Minuman',
      wallet: 'Bank BCA',
      date: new Date().toISOString().split('T')[0]
    });
    showToast('Transaksi berhasil disimpan!');
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    showToast('Transaksi berhasil dihapus!', 'info');
  };

  const handleUpdateBudgetLimit = (category, limitValue) => {
    setBudgetLimits(prev => ({
      ...prev,
      [category]: Math.max(0, Number(limitValue) || 0)
    }));
    showToast(`Batas anggaran ${category} berhasil diperbarui`);
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.target || newGoal.target <= 0) {
      showToast('Isi judul target & nominal impian dengan benar', 'error');
      return;
    }
    const goalItem = {
      id: 'g_' + Date.now(),
      title: newGoal.title,
      target: Number(newGoal.target),
      current: 0,
      category: newGoal.category
    };
    setGoals([...goals, goalItem]);
    setNewGoal({ title: '', target: '', category: 'Tabungan' });
    setShowGoalForm(false);
    showToast('Target keuangan baru berhasil ditambahkan!');
  };

  const handleDepositGoal = (id, amountToAdd) => {
    const val = Number(amountToAdd);
    if (isNaN(val) || val <= 0) return;

    setGoals(goals.map(g => {
      if (g.id === id) {
        return { ...g, current: Math.min(g.target, g.current + val) };
      }
      return g;
    }));
    showToast('Alokasi tabungan berhasil ditambahkan!');
  };

  const handleDeleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
    showToast('Target impian dihapus', 'info');
  };

  const handleResetData = () => {
    if (window.confirm && window.confirm('Kembalikan data ke contoh awal?')) {
      setTransactions(INITIAL_TRANSACTIONS);
      setBudgetLimits(DEFAULT_BUDGET_LIMITS);
      setGoals(INITIAL_GOALS);
      showToast('Data dikembalikan ke sampel awal');
    }
  };

  const allCategories = useMemo(() => {
    const catSet = new Set(Object.values(CATEGORIES).flat());
    return Array.from(catSet);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Visual Accent Ambient Lighting Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-3 border transition-all transform animate-bounce ${
          notification.type === 'error' ? 'bg-red-950/80 border-red-500/50 text-red-200' : 
          notification.type === 'info' ? 'bg-blue-950/80 border-blue-500/50 text-blue-200' : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
        }`}>
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-xs md:text-sm">{notification.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* HEADER SECTION (di-set relative z-30 agar dropdown tema tidak tertimpa tab/konten di bawahnya) */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6 backdrop-blur-md relative z-30">
          <div>
            <div className="flex items-center gap-3.5">
              <div className={`p-3.5 bg-gradient-to-br ${theme.iconBg} rounded-2xl text-white shadow-xl ring-1 ring-white/10 relative group`}>
                <Wallet className="w-7 h-7 transition-transform group-hover:scale-110 duration-300" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={`text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r ${theme.titleGradient} bg-clip-text text-transparent`}>
                    KeuanganKu
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Pro Edition
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-400 mt-0.5">Sistem Pembukuan, Target Budgeting & Financial Tracker</p>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Live Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] font-medium text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Terhubung LocalStorage</span>
            </div>

            {/* Theme Picker Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-2 transition-all shadow-sm"
                title="Pilih Aksen Warna"
              >
                <Palette className={`w-4 h-4 ${theme.accentColor}`} />
                <span className="hidden sm:inline">Tema:</span>
                <span className="w-3 h-3 rounded-full ring-2 ring-slate-800" style={{ backgroundColor: theme.hex }} />
              </button>

              {showThemePicker && (
                <>
                  {/* Backdrop Click Outside overlay */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowThemePicker(false)} 
                  />

                  {/* Dropdown Menu dengan background solid bg-slate-900 & shadow kuat */}
                  <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/90 p-2 z-50 space-y-1 animate-fadeIn">
                    <p className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1.5 flex items-center gap-1 border-b border-slate-800/80 mb-1">
                      <Sparkles className="w-3 h-3 text-amber-400" /> Pilih Warna Aksen
                    </p>
                    {Object.values(THEMES).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setThemeKey(t.id);
                          setShowThemePicker(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all ${
                          themeKey === t.id ? 'bg-slate-800 font-bold text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: t.hex }} />
                          {t.name}
                        </span>
                        {themeKey === t.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {activeTab !== 'rekap_tahunan' && (
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800/80 rounded-xl px-3 py-2">
                <Calendar className={`w-4 h-4 ${theme.accentColor}`} />
                <input 
                  type="month" 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent text-xs font-medium focus:outline-none text-slate-200 cursor-pointer"
                />
              </div>
            )}

            {activeTab === 'rekap_tahunan' && (
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800/80 rounded-xl px-3 py-2">
                <CalendarDays className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-slate-400">Tahun:</span>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent text-xs font-semibold focus:outline-none text-slate-200 cursor-pointer"
                >
                  <option value="2026" className="bg-slate-900">2026</option>
                  <option value="2025" className="bg-slate-900">2025</option>
                  <option value="2027" className="bg-slate-900">2027</option>
                </select>
              </div>
            )}

            <button 
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Unduh Laporan CSV"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>

            <button 
              onClick={handleResetData}
              title="Reset ke Data Contoh"
              className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80 rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap border-b border-slate-800/80 gap-1.5 relative z-10">
          <button
            onClick={() => setActiveTab('transaksi')}
            className={`px-4 py-2.5 text-xs md:text-sm font-semibold rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'transaksi'
                ? theme.activeTab
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            1. Transaksi ({filteredTransactions.length})
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 text-xs md:text-sm font-semibold rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? theme.activeTab
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            2. Laporan Bulanan
          </button>

          <button
            onClick={() => setActiveTab('budgeting')}
            className={`px-4 py-2.5 text-xs md:text-sm font-semibold rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'budgeting'
                ? theme.activeTab
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Sliders className="w-4 h-4" />
            3. Target Anggaran
          </button>

          <button
            onClick={() => setActiveTab('impian')}
            className={`px-4 py-2.5 text-xs md:text-sm font-semibold rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'impian'
                ? theme.activeTab
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Target className="w-4 h-4" />
            4. Dana Darurat & Impian
          </button>

          <button
            onClick={() => setActiveTab('rekap_tahunan')}
            className={`px-4 py-2.5 text-xs md:text-sm font-semibold rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'rekap_tahunan'
                ? theme.activeTab
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            5. Rekap Tahunan
          </button>
        </div>

        {/* 1. KELOLA TRANSAKSI TAB */}
        {activeTab === 'transaksi' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            
            {/* Form Input Transaksi */}
            <div className="lg:col-span-1 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl h-fit space-y-5 shadow-xl relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-indigo-500/80 before:to-transparent">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <PlusCircle className={`w-5 h-5 ${theme.accentColor}`} />
                  Tambah Transaksi Baru
                </h2>
                <p className="text-xs text-slate-400 mt-1">Input pemasukan & pengeluaran kamu di sini</p>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                {/* Jenis Transaksi */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Jenis Transaksi</label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setFormData({
                        ...formData,
                        type: newType,
                        category: CATEGORIES[newType][0]
                      });
                    }}
                    className={`w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none ${theme.focusBorder}`}
                  >
                    <option value="income">🟢 Pemasukan</option>
                    <option value="fixed_expense">🟠 Pengeluaran Tetap</option>
                    <option value="daily_expense">🔴 Pengeluaran Harian</option>
                  </select>
                </div>

                {/* Judul Transaksi */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Judul Transaksi</label>
                  <input
                    type="text"
                    placeholder="Contoh: Beli Token Listrik, Makan Siang"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none ${theme.focusBorder} placeholder-slate-600`}
                  />
                </div>

                {/* Nominal / Amount */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Nominal (Rp)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className={`w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none ${theme.focusBorder} placeholder-slate-600`}
                  />
                </div>

                {/* Sumber Dana / Wallet */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Sumber Dana / Dompet</label>
                  <select
                    value={formData.wallet}
                    onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
                    className={`w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none ${theme.focusBorder}`}
                  >
                    {WALLETS.map(w => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none ${theme.focusBorder}`}
                  >
                    {CATEGORIES[formData.type].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Tanggal */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Tanggal Transaksi</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none ${theme.focusBorder}`}
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full ${theme.buttonPrimary} font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Simpan Transaksi
                </button>
              </form>
            </div>

            {/* Table Daftar Transaksi */}
            <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl space-y-5 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    Daftar Transaksi Bulanan
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Menampilkan {filteredTransactions.length} transaksi untuk periode {selectedMonth}
                  </p>
                </div>

                {/* Filter & Search */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Cari transaksi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`bg-slate-950/80 border border-slate-800/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none ${theme.focusBorder} w-36 sm:w-44`}
                    />
                  </div>

                  <select
                    value={walletFilter}
                    onChange={(e) => setWalletFilter(e.target.value)}
                    className={`bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none ${theme.focusBorder}`}
                  >
                    <option value="all">Semua Dompet</option>
                    {WALLETS.map(w => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className={`bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none ${theme.focusBorder}`}
                  >
                    <option value="all">Semua Kategori</option>
                    {allCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table Body */}
              <div className="overflow-x-auto">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800/80 rounded-2xl">
                    Belum ada data transaksi yang sesuai filter di bulan ini.
                  </div>
                ) : (
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
                      <tr>
                        <th className="p-3 rounded-l-xl">Tanggal</th>
                        <th className="p-3">Transaksi</th>
                        <th className="p-3">Dompet</th>
                        <th className="p-3">Kategori</th>
                        <th className="p-3 text-right">Nominal</th>
                        <th className="p-3 text-center rounded-r-xl">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 text-xs text-slate-400 font-mono whitespace-nowrap">{tx.date}</td>
                          <td className="p-3 font-medium text-slate-100">{tx.title}</td>
                          <td className="p-3 text-xs text-slate-400">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 font-mono text-[11px]">
                              {tx.wallet || 'Bank BCA'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/60">
                              {tx.category}
                            </span>
                          </td>
                          <td className={`p-3 text-right font-bold font-mono whitespace-nowrap ${
                            tx.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
                          }`}>
                            {tx.type === 'income' ? '+' : '-'} {formatRupiah(tx.amount)}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeleteTransaction(tx.id)}
                              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>
        )}

        {/* 2. LAPORAN BULANAN (DASHBOARD) TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* MULTI-WALLET SUMMARY CARDS */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-400" />
                Saldo Rekening & Sumber Dana
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {WALLETS.map(w => (
                  <div key={w.id} className={`p-4 rounded-2xl border ${w.color} backdrop-blur-lg flex flex-col justify-between shadow-lg relative overflow-hidden group transition-all duration-300 hover:-translate-y-0.5`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider">{w.name}</span>
                      <Wallet className="w-4 h-4 opacity-60" />
                    </div>
                    <span className="text-lg font-extrabold text-white mt-3 font-mono">
                      {formatRupiah(walletBalances[w.name] || 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* MONTHLY CARDS SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-emerald-500 before:to-teal-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pemasukan</p>
                    <h3 className="text-2xl font-black text-emerald-400 mt-2 font-mono">{formatRupiah(stats.totalIncome)}</h3>
                  </div>
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-slate-500 font-medium">Bulan {selectedMonth}</div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-amber-500 before:to-orange-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pengeluaran Tetap</p>
                    <h3 className="text-2xl font-black text-amber-400 mt-2 font-mono">{formatRupiah(stats.totalFixedExpense)}</h3>
                  </div>
                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-slate-500 font-medium">Kost, Tagihan, Cicilan</div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-rose-500/40 transition-all duration-300 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-rose-500 before:to-pink-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pengeluaran Harian</p>
                    <h3 className="text-2xl font-black text-rose-400 mt-2 font-mono">{formatRupiah(stats.totalDailyExpense)}</h3>
                  </div>
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
                    <ArrowDownRight className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-slate-500 font-medium">Makan, Belanja, Hiburan</div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-indigo-500 before:to-purple-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Sisa Tabungan</p>
                    <h3 className={`text-2xl font-black mt-2 font-mono ${stats.netSavings >= 0 ? 'text-indigo-400' : 'text-red-500'}`}>
                      {formatRupiah(stats.netSavings)}
                    </h3>
                  </div>
                  <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-slate-500 font-medium">Pemasukan - Pengeluaran</div>
              </div>

            </div>

            {/* MONTHLY HEALTH INDICATOR CARD */}
            <div className={`p-6 rounded-2xl border backdrop-blur-xl ${stats.healthStatus.bg} ${stats.healthStatus.border} transition-all shadow-xl`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <stats.healthStatus.icon className={`w-6 h-6 ${stats.healthStatus.color}`} />
                    <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Penilaian Finansial Bulan Ini</span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                    Status: <span className={stats.healthStatus.color}>{stats.healthStatus.label}</span>
                  </h2>
                  <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                    {stats.healthStatus.msg}
                  </p>
                </div>

                {/* Savings Score Progress Bar */}
                <div className="w-full md:w-80 space-y-2 bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 shadow-inner">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Rasio Tabungan</span>
                    <span className={`font-bold font-mono ${stats.savingsRate < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {stats.savingsRate}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        stats.savingsRate >= 30 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                        stats.savingsRate >= 10 ? 'bg-gradient-to-r from-blue-500 to-indigo-400' :
                        stats.savingsRate >= 0 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.max(0, Math.min(100, stats.savingsRate))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 pt-1 font-mono">
                    <span>Target Ideal: &gt;= 30%</span>
                    <span>Defisit: &lt; 0%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PROFESSIONAL 50 / 30 / 20 BUDGET ALLOCATION CARD */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl space-y-4 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  Analisis Alokasi Gaji (Formula 50 / 30 / 20)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Standar perencanaan keuangan ideal: 50% Kebutuhan Pokok, 30% Keinginan, 20% Tabungan/Investasi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* 50% Kebutuhan */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Kebutuhan Pokok (50%)</span>
                    <span className="font-bold font-mono text-amber-400">{formatRupiah(stats.rule503020.needsTarget)}</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono">{formatRupiah(stats.rule503020.actualNeeds)}</div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-amber-500"
                      style={{ width: `${Math.min(100, stats.totalIncome > 0 ? (stats.rule503020.actualNeeds / stats.totalIncome) * 100 : 0)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Realita: {stats.totalIncome > 0 ? Math.round((stats.rule503020.actualNeeds / stats.totalIncome) * 100) : 0}% dari Pemasukan
                  </p>
                </div>

                {/* 30% Keinginan */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Keinginan & Hobi (30%)</span>
                    <span className="font-bold font-mono text-rose-400">{formatRupiah(stats.rule503020.wantsTarget)}</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono">{formatRupiah(stats.rule503020.actualWants)}</div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-rose-500"
                      style={{ width: `${Math.min(100, stats.totalIncome > 0 ? (stats.rule503020.actualWants / stats.totalIncome) * 100 : 0)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Realita: {stats.totalIncome > 0 ? Math.round((stats.rule503020.actualWants / stats.totalIncome) * 100) : 0}% dari Pemasukan
                  </p>
                </div>

                {/* 20% Tabungan */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Tabungan & Investasi (20%)</span>
                    <span className="font-bold font-mono text-emerald-400">{formatRupiah(stats.rule503020.savingsTarget)}</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono">{formatRupiah(stats.rule503020.actualSavings)}</div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-emerald-500"
                      style={{ width: `${Math.min(100, Math.max(0, stats.totalIncome > 0 ? (stats.rule503020.actualSavings / stats.totalIncome) * 100 : 0))}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Realita: {stats.totalIncome > 0 ? Math.round((stats.rule503020.actualSavings / stats.totalIncome) * 100) : 0}% dari Pemasukan
                  </p>
                </div>
              </div>
            </div>

            {/* MONTHLY CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between shadow-xl">
                <div>
                  <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                    Perbandingan Pemasukan vs Pengeluaran
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Visualisasi rasio arus kas utama dalam bulan ini</p>
                </div>

                <div className="h-64 mt-6">
                  {stats.totalIncome === 0 && stats.totalExpense === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-500 text-sm">Belum ada data transaksi bulan ini</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v/1000}k`} tickLine={false} />
                        <Tooltip 
                          formatter={(value) => [formatRupiah(value), 'Nominal']}
                          contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                        />
                        <Bar dataKey="Total" radius={[8, 8, 0, 0]}>
                          {barChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between shadow-xl">
                <div>
                  <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                    <PieIcon className="w-5 h-5 text-pink-400" />
                    Proporsi Pengeluaran per Kategori
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Menampilkan alokasi pengeluaran terbesar kamu</p>
                </div>

                <div className="h-64 mt-6">
                  {pieChartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-500 text-sm">Belum ada pengeluaran di bulan ini</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [formatRupiah(value), 'Total']}
                          contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 3. TARGET ANGGARAN TAB */}
        {activeTab === 'budgeting' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl space-y-2 shadow-xl">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                Manajemen & Batas Anggaran (Budget Limit)
              </h2>
              <p className="text-xs text-slate-400">
                Tentukan plafon maksimal pengeluaran per kategori. Sistem akan memberi peringatan jika pengeluaran aktual melebihi batas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgetAnalysis.map(b => (
                <div 
                  key={b.category} 
                  className={`p-5 rounded-2xl border backdrop-blur-xl transition-all shadow-lg ${
                    b.isOver 
                      ? 'bg-red-950/20 border-red-500/40' 
                      : b.percent >= 80 
                      ? 'bg-amber-950/20 border-amber-500/40' 
                      : 'bg-slate-900/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-200">{b.category}</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Terpakai: <span className="text-white font-mono font-semibold">{formatRupiah(b.spent)}</span>
                      </p>
                    </div>

                    {b.isOver ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        MELEBIHI BUDGET ({b.percent}%)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/60">
                        {b.percent}% Terpakai
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden my-3 border border-slate-800/80">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        b.isOver ? 'bg-red-500' : b.percent >= 80 ? 'bg-amber-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${Math.min(100, b.percent)}%` }}
                    />
                  </div>

                  {/* Inline Limit Input */}
                  <div className="flex items-center justify-between gap-3 pt-2 text-xs">
                    <span className="text-slate-400">Batas Maksimal:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-mono">Rp</span>
                      <input 
                        type="number"
                        defaultValue={b.limit}
                        onBlur={(e) => handleUpdateBudgetLimit(b.category, e.target.value)}
                        className="w-28 bg-slate-950/80 border border-slate-800/80 rounded-lg px-2.5 py-1 text-right text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono font-semibold"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. TARGET IMPIAN TAB */}
        {activeTab === 'impian' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-pink-400" />
                  Target Impian & Dana Darurat (Financial Goals)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Rencanakan tabungan untuk masa depan, liburan, gadget, atau dana darurat keluarga.
                </p>
              </div>

              <button
                onClick={() => setShowGoalForm(!showGoalForm)}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-pink-600/30 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Tambah Target Impian
              </button>
            </div>

            {/* Modal Form Tambah Goal */}
            {showGoalForm && (
              <form onSubmit={handleAddGoal} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 animate-fadeIn shadow-2xl">
                <h3 className="text-sm font-bold text-slate-200">Buat Target Finansial Baru</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nama Target</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Dana Darurat 6 Bulan" 
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Target Nominal (Rp)</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Kategori Target</label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                    >
                      <option value="Darurat">🛡️ Dana Darurat</option>
                      <option value="Investasi">📈 Investasi & Properti</option>
                      <option value="Karir">💻 Gadget & Karir</option>
                      <option value="Liburan">✈️ Liburan & Hobi</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGoalForm(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pink-600 text-white text-xs font-bold rounded-xl"
                  >
                    Simpan Target
                  </button>
                </div>
              </form>
            )}

            {/* Goals Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {goals.map(g => {
                const percent = Math.min(100, Math.round((g.current / g.target) * 100));
                return (
                  <div key={g.id} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden group">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-bold rounded-full">
                          {g.category}
                        </span>
                        <button 
                          onClick={() => handleDeleteGoal(g.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="font-bold text-base text-slate-100">{g.title}</h3>
                      
                      <div className="flex justify-between items-baseline text-xs pt-1">
                        <span className="text-slate-400">Terkumpul:</span>
                        <span className="font-bold font-mono text-emerald-400">{formatRupiah(g.current)}</span>
                      </div>
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="text-slate-400">Target:</span>
                        <span className="font-semibold font-mono text-slate-300">{formatRupiah(g.target)}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                        <span>Pencapaian</span>
                        <span className="text-pink-400 font-mono">{percent}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Deposit Input */}
                    <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2">
                      <input 
                        type="number"
                        placeholder="Tambah Rp..."
                        id={`input_${g.id}`}
                        className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-pink-500 font-mono"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`input_${g.id}`);
                          if (input && input.value) {
                            handleDepositGoal(g.id, input.value);
                            input.value = '';
                          }
                        }}
                        className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all whitespace-nowrap"
                      >
                        + Tabung
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* 5. REKAP TAHUNAN TAB */}
        {activeTab === 'rekap_tahunan' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* ANNUAL STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pemasukan Setahun</p>
                <h3 className="text-2xl font-black text-emerald-400 mt-2 font-mono">{formatRupiah(annualSummary.totalYearIncome)}</h3>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">Tahun {selectedYear}</p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengeluaran Tetap</p>
                <h3 className="text-2xl font-black text-amber-400 mt-2 font-mono">{formatRupiah(annualSummary.totalYearFixed)}</h3>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">Kost, Cicilan & Tagihan Setahun</p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengeluaran Harian</p>
                <h3 className="text-2xl font-black text-rose-400 mt-2 font-mono">{formatRupiah(annualSummary.totalYearDaily)}</h3>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">Makan & Operasional Setahun</p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sisa Tabungan Setahun</p>
                <h3 className={`text-2xl font-black mt-2 font-mono ${annualSummary.totalYearNet >= 0 ? 'text-indigo-400' : 'text-red-500'}`}>
                  {formatRupiah(annualSummary.totalYearNet)}
                </h3>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">Rasio Tabungan: {annualSummary.yearSavingsRate}%</p>
              </div>
            </div>

            {/* ANNUAL CASHFLOW TREND CHART */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    Grafik Tren Bulanan Tahun {selectedYear}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Perbandingan Pemasukan vs Total Pengeluaran sepanjang 12 bulan</p>
                </div>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={annualSummary.monthlyBreakdown} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <XAxis dataKey="monthName" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v/1000}k`} tickLine={false} />
                    <Tooltip 
                      formatter={(value) => [formatRupiah(value)]}
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="totalExpense" name="Total Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* MONTH BY MONTH TABLE */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                Rincian Rekapitulasi Per Bulan ({selectedYear})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase">
                    <tr>
                      <th className="p-3 rounded-l-xl">Bulan</th>
                      <th className="p-3 text-right">Pemasukan</th>
                      <th className="p-3 text-right">Pengeluaran Tetap</th>
                      <th className="p-3 text-right">Pengeluaran Harian</th>
                      <th className="p-3 text-right">Total Pengeluaran</th>
                      <th className="p-3 text-right rounded-r-xl">Sisa Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {annualSummary.monthlyBreakdown.map((m) => (
                      <tr key={m.monthKey} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 font-semibold text-slate-200">{m.monthName}</td>
                        <td className="p-3 text-right text-emerald-400 font-mono font-medium">{formatRupiah(m.income)}</td>
                        <td className="p-3 text-right text-amber-400 font-mono">{formatRupiah(m.fixedExpense)}</td>
                        <td className="p-3 text-right text-rose-400 font-mono">{formatRupiah(m.dailyExpense)}</td>
                        <td className="p-3 text-right font-mono font-medium text-slate-200">{formatRupiah(m.totalExpense)}</td>
                        <td className={`p-3 text-right font-mono font-bold ${m.netSavings >= 0 ? 'text-indigo-400' : 'text-red-500'}`}>
                          {formatRupiah(m.netSavings)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}