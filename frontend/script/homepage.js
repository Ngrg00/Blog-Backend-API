document.addEventListener("DOMContentLoaded", async () => {
    const homepage = document.querySelector(".homepage");

    if(!homepage) return;
    
    const token = sessionStorage.getItem("token");

    if(!token) {
        window.location.href = "./login.html";

        return;
    }

    const getAllPost = async () => {
        const addPostDiv = document.querySelector(".addPost");
        homepage.innerHTML = "";
        homepage.appendChild(addPostDiv);
        
        try {
            const resPost = await fetch("http://localhost:5000/api/post", 
                { headers: {"Authorization": `Bearer ${token}` } 
            });

            if(!resPost.ok) {
                throw new Error("Token is invalid or expired.");
            }

            const posts = await resPost.json();

            posts.forEach(post => {
                const container = document.createElement("div");
                container.className = "post";
            
                container.innerHTML = 
                `   
                    <div class="top">
                        <p id="author"><strong>${post.author_id.username}</strong></p>
                        <p>${post.content}</p>
                    </div>
                    <div class="bottom">
                        <button><img src="../img/comment.svg"></button>
                        <button><img src="../img/heart_icon.svg" id="heart"></button>
                    </div>
                `;

                homepage.appendChild(container);
            })
        
        } catch (error) {
            console.log(error);

            sessionStorage.removeItem("token");
            window.location.href = "./login.html";

        }
    }

    try {
        const resUser = await fetch("http://localhost:5000/api/user/current", 
            { headers: {"Authorization": `Bearer ${token}` } 
        });

        if(!resUser.ok) {
            throw new Error("Token is invalid or expired.");
        }

        const user = await resUser.json();

        //window.alert(`Welcome ${user.username}`)
    } catch (error) {
        console.log(error);

        sessionStorage.removeItem("token");
        window.location.href = "./login.html";
    }

    getAllPost();

    const postBtn = document.querySelector(".postBtn");

    postBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const content = document.querySelector(".addPostInput").value;

        if(!content) return;

        try {
            const res = await fetch("http://localhost:5000/api/post", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ content })
            });

            if (!res.ok) {
                throw new Error("Failed to create post");
            }

            getAllPost();

            document.querySelector(".addPostInput").value = "";

        } catch (error) {
            
        }
    })

    
});