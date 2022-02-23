class Cart {
  constructor() {
    this.store = JSON.parse(localStorage.getItem("cart")) || [];
  }

  getCart() {
    return this.store;
  }

  addCart(id, data) {
    // Check sản phẩm đã có trong giỏ hàng chưa
    const indexProductInCart = this.store.findIndex((item) => {
      return item.id === id;
    });

    // Xử lý nếu chưa sản phẩm đó chưa có trong giỏ hàng
    if (indexProductInCart === -1) {
      this.store.push({
        id,
        market_hash_name: data.market_hash_name,
        amount: data.amount,
        price: data.price,
        img_url: data.img_url,
      });
    } else {
      // Cộng vào số lượng nếu sản phẩm bị trùng
      this.store[indexProductInCart] = {
        ...this.store[indexProductInCart],
        amount: this.store[indexProductInCart].amount + data.amount,
      };
    }
    // Lưu lại vào localStorage
    this.save();
  }

  save() {
    console.log("Save is succesfully");
    localStorage.setItem("cart", JSON.stringify(this.store));
  }

  getTotal() {
    return this.store.reduce((acc, cur, index) => {
      return acc + cur.price * cur.amount;
    }, 0);
  }

  removeCart(id) {
    const indexProductInCart = this.store.findIndex((item) => {
      return item.id === id;
    });

    // Ref type
    this.store.splice(indexProductInCart, 1);
    this.save();
    cart.renderCart();
    cart.renderTotalCheckOut();
  }

  changeTotal(element) {
    element.innerHTML = numeral(cart.getTotal()).format("0,0").replaceAll(",", ".") + " đ";
  }

  changeAmount(id, element) {
    // Check sản phẩm đã có trong giỏ hàng chưa
    const indexProductInCart = this.store.findIndex((item) => {
      return item.id === id;
    });

    this.store[indexProductInCart] = {
      ...this.store[indexProductInCart],
      amount: +element.value, // + để ép kiểu nhanh
    };

    this.save();
    this.renderCart();
    this.renderTotalCheckOut();
  }

  renderCart() {
    const cartElement = $("#cart")[0];
    const html = this.store
      .map((product) => {
        return `<tr class="table-body-row">
        <td class="product-remove"><a onclick="handleRemove('${
          product.id
        }', this)"><i class="far fa-window-close"></i></a></td>
        <td class="product-image"><img src="${product.img_url}" alt=""></td>
        <td class="product-name">${product.market_hash_name}</td>
        <td class="product-price">${numeral(product.price)
          .format("0,0")
          .replaceAll(",", ".")} đ</td>
        <td class="product-quantity"><input min="1" type="number" onchange="handleChangeAmount('${
          product.id
        }', this)" value="${product.amount}"></td>
        <td class="product-total">${numeral(product.price * product.amount)
          .format("0,0")
          .replaceAll(",", ".")} đ</td>
    </tr>`;
      })
      .join("");

    cartElement.innerHTML = html;
  }

  renderTotalCheckOut() {
    const totalElement = $("#total")[0];
    totalElement.innerHTML = numeral(cart.getTotal()).format("0,0").replaceAll(",", ".") + " đ";
  }
}

const cart = new Cart();

cart.renderCart();
cart.renderTotalCheckOut();

const handleRemove = (id, element) => {
  const trElement = element.parentElement.parentElement;
  cart.removeCart(id);
  trElement.remove();
  // this.save();

  // Thay đổi tổng tiền
  cart.changeTotal(totalElement);
};

const handleChangeAmount = (id, element) => {
  if (element.value <= 0) {
    element.value = 1;
  }
  cart.changeAmount(id, element);
};
