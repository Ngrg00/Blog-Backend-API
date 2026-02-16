document.addEventListener("DOMContentLoaded", async () => {
    const homepage = document.querySelector(".homepage");

    if(!homepage) return;
    
    const token = sessionStorage.getItem("token");

    if(!token) {
        window.location.href = "./login.html";

        return;
    }

    const getAllPost = async () => {

        const addPost = document.querySelector(".addPost");
        homepage.innerHTML = "";
        homepage.appendChild(addPost);

        try {
            const resPosts = await fetch("http://localhost:5000/api/post", 
                { headers: {"Authorization": `Bearer ${token}`} }
            );

            if(!resPosts.ok) {
                throw new Error("Token is invalid or expired.");
            }

            const posts = await resPosts.json();

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
                        <button class="commentBtn")"><img src="../img/comment.svg"></button>
                        <button class="like"><img src="../img/heart_icon.svg" id="heart"></button>
                    </div>
                `;

                const commentBtn = container.querySelector(".commentBtn");

                commentBtn.addEventListener("click", () => {

                    if(container.querySelector(".addComment")) { container.querySelector(".addComment").remove(); };

                    const addComment = document.createElement("div");
                    addComment.className = "addComment";
                    addComment.style.display = "flex";

                    addComment.addEventListener("click", (e) => {
                        if(e.target === addComment) {
                             addComment.style.display = "none";
                        }
                    });

                    addComment.innerHTML = 
                        `
                            <div class="popupBox">
                                <div id="post">
                                    <div class="top">
                                        <p id="author"><strong>${post.author_id.username}</strong></p>
                                        <p>${post.content}</p>
                                    </div>

                                    <div class="bottom">
                                        <input type="text" placeholder="Write a comment...">
                                        <button class="addCommentBtn">Send</button>
                                    </div
                                </div>
                            </div>
                        `

                    container.appendChild(addComment);
                
                });

                homepage.appendChild(container);
            });
        
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
    });
});

