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
    e.preventDefault();

    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("በስኬት ገብተዋል!");
      
      const loginSection = document.getElementById("login-section") || document.querySelector(".login-container");
      const mainDashboard = document.getElementById("main-dashboard") || document.getElementById("dashboard");

      if (loginSection) loginSection.style.display = "none";
      if (mainDashboard) mainDashboard.style.display = "block";

      loadBags();
    } catch (error) {
      console.error("Login Error:", error);
      alert("መግባት አልተቻለም! እባክዎ ኢሜይል እና ፓስወርድዎን ያረጋግጡ።");
    }
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
      
      const img = document.createElement("img");
      img.src = bag.imageUrl || "https://via.placeholder.com/150";
      img.alt = bag.name || "Bag";

      const title = document.createElement("h3");
      title.textContent = bag.name;

      const price = document.createElement("p");
      price.textContent = ዋጋ፦ ${bag.price} ብር;

      const delBtn = document.createElement("button");
      delBtn.className = "btn-delete";
      delBtn.textContent = "ሰርዝ";
      delBtn.onclick = () => deleteBag(id);

      bagCard.appendChild(img);
      bagCard.appendChild(title);
      bagCard.appendChild(price);
      bagCard.appendChild(delBtn);

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
