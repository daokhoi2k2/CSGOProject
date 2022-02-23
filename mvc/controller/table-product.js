const tbodyResultElement = $("#tbody-result")[0];

axios
  .get("http://localhost:4000/knifes")
  .then((res) => res.data)
  .then((data) => {
    const result = data.map((product) => {
      return `<tr>
                  <td>
                    <div class="d-flex px-2">
                      <div>
                        <img
                          src=${product.img_url}
                          class="avatar avatar-sm rounded-circle me-2"
                          alt="spotify"
                        />
                      </div>
                      <div class="my-auto">
                        <h6 class="mb-0 text-sm">
                          ${product.market_hash_name}
                        </h6>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="text-sm font-weight-bold mb-0">
                      ${numeral(product.price).format('0,0').replaceAll(",", ".")}
                    </p>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <span class="badge badge-sm bg-gradient-success"
                      >Success</span
                    >
                  </td>
                  <td class="align-middle text-center">
                    <div
                      class="d-flex align-items-center justify-content-center"
                    >
                      <span class="me-2 text-xs font-weight-bold"
                        >${product.volume}</span
                      >
                      <div>
                        <div class="progress">
                          <div
                            class="progress-bar bg-gradient-warning"
                            role="progressbar"
                            aria-valuenow="1"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style="width: ${product.volume}%"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle">
                    <button class="btn btn-link text-secondary mb-0">
                      <i class="fa fa-ellipsis-v text-xs"></i>
                    </button>
                  </td>
                </tr>`;
    });
    tbodyResultElement.innerHTML = result.join("");
  });

const totalOrder = $("#totalOrder")[0];
const orderAmount = $("#orderAmount")[0];
axios.get("http://localhost:4000/orders")
  .then((res) => res.data)
  .then((data) => {
    const total = data.reduce((acc, cur) => {
      return acc + cur.total;
    }, 0);

    orderAmount.innerHTML = data.length;
    totalOrder.innerHTML = numeral(total).format('0,0').replaceAll(",", ".") + " đ";
  })