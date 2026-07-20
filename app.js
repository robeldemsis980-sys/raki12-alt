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

// 1. ቦርሳዎችን ከ Firebase Firestore ማምጫ function
async function loadBags() {
  const bagList = document.getElementById("bag-list");
  if (!bagList) return;
  
  bagList.innerHTML = "<p>Loading...</p>";

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
        <p>ብዛት፦ ${bag.quantity || 1}</p>
        <button onclick="deleteBag('${id}')" class="btn-delete">ሰርዝ</button>
      ;
      bagList.appendChild(bagCard);
    });
  } catch (error) {
    console.error("Error fetching bags: ", error);
    bagList.innerHTML = "<p>መረጃዎችን ማምጣት አልተቻለም።</p>";
  }
}

// 2. አዲስ ቦርሳ ወደ Firebase መጨመሪያ Form Event Listener
const bagForm = document.getElementById("bag-form");
if (bagForm) {
  bagForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("bag-name").value;
    const price = document.getElementById("bag-price").value;
    const imageUrl = document.getElementById("bag-image").value;

    try {
      await addDoc(bagsCollection, {
        name: name,
        price: Number(price),
        imageUrl: imageUrl,
        createdAt: new Date()
      });

      bagForm.reset();
      loadBags(); // ዝርዝሩን ማደስ
      alert("ዕቃው በስኬት ተመዝግቧል!");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("ዕቃውን መመዝገብ አልተቻለም፤ እባክዎ ድጋሚ ይሞክሩ።");
    }
  });
}

// 3. ቦርሳ የመሰረዝ function (Global Window Scope ላይ ማድረግ)
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

// ገጹ ሲከፈት መረጃዎችን ሎድ ማድረግ
document.addEventListener("DOMContentLoaded", loadBags);
