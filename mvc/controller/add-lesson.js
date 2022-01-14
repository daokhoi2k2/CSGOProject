$(document).ready(() => {
  const addLessonElement = $("#addLesson")[0];
  const mapListElement = $("#map")[0];
  const serverElement = $("#tickrate")[0];

  // Call API get map
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
      mapListElement.innerHTML = html;
    });

  // Call API get server
  axios
    .get("http://localhost:4000/tickrates")
    .then((res) => res.data)
    .then((data) => {
      let result = `   <option class="text-white bg-warning" value="">
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

  const handleAddLesson = (e) => {
    e.preventDefault();
    const urlVideo = $("[name = 'urlVideo']")[0].value;
    const map = $("[name = 'map']")[0].value;
    const tickrate = $("[name = 'tickrate']")[0].value;
    const position = $("[name = 'position']")[0].value;
    const video_duration = $("[name = 'video_duration']")[0].value;
    const poster = $("[name = 'urlImage']")[0].value;
    const isShow = $("[name = 'isShow']")[0].checked;
    // Không có server không làm được upload file
    // const posterFile = $("[name = 'posterFile']")[0].files[0];
    // const videoFile = $("[name = 'videoFile']")[0].files[0];

    axios
      .post("http://localhost:4000/lessons", {
        video_url: urlVideo,
        mapId: +map,
        tickrateId: +tickrate,
        position,
        video_duration,
        isShow,
        poster,
        create_timeStamp: moment().format("DD/MM/YYYY"),
      })
      .then((res) => {
        Toastify({
          text: "Thêm bài học thành công",
          className: "info",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          gravity: "bottom",
        }).showToast();
      });

    setTimeout(() => {
      window.location.href = "/admin/tables.html";
    }, 2000);
  };

  //  Add event listener
  addLessonElement.addEventListener("submit", handleAddLesson);
});
