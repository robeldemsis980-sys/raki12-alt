/**
 * RAKI BAG SHOP MANAGEMENT SYSTEM — CORE LOGIC V2
 * ⚡️ ባህሪያት: ዋና ብር (ካፒታል) ከትርፍ መለየት | 0% VAT (ያለ ታክስ) | ባለሁለት ቋንቋ
 */

// --- 1. የትርጉም መዝገበ-ቃላት (DICTIONARY) ---
const TranslationsDictionary = {
    am: {
        auth_subtitle: "የሱቅ መቆጣጠሪያ ማዕከል V2",
        email_label: "ኢሜይል አድራሻ", password_label: "የይለፍ ቃል", role_label: "ኃላፊነት",
        role_admin: "አስተዳዳሪ / ባለቤት", role_employee: "ሠራተኛ / ካሺየር", sign_in: "ግባ",
        menu_dashboard: "ዳሽቦርድ", menu_pos: "መሸጫ ማሽን (POS)", menu_inventory: "የዕቃዎች ክምችት",
        menu_expenses: "የሱቅ ወጪዎች", menu_customers: "ደንበኞች", menu_reports: "የሂሳብ ሪፖርቶች", logout: "ውጣ",
        live_alerts: "የክምችት ማሳሰቢያዎች", dash_title: "የንግድ ትንተና ዳሽቦርድ", dash_subtitle: "የካፒታል፣ የሽያጭ እና የትርፍ መከታተያ ማዕከል።",
        card_total_revenue: "ጠቅላላ የሽያጭ ገቢ (Gross)", card_capital_cost: "የተሸጡ ዕቃዎች ዋና ብር (ካፒታል)",
        card_net_profit: "የተጣራ ትርፍ (ከወጪ በኋላ)", card_total_expenses: "ጠቅላላ የሱቅ ወጪዎች",
        card_inventory_value: "የመጋዘን ዕቃዎች ጠቅላላ ዋና ብር", card_low_stock: "ያለቁ/ያነሱ ዕቃዎች",
        chart_sales_trend: "የሽያጭና የትርፍ ሂደት ገበታ", chart_profit_expense: "ዋና ብር፣ ወጪ እና ትርፍ ንጽጽር",
        pos_current_trans: "አሁን ያለ ሽያጭ", pos_subtotal: "ጠቅላላ ድምር", pos_discount: "ቅናሽ (Discount %)",
        pos_grand_total: "የሚከፈልበት ጠቅላላ ዋጋ", pos_btn_pay: "ሽያጩን ጨርስና ደረሰኝ አትም",
        inv_title: "የቦርሳዎች መቆጣጠሪያ መዝገብ", inv_btn_add: "አዲስ ቦርሳ መዝግብ",
        th_image: "ምስል", th_barcode: "ባርኮድ", th_name: "የቦርሳው ስም", th_category: "ዘርፍ/ብራንድ", th_stock: "ያለው ክምችት",
        th_buy_price: "ዋና ብር (መግዣ)", th_sell_price: "መሸጫ ዋጋ", th_actions: "ማስተካከያ",
        exp_title: "የሱቅ ወጪዎች መመዝገቢያ", exp_btn_add: "አዲስ ወጪ መዝግብ",
        th_date: "ቀን", th_exp_cat: "የወጪ አይነት", th_desc: "ዝርዝር መግለጫ", th_amount: "የገንዘብ መጠን",
        cust_title: "የደንበኞች መረጃ ማዕከል", cust_btn_add: "ደንበኛ መዝግብ",
        th_cust_name: "የደንበኛ ስም", th_phone: "ስልክ ቁጥር", th_orders: "የገዛው ብዛት", th_total_spend: "ያወጣው ጠቅላላ ገንዘብ",
        rep_title: "የሂሳብ እና የኦዲት ሪፖርቶች", rep_print: "ሪፖርት አትም",
        rep_gross: "ጠቅላላ የሽያጭ ገቢ (Gross Income):", rep_capital: "የዕቃዎች ጠቅላላ ዋና ብር (Total Capital Cost):",
        rep_expenses: "ጠቅላላ ተጨማሪ ወጪዎች (Operational Expenses):", rep_net: "የተጣራ ንፁህ ትርፍ (Net Profit Margin):"
    },
    en: {
        auth_subtitle: "Shop Management Portal V2",
        email_label: "Email Address", password_label: "Password", role_label: "Role Profile",
        role_admin: "Admin / Executive Owner", role_employee: "Employee / Cashier", sign_in: "Secure Sign In",
        menu_dashboard: "Analytics Dashboard", menu_pos: "POS Workstation", menu_inventory: "Stock Inventory",
        menu_expenses: "Shop Expenses", menu_customers: "Client Management", menu_reports: "Financial Reports", logout: "Logout",
        live_alerts: "Active Inventory Alerts", dash_title: "Business Performance Analytics", dash_subtitle: "Real-time cost of goods, sales, and profit pipeline tracking.",
        card_total_revenue: "Total Sales Revenue (Gross)", card_capital_cost: "Cost of Goods Sold (Capital)",
        card_net_profit: "Net Profit Margin (After Expense)", card_total_expenses: "Total Store Expenses",
        card_inventory_value: "Warehouse Stock Worth (Capital)", card_low_stock: "Critical Stock Alerts",
        chart_sales_trend: "Sales Volume & Profit Metrics", chart_profit_expense: "Capital vs Expense vs Profit Breakdown",
        pos_current_trans: "Active Transaction Desk", pos_subtotal: "Cart Subtotal", pos_discount: "Apply Discount (%)",
        pos_grand_total: "Net Grand Total Bill", pos_btn_pay: "Execute Order & Print Receipt",
        inv_title: "Product Stock Inventory Ledger", inv_btn_add: "Add New Product",
        th_image: "Media", th_barcode: "Barcode", th_name: "Product Name", th_category: "Category/Brand", th_stock: "Stock Inventory",
        th_buy_price: "Buying Cost (Capital)", th_sell_price: "Retail Price", th_actions: "Manage",
        exp_title: "Store Outflows & Expenses", exp_btn_add: "Record New Expense",
        th_date: "Logged Date", th_exp_cat: "Expense Category", th_desc: "Narration/Detail", th_amount: "Amount Paid",
        cust_title: "Customer Directory & Logs", cust_btn_add: "New Customer Profile",
        th_cust_name: "Customer Name", th_phone: "Phone Line", th_orders: "Visits Count", th_total_spend: "Gross Account Volume",
        rep_title: "Financial Auditing Hub", rep_print: "Print Statement",
        rep_gross: "Total Sales Revenue (Gross Income):", rep_capital: "Total Capital Expended (Cost of Bags Sold):",
        rep_expenses: "Total Auxiliary Outflows (Operational Expenses):", rep_net: "Net Earned Profit (Net Returns):"
    }
};

