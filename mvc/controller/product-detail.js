const url_string = window.location.href; //window.location.href
const url = new URL(url_string);
const id = url.searchParams.get("id");
const productDetailElement = $("#product-detail")[0];

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
        img_url: data.img_url
      });
    } else {
      // Cộng vào số lượng nếu sản phẩm bị trùng
      this.store[indexProductInCart] = {
        ...this.store[indexProductInCart],
        amount: this.store[indexProductInCart].amount + data.amount
      }

    }
    // Lưu lại vào localStorage
    this.save();
  }
  
  save() {
    console.log("Save is succesfully")
    localStorage.setItem("cart", JSON.stringify(this.store));
  }

  removeCart(id) {
    // this.store.findIndex((item) => {
    //   console.log("[item]", item);
    // })
  }
}

axios
  .get(`http://localhost:4000/knifes/${id}?_expand=type`)
  .then((res) => res.data)
  .then((data) => {
    const html = `<div class="container">
        <div class="row">
          <div class="col-md-5">
            <div class="single-product-img">
              <img src="${data.img_url}" alt="">
            </div>
          </div>
          <div class="col-md-7">
            <div class="single-product-content">
              <h3>${data.market_hash_name}</h3>
              <p class="single-product-pricing">${numeral(data.price)
                .format("0,0")
                .replaceAll(",", ".")} đ</p>
              <p>
                ${data.description}
              </p>
              <div class="single-product-form">
                <form action="index.html">
                  <input type="number" id="amount" value="1">
                </form>
                <a onclick="addCart('${data.id}', '${data.market_hash_name}', '${data.price}', '${data.img_url}')" class="cart-btn"><i class="fas fa-shopping-cart"></i> Thêm vào giỏ</a>
                <p><strong>Categories: </strong>${data.type.name}</p>
              </div>
              <h4>Share:</h4>
              <ul class="product-share">
                <li>
                  <a href=""><i class="fab fa-facebook-f"></i></a>
                </li>
                <li>
                  <a href=""><i class="fab fa-twitter"></i></a>
                </li>
                <li>
                  <a href=""><i class="fab fa-google-plus-g"></i></a>
                </li>
                <li>
                  <a href=""><i class="fab fa-linkedin"></i></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>`;
    productDetailElement.innerHTML = html;
  });

const cart = new Cart();
const addCart = (id, market_hash_name, price, img_url) => {
  const store = cart.getCart();
  const amountElement = $("#amount")[0];
  cart.addCart(id, {
    market_hash_name: market_hash_name,
    amount: +amountElement.value,
    price: price,
    img_url
  });

  Toastify({
    text: "Thêm sản phẩm vào giỏ hàng thành công",
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    }
  }).showToast();
  // console.log("Thêm sản phẩm", data);
};
