/**
 * RAKI BAG SHOP MANAGEMENT SYSTEM — CORE LOGIC V5
 * ⚡️ NEW: Role-Based Access Control (Admin vs Staff) | Activity Log / Audit Trail
 * ⚡️ Admin: Full control | Staff: View + POS sales only
 * ⚡️ Every action logged to Firestore with user, timestamp, IP, and details
 */

import { db } from "./firebase.js";
import {
    getAuth, onAuthStateChanged, signInWithEmailAndPassword,
    createUserWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    collection, doc, getDocs, getDoc, setDoc, addDoc,
    deleteDoc, updateDoc, query, orderBy, limit, where, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const auth = getAuth();

// ============================================================================
// 1. TRANSLATIONS (Updated with Activity Log)
// ============================================================================
const TranslationsDictionary = {
    am: {
        auth_subtitle: "የሱቅ መቆጣጠሪያ ማዕከል V3 — Role-Based",
        email_label: "ኢሜይል አድራሻ", password_label: "የይለፍ ቃል", role_label: "ኃላፊነት",
        role_admin: "አስተዳዳሪ / ባለቤት", role_staff: "ሰራተኛ / Staff", sign_in: "ግባ",
        menu_dashboard: "ዳሽቦርድ", menu_pos: "መሸጫ ማሽን (POS)", menu_inventory: "የዕቃዎች ክምችት",
        menu_expenses: "የሱቅ ወጪዎች", menu_customers: "ደንበኞች", menu_reports: "የሂሳብ ሪፖርቶች",
        menu_activity_log: "የድርጊት መዝገብ / Activity Log", logout: "ውጣ",
        live_alerts: "የክምችት ማሳሰቢያዎች", dash_title: "የንግድ ትንተና ዳሽቦርድ",
        dash_subtitle: "የካፒታል፣ የሽያጭ እና የትርፍ መከታተያ ማዕከል።",
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
        rep_expenses: "ጠቅላላ ተጨማሪ ወጪዎች (Operational Expenses):", rep_net: "የተጣራ ንፁህ ትርፍ (Net Profit Margin):",
        auth_have_account: "አካውንት አለዎት?", auth_no_account: "አካውንት የለዎትም?",
        auth_toggle_to_signup: "አዲስ ሂሳብ ይክፈቱ", auth_toggle_to_signin: "ግቡ (Sign In)",
        auth_signup_btn: "ሂሳብ ክፈት",
        actlog_title: "የድርጊት መዝገብ / Activity Log",
        th_timestamp: "ቀን / ሰአት", th_user: "ተጠቃሚ", th_role: "ኃላፊነት",
        th_action: "ድርጊት", th_details: "ዝርዝር", th_ip: "IP አድራሻ",
        staff_restricted: "⚠️ ሰራተኛ ሆነው ይህንን ክፍል ማስተካከል አይችሉም። ለማየት ብቻ ነው የተፈቀደው።",
        permission_denied: "ይቅርታ፣ ይህንን ድርጊት ለመፈፀም ስልጣን አልነበረዎትም!"
    },
    en: {
        auth_subtitle: "Shop Management Portal V3 — Role-Based",
        email_label: "Email Address", password_label: "Password", role_label: "Role Profile",
        role_admin: "Admin / Executive Owner", role_staff: "Staff / Salesperson", sign_in: "Secure Sign In",
        menu_dashboard: "Analytics Dashboard", menu_pos: "POS Workstation", menu_inventory: "Stock Inventory",
        menu_expenses: "Shop Expenses", menu_customers: "Client Management", menu_reports: "Financial Reports",
        menu_activity_log: "Activity Log / Audit Trail", logout: "Logout",
        live_alerts: "Active Inventory Alerts", dash_title: "Business Performance Analytics",
        dash_subtitle: "Real-time cost of goods, sales, and profit pipeline tracking.",
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
        rep_expenses: "Total Auxiliary Outflows (Operational Expenses):", rep_net: "Net Earned Profit (Net Returns):",
        auth_have_account: "Already have an account?", auth_no_account: "Don't have an account?",
        auth_toggle_to_signup: "Create an account", auth_toggle_to_signin: "Sign In instead",
        auth_signup_btn: "Create Account",
        actlog_title: "Activity Log / Audit Trail",
        th_timestamp: "Date / Time", th_user: "User", th_role: "Role",
        th_action: "Action", th_details: "Details", th_ip: "IP Address",
        staff_restricted: "⚠️ As a Staff member, you cannot modify this section. View-only access granted.",
        permission_denied: "Sorry, you do not have permission to perform this action!"
    }
};

// ============================================================================
// 2. ACTIVITY LOGGER — Records every action to Firestore
// ============================================================================
const ActivityLogger = {
    async log(action, details = "", metadata = {}) {
        const user = auth.currentUser;
        if (!user) return;
        try {
            const logEntry = {
                userId: user.uid,
                userEmail: user.email,
                userName: user.email.split('@')[0],
                role: AppState.currentUserRole || "unknown",
                action: action,
                details: details,
                timestamp: serverTimestamp(),
                ipAddress: await this.getIPAddress(),
                userAgent: navigator.userAgent.substring(0, 200),
                ...metadata
            };
            await addDoc(collection(db, "activityLogs"), logEntry);
        } catch (err) {
            console.error("Activity log failed:", err);
        }
    },

    async getIPAddress() {
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            return data.ip;
        } catch { return "unknown"; }
    },

    ACTIONS: {
        LOGIN: "login", LOGOUT: "logout", SALE_COMPLETED: "sale",
        PRODUCT_ADDED: "product_add", PRODUCT_EDITED: "product_edit",
        PRODUCT_DELETED: "product_delete", EXPENSE_ADDED: "expense_add",
        CUSTOMER_ADDED: "customer_add", SETTINGS_CHANGED: "settings_change"
    }
};