// --- 2. የውሂብ ማስቀመጫ ማዕከል (DATABASE CORE Engine) ---
// ደህንነቱ የተጠበቀ የማከማቻ ንብርብር: localStorage ብራውዘሩ ካገደው (Tracking Prevention/Private Mode)
// ስክሪፕቱ ሙሉ በሙሉ እንዳይሰበር ወደ በ-ማህደረ ትውስታ (in-memory) fallback ያደርጋል።
const SafeStorage = {
    memoryFallback: {},
    isLocalStorageAvailable: (() => {
        try {
            const testKey = "__raki_storage_test__";
            localStorage.setItem(testKey, "1");
            localStorage.removeItem(testKey);
            return true;
        } catch (err) {
            console.warn("localStorage አልተደረሰም (ምናልባት Tracking Prevention አግዶታል)። በ-ማህደረ ትውስታ ብቻ ይሰራል፤ ውሂብ ገፁን ዳግም ሲጫኑ አይቀመጥም።", err);
            return false;
        }
    })(),
    getItem(key) {
        if (this.isLocalStorageAvailable) {
            try { return localStorage.getItem(key); } catch (err) { /* ignore, fallback below */ }
        }
        return Object.prototype.hasOwnProperty.call(this.memoryFallback, key) ? this.memoryFallback[key] : null;
    },
    setItem(key, value) {
        if (this.isLocalStorageAvailable) {
            try { localStorage.setItem(key, value); return; } catch (err) { /* ignore, fallback below */ }
        }
        this.memoryFallback[key] = value;
    }
};

const LocalDatabase = {
    tables: {
        products: JSON.parse(SafeStorage.getItem('raki_v2_products')) || [],
        sales: JSON.parse(SafeStorage.getItem('raki_v2_sales')) || [],
        expenses: JSON.parse(SafeStorage.getItem('raki_v2_expenses')) || [],
        customers: JSON.parse(SafeStorage.getItem('raki_v2_customers')) || [
            { id: "CUST-401", name: "አስቴር በቀለ", phone: "0911556677", count: 1, total: 2500 }
        ],
        settings: JSON.parse(SafeStorage.getItem('raki_v2_settings')) || { name: "RAKI BAG SHOP", lang: "am" }
    },
    commit(tableName) {
        SafeStorage.setItem(`raki_v2_${tableName}`, JSON.stringify(this.tables[tableName]));
        SystemPipeline.calculateBusinessMetrics();
    }
};

