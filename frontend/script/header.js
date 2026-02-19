
const searchInput = document.querySelector(".searchInput");
const searchResult = document.querySelector(".searchResult");
const cancelBtn = document.querySelector(".cancel");

searchInput.addEventListener("input", async () => {

    cancelBtn.addEventListener("click", () => {
        searchInput.value = "";
    });

    const q = searchInput.value.trim();
    if(!q) {
        cancelBtn.style.display = "none"
        searchResult.style.display = "none";
        searchResult.innerHTML = "";
        return;
    }

    cancelBtn.style.display = "block";

    try {
        const token = sessionStorage.getItem("token");
        
        const res = await fetch(`http://localhost:5000/api/user/search?q=${q}`,
                { headers: {"Authorization": `Bearer ${token}`} }
        );

        const currentRes = await fetch(`http://localhost:5000/api/user/current`,
                { headers: {"Authorization": `Bearer ${token}`} }
        );

        const users = await res.json();
        const currentUser = await currentRes.json();

        searchResult.innerHTML = "";

        if(users.length === 0) {
            searchResult.style.display = "none";
            return;
        }

        users.forEach(u => {
            const div = document.createElement("div");
            div.textContent = u.username;

            div.addEventListener("click", () => {
                if(u.username === currentUser.username) {
                    window.location.href = `./profile.html`;
                } else {
                    window.location.href = `./otherProfile.html?id=${u._id}`;
                }
                
            });

            searchResult.appendChild(div);
        });

        searchResult.style.display = "block";
        

    } catch (error) {
        console.log(error);
    }
})