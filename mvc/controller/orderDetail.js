$(document).ready(() => {
  const orderResultElement = $("#order-result")[0];
  const url = new URL(window.location.href);
  const id = url.searchParams.get("id");

  axios
    .get(`http://localhost:4000/orders/${id}`)
    .then((res) => res.data)
    .then((data) => data.listProduct)
    .then((orders) => {
      const html = orders
        .map((order) => {
          return `<tr>
            <td>
              <div class="d-flex px-2">
                <div>
                  <img
                    src=${order.img_url}
                    class="avatar avatar-sm rounded-circle me-2"
                    alt="spotify"
                  />
                </div>
                <div class="my-auto">
                  <h6 class="mb-0 text-sm">
                    ${order.market_hash_name}
                  </h6>
                </div>
              </div>
            </td>
            <td>
              <p class="text-sm font-weight-bold mb-0">
                ${numeral(order.price).format("0,0").replaceAll(",", ".")} đ
              </p>
            </td>
            <td class="align-middle text-center text-sm">
                <span class="text-secondary text-xs font-weight-bold"
                >${order.amount}</span
                >
            </td>
            <td style="text-align: center">
                <span class="text-secondary text-xs font-weight-bold"
                >${numeral(order.price * order.amount).format("0,0").replaceAll(",", ".")} đ</span
                >
            </td>
          </tr>`;
        })
        .join("");
      orderResultElement.innerHTML = html;
    });
});
