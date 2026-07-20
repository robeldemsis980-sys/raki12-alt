import { db } from "./firebase.js";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firestore Collection Reference
const bagsCollection = collection(db, "bags");

// 1. የ Login Form መቆጣጠሪያ (ገጹ Refresh እንዳያደርግ Prevent ማድረጊያ)
const loginForm = document.getElementById("login-form") || document.querySelector("form");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // ገጹ Refresh እንዳያደርግ ይከለክላል
    
    // የሜኑ/ዳሽቦርድ ገጹን ማሳየት (Dashboard View ማብራት)
    const loginSection = document.getElementById("login-section") || document.querySelector(".login-container");
    const mainDashboard = document.getElementById("main-dashboard") || document.getElementById("dashboard");

    if (loginSection) loginSection.style.display = "none";
    if (mainDashboard) mainDashboard.style.display = "block";

    loadBags(); // እቃዎችን ከ Cloud መጫን
  });
}

// 2. እቃዎችን ከ Firestore ማምጫ function
async function loadBags() {
  const bagList = document.getElementById("bag-list");
  if (!bagList) return;
  
  bagList.innerHTML = "<p>መረጃዎች በመጫን ላይ ናቸው...</p>";

  try {
    const querySnapshot = await getDocs(bagsCollection);
    bagList.innerHTML = "";

    if (querySnapshot.empty) {
      bagList.innerHTML = "<p>ምንም የተመዘገበ ዕቃ የለም።</p>";
      return;
    }

    querySnapshot.forEach((docSnap) => {
      const bag = docSnap.data();
      const id = docSnap.id;

      const bagCard = document.createElement("div");
      bagCard.className = "bag-card";
      bagCard.innerHTML = 
        <img src="${bag.imageUrl || 'https://via.placeholder.com/150'}" alt="${bag.name}">
        <h3>${bag.name}</h3>
        <p>ዋጋ፦ ${bag.price} ብር</p>
        <button onclick="deleteBag('${id}')" class="btn-delete">ሰርዝ</button>
      ;
      bagList.appendChild(bagCard);
    });
  } catch (error) {
    console.error("Error fetching bags: ", error);
    bagList.innerHTML = "<p>መረጃዎችን ማምጣት አልተቻለም።</p>";
  }
}

// 3. አዲስ እቃ መጨመሪያ Form Event Listener
const bagForm = document.getElementById("bag-form");
if (bagForm) {
  bagForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("bag-name");
    const priceInput = document.getElementById("bag-price");
    const imageInput = document.getElementById("bag-image");

    if (!nameInput || !priceInput) return;

    try {
      await addDoc(bagsCollection, {
        name: nameInput.value,
        price: Number(priceInput.value),
        imageUrl: imageInput ? imageInput.value : '',
        createdAt: new Date()
      });

      bagForm.reset();
      loadBags();
      alert("ዕቃው በስኬት ተመዝግቧል!");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("ዕቃውን መመዝገብ አልተቻለም፤ እባክዎ ድጋሚ ይሞክሩ።");
    }
  });
}

// 4. እቃ የመሰረዝ function
window.deleteBag = async function(id) {
  if (confirm("እርግጠኛ ነዎት ይህን ዕቃ መሰረዝ ይፈልጋሉ?")) {
    try {
      await deleteDoc(doc(db, "bags", id));
      loadBags();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }
};

// ገጹ እንደተከፈተ ዳታዎችን መጫን
document.addEventListener("DOMContentLoaded", loadBags);
