$(document).ready(() => {
  const orderResultElement = $("#order-result")[0];

  axios
    .get("http://localhost:4000/orders")
    .then((res) => res.data)
    .then((data) => {
      const html = data.map((item) => {
        return `<tr>
            <td>
                <div class="d-flex px-3 py-1">
                    <div class="poster">
                        <span class="text-secondary text-xs font-weight-bold"
                        >${item.fullName}</span
                        >
                    </div>
                </div>
            </td>
            <td>
                <p class="text-xs font-weight-bold mb-0">${item.address}</p>
            </td>
            <td class="align-middle text-center text-sm">
                <p class="text-xs font-weight-bold mb-0">${item.phone}</p>
            </td>
            <td class="align-middle text-center text-sm">
                <span class="text-secondary text-xs font-weight-bold"
                >${item.email}</span
                >
            </td>
            <td class="align-middle text-center text-sm">
                <span class="text-secondary text-xs font-weight-bold"
                >${numeral(item.total).format("0,0").replaceAll(",", ".") + " đ"}</span
                >
            </td>
            <td class="align-middle text-center">
                <a href="/admin/orderDetail.html?id=${item.id}" class="text-secondary text-xs font-weight-bold"
                >Chi tiết</a
                >
            </td>
        </tr>`;
      }).join("");
      orderResultElement.innerHTML = html;
    });
});
