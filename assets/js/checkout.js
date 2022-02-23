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
  }

  changeTotal(element) {
    element.innerHTML = numeral(cart.getTotal()).format("0,0").replaceAll(",", ".") + " đ";
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
          <td class="product-quantity"><input type="number" value="${product.amount}"></td>
          <td class="product-total">${numeral(product.price * product.amount)
            .format("0,0")
            .replaceAll(",", ".")} đ</td>
      </tr>`;
      })
      .join("");

    cartElement.innerHTML = html;
  }

  renderCartDetail() {
    const cartElement = $("#order-details")[0];
    const html = this.store
      .map((item) => {
        return `<tr>
        <td>${item.market_hash_name}</td>
        <td>${numeral(item.price * item.amount)
          .format("0,0")
          .replaceAll(",", ".")} đ</td>
    </tr>`;
      })
      .join("");

    cartElement.innerHTML = html;
  }

  renderTotalCartDetail() {
    const total = $("#total")[0];
    total.innerHTML = numeral(this.getTotal()).format("0,0").replaceAll(",", ".") + " đ";
  }

  clear() {
    this.store = [];
    this.save();
  }
}

const cart = new Cart();
cart.renderCartDetail();
cart.renderTotalCartDetail();

// Check if order empty remove btn
const handleOrder = () => {
  const orderBtn = $("#orderBtn")[0];
  if(cart.getCart().length === 0) {
    orderBtn.remove();
  }
}

handleOrder();

const handlePayment = () => {
  const orderElement = $("#order")[0];

  // GET VALUE FORM
  const fullName = $("[name= 'fullName']")[0];
  const email = $("[name = 'email']")[0];
  const address = $("[name = 'address']")[0];
  const phone = $("[name = 'phone']")[0];
  const request = $("[name = 'request']")[0];

  // Err Msg 
  const fullNameErrMsg = $("#fullNameErrMsg")[0];
  const emailErrMsg = $("#emailErrMsg")[0];
  const addressErrMsg = $("#addressErrMsg")[0];
  const phoneErrMsg = $("#phoneErrMsg")[0];

  // Clear msg 
  fullNameErrMsg.innerHTML = "";
  emailErrMsg.innerHTML = "";
  addressErrMsg.innerHTML = "";
  phoneErrMsg.innerHTML = "";

  // Validate form
  if(!fullName.value || !email.value || !address.value || !phone.value) {
    if(!fullName.value) {
      fullNameErrMsg.innerHTML = "Vui lòng nhập trường này";
    }
  
    if(!email.value) {
      emailErrMsg.innerHTML = "Vui lòng nhập trường này";
    }

    if(!address.value) {
      addressErrMsg.innerHTML = "Vui lòng nhập trường này";
    }
    
    if(!phone.value) {
      phoneErrMsg.innerHTML = "Vui lòng nhập trường này";
    }

    // Validate email
    if(!email.value.match(/(.+)@(.+){2,}\.(.+){2,}/)) { 
      emailErrMsg.innerHTML = "Không đúng định dạng email";
    }

    return;
  }

  axios.post("http://localhost:4000/orders", {
    fullName: fullName.value,
    email: email.value,
    address: address.value,
    phone: phone.value,
    request: request.value,
    total: cart.getTotal(),
    listProduct: cart.getCart(),
  });

  orderElement.reset();
  cart.clear();
  cart.renderCartDetail();
  cart.renderTotalCartDetail();
  handleOrder();

  Toastify({
    text: "Đặt hàng thành công",
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
};
