import { db } from "./firebase.js";
import { 
  getAuth, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const auth = getAuth();
const bagsCollection = collection(db, "bags");

// 1. የ Login መቆጣጠሪያ
const loginForm = document.querySelector("form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // ገጹ Refresh እንዳያደርግ መከልከል

    // በኢሜይል እና ፓስወርድ ሳጥን ውስጥ ያሉትን ጽሑፎች ማግኘት
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      // ወደ Firebase Login ለማድረግ መሞከር
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert("በስኬት ገብተዋል!");
      
      // Login section ን መሸሸግ እና ዋናውን ገጽ ማሳየት
      document.body.classList.add("logged-in");
      
      // የሎጊን ፎርም ካለ መሸሸግ
      const modal = document.querySelector(".modal") || document.querySelector(".login-container");
      if (modal) modal.style.display = "none";

      loadBags();
    } catch (error) {
      console.error("Login Error:", error);
      alert("መግባት አልተቻለም! እባክዎ ኢሜይል እና ፓስወርድዎን ያረጋግጡ። Error: " + error.message);
    }
  });
}

// 2. እቃዎችን ማምጫ function
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
  }
}

// 3. እቃ የመሰረዝ function
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
