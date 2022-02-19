const url_string = window.location.href; //window.location.href
const url = new URL(url_string);
const id = url.searchParams.get("id");
const productDetailElement = $("#product-detail")[0]
console.log(productDetailElement)

axios.get(`http://localhost:4000/knifes/${id}`)
    .then(res => res.data)
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
              <p class="single-product-pricing">${numeral(data.price).format('0,0').replaceAll(",", ".")} đ</p>
              <p>
                ${data.description}
              </p>
              <div class="single-product-form">
                <form action="index.html">
                  <input type="number" value="1">
                </form>
                <a href="cart.html" class="cart-btn"><i class="fas fa-shopping-cart"></i> Add to Cart</a>
                <p><strong>Categories: </strong>Fruits, Organic</p>
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
      </div>`
      productDetailElement.innerHTML = html;
    })