const AppState = {
    activeLanguage: LocalDatabase.tables.settings.lang || "am",
    posCart: [],
    loadedCharts: {}
};

// --- 3. የሲስተሙ የስራ ቧንቧ (APPLICATION PIPELINE) ---
const SystemPipeline = {
    init() {
        this.translateInterface(AppState.activeLanguage);
        this.registerEventBindings();
        this.calculateBusinessMetrics();
        this.renderPOSCatalog();
        this.renderInventoryTable();
        this.renderExpenseTable();
        this.renderCustomerTable();
        this.triggerInventoryLiveAlerts();
    },

    translateInterface(lang) {
        AppState.activeLanguage = lang;
        document.documentElement.setAttribute('data-lang', lang);

        document.querySelectorAll('[data-i18n]').forEach(node => {
            const dictionaryKey = node.getAttribute('data-i18n');
            if (TranslationsDictionary[lang] && TranslationsDictionary[lang][dictionaryKey]) {
                node.innerText = TranslationsDictionary[lang][dictionaryKey];
            }
        });
        const langSelector = document.getElementById('lang-selector');
        if (langSelector) langSelector.value = lang;
    },

    registerEventBindings() {
        this.registerMobileNavigation();

        // Language Select Trigger
        const langSelector = document.getElementById('lang-selector');
        if (langSelector) {
            langSelector.addEventListener('change', (e) => {
                this.translateInterface(e.target.value);
                LocalDatabase.tables.settings.lang = e.target.value;
                LocalDatabase.commit('settings');
            });
        }

        // Dashboard Tabs Navigation
        document.querySelectorAll('.sidebar-menu .menu-item').forEach(tabButton => {
            tabButton.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.sidebar-menu .menu-item').forEach(b => b.classList.remove('active'));
                tabButton.classList.add('active');

                const targetId = tabButton.getAttribute('data-target');
                document.querySelectorAll('.workspace-section').forEach(section => section.classList.add('hidden'));
                const targetSection = document.getElementById(targetId);
                if (targetSection) targetSection.classList.remove('hidden');

                if (targetId === 'dashboard-section') this.renderAnalyticsCharts();
                this.closeMobileSidebar();
            });
        });

        // Authentication form handler
        const authForm = document.getElementById('auth-form');
        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = document.getElementById('auth-email');
                const roleInput = document.getElementById('auth-role');
                const userDisplay = document.getElementById('user-display-name');
                const roleDisplay = document.getElementById('user-display-role');
                const authContainer = document.getElementById('auth-container');
                const appContainer = document.getElementById('app-container');

                if (emailInput && userDisplay) userDisplay.innerText = emailInput.value.split('@')[0].toUpperCase();
                if (roleInput && roleDisplay) roleDisplay.innerText = roleInput.value.toUpperCase();
                if (authContainer) authContainer.classList.add('hidden');
                if (appContainer) appContainer.classList.remove('hidden');
                this.renderAnalyticsCharts();
            });
        }

        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                const appContainer = document.getElementById('app-container');
                const authContainer = document.getElementById('auth-container');
                if (appContainer) appContainer.classList.add('hidden');
                if (authContainer) authContainer.classList.remove('hidden');
            });
        }

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const activeTheme = document.documentElement.getAttribute('data-theme');
                document.documentElement.setAttribute('data-theme', activeTheme === 'light' ? 'dark' : 'light');
            });
        }

        // Popup triggers
        const openProductModal = document.getElementById('open-product-modal');
        if (openProductModal) {
            openProductModal.addEventListener('click', () => {
                const productForm = document.getElementById('product-form');
                const prodId = document.getElementById('prod-id');
                const productModal = document.getElementById('product-modal');
                if (productForm) productForm.reset();
                if (prodId) prodId.value = "";
                if (productModal) productModal.classList.remove('hidden');
            });
        }

        const openExpenseModal = document.getElementById('open-expense-modal');
        if (openExpenseModal) {
            openExpenseModal.addEventListener('click', () => {
                const expenseModal = document.getElementById('expense-modal');
                if (expenseModal) expenseModal.classList.remove('hidden');
            });
        }

        const openCustomerModal = document.getElementById('open-customer-modal');
        if (openCustomerModal) {
            openCustomerModal.addEventListener('click', () => {
                const customerModal = document.getElementById('customer-modal');
                if (customerModal) customerModal.classList.remove('hidden');
            });
        }

        document.querySelectorAll('.close-modal-btn').forEach(b => {
            b.addEventListener('click', () => document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden')));
        });

        // Intercepting Form Submits
        const productForm = document.getElementById('product-form');
        if (productForm) productForm.addEventListener('submit', (e) => this.processProductRegistration(e));

        const expenseForm = document.getElementById('expense-form');
        if (expenseForm) expenseForm.addEventListener('submit', (e) => this.processExpenseRegistration(e));

        const customerForm = document.getElementById('customer-form');
        if (customerForm) customerForm.addEventListener('submit', (e) => this.processCustomerRegistration(e));

        // Live calculation triggers
        const posSearchInput = document.getElementById('pos-search-input');
        if (posSearchInput) posSearchInput.addEventListener('input', () => this.renderPOSCatalog());

        const posCatFilter = document.getElementById('pos-category-filter');
        if (posCatFilter) posCatFilter.addEventListener('change', () => this.renderPOSCatalog());

        const posDiscount = document.getElementById('pos-discount');
        if (posDiscount) posDiscount.addEventListener('input', () => this.calculateCartTotals());

        const posCompleteOrder = document.getElementById('pos-complete-order');
        if (posCompleteOrder) posCompleteOrder.addEventListener('click', () => this.executePOSCheckoutTransaction());

        // Notifications Toggle Dropdown
        const alertTrigger = document.getElementById('alert-trigger');
        if (alertTrigger) {
            alertTrigger.addEventListener('click', () => {
                const notifMenu = document.getElementById('notification-menu');
                if (notifMenu) notifMenu.classList.toggle('hidden');
            });
        }
    },

    registerMobileNavigation() {
        const sidebar = document.getElementById('app-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const toggleBtn = document.getElementById('sidebar-toggle');

        const setSidebarOpen = (isOpen) => {
            if (!sidebar || !overlay || !toggleBtn) return;
            sidebar.classList.toggle('open', isOpen);
            overlay.classList.toggle('hidden', !isOpen);
            overlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
            toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            toggleBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        this.closeMobileSidebar = () => {
            if (window.innerWidth <= 1024) setSidebarOpen(false);
        };

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const willOpen = !sidebar?.classList.contains('open');
                setSidebarOpen(willOpen);
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => setSidebarOpen(false));
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setSidebarOpen(false);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) setSidebarOpen(false);
            if (AppState.loadedCharts.salesChartInstance || AppState.loadedCharts.profitChartInstance) {
                this.renderAnalyticsCharts();
            }
        });
    },

    getChartOptions(type = 'line') {
        const isMobile = window.innerWidth <= 768;
        const base = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: isMobile ? 'bottom' : 'top',
                    labels: { boxWidth: 12, font: { size: isMobile ? 10 : 12 } }
                }
            }
        };

        if (type === 'line' || type === 'bar') {
            base.scales = {
                x: { ticks: { maxRotation: isMobile ? 45 : 0, minRotation: 0, font: { size: isMobile ? 10 : 12 } } },
                y: { ticks: { font: { size: isMobile ? 10 : 12 } } }
            };
        }

        return base;
    },

    // --- 4. የፋይናንስ የሂሳብ ማሽን (FINANCIAL ENGINE) ---
    calculateBusinessMetrics() {
        const productsList = LocalDatabase.tables.products;
        const salesReceipts = LocalDatabase.tables.sales;
        const totalExpensesPaid = LocalDatabase.tables.expenses;

        let totalCurrentInventoryCapital = 0;
        let criticalLowStockCounter = 0;
        productsList.forEach(item => {
            totalCurrentInventoryCapital += (item.qty * item.buyPrice);
            if (item.qty <= 5) criticalLowStockCounter++;
        });

        let totalGrossSalesRevenue = 0;
        let totalCostOfItemsSold = 0;

        salesReceipts.forEach(receipt => {
            totalGrossSalesRevenue += receipt.grandTotal;
            totalCostOfItemsSold += receipt.totalCostBasis;
        });

        let operationalExpensesSum = 0;
        totalExpensesPaid.forEach(exp => operationalExpensesSum += exp.amount);

        const netShopProfitMargin = (totalGrossSalesRevenue - totalCostOfItemsSold) - operationalExpensesSum;

        // ወደ ዳሽቦርድ UI ማስተላለፍ (ደህንነቱ በተጠበቀ መንገድ)
        const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.innerText = txt; };

        setTxt('dash-total-revenue', totalGrossSalesRevenue.toFixed(2) + " ETB");
        setTxt('dash-capital-cost', totalCostOfItemsSold.toFixed(2) + " ETB");
        setTxt('dash-net-profit', netShopProfitMargin.toFixed(2) + " ETB");
        setTxt('dash-total-expenses', operationalExpensesSum.toFixed(2) + " ETB");
        setTxt('dash-inventory-value', totalCurrentInventoryCapital.toFixed(2) + " ETB");
        setTxt('dash-low-stock-count', criticalLowStockCounter + " Bags");

        // ወደ ኦዲት ሪፖርት ማስተላለፍ
        setTxt('report-gross', totalGrossSalesRevenue.toFixed(2) + " ETB");
        setTxt('report-capital', totalCostOfItemsSold.toFixed(2) + " ETB");
        setTxt('report-expenses', operationalExpensesSum.toFixed(2) + " ETB");
        setTxt('report-net', netShopProfitMargin.toFixed(2) + " ETB");

        AppState.dashboardCalculations = { totalGrossSalesRevenue, totalCostOfItemsSold, operationalExpensesSum, netShopProfitMargin };
    },

    // --- 5. ቻርቶች መሳያ (ANALYTICS VISUALIZATIONS) ---
    renderAnalyticsCharts() {
        if (AppState.loadedCharts.salesChartInstance) AppState.loadedCharts.salesChartInstance.destroy();
        if (AppState.loadedCharts.profitChartInstance) AppState.loadedCharts.profitChartInstance.destroy();

        const dataMetrics = AppState.dashboardCalculations || { totalGrossSalesRevenue: 0, totalCostOfItemsSold: 0, operationalExpensesSum: 0, netShopProfitMargin: 0 };

        const chartSalesTrendsEl = document.getElementById('chart-sales-trends');
        if (chartSalesTrendsEl && typeof Chart !== 'undefined') {
            const ctxLine = chartSalesTrendsEl.getContext('2d');
            AppState.loadedCharts.salesChartInstance = new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [
                        { label: 'Sales Income', data: [dataMetrics.totalGrossSalesRevenue * 0.4, dataMetrics.totalGrossSalesRevenue * 0.7, dataMetrics.totalGrossSalesRevenue * 0.9, dataMetrics.totalGrossSalesRevenue], borderColor: '#4f46e5', tension: 0.3, fill: false },
                        { label: 'Net Profit', data: [dataMetrics.netShopProfitMargin * 0.3, dataMetrics.netShopProfitMargin * 0.6, dataMetrics.netShopProfitMargin * 0.8, dataMetrics.netShopProfitMargin], borderColor: '#10b981', tension: 0.3, fill: false }
                    ]
                },
                options: this.getChartOptions('line')
            });
        }

        const chartProfitExpenseEl = document.getElementById('chart-profit-expense');
        if (chartProfitExpenseEl && typeof Chart !== 'undefined') {
            const ctxBar = chartProfitExpenseEl.getContext('2d');
            AppState.loadedCharts.profitChartInstance = new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: ['ዋና ብር (Capital Cost)', 'ወጪ (Expenses)', 'ትርፍ (Net Profit)'],
                    datasets: [{
                        label: 'Financial Distribution (ETB)',
                        data: [dataMetrics.totalCostOfItemsSold, dataMetrics.operationalExpensesSum, dataMetrics.netShopProfitMargin],
                        backgroundColor: ['#f59e0b', '#f43f5e', '#10b981']
                    }]
                },
                options: this.getChartOptions('bar')
            });
        }
    },

    // --- 6. የቦርሳ ዕቃዎች ምዝገባ ማሽን (INVENTORY CONTROL) ---
    processProductRegistration(e) {
        e.preventDefault();
        const existingId = document.getElementById('prod-id').value;
        const assignedId = existingId || "BAG-" + Date.now().toString().slice(-6);

        const imgVal = document.getElementById('prod-image').value;
        const registeredBagItem = {
            id: assignedId,
            barcode: document.getElementById('prod-barcode').value,
            name: document.getElementById('prod-name').value,
            category: document.getElementById('prod-category').value,
            brand: document.getElementById('prod-brand').value,
            color: document.getElementById('prod-color').value,
            size: document.getElementById('prod-size').value,
            qty: parseInt(document.getElementById('prod-qty').value) || 0,
            buyPrice: parseFloat(document.getElementById('prod-buy-price').value) || 0,
            sellPrice: parseFloat(document.getElementById('prod-sell-price').value) || 0,
            image: imgVal || "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200"
        };

        const lookupIndex = LocalDatabase.tables.products.findIndex(p => p.id === assignedId);
        if (lookupIndex > -1) LocalDatabase.tables.products[lookupIndex] = registeredBagItem;
        else LocalDatabase.tables.products.push(registeredBagItem);

        LocalDatabase.commit('products');
        this.renderInventoryTable();
        this.renderPOSCatalog();
        const productModal = document.getElementById('product-modal');
        if (productModal) productModal.classList.add('hidden');
    },

    renderInventoryTable() {
        const tableContainerBody = document.getElementById('inventory-table-body');
        if (!tableContainerBody) return;
        tableContainerBody.innerHTML = "";

        LocalDatabase.tables.products.forEach(product => {
            const rowNode = document.createElement('tr');
            rowNode.innerHTML = `
                <td><img src="${product.image}" class="table-product-img" style="width:40px; height:40px; object-fit:cover;"></td>
                <td><code>${product.barcode}</code></td>
                <td><strong>${product.name}</strong></td>
                <td>${product.category} / ${product.brand}</td>
                <td><span class="text-bold" style="color:${product.qty <= 5 ? 'red' : 'inherit'}">${product.qty} Pcs</span></td>
                <td class="text-warning text-bold">${product.buyPrice.toFixed(2)} ETB</td>
                <td class="text-success text-bold">${product.sellPrice.toFixed(2)} ETB</td>
                <td>
                    <button class="btn btn-primary btn-sm action-edit" data-id="${product.id}">ያስተካክሉ</button>
                    <button class="btn btn-danger btn-sm action-delete" data-id="${product.id}">ሰርዝ</button>
                </td>
            `;

            rowNode.querySelector('.action-edit').addEventListener('click', () => {
                document.getElementById('prod-id').value = product.id;
                document.getElementById('prod-barcode').value = product.barcode;
                document.getElementById('prod-name').value = product.name;
                document.getElementById('prod-category').value = product.category;
                document.getElementById('prod-brand').value = product.brand;
                document.getElementById('prod-color').value = product.color;
                document.getElementById('prod-size').value = product.size;
                document.getElementById('prod-qty').value = product.qty;
                document.getElementById('prod-buy-price').value = product.buyPrice;
                document.getElementById('prod-sell-price').value = product.sellPrice;
                document.getElementById('prod-image').value = product.image;

                const prodModal = document.getElementById('product-modal');
                if (prodModal) prodModal.classList.remove('hidden');
            });

            rowNode.querySelector('.action-delete').addEventListener('click', () => {
                if (confirm("ይህንን ቦርሳ ከሲስተሙ ላይ መሰረዝ ይፈልጋሉ?")) {
                    LocalDatabase.tables.products = LocalDatabase.tables.products.filter(p => p.id !== product.id);
                    LocalDatabase.commit('products');
                    this.renderInventoryTable();
                    this.renderPOSCatalog();
                }
            });
            tableContainerBody.appendChild(rowNode);
        });
    },

    // --- 7. የሽያጭ ማሽን (POS WORKSTATION ENGINE - NO VAT) ---
    renderPOSCatalog() {
        const gridView = document.getElementById('pos-catalog-grid');
        if (!gridView) return;

        const posSearchEl = document.getElementById('pos-search-input');
        const searchInputKeyword = posSearchEl ? posSearchEl.value.toLowerCase() : "";

        const posCatFilterEl = document.getElementById('pos-category-filter');
        const activeCategorySelected = posCatFilterEl ? posCatFilterEl.value : "";
        gridView.innerHTML = "";

        // Filling Categories Dropdown
        const uniqueCategoriesList = [...new Set(LocalDatabase.tables.products.map(p => p.category))];
        const selectFilterNode = document.getElementById('pos-category-filter');
        if (selectFilterNode) {
            selectFilterNode.innerHTML = `<option value="">ሁሉም ዘርፎች (All)</option>`;
            uniqueCategoriesList.forEach(c => selectFilterNode.innerHTML += `<option value="${c}">${c}</option>`);
            if (activeCategorySelected) selectFilterNode.value = activeCategorySelected;
        }

        // Loading Client Select List
        const checkoutCustomerSelect = document.getElementById('pos-customer-select');
        if (checkoutCustomerSelect) {
            checkoutCustomerSelect.innerHTML = `<option value="walk-in">መደበኛ ደንበኛ (Walk-in Customer)</option>`;
            LocalDatabase.tables.customers.forEach(cust => checkoutCustomerSelect.innerHTML += `<option value="${cust.id}">${cust.name}</option>`);
        }

        // Rendering Catalog Cards
        LocalDatabase.tables.products.forEach(bag => {
            const matchesSearch = bag.name.toLowerCase().includes(searchInputKeyword) || bag.barcode.includes(searchInputKeyword);
            const matchesCategory = !activeCategorySelected || bag.category === activeCategorySelected;

            if (matchesSearch && matchesCategory) {
                const itemCardNode = document.createElement('div');
                itemCardNode.className = "pos-item-card";
                itemCardNode.innerHTML = `
                    <img src="${bag.image}" alt="${bag.name}">
                    <h5>${bag.name}</h5>
                    <span class="text-success text-bold">${bag.sellPrice.toFixed(2)} ETB</span>
                    <br><small class="text-muted">ክምችት: ${bag.qty}</small>
                `;
                itemCardNode.addEventListener('click', () => this.addItemToPOSCart(bag));
                gridView.appendChild(itemCardNode);
            }
        });
    },

    addItemToPOSCart(productItem) {
        if (productItem.qty <= 0) return alert("ይህ ቦርሳ ክምችት ላይ አልቋል! / Out of Stock!");

        const existInCart = AppState.posCart.find(c => c.id === productItem.id);
        if (existInCart) {
            if (existInCart.quantity + 1 > productItem.qty) return alert("ከተረፈው የክምችት መጠን በላይ መሸጥ አይቻልም!");
            existInCart.quantity++;
        } else {
            AppState.posCart.push({ ...productItem, quantity: 1 });
        }
        this.renderPOSCartList();
    },

    renderPOSCartList() {
        const manifestBox = document.getElementById('pos-cart-manifest');
        if (!manifestBox) return;
        manifestBox.innerHTML = "";

        AppState.posCart.forEach((cartItem, index) => {
            const cartRow = document.createElement('div');
            cartRow.className = 'cart-row';
            cartRow.innerHTML = `
                <div>
                    <span class="text-bold" style="font-size:0.85rem">${cartItem.name}</span><br>
                    <small class="text-success">${cartItem.sellPrice} ETB</small>
                </div>
                <div class="text-bold">x${cartItem.quantity}</div>
                <button class="btn btn-danger btn-remove" onclick="window.ejectCartItem(${index})">-</button>
            `;
            manifestBox.appendChild(cartRow);
        });
        this.calculateCartTotals();
    },

    calculateCartTotals() {
        let runningSubtotalSum = 0;
        AppState.posCart.forEach(item => runningSubtotalSum += (item.sellPrice * item.quantity));

        const posDiscountEl = document.getElementById('pos-discount');
        const discountRatePercentage = posDiscountEl ? parseFloat(posDiscountEl.value) || 0 : 0;
        const totalDiscountDeductionAmount = runningSubtotalSum * (discountRatePercentage / 100);

        const finalNetGrandTotalBill = runningSubtotalSum - totalDiscountDeductionAmount;

        const subtotalEl = document.getElementById('pos-subtotal');
        const grandTotalEl = document.getElementById('pos-grand-total');

        if (subtotalEl) subtotalEl.innerText = runningSubtotalSum.toFixed(2) + " ETB";
        if (grandTotalEl) grandTotalEl.innerText = finalNetGrandTotalBill.toFixed(2) + " ETB";
    },

    executePOSCheckoutTransaction() {
        if (AppState.posCart.length === 0) return alert("እባክዎ መጀመሪያ ዕቃ ወደ ካርቱ ይጨምሩ!");

        let aggregateCostBasisOfTransaction = 0;

        AppState.posCart.forEach(cartBag => {
            const masterProduct = LocalDatabase.tables.products.find(p => p.id === cartBag.id);
            if (masterProduct) masterProduct.qty -= cartBag.quantity;
            aggregateCostBasisOfTransaction += (cartBag.buyPrice * cartBag.quantity);
        });

        const grandTotalEl = document.getElementById('pos-grand-total');
        const transactionFinalGrandTotalAmount = grandTotalEl ? parseFloat(grandTotalEl.innerText) : 0;

        const netProfitEarnedFromTransaction = transactionFinalGrandTotalAmount - aggregateCostBasisOfTransaction;

        const secureInvoiceTransactionObject = {
            id: "TXN-" + Date.now().toString().slice(-5),
            dateTimestamp: new Date().toISOString(),
            grandTotal: transactionFinalGrandTotalAmount,
            totalCostBasis: aggregateCostBasisOfTransaction,
            profit: netProfitEarnedFromTransaction
        };

        LocalDatabase.tables.sales.push(secureInvoiceTransactionObject);
        LocalDatabase.commit('products');
        LocalDatabase.commit('sales');

        alert(`💰 ሽያጩ በተሳካ ሁኔታ ተጠናቋል!\nደረሰኝ ቁጥር: ${secureInvoiceTransactionObject.id}\nጠቅላላ ሂሳብ: ${transactionFinalGrandTotalAmount.toFixed(2)} ETB\nዋና ብር (ካፒታል): ${aggregateCostBasisOfTransaction.toFixed(2)} ETB\nትርፍ: ${netProfitEarnedFromTransaction.toFixed(2)} ETB`);

        AppState.posCart = [];
        this.renderPOSCartList();
        this.renderPOSCatalog();
        this.renderInventoryTable();
    },

    // --- 8. ተጨማሪ ወጪዎች እና ደንበኞች አስተዳዳሪ (EXPENSES & CUSTOMERS) ---
    processExpenseRegistration(e) {
        e.preventDefault();
        const expenseLog = {
            date: new Date().toLocaleDateString(),
            category: document.getElementById('exp-category').value,
            desc: document.getElementById('exp-desc').value,
            amount: parseFloat(document.getElementById('exp-amount').value) || 0
        };
        LocalDatabase.tables.expenses.push(expenseLog);
        LocalDatabase.commit('expenses');
        this.renderExpenseTable();
        const expModal = document.getElementById('expense-modal');
        if (expModal) expModal.classList.add('hidden');
    },

    renderExpenseTable() {
        const trContainerBody = document.getElementById('expense-table-body');
        if (!trContainerBody) return;
        trContainerBody.innerHTML = "";
        LocalDatabase.tables.expenses.forEach(exp => {
            trContainerBody.innerHTML += `<tr><td>${exp.date}</td><td><span class="badge role-badge">${exp.category}</span></td><td>${exp.desc}</td><td class="text-danger text-bold">${exp.amount.toFixed(2)} ETB</td></tr>`;
        });
    },

    processCustomerRegistration(e) {
        e.preventDefault();
        const clientProfile = {
            id: "CUST-" + Date.now().toString().slice(-3),
            name: document.getElementById('cust-name').value,
            phone: document.getElementById('cust-phone').value,
            count: 0, total: 0
        };
        LocalDatabase.tables.customers.push(clientProfile);
        LocalDatabase.commit('customers');
        this.renderCustomerTable();
        this.renderPOSCatalog();
        const custModal = document.getElementById('customer-modal');
        if (custModal) custModal.classList.add('hidden');
    },

    renderCustomerTable() {
        const tbody = document.getElementById('customer-table-body');
        if (!tbody) return;
        tbody.innerHTML = "";
        LocalDatabase.tables.customers.forEach(c => {
            tbody.innerHTML += `<tr><td><code>${c.id}</code></td><td><strong>${c.name}</strong></td><td>${c.phone}</td><td>${c.count}</td><td class="text-success text-bold">${c.total.toFixed(2)} ETB</td></tr>`;
        });
    },

    triggerInventoryLiveAlerts() {
        const listWrapper = document.getElementById('notification-list');
        if (!listWrapper) return;
        let counter = 0;
        listWrapper.innerHTML = "";

        LocalDatabase.tables.products.forEach(p => {
            if (p.qty <= 5) {
                counter++;
                listWrapper.innerHTML += `
                    <div style="padding:10px; border-bottom:1px solid #ccc; font-size:0.8rem; color:red;">
                        🔔 ክምችት አሳሳቢ ደረጃ ላይ ነው: <strong>${p.name}</strong> (${p.qty} ቁርጥ ቀረ)
                    </div>`;
            }
        });
        const notifCountEl = document.getElementById('notification-count');
        if (notifCountEl) notifCountEl.innerText = counter;
    }
};

// Global Mappings for dynamic actions
window.setLanguage = (lang) => SystemPipeline.translateInterface(lang);
window.ejectCartItem = (cartIndex) => {
    AppState.posCart.splice(cartIndex, 1);
    SystemPipeline.renderPOSCartList();
};

document.addEventListener('DOMContentLoaded', () => SystemPipeline.init());