const tbodyResultElement = $("#tbody-result")[0];

axios
  .get("http://localhost:4000/knifes")
  .then((res) => res.data)
  .then((data) => {
    const result = data.map(async (product) => {
      const resInfoSteam = await axios.get(
        `http://localhost:3000/infoItem/${encodeURI(product.market_hash_name)}`
      );
      const dataInfoSteam = resInfoSteam.data;
        console.log(dataInfoSteam)
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
                      ${dataInfoSteam.lowest_price || "Out of stock"}
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
                        >${dataInfoSteam.volume || 0}</span
                      >
                      <div>
                        <div class="progress">
                          <div
                            class="progress-bar bg-gradient-warning"
                            role="progressbar"
                            aria-valuenow="1"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style="width: ${dataInfoSteam.volume || 0}%"
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

    // Result return : [ Promise, Promise, Promise, Promise, ....] so we need use Promise.all to get value
    Promise.all(result).then((data) => {
      console.log(data);
      tbodyResultElement.innerHTML = data.join("");
    });
  });
