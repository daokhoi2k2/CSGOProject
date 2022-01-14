const removeLesson = (id, e) => {
  console.log(id, e);
  axios
    .delete(`http://localhost:4000/lessons/${id}`)
    .then((res) => {
      if (res.status === 200) {
        $(e).parent().parent().remove();
        Toastify({
          text: "Xóa thành công",
          className: "success",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          gravity: "bottom",
        }).showToast();
      }
    })
    .catch((err) => {
      Toastify({
        text: "Có lỗi xảy ra",
        className: "danger",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        gravity: "bottom",
      }).showToast();
    });
};

$(document).ready(() => {
  const lessonResultElement = $("#lesson-result")[0];
  const serverElement = $("#tickrate")[0];
  const selectMapElement = $("#selectMap")[0];
  const searchText = $("#searchTextLesson")[0];

  class filterLesson {
    constructor(map = "", server = "", searchValue = "") {
      this.map = map;
      this.server = server;
      this.searchValue = searchValue;
    }

    onfilter = async (map, server, searchValue) => {
      const res = await axios.get(
        "http://localhost:4000/lessons?_expand=map&&_expand=tickrate"
      );
      let result = res.data;

      // Filter server
      if (server != "") {
        result = result.filter((item) => {
          return item.tickrateId === server;
        });
      }

      if (map != "") {
        result = result.filter((item) => {
          return item.mapId === map;
        });
      }

      if (searchValue != "") {
        result = result.filter((item) => {
          const pattern = `${searchValue.toLowerCase()}`;
          const reg = new RegExp(pattern);
          return item.position.toLowerCase().match(reg);
        });
      }
      return result;
    };
  }

  /* Render Lesson */
  const renderLesson = (data) => {
    const result = data.map((item) => {
      return `<tr>
                <td>
                    <div class="d-flex px-2 py-1">
                    <div class="poster" onclick="showBoxVideo('${item.id}', '${
        item.video_url
      }')">
                        <img
                        src="../assets/poster/${item.poster}"
                        class="avatar me-3 border-radius-lg"
                        alt="${item.poster}"
                        />
                    </div>
                    </div>
                </td>
                <td>
                    <p class="text-xs font-weight-bold mb-0">${
                      item.map?.map_name
                    }</p>
                    <p class="text-xs text-secondary mb-0">${item.position}</p>
                </td>
                <td class="align-middle text-center text-sm">
                    <span class="badge badge-sm bg-gradient-${
                      item.isShow ? "success" : "danger"
                    }"
                    >${item.isShow ? "Hiện thị" : "Ẩn"}</span
                    >
                </td>
                <td class="align-middle text-center text-sm">
                    <span class="text-secondary text-xs font-weight-bold"
                    >${moment
                      .utc(item.video_duration * 1000)
                      .format("mm:ss")}</span
                    >
                </td>
                <td class="align-middle text-center text-sm">
                    <span class="text-secondary text-xs font-weight-bold"
                    >${item.tickrate.value} ticks</span
                    >
                </td>
                <td class="align-middle text-center">
                    <span class="text-secondary text-xs font-weight-bold"
                    >${item.create_timeStamp}</span
                    >
                </td>
                <td class="align-middle">
                    <a
                        href="javascript:;"
                        class="text-secondary font-weight-bold"
                        data-toggle="tooltip"
                        data-original-title="Edit user"
                        title="Chi tiết bài học"
                    >
                        <i class="fas fa-info-circle"></i>
                    </a>
                    <a
                        href="update-lesson.html?id=${item.id}"
                        class="text-secondary font-weight-bold"
                        data-toggle="tooltip"
                        data-original-title="Edit user"
                        title="Sửa bài học"
                    >
                        <i class="fas fa-edit"></i>
                    </a>
                    <a
                        href="javascript:;"
                        class="text-secondary font-weight-bold"
                        data-toggle="tooltip"
                        data-original-title="Edit user"
                        title="Xóa bài học"
                        onclick="removeLesson(${item.id}, this)"
                    >
                        <i class="far fa-trash-alt"></i>
                    </a>
                </td>
            </tr>`;
    });

    lessonResultElement.innerHTML = result.join("");
  };

  const filter = new filterLesson("", "", "");

  const handleChangeFilter = async () => {
    const data = await filter.onfilter(
      +selectMapElement.value,
      +serverElement.value,
      searchText.value
    );

    renderLesson(data);
  };

  // Add event listener
  serverElement.addEventListener("change", handleChangeFilter);
  selectMapElement.addEventListener("change", handleChangeFilter);
  searchText.addEventListener("keyup", handleChangeFilter);

  /* Handle get tick rate  */
  axios
    .get("http://localhost:4000/tickrates")
    .then((res) => res.data)
    .then((data) => {
      let result = `<option class="text-white bg-warning" value="">
        Chọn máy chủ
    </option>
  `;
      const arrayMap = data.map((server) => {
        return `<option value="${server.id}">
            ${server.value} ticks
        </option>`;
      });

      return result + arrayMap.join("");
    })
    .then((html) => {
      serverElement.innerHTML = html;
    });

  /* Handle get lesson and show */
  axios
    .get("http://localhost:4000/lessons?_expand=map&&_expand=tickrate")
    .then((res) => res.data)
    .then((data) => {
      renderLesson(data);
    });

  /* Handle get map for filter */
  axios
    .get("http://localhost:4000/maps")
    .then((res) => res.data)
    .then((data) => {
      let result = `<option class="text-white bg-warning" value="">
            Chọn bản đồ
       </option>
        `;
      // Trả về mảng
      const arrayMap = data.map((map) => {
        return `<option value="${map.id}">
            ${map.map_name}
      </option>`;
      });

      // Chuyển mảng trên thành chuỗi và sau đó là thêm vào kết quả
      return result + arrayMap.join("");
    })
    .then((html) => {
      selectMapElement.innerHTML = html;
    });
});
