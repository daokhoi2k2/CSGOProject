$(document).ready(() => {
  const updateLessonElement = $("#updateLesson")[0];
  const mapListElement = $("#map")[0];
  const serverElement = $("#tickrate")[0];

  // Element value in form
  let urlVideo = $("[name = 'urlVideo']")[0];
  let map = $("[name = 'map']")[0];
  let tickrate = $("[name = 'tickrate']")[0];
  let position = $("[name = 'position']")[0];
  let video_duration = $("[name = 'video_duration']")[0];
  let poster = $("[name = 'urlImage']")[0];
  let isShow = $("[name = 'isShow']")[0].checked;
  // Không có server không làm được upload file
  // const posterFile = $("[name = 'posterFile']")[0].files[0];
  // const videoFile = $("[name = 'videoFile']")[0].files[0];

  const url = new URL(window.location.href);
  const idLesson = url.searchParams.get("id");

  const renderInfoForForm = async (infoLesson) => {
    const data = await infoLesson();
    urlVideo.value = data.video_url;
    position.value = data.position;
    video_duration.value = data.video_duration;
    poster.value = data.poster;
  };

  // Get Info from method get by id
  const getInfoLesson = () => {
    return axios
      .get(
        `http://localhost:4000/lessons/${idLesson}?tickrateId=1&&_expand=map&&_expand=tickrate`
      )
      .then((res) => res.data);
  };

  renderInfoForForm(getInfoLesson);

  // Call API get list map
  axios
    .get("http://localhost:4000/maps")
    .then((res) => res.data)
    .then(async (data) => {
      let result = `<option class="text-white bg-warning" value="">
            Chọn bản đồ
       </option>
        `;
      const infoLessonCurrent = await getInfoLesson();
      // Trả về mảng
      const arrayMap = data.map((map) => {
        return `<option value="${map.id}" ${
          infoLessonCurrent.mapId == map.id ? "selected" : ""
        }>
            ${map.map_name}
      </option>`;
      });

      // Chuyển mảng trên thành chuỗi và sau đó là thêm vào kết quả
      return result + arrayMap.join("");
    })
    .then((html) => {
      mapListElement.innerHTML = html;
    });

  // Call API get list server
  axios
    .get("http://localhost:4000/tickrates")
    .then((res) => res.data)
    .then(async (data) => {
      let result = `<option class="text-white bg-warning" value="">
        Chọn máy chủ
    </option>
  `;
      const infoLessonCurrent = await getInfoLesson();
      const arrayMap = data.map((server) => {
        return `<option value="${server.id}"  ${
          infoLessonCurrent.tickrateId == server.id ? "selected" : ""
        }>
            ${server.value} ticks
        </option>`;
      });

      return result + arrayMap.join("");
    })
    .then((html) => {
      serverElement.innerHTML = html;
    });

  const handleUpdateLesson = (e) => {
    e.preventDefault();
    axios
      .patch(`http://localhost:4000/lessons/${idLesson}`, {
        video_url: urlVideo.value,
        mapId: +map.value,
        tickrateId: +tickrate.value,
        position: position.value,
        video_duration: video_duration.value,
        isShow: isShow.value,
        poster: poster.value,
      })
      .then((res) => {
        setTimeout(() => {
          window.location.href = "/admin/tables.html";
        }, 2000);

        Toastify({
          text: "Sửa bài học thành công",
          className: "info",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          gravity: "bottom",
        }).showToast();
      });
  };

  // //  Add event listener
  updateLessonElement.addEventListener("submit", handleUpdateLesson);
});
