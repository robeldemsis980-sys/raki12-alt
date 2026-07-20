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
  price.textContent = "ዋጋ: " + bag.price + " ብር";

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
