const productListElement = $(".product-lists")[0];

// '1,000'
fetch("http://localhost:4000/knifes")
    .then((res) => res.json())
    .then((data) => {
        const html = data.map((knife) => {
            return `<div class="col-lg-4 col-md-6 text-center">
            <div class="single-product-item">
              <div class="product-image">
                <a href="/client/product-detail.html?id=${knife.id}"
                  ><img src="${knife.img_url}" height="261px" alt=""
                /></a>
              </div>
              <h3>${knife.market_hash_name}</h3>
              <p class="product-price">
                <span class="product-description mb-3" id="description">${knife.description}</span>
                ${numeral(knife.price).format('0,0').replaceAll(",", ".")} đ
              </p>
              <a href="#" class="cart-btn"><i class="fas fa-shopping-cart"></i> Chi tiết</a>
            </div>
          </div>
          `
        }).join("");
        productListElement.innerHTML = html;
    })