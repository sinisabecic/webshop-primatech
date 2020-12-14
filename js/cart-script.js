//! Storage controller
const StorageCtrl = (function () {
  //
  return {
    getStorageItems: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },

    storeItem: function (item) {
      let items;

      if (localStorage.getItem("items") === null) {
        items = [];
        //! Ako prvi element ubacamo on se nece ubaciti. Zato nam je potreban ovaj dio.
        items.push(item);

        localStorage.setItem("items", JSON.stringify(items));
        //
      } else {
        items = JSON.parse(localStorage.getItem("items"));

        items.push(item);

        localStorage.setItem("items", JSON.stringify(items));
      }
    },

    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
  };
})();
//TODO
//! Item controller
//? Za stavke
//
const ItemCtrl = (function () {
  //
  //* Item constructor
  //
  const Item = function (id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  };

  //
  const data = {
    // items: [],
    items: StorageCtrl.getStorageItems(),
    currentItem: null,
    totalprice: 0,
  };

  //* Public methods
  //? Moze i bez da je definisemo kao funkciju
  return {
    getItems: function () {
      return data.items;
    },

    //? (name.value, price.value)
    addItem: function (name, price) {
      let ID;

      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      price = parseInt(price);

      newItem = new Item(ID, name, price);

      data.items.push(newItem);

      return newItem;
    },

    getCurrentItem: function () {
      return data.currentItem;
    },

    //? Ovdje mi samo dodjeljujemo vrijednost currentItem-u. Popunjavamo ga
    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    getItemById: function (id) {
      let found = null;

      data.items.forEach((item) => {
        if (item.id === id) {
          found = item; //? Daj mi citav item
        }
      });
      return found;
    },

    deleteItem: function (id) {
      //* Daj mi sve id-je
      const ids = data.items.map((item) => {
        return item.id;
      });

      const index = ids.indexOf(id);

      //? Brisanje elemenata iz niza
      data.items.splice(index, 1);
    },

    getTotalprice: function () {
      let total = 0;

      data.items.forEach((item) => {
        total += item.price;
      });

      data.totalprice = total;

      return data.totalprice;
    },

    logData: function () {
      return data;
    },
  };
})();

//
//! UI controller
//? Za izgled
//
const UICtrl = (function () {
  //
  const UISelectors = {
    //* Korpa
    cartQty: ".cd-qty",
    cartTitle: ".cd-title",
    cartItemPrice: ".cd-price",
    cartAddBtn: ".add-to-cart-btn",
    cartItemRemove: ".cd-item-remove",
    cartFullPrice: ".cd-total-price",
    itemList: "#item-list",
    listItems: "#item-list .collection-item",
    cart: "#cd-cart",

    //* Proizvodi
    itemName: ".card-title",
    itemPrice: ".price",
    addBtn: "#add-to-cart-btn",
  };

  return {
    getSelectors: function () {
      return UISelectors;
    },

    populateItemList: function (items) {
      let html = "";

      items.forEach((item) => {
        html += `
          <li class="cd-cart-items" data-id="${item.id}">
          <span class="cd-qty">1x</span>
                <a href="#" class="cd-title">${item.name}</a>
                <div class="cd-price">${item.price} <span>&euro;</span></div>
                <a href="#" class="cd-item-remove"></a>
        </li>`;

        document.querySelector(UISelectors.itemList).innerHTML = html;
      });
    },

    addListItem: function (item) {
      document.querySelector(UISelectors.itemList).style.display = "block";
      //
      const li = document.createElement("li");
      li.className = "cd-cart-items collection-item";

      li.dataset.id = item.id; //? data-id

      //* Add HTML
      li.innerHTML = `<span class="cd-qty">1x</span>
                <a href="#" class="cd-title">${item.name}</a>
                <div class="cd-price">${item.price} <span>&euro;</span></div>
                <a href="#" class="cd-item-remove"></a>`;

      //* Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },

    deleteListItem: function (id) {
      //
      const itemID = `[data-id="${id}"]`;
      const item = document.querySelector(itemID);

      item.remove();
    },

    showTotalprice: function (total) {
      document.querySelector(UISelectors.cartFullPrice).textContent = total;
    },
  };
})();

//! App controller
//? glavni kontroler koji ce pozivati ove druge kontrolere
//
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  //
  //* Load event listeners
  //
  const loadEventListeners = function () {
    //

    const UISelectors = UICtrl.getSelectors();

    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemDeleteSubmit);
  };

  //! end loadEventListeners()  //

  const itemAddSubmit = function (e) {
    const name =
      e.target.previousElementSibling.previousElementSibling
        .previousElementSibling.innerText;

    const price =
      e.target.previousElementSibling.previousElementSibling.innerText;

    if (name !== "" && price !== "") {
      //
      const newItem = ItemCtrl.addItem(name, price);
      console.log(newItem);

      const addedItem = UICtrl.addListItem(newItem);

      const totalprice = ItemCtrl.getTotalprice();
      UICtrl.showTotalprice(totalprice);

      const addedStorageItem = StorageCtrl.storeItem(newItem);

      if (!newItem || !addedItem || !addedStorageItem) {
        alertify.success("Dodato!");
      } else {
        alertify.error("Greska. pokusajte ponovo!");
      }
    }
    e.preventDefault();
  };

  const itemDeleteSubmit = function (e) {
    if (e.target.classList.contains("cd-item-remove")) {
      const listId = e.target.parentNode.dataset.id; //? getAttribute('data-id')

      const id = parseInt(listId);
      console.log(document.querySelector(`[data-id="${id}"]`)); //? DOM element

      const itemForDelete = ItemCtrl.getItemById(id);

      ItemCtrl.setCurrentItem(itemForDelete);
      console.log(itemForDelete);
    }

    //? Spas je sto u currentItem moze da bude samo jedan element pa je on jedinstven
    const currentItem = ItemCtrl.getCurrentItem();

    ItemCtrl.deleteItem(currentItem.id);

    UICtrl.deleteListItem(currentItem.id);

    //! Moramo ponovo da izvrsavamo ovu funkciju kako bi se obracunalo opet
    const totalCalories = ItemCtrl.getTotalprice();
    UICtrl.showTotalprice(totalCalories);

    StorageCtrl.deleteItemFromStorage(currentItem.id);

    e.preventDefault();
  };

  //
  return {
    init: function () {
      const storageItems = StorageCtrl.getStorageItems();

      //* Check if any items
      if (storageItems.length !== 0) {
        UICtrl.populateItemList(storageItems);
      }

      const totalCalories = ItemCtrl.getTotalprice();
      UICtrl.showTotalprice(totalCalories);

      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);
//
//! Inicijalizacija
App.init();

//! Testiranje

// document
//   .querySelector(".cd-item-remove" ?? "")
//   .addEventListener("click", itemDeleteSubmit);

// function itemDeleteSubmit(e) {
//   console.log(e.target);
// }
