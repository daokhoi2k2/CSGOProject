$(document).ready(() => {
  const addLessonElement = $("#addLesson")[0];
  const knifeTypeListElement = $("#knifeType")[0];
  const serverElement = $("#tickrate")[0];

  // Call API get map
  axios
    .get("http://localhost:4000/types")
    .then((res) => res.data)
    .then((data) => {
      let result = `<option class="text-white bg-warning" value="">
              Chọn loại
         </option>
          `;
      // Trả về mảng
      const arrayMap = data.map((type) => {
        return `<option value="${type.id}">
              ${type.name}
        </option>`;
      });

      // Chuyển mảng trên thành chuỗi và sau đó là thêm vào kết quả
      return result + arrayMap.join("");
    })
    .then((html) => {
      knifeTypeListElement.innerHTML = html;
    });

  const handleAddKnife = (e) => {
    e.preventDefault();
    const market_hash_name = $("[name= 'market_hash_name']")[0].value;
    const price = $("[name= 'price']")[0].value;
    const knifeType = $("[name= 'knifeType']")[0].value;
    const knifeImg = $("[name= 'knifeImg']")[0].files[0];
    const description = $("[name= 'description']")[0].value;
    const isShow = $("[name= 'isShow']")[0].value;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(knifeImg);
    fileReader.onload = () => {
      const Imghash64 = fileReader.result;
      axios
        .post("http://localhost:4000/knifes", {
          market_hash_name,
          img_url: Imghash64,
          typeId: knifeType,
          price,
          description,
          volume: 0,
          view: 0,
          isShow,
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
  };

  //  Add event listener
  addLessonElement.addEventListener("submit", handleAddKnife);
});
