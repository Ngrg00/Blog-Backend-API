document.addEventListener("DOMContentLoaded", async () => {
    const homepage = document.querySelector(".homepage");

    if(!homepage) return;
    
    const token = sessionStorage.getItem("token");

    if(!token) {
        window.location.href = "./login.html";

        return;
    }

    const resUser = await fetch("http://localhost:5000/api/user/current", 
        { headers: {"Authorization": `Bearer ${token}` } 
    });

    if(!resUser.ok) {
        throw new Error("Token is invalid or expired.");
    }

    const user = await resUser.json();

    const textarea = document.querySelector(".addPost textarea");

    textarea.addEventListener("input", () => {
        textarea.style.height = "20px";
        textarea.style.height = textarea.scrollHeight + "px";
    });

    const getAllPost = async () => {

        const addPost = document.querySelector(".addPost");
        // homepage.innerHTML = "";
        // homepage.appendChild(addPost);

        try {
            const resPosts = await fetch("http://localhost:5000/api/post", 
                { headers: {"Authorization": `Bearer ${token}`} }
            );

            if(!resPosts.ok) {
                throw new Error("Token is invalid or expired.");
            }

            const posts = await resPosts.json();

            if(posts.length === 0) {
                const container = document.createElement("div");
                container.className = "post";

                container.innerHTML = "Add something..."

                homepage.appendChild(container);
            } else {
                posts.forEach(post => {
                    let icon;
                    
                    if(post.author_id.profilePic) {
                        icon = `<img src="http://localhost:5000/${post.author_id.profilePic}"/>`
                    } else {
                        icon = 
                        `   
                            <div class="profileIcon" 
                                style="background: ${post.author_id.profileIcon.color}">
                                ${post.author_id.profileIcon.initial}
                            </div>
                        `;
                    }

                    const imgs = (post.imgs || []).map(i => 
                        `<div class="slide">
                            <img src="http://localhost:5000/${i}">
                        </div>`)
                        .join("")
                    ;

                    const date = new Date(post.createdAt).toLocaleDateString();
                    const time = new Date(post.createdAt).toLocaleTimeString();

                    const container = document.createElement("div");
                    container.className = "post";

                    container.addEventListener("click", () => {
                        window.location.href = `./postPage.html?id=${post._id}`;
                    });
                    
                    container.innerHTML = 
                    `   
                        <div class="top">
                            <div class="profilePic">
                                ${icon}
                            </div>
                            <div class="userPost">
                                <p class="author"><strong class="authorName">${post.author_id.username}</strong> - <small>${date} ${time}</small></p>
                                <p>${post.content}</p>
                                <div class="postImgs">
                                    ${imgs}
                                </div>
                            </div>
                        </div>
                        <div class="bottom">
                            <button class="commentBtn"><img src="../img/comment.svg"></button>
                            <button class="likeBtn"><img src="../img/heart_icon.svg" class="heart"></button>
                        </div>
                    `;

                    const otherProfile = container.querySelector(".author");

                    otherProfile.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if(user._id === post.author_id._id) {
                            window.location.href = "./profile.html";
                        } else {
                            window.location.href = `./otherProfile.html?id=${post.author_id._id}`;
                        }
                        
                    });

                    const commentBtn = container.querySelector(".commentBtn");

                    commentBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if(container.querySelector(".addComment")) { container.querySelector(".addComment").remove(); };

                        const addComment = document.createElement("div");
                        addComment.className = "addComment";
                        addComment.style.display = "flex";

                        addComment.addEventListener("click", (e) => {
                            e.stopPropagation();

                            if(e.target === addComment) {
                                addComment.style.display = "none";
                            }
                        });

                        addComment.innerHTML = 
                            `
                                <div class="popupBox">
                                    <div id="post">
                                        <div class="top">
                                            <div class="profilePic">
                                                ${icon}
                                            </div>
                                            <div class="userPost">
                                                <p class="author"><strong class="authorName">${post.author_id.username}</strong> - <small>${date} ${time}</small></p>
                                                <p>${post.content}</p>
                                                <div class="postImgs">
                                                    ${imgs}
                                                </div>
                                            </div>
                                        </div>

                                        <div class="bottom">
                                            <input type="text" placeholder="Write a comment..." class="commentInput">
                                            <button class="addCommentBtn">Send</button>
                                        </div>
                                    </div>
                                </div>
                            `
                        ;

                        const addCommentBtn = addComment.querySelector(".addCommentBtn");
                        

                        addCommentBtn.addEventListener("click", async (e) => {
                            e.stopPropagation();

                            const commentText = addComment.querySelector(".commentInput").value;

                            if(!commentText) return;

                            try {
                                const res = await fetch(`http://localhost:5000/api/post/${post._id}/add-comment`, {
                                    method: "POST",
                                    headers: { 
                                        "Content-Type": "application/json",
                                        "Authorization": `Bearer ${token}` 
                                    },
                                    body: JSON.stringify({ text: commentText })
                                });

                                if(!res.ok) { throw new Error("Unable to write comment!") };

                                console.log("Done");
                                
                                addComment.querySelector(".commentInput").value = "";

                            } catch (error) {
                                console.log(error);
                            }
                        })
                    

                        container.appendChild(addComment);
                    
                    });

                    const likeBtn = container.querySelector(".likeBtn");
                    
                    let liked = false;

                    likeBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const heartIcon = container.querySelector(".heart");
                        liked = !liked;

                        if(liked) {
                            heartIcon.src = "../img/heart_filled.svg";
                        } else {
                            heartIcon.src = "../img/heart_icon.svg";
                        }
                    });

                    homepage.appendChild(container);
                });
            }
        } catch (error) {
            console.log(error);

            // sessionStorage.removeItem("token");
            // window.location.href = "./login.html";

        }
    }

    getAllPost();

    const addImg = document.querySelector(".addImg");
    const imgInput = document.querySelector(".imgsPreveiw")
    addImg.addEventListener("click", () => imgInput.click());

    const postBtn = document.querySelector(".postBtn");

    const addPost = document.querySelector(".addPost");

    addPost.addEventListener("submit", async (e) => {
        e.preventDefault();

        
        const formData = new FormData(addPost);

        // const content = document.querySelector(".addPostInput").value;
        
        try {
            const res = await fetch("http://localhost:5000/api/post", {
                method: "POST",
                headers: { 
                    // "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: formData
            });

            if (!res.ok) {
                throw new Error("Failed to create post");
            }

            window.location.reload();

            console.log("Done");
            document.querySelector(".addPostInput").value = "";

        } catch (error) {
            console.log(error);

            // sessionStorage.removeItem("token");
            // window.location.href = "./login.html";
        }
    });
});