// ============================================================================
// 3. ROLE-BASED ACCESS CONTROL
// ============================================================================
const AccessControl = {
    PERMISSIONS: {
        admin: {
            canViewDashboard: true, canViewPOS: true, canViewInventory: true,
            canAddProduct: true, canEditProduct: true, canDeleteProduct: true,
            canViewExpenses: true, canAddExpense: true,
            canViewCustomers: true, canAddCustomer: true,
            canViewReports: true, canViewActivityLog: true,
            canManageUsers: true, canModifySettings: true
        },
        staff: {
            canViewDashboard: true, canViewPOS: true, canViewInventory: true,
            canAddProduct: false, canEditProduct: false, canDeleteProduct: false,
            canViewExpenses: true, canAddExpense: false,
            canViewCustomers: true, canAddCustomer: false,
            canViewReports: true, canViewActivityLog: false,
            canManageUsers: false, canModifySettings: false
        }
    },

    getCurrentRole() { return AppState.currentUserRole || "staff"; },
    hasPermission(perm) { return this.PERMISSIONS[this.getCurrentRole()]?.[perm] || false; },
    isAdmin() { return this.getCurrentRole() === "admin"; },
    isStaff() { return this.getCurrentRole() === "staff"; },

    applyUIRestrictions() {
        const isStaff = this.isStaff();
        document.body.classList.toggle("staff-view", isStaff);

        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = isStaff ? 'none' : '';
        });
        document.querySelectorAll('.admin-only-btn').forEach(btn => {
            btn.style.display = isStaff ? 'none' : '';
        });

        this.addStaffRestrictionBanners();
        this.restrictTableActions();
    },

    addStaffRestrictionBanners() {
        const sections = ['inventory-section', 'expenses-section', 'customers-section'];
        const msg = TranslationsDictionary[AppState.activeLanguage]?.staff_restricted || TranslationsDictionary.en.staff_restricted;

        sections.forEach(id => {
            const section = document.getElementById(id);
            if (!section) return;
            section.querySelector('.staff-restricted-banner')?.remove();

            if (this.isStaff()) {
                const banner = document.createElement('div');
                banner.className = 'staff-restricted-banner';
                banner.innerHTML = `<i class="fa-solid fa-lock"></i> <span>${msg}</span>`;
                section.querySelector('.page-title-action')?.after(banner);
            }
        });
    },

    restrictTableActions() {
        if (!this.isStaff()) return;
        document.querySelectorAll('.action-edit, .action-delete').forEach(btn => {
            btn.style.display = 'none';
        });
    },

    requirePermission(perm) {
        if (this.hasPermission(perm)) return true;
        const msg = TranslationsDictionary[AppState.activeLanguage]?.permission_denied || TranslationsDictionary.en.permission_denied;
        this.showDeniedToast(msg);
        return false;
    },

    showDeniedToast(msg) {
        document.querySelector('.permission-denied-toast')?.remove();
        const toast = document.createElement('div');
        toast.className = 'permission-denied-toast';
        toast.innerHTML = `<i class="fa-solid fa-shield-halved"></i> <span>${msg}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// ============================================================================
// 4. DATA SERVICE
// ============================================================================
const DataService = {
    async loadCollection(name) {
        try {
            const snap = await getDocs(collection(db, name));
            return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (err) { console.error(`Load error (${name}):`, err); return []; }
    },
    async loadActivityLogs(filters = {}) {
        try {
            let constraints = [orderBy("timestamp", "desc"), limit(200)];
            if (filters.userId) constraints.push(where("userId", "==", filters.userId));
            if (filters.action) constraints.push(where("action", "==", filters.action));
            const q = query(collection(db, "activityLogs"), ...constraints);
            const snap = await getDocs(q);
            return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (err) { console.error("Activity logs error:", err); return []; }
    },
    async setDocument(col, id, data) {
        const { id: _omit, ...payload } = data;
        await setDoc(doc(db, col, id), payload);
    },
    async addDocument(col, data) {
        const { id: _omit, ...payload } = data;
        const ref = await addDoc(collection(db, col), payload);
        return ref.id;
    },
    async updateDocument(col, id, partial) {
        await updateDoc(doc(db, col, id), partial);
    },
    async deleteDocument(col, id) {
        await deleteDoc(doc(db, col, id));
    },
    async getSettings() {
        try {
            const snap = await getDoc(doc(db, "settings", "config"));
            return snap.exists() ? snap.data() : { name: "RAKI BAG SHOP", lang: "am" };
        } catch { return { name: "RAKI BAG SHOP", lang: "am" }; }
    },
    async saveSettings(data) {
        await setDoc(doc(db, "settings", "config"), data);
    }
};

// ============================================================================
// 5. LOCAL CACHE & APP STATE
// ============================================================================
const LocalDatabase = {
    tables: { products: [], sales: [], expenses: [], customers: [], activityLogs: [], settings: { name: "RAKI BAG SHOP", lang: "am" } },
    async loadAll() {
        this.tables.products = await DataService.loadCollection('products');
        this.tables.sales = await DataService.loadCollection('sales');
        this.tables.expenses = await DataService.loadCollection('expenses');
        this.tables.customers = await DataService.loadCollection('customers');
        this.tables.settings = await DataService.getSettings();
    }
};

const AppState = {
    activeLanguage: "am", currentUserRole: "staff", currentUserId: null, currentUserEmail: null,
    posCart: [], loadedCharts: {}, authMode: "signin", dashboardCalculations: {}
};

function getAuthErrorMessage(err) {
    const map = {
        'auth/email-already-in-use': 'ይህ ኢሜይል አስቀድሞ ተመዝግቧል።',
        'auth/weak-password': 'የይለፍ ቃል በጣም ደካማ ነው (ቢያንስ 6 ፊደላት)።',
        'auth/invalid-email': 'ትክክለኛ ያልሆነ ኢሜይል አድራሻ ነው።',
        'auth/user-not-found': 'ይህ ኢሜይል አልተመዘገበም።',
        'auth/wrong-password': 'የተሳሳተ የይለፍ ቃል ነው።',
        'auth/invalid-credential': 'ኢሜይል ወይም የይለፍ ቃል ትክክል አይደለም።',
        'auth/too-many-requests': 'በጣም ብዙ ሙከራዎች ተደርገዋል። ትንሽ ቆይተው ይሞክሩ።',
        'auth/network-request-failed': 'የኢንተርኔት ግንኙነት ችግር።'
    };
    return map[err.code] || 'ስህተት ተከስቷል፣ እባክዎ እንደገና ይሞክሩ።';
}

// ============================================================================
// 6. MAIN PIPELINE
// ============================================================================
const SystemPipeline = {
    async init() {
        this.registerEventBindings();
        onAuthStateChanged(auth, async (user) => {
            if (user) await this.handleAuthenticatedSession(user);
            else this.showAuthScreen();
        });
    },

    async handleAuthenticatedSession(firebaseUser) {
        let resolvedRole = "staff";
        try {
            const snap = await getDoc(doc(db, "users", firebaseUser.uid));
            if (snap.exists()) resolvedRole = snap.data().role || "staff";
        } catch (err) { console.error("Role fetch error:", err); }

        AppState.currentUserRole = resolvedRole;
        AppState.currentUserId = firebaseUser.uid;
        AppState.currentUserEmail = firebaseUser.email;

        await LocalDatabase.loadAll();
        AppState.activeLanguage = LocalDatabase.tables.settings.lang || "am";
        this.translateInterface(AppState.activeLanguage);

        const userDisplay = document.getElementById('user-display-name');
        const roleDisplay = document.getElementById('user-display-role');
        if (userDisplay) userDisplay.innerText = firebaseUser.email.split('@')[0].toUpperCase();
        if (roleDisplay) { roleDisplay.innerText = resolvedRole.toUpperCase(); roleDisplay.className = `role-badge ${resolvedRole}`; }

        AccessControl.applyUIRestrictions();

        document.getElementById('auth-container')?.classList.add('hidden');
        document.getElementById('app-container')?.classList.remove('hidden');

        await ActivityLogger.log(ActivityLogger.ACTIONS.LOGIN, `User logged in as ${resolvedRole}`, { deviceInfo: navigator.platform });

        this.calculateBusinessMetrics();
        this.renderPOSCatalog();
        this.renderInventoryTable();
        this.renderExpenseTable();
        this.renderCustomerTable();
        this.triggerInventoryLiveAlerts();
        this.renderAnalyticsCharts();
    },

    showAuthScreen() {
        document.getElementById('auth-container')?.classList.remove('hidden');
        document.getElementById('app-container')?.classList.add('hidden');
        document.getElementById('auth-form')?.reset();
        AppState.currentUserRole = "staff";
        document.body.classList.remove("staff-view");
    },

    setAuthMode(mode) {
        AppState.authMode = mode;
        const dict = TranslationsDictionary[AppState.activeLanguage] || TranslationsDictionary.am;
        const submitBtn = document.getElementById('auth-submit-btn');
        const roleGroup = document.getElementById('auth-role-group');
        const promptEl = document.getElementById('auth-mode-prompt');
        const toggleLink = document.getElementById('auth-toggle-mode');

        if (mode === 'signup') {
            if (submitBtn) submitBtn.innerText = dict.auth_signup_btn;
            if (roleGroup) roleGroup.classList.remove('hidden');
            if (promptEl) promptEl.innerText = dict.auth_have_account;
            if (toggleLink) toggleLink.innerText = dict.auth_toggle_to_signin;
        } else {
            if (submitBtn) submitBtn.innerText = dict.sign_in;
            if (roleGroup) roleGroup.classList.add('hidden');
            if (promptEl) promptEl.innerText = dict.auth_no_account;
            if (toggleLink) toggleLink.innerText = dict.auth_toggle_to_signup;
        }
    },

    translateInterface(lang) {
        AppState.activeLanguage = lang;
        document.documentElement.setAttribute('data-lang', lang);
        document.querySelectorAll('[data-i18n]').forEach(node => {
            const key = node.getAttribute('data-i18n');
            if (TranslationsDictionary[lang]?.[key]) node.innerText = TranslationsDictionary[lang][key];
        });
        document.getElementById('lang-selector') && (document.getElementById('lang-selector').value = lang);
        this.setAuthMode(AppState.authMode);
    },

    registerEventBindings() {
        this.registerMobileNavigation();

        document.getElementById('lang-selector')?.addEventListener('change', async (e) => {
            this.translateInterface(e.target.value);
            LocalDatabase.tables.settings.lang = e.target.value;
            try { await DataService.saveSettings(LocalDatabase.tables.settings); } catch (err) {}
        });

        document.querySelectorAll('.sidebar-menu .menu-item').forEach(tab => {
            tab.addEventListener('click', async (e) => {
                e.preventDefault();
                const targetId = tab.getAttribute('data-target');
                if (targetId === 'activity-log-section' && !AccessControl.hasPermission('canViewActivityLog')) {
                    AccessControl.requirePermission('canViewActivityLog'); return;
                }
                document.querySelectorAll('.sidebar-menu .menu-item').forEach(b => b.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.workspace-section').forEach(s => s.classList.add('hidden'));
                document.getElementById(targetId)?.classList.remove('hidden');
                if (targetId === 'dashboard-section') this.renderAnalyticsCharts();
                if (targetId === 'activity-log-section') await this.renderActivityLog();
                this.closeMobileSidebar();
            });
        });

        document.getElementById('auth-toggle-mode')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.setAuthMode(AppState.authMode === 'signin' ? 'signup' : 'signin');
        });
        this.setAuthMode(AppState.authMode);

        document.getElementById('auth-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('auth-email').value.trim();
            const password = document.getElementById('auth-password').value;
            const role = document.getElementById('auth-role')?.value || "staff";
            const btn = document.getElementById('auth-submit-btn');
            if (btn) btn.disabled = true;

            try {
                if (AppState.authMode === 'signup') {
                    const cred = await createUserWithEmailAndPassword(auth, email, password);
                    await setDoc(doc(db, "users", cred.user.uid), { email, role, createdAt: new Date().toISOString() });
                } else {
                    await signInWithEmailAndPassword(auth, email, password);
                }
            } catch (err) {
                alert(getAuthErrorMessage(err));
            } finally { if (btn) btn.disabled = false; }
        });

        document.getElementById('btn-logout')?.addEventListener('click', async () => {
            try {
                await ActivityLogger.log(ActivityLogger.ACTIONS.LOGOUT, "User signed out");
                await signOut(auth);
                AppState.posCart = [];
            } catch (err) { console.error("Logout error:", err); }
        });

        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            const t = document.documentElement.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', t === 'light' ? 'dark' : 'light');
        });

        document.getElementById('open-product-modal')?.addEventListener('click', () => {
            if (!AccessControl.requirePermission('canAddProduct')) return;
            document.getElementById('product-form')?.reset();
            document.getElementById('prod-id').value = "";
            document.getElementById('product-modal')?.classList.remove('hidden');
        });

        document.getElementById('open-expense-modal')?.addEventListener('click', () => {
            if (!AccessControl.requirePermission('canAddExpense')) return;
            document.getElementById('expense-modal')?.classList.remove('hidden');
        });

        document.getElementById('open-customer-modal')?.addEventListener('click', () => {
            if (!AccessControl.requirePermission('canAddCustomer')) return;
            document.getElementById('customer-modal')?.classList.remove('hidden');
        });

        document.querySelectorAll('.close-modal-btn').forEach(b => {
            b.addEventListener('click', () => document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden')));
        });

        document.getElementById('product-form')?.addEventListener('submit', (e) => this.processProductRegistration(e));
        document.getElementById('expense-form')?.addEventListener('submit', (e) => this.processExpenseRegistration(e));
        document.getElementById('customer-form')?.addEventListener('submit', (e) => this.processCustomerRegistration(e));

        document.getElementById('pos-search-input')?.addEventListener('input', () => this.renderPOSCatalog());
        document.getElementById('pos-category-filter')?.addEventListener('change', () => this.renderPOSCatalog());
        document.getElementById('pos-discount')?.addEventListener('input', () => this.calculateCartTotals());
        document.getElementById('pos-complete-order')?.addEventListener('click', () => this.executePOSCheckoutTransaction());

        document.getElementById('alert-trigger')?.addEventListener('click', () => {
            document.getElementById('notification-menu')?.classList.toggle('hidden');
        });

        document.getElementById('actlog-filter-user')?.addEventListener('change', () => this.renderActivityLog());
        document.getElementById('actlog-filter-action')?.addEventListener('change', () => this.renderActivityLog());
    },

    registerMobileNavigation() {
        const sidebar = document.getElementById('app-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const toggleBtn = document.getElementById('sidebar-toggle');

        const setOpen = (isOpen) => {
            if (!sidebar || !overlay || !toggleBtn) return;
            sidebar.classList.toggle('open', isOpen);
            overlay.classList.toggle('hidden', !isOpen);
            overlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
            toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        this.closeMobileSidebar = () => { if (window.innerWidth <= 1024) setOpen(false); };

        toggleBtn?.addEventListener('click', () => setOpen(!sidebar.classList.contains('open')));
        overlay?.addEventListener('click', () => setOpen(false));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) setOpen(false);
        });
    },

    getChartOptions(type = 'line') {
        const isMobile = window.innerWidth <= 768;
        const base = {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: isMobile ? 'bottom' : 'top', labels: { boxWidth: 12, font: { size: isMobile ? 10 : 12 } } } }
        };
        if (type === 'line' || type === 'bar') {
            base.scales = {
                x: { ticks: { maxRotation: isMobile ? 45 : 0, font: { size: isMobile ? 10 : 12 } } },
                y: { ticks: { font: { size: isMobile ? 10 : 12 } } }
            };
        }
        return base;
    },

    calculateBusinessMetrics() {
        const products = LocalDatabase.tables.products;
        const sales = LocalDatabase.tables.sales;
        const expenses = LocalDatabase.tables.expenses;

        let invCapital = 0, lowStock = 0;
        products.forEach(p => { invCapital += (p.qty * p.buyPrice); if (p.qty <= 5) lowStock++; });

        let grossRevenue = 0, cogs = 0;
        sales.forEach(s => { grossRevenue += s.grandTotal; cogs += s.totalCostBasis; });

        let opEx = 0;
        expenses.forEach(e => opEx += e.amount);

        const netProfit = (grossRevenue - cogs) - opEx;
        const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.innerText = txt; };

        setTxt('dash-total-revenue', grossRevenue.toFixed(2) + " ETB");
        setTxt('dash-capital-cost', cogs.toFixed(2) + " ETB");
        setTxt('dash-net-profit', netProfit.toFixed(2) + " ETB");
        setTxt('dash-total-expenses', opEx.toFixed(2) + " ETB");
        setTxt('dash-inventory-value', invCapital.toFixed(2) + " ETB");
        setTxt('dash-low-stock-count', lowStock + " Bags");
        setTxt('report-gross', grossRevenue.toFixed(2) + " ETB");
        setTxt('report-capital', cogs.toFixed(2) + " ETB");
        setTxt('report-expenses', opEx.toFixed(2) + " ETB");
        setTxt('report-net', netProfit.toFixed(2) + " ETB");

        AppState.dashboardCalculations = { totalGrossSalesRevenue: grossRevenue, totalCostOfItemsSold: cogs, operationalExpensesSum: opEx, netShopProfitMargin: netProfit };
    },

    renderAnalyticsCharts() {
        if (AppState.loadedCharts.salesChartInstance) AppState.loadedCharts.salesChartInstance.destroy();
        if (AppState.loadedCharts.profitChartInstance) AppState.loadedCharts.profitChartInstance.destroy();

        const dm = AppState.dashboardCalculations || { totalGrossSalesRevenue: 0, totalCostOfItemsSold: 0, operationalExpensesSum: 0, netShopProfitMargin: 0 };

        const salesEl = document.getElementById('chart-sales-trends');
        if (salesEl && typeof Chart !== 'undefined') {
            AppState.loadedCharts.salesChartInstance = new Chart(salesEl.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [
                        { label: 'Sales Income', data: [dm.totalGrossSalesRevenue * 0.4, dm.totalGrossSalesRevenue * 0.7, dm.totalGrossSalesRevenue * 0.9, dm.totalGrossSalesRevenue], borderColor: '#4f46e5', tension: 0.3, fill: false },
                        { label: 'Net Profit', data: [dm.netShopProfitMargin * 0.3, dm.netShopProfitMargin * 0.6, dm.netShopProfitMargin * 0.8, dm.netShopProfitMargin], borderColor: '#10b981', tension: 0.3, fill: false }
                    ]
                },
                options: this.getChartOptions('line')
            });
        }

        const profitEl = document.getElementById('chart-profit-expense');
        if (profitEl && typeof Chart !== 'undefined') {
            AppState.loadedCharts.profitChartInstance = new Chart(profitEl.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Capital Cost', 'Expenses', 'Net Profit'],
                    datasets: [{ label: 'Financial Distribution (ETB)', data: [dm.totalCostOfItemsSold, dm.operationalExpensesSum, dm.netShopProfitMargin], backgroundColor: ['#f59e0b', '#f43f5e', '#10b981'] }]
                },
                options: this.getChartOptions('bar')
            });
        }
    },

    async processProductRegistration(e) {
        e.preventDefault();
        const isEdit = !!document.getElementById('prod-id').value;
        const perm = isEdit ? 'canEditProduct' : 'canAddProduct';
        if (!AccessControl.requirePermission(perm)) return;

        const existingId = document.getElementById('prod-id').value;
        const id = existingId || "BAG-" + Date.now().toString().slice(-6);
        const item = {
            id, barcode: document.getElementById('prod-barcode').value,
            name: document.getElementById('prod-name').value,
            category: document.getElementById('prod-category').value,
            brand: document.getElementById('prod-brand').value,
            color: document.getElementById('prod-color').value || '',
            size: document.getElementById('prod-size').value || '',
            qty: parseInt(document.getElementById('prod-qty').value) || 0,
            buyPrice: parseFloat(document.getElementById('prod-buy-price').value) || 0,
            sellPrice: parseFloat(document.getElementById('prod-sell-price').value) || 0,
            image: document.getElementById('prod-image').value || "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200",
            lastModifiedBy: AppState.currentUserEmail,
            lastModifiedAt: new Date().toISOString()
        };

        try {
            await DataService.setDocument('products', id, item);
            const idx = LocalDatabase.tables.products.findIndex(p => p.id === id);
            if (idx > -1) LocalDatabase.tables.products[idx] = item;
            else LocalDatabase.tables.products.push(item);

            await ActivityLogger.log(
                isEdit ? ActivityLogger.ACTIONS.PRODUCT_EDITED : ActivityLogger.ACTIONS.PRODUCT_ADDED,
                `${isEdit ? 'Updated' : 'Added'} product: ${item.name} (Qty: ${item.qty})`,
                { productId: id, productName: item.name }
            );

            this.calculateBusinessMetrics();
            this.renderInventoryTable();
            this.renderPOSCatalog();
            document.getElementById('product-modal')?.classList.add('hidden');
        } catch (err) {
            alert("ቦርሳውን ማስቀመጥ አልተቻለም። እባክዎ እንደገና ይሞክሩ።");
        }
    },

    renderInventoryTable() {
        const tbody = document.getElementById('inventory-table-body');
        if (!tbody) return;
        tbody.innerHTML = "";
        const canEdit = AccessControl.hasPermission('canEditProduct');
        const canDelete = AccessControl.hasPermission('canDeleteProduct');

        LocalDatabase.tables.products.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${p.image}" class="table-product-img" style="width:40px;height:40px;object-fit:cover;"></td>
                <td><code>${p.barcode}</code></td>
                <td><strong>${p.name}</strong></td>
                <td>${p.category} / ${p.brand}</td>
                <td><span class="text-bold" style="color:${p.qty <= 5 ? 'red' : 'inherit'}">${p.qty} Pcs</span></td>
                <td class="text-warning text-bold">${p.buyPrice.toFixed(2)} ETB</td>
                <td class="text-success text-bold">${p.sellPrice.toFixed(2)} ETB</td>
                <td>
                    ${canEdit ? `<button class="btn btn-primary btn-sm action-edit" data-id="${p.id}">ያስተካክሉ</button>` : ''}
                    ${canDelete ? `<button class="btn btn-danger btn-sm action-delete" data-id="${p.id}">ሰርዝ</button>` : ''}
                </td>
            `;

            row.querySelector('.action-edit')?.addEventListener('click', () => {
                if (!AccessControl.requirePermission('canEditProduct')) return;
                document.getElementById('prod-id').value = p.id;
                document.getElementById('prod-barcode').value = p.barcode;
                document.getElementById('prod-name').value = p.name;
                document.getElementById('prod-category').value = p.category;
                document.getElementById('prod-brand').value = p.brand;
                document.getElementById('prod-color').value = p.color || '';
                document.getElementById('prod-size').value = p.size || '';
                document.getElementById('prod-qty').value = p.qty;
                document.getElementById('prod-buy-price').value = p.buyPrice;
                document.getElementById('prod-sell-price').value = p.sellPrice;
                document.getElementById('prod-image').value = p.image;
                document.getElementById('product-modal')?.classList.remove('hidden');
            });

            row.querySelector('.action-delete')?.addEventListener('click', async () => {
                if (!AccessControl.requirePermission('canDeleteProduct')) return;
                if (!confirm("ይህንን ቦርሳ ከሲስተሙ ላይ መሰረዝ ይፈልጋሉ?")) return;
                try {
                    await DataService.deleteDocument('products', p.id);
                    await ActivityLogger.log(ActivityLogger.ACTIONS.PRODUCT_DELETED, `Deleted product: ${p.name}`, { productId: p.id });
                    LocalDatabase.tables.products = LocalDatabase.tables.products.filter(x => x.id !== p.id);
                    this.calculateBusinessMetrics();
                    this.renderInventoryTable();
                    this.renderPOSCatalog();
                } catch (err) { alert("መሰረዝ አልተቻለም።"); }
            });

            tbody.appendChild(row);
        });
    },

    renderPOSCatalog() {
        const grid = document.getElementById('pos-catalog-grid');
        if (!grid) return;
        const search = document.getElementById('pos-search-input')?.value.toLowerCase() || "";
        const cat = document.getElementById('pos-category-filter')?.value || "";
        grid.innerHTML = "";

        const cats = [...new Set(LocalDatabase.tables.products.map(p => p.category))];
        const sel = document.getElementById('pos-category-filter');
        if (sel) { sel.innerHTML = `<option value="">ሁሉም ዘርፎች</option>`; cats.forEach(c => sel.innerHTML += `<option value="${c}">${c}</option>`); if (cat) sel.value = cat; }

        const custSel = document.getElementById('pos-customer-select');
        if (custSel) { custSel.innerHTML = `<option value="walk-in">መደበኛ ደንበኛ</option>`; LocalDatabase.tables.customers.forEach(c => custSel.innerHTML += `<option value="${c.id}">${c.name}</option>`); }

        LocalDatabase.tables.products.forEach(p => {
            if ((p.name.toLowerCase().includes(search) || p.barcode.includes(search)) && (!cat || p.category === cat)) {
                const card = document.createElement('div');
                card.className = "pos-item-card";
                card.innerHTML = `<img src="${p.image}" alt="${p.name}"><h5>${p.name}</h5><span class="text-success text-bold">${p.sellPrice.toFixed(2)} ETB</span><br><small class="text-muted">ክምችት: ${p.qty}</small>`;
                card.addEventListener('click', () => this.addItemToPOSCart(p));
                grid.appendChild(card);
            }
        });
    },

    addItemToPOSCart(product) {
        if (product.qty <= 0) return alert("ይህ ቦርሳ ክምችት ላይ አልቋል!");
        const exist = AppState.posCart.find(c => c.id === product.id);
        if (exist) {
            if (exist.quantity + 1 > product.qty) return alert("ከተረፈው የክምችት መጠን በላይ መሸጥ አይቻልም!");
            exist.quantity++;
        } else {
            AppState.posCart.push({ ...product, quantity: 1 });
        }
        this.renderPOSCartList();
    },

    renderPOSCartList() {
        const box = document.getElementById('pos-cart-manifest');
        if (!box) return;
        box.innerHTML = "";
        AppState.posCart.forEach((item, i) => {
            const row = document.createElement('div');
            row.className = 'cart-row';
            row.innerHTML = `<div><span class="text-bold" style="font-size:0.85rem">${item.name}</span><br><small class="text-success">${item.sellPrice} ETB</small></div><div class="text-bold">x${item.quantity}</div><button class="btn btn-danger btn-remove" onclick="window.ejectCartItem(${i})">-</button>`;
            box.appendChild(row);
        });
        this.calculateCartTotals();
    },

    calculateCartTotals() {
        let sub = 0;
        AppState.posCart.forEach(i => sub += (i.sellPrice * i.quantity));
        const disc = parseFloat(document.getElementById('pos-discount')?.value) || 0;
        const total = sub - (sub * (disc / 100));
        document.getElementById('pos-subtotal') && (document.getElementById('pos-subtotal').innerText = sub.toFixed(2) + " ETB");
        document.getElementById('pos-grand-total') && (document.getElementById('pos-grand-total').innerText = total.toFixed(2) + " ETB");
    },

    async executePOSCheckoutTransaction() {
        if (AppState.posCart.length === 0) return alert("እባክዎ መጀመሪያ ዕቃ ወደ ካርቱ ይጨምሩ!");
        const btn = document.getElementById('pos-complete-order');
        if (btn) btn.disabled = true;

        try {
            let cogs = 0;
            const updates = [];
            const soldItems = [];

            AppState.posCart.forEach(c => {
                const master = LocalDatabase.tables.products.find(p => p.id === c.id);
                if (master) { master.qty -= c.quantity; updates.push(DataService.updateDocument('products', master.id, { qty: master.qty })); }
                cogs += (c.buyPrice * c.quantity);
                soldItems.push({ name: c.name, qty: c.quantity, price: c.sellPrice });
            });

            const grand = parseFloat(document.getElementById('pos-grand-total')?.innerText) || 0;
            const profit = grand - cogs;
            const txnId = "TXN-" + Date.now().toString().slice(-5);
            const txn = { id: txnId, dateTimestamp: new Date().toISOString(), grandTotal: grand, totalCostBasis: cogs, profit, soldBy: AppState.currentUserEmail, soldByRole: AppState.currentUserRole, items: soldItems };

            await Promise.all(updates);
            await DataService.setDocument('sales', txnId, txn);
            LocalDatabase.tables.sales.push(txn);

            await ActivityLogger.log(ActivityLogger.ACTIONS.SALE_COMPLETED, `Sale: ${txnId} — ${grand.toFixed(2)} ETB`, { transactionId: txnId, amount: grand, items: soldItems });

            alert(`💰 ሽያጩ ተጠናቋል!\n${txnId} | ${grand.toFixed(2)} ETB | ትርፍ: ${profit.toFixed(2)} ETB`);
            AppState.posCart = [];
            this.calculateBusinessMetrics();
            this.renderPOSCartList();
            this.renderPOSCatalog();
            this.renderInventoryTable();
        } catch (err) {
            alert("ሽያጩን ማጠናቀቅ አልተቻለም።");
        } finally { if (btn) btn.disabled = false; }
    },

    async processExpenseRegistration(e) {
        e.preventDefault();
        if (!AccessControl.requirePermission('canAddExpense')) return;
        const exp = {
            date: new Date().toLocaleDateString(),
            category: document.getElementById('exp-category').value,
            desc: document.getElementById('exp-desc').value,
            amount: parseFloat(document.getElementById('exp-amount').value) || 0,
            recordedBy: AppState.currentUserEmail,
            recordedAt: new Date().toISOString()
        };
        try {
            const id = await DataService.addDocument('expenses', exp);
            LocalDatabase.tables.expenses.push({ id, ...exp });
            await ActivityLogger.log(ActivityLogger.ACTIONS.EXPENSE_ADDED, `Expense: ${exp.category} — ${exp.amount.toFixed(2)} ETB`, { expenseId: id, category: exp.category, amount: exp.amount });
            this.calculateBusinessMetrics();
            this.renderExpenseTable();
            document.getElementById('expense-modal')?.classList.add('hidden');
        } catch (err) { alert("ወጪውን ማስቀመጥ አልተቻለም።"); }
    },

    renderExpenseTable() {
        const tbody = document.getElementById('expense-table-body');
        if (!tbody) return;
        tbody.innerHTML = "";
        LocalDatabase.tables.expenses.forEach(e => {
            tbody.innerHTML += `<tr><td>${e.date}</td><td><span class="badge role-badge">${e.category}</span></td><td>${e.desc}</td><td class="text-danger text-bold">${e.amount.toFixed(2)} ETB</td></tr>`;
        });
    },

    async processCustomerRegistration(e) {
        e.preventDefault();
        if (!AccessControl.requirePermission('canAddCustomer')) return;
        const id = "CUST-" + Date.now().toString().slice(-3);
        const cust = { id, name: document.getElementById('cust-name').value, phone: document.getElementById('cust-phone').value, count: 0, total: 0, registeredBy: AppState.currentUserEmail, registeredAt: new Date().toISOString() };
        try {
            await DataService.setDocument('customers', id, cust);
            LocalDatabase.tables.customers.push(cust);
            await ActivityLogger.log(ActivityLogger.ACTIONS.CUSTOMER_ADDED, `Customer: ${cust.name}`, { customerId: id });
            this.renderCustomerTable();
            this.renderPOSCatalog();
            document.getElementById('customer-modal')?.classList.add('hidden');
        } catch (err) { alert("ደንበኛውን ማስቀመጥ አልተቻለም።"); }
    },

    renderCustomerTable() {
        const tbody = document.getElementById('customer-table-body');
        if (!tbody) return;
        tbody.innerHTML = "";
        LocalDatabase.tables.customers.forEach(c => {
            tbody.innerHTML += `<tr><td><code>${c.id}</code></td><td><strong>${c.name}</strong></td><td>${c.phone}</td><td>${c.count}</td><td class="text-success text-bold">${c.total.toFixed(2)} ETB</td></tr>`;
        });
    },

    async renderActivityLog() {
        const tbody = document.getElementById('activity-log-table-body');
        if (!tbody) return;
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;"><i class="fa-solid fa-circle-notch fa-spin"></i> መረጃ በመጫን ላይ...</td></tr>`;

        try {
            const fUser = document.getElementById('actlog-filter-user')?.value || "";
            const fAction = document.getElementById('actlog-filter-action')?.value || "";
            const filters = {}; if (fUser) filters.userId = fUser; if (fAction) filters.action = fAction;
            const logs = await DataService.loadActivityLogs(filters);
            this.updateUserFilter(logs);

            tbody.innerHTML = "";
            if (logs.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6"><div class="activity-empty-state"><i class="fa-solid fa-clipboard-list"></i><p>ምንም የድርጊት መዝገብ አልተገኘም።</p></div></td></tr>`;
                return;
            }

            const labels = { sale: 'ሽያጭ (Sale)', product_add: 'እቃ መጨመር (Add)', product_edit: 'እቃ ማስተካከል (Edit)', product_delete: 'እቃ መሰረዝ (Delete)', expense_add: 'ወጪ መመዝገብ (Expense)', customer_add: 'ደንበኛ መመዝገብ (Customer)', login: 'መግባት (Login)', logout: 'መውጣት (Logout)' };

            logs.forEach(log => {
                const ts = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp || Date.now());
                const dateStr = ts.toLocaleString('en-GB', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="log-timestamp">${dateStr}</td>
                    <td><div class="log-user-cell"><div class="user-mini-avatar"><i class="fa-solid fa-user"></i></div><span>${log.userName || log.userEmail?.split('@')[0] || 'Unknown'}</span></div></td>
                    <td><span class="role-badge ${log.role}">${log.role?.toUpperCase()}</span></td>
                    <td><span class="log-action-badge ${log.action}">${labels[log.action] || log.action}</span></td>
                    <td class="log-detail-text" title="${log.details || ''}">${log.details || '-'}</td>
                    <td><code style="font-size:0.75rem;color:var(--text-muted);">${log.ipAddress || 'N/A'}</code></td>
                `;
                tbody.appendChild(row);
            });
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--brand-danger);">መረጃ መጫን ላይ ስህተት ተከስቷል።</td></tr>`;
        }
    },

    updateUserFilter(logs) {
        const sel = document.getElementById('actlog-filter-user');
        if (!sel) return;
        const cur = sel.value;
        const users = [...new Map(logs.map(l => [l.userId, { id: l.userId, name: l.userName || l.userEmail?.split('@')[0] }])).values()];
        sel.innerHTML = `<option value="">ሁሉም ተጠቃሚዎች</option>`;
        users.forEach(u => sel.innerHTML += `<option value="${u.id}">${u.name}</option>`);
        if (cur) sel.value = cur;
    },

    triggerInventoryLiveAlerts() {
        const list = document.getElementById('notification-list');
        if (!list) return;
        let count = 0;
        list.innerHTML = "";
        LocalDatabase.tables.products.forEach(p => {
            if (p.qty <= 5) {
                count++;
                list.innerHTML += `<div style="padding:10px;border-bottom:1px solid #ccc;font-size:0.8rem;color:red;">🔔 <strong>${p.name}</strong> (${p.qty} ቁርጥ ቀረ)</div>`;
            }
        });
        const badge = document.getElementById('notification-count');
        if (badge) badge.innerText = count;
    }
};

window.setLanguage = (lang) => SystemPipeline.translateInterface(lang);
window.ejectCartItem = (idx) => { AppState.posCart.splice(idx, 1); SystemPipeline.renderPOSCartList(); };
document.addEventListener('DOMContentLoaded', () => SystemPipeline.init());
