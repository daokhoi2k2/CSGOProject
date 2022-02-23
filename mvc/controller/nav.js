const navTypeListElement = $("#type-nav")[0];

axios
    .get("http://localhost:4000/types")
    .then((res) => res.data)
    .then((data) => {
        const html = data.map((type) => {
            return `
                <li><a href="/client/type.html?id=${type.id}">${type.name}</a></li>
            `
        }).join("");
        navTypeListElement.innerHTML = html;
    })