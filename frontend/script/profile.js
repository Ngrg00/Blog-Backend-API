document.addEventListener("DOMContentLoaded", async () => {
    const profile = document.querySelector(".profile");

    if(!profile) return;

    const token = sessionStorage.getItem("token");

    if(!token) {
        window.location.href = "./login.html";

        return;
    }

    const logout = document.querySelector(".logOut");


    logout.addEventListener("click", () => {
        window.alert("Goodbye!");

        sessionStorage.removeItem("token");
        window.location.href = "./login.html";
    })

    try {
        const userRes = await fetch("http://localhost:5000/api/user/current", 
            { headers: {"Authorization": `Bearer ${token}`} }
        );

        

        if(!userRes.ok) { throw new Error("Token is invalid or expired.") };

        const user = await userRes.json();

        const date = new Date(user.createdAt).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        const profile = document.querySelector(".profile");

        const profileTop = document.createElement("div");
        profileTop.className = "profileTop";

        const profileBottom = document.createElement("div");
        profileBottom.className = "profileBottom";
        profileBottom.innerHTML = 
            `
                <button class="editProfile">Edit profile</button>
                <p><strong class="authorName">${user.username}</strong></p>
                <p class="author"><small>Joined ${date}</small></p><br>
                <p><small>Post:</small></p>
            `
        ;

        const displayPost = async () => {
            const postsRes = await fetch (`http://localhost:5000/api/post/me`, 
                { headers: {"Authorization": `Bearer ${token}`} }
            );

            if(!postsRes.ok) { throw new Error("Token is invalid or expired.") };

            const posts = await postsRes.json();

            profile.innerHTML = "";
            profile.appendChild(profileTop);
            profile.appendChild(profileBottom);

            if(posts.length === 0) {
                const container = document.createElement("div");
                container.className = "post";

                container.innerHTML = "No post!";

                profile.appendChild(container);
            } else {
                posts.forEach(post => {
                    const date = new Date(post.createdAt).toLocaleDateString();
                    const time = new Date(post.createdAt).toLocaleTimeString();

                    const container = document.createElement("div");
                    container.className = "post";

                    container.addEventListener("click", () => {
                        window.location.href = `./postPage.html?id=${post._id}`;
                    })
                    
                    container.innerHTML = 
                    `   
                        <div class="top">
                            <p><strong>${post.author_id.username}</strong> - <small>${date} ${time}</small></p>
                            <p class="postContent">${post.content}</p>
                        </div>

                        <div class="bottom">
                            <button class="postOptionBtn">...</button>
                            <div class="options hidden">
                                <p class="edit">Edit post</p>
                                <p class="delete">Delete post</p>
                            </div>
                        </div>
                        
                    `;

                    const postOptionbtn = container.querySelector(".postOptionBtn");
                    const options = container.querySelector(".options");

                    postOptionbtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        options.classList.toggle("hidden");
                    });

                    const editBtn = container.querySelector(".edit");
                    editBtn.addEventListener("click", async (e) => {
                        e.preventDefault(); 
                        e.stopPropagation();

                        options.classList.toggle("hidden");

                        const p = container.querySelector(".postContent");

                        const textarea = document.createElement("textarea");
                        textarea.className = "postEdit";
                        textarea.value = p.textContent;

                        textarea.style.height = "40px";
                        textarea.style.height = textarea.scrollHeight + "px";

                        textarea.addEventListener("click", (e) => {
                            e.stopPropagation();
                        })

                        p.replaceWith(textarea);

                        const submitEditBtn = document.createElement("button");
                        submitEditBtn.className = "submitEdit";
                        submitEditBtn.innerHTML = "Done";
                        
                        container.querySelector(".top").appendChild(submitEditBtn);

                        submitEditBtn.addEventListener("click", async (e) => {
                            e.preventDefault(); 
                            e.stopPropagation();

                            await fetch(`http://localhost:5000/api/post/${post._id}`, 
                                {   
                                    method: "PUT",
                                    headers: 
                                        { 
                                            "Content-Type": "application/json",
                                            "Authorization": `Bearer ${token}`
                                        },
                                    body: JSON.stringify({ content: textarea.value})
                                }
                            ); 

                            p.textContent = textarea.value;

                            textarea.replaceWith(p);

                            submitEditBtn.remove();

                            displayPost();
                        });
                    });

                    const deleteBtn = container.querySelector(".delete");
                    deleteBtn.addEventListener("click", async (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const confirmed = window.confirm("Are you sure you want to delete this post?");
                        if(!confirmed) return;

                        await fetch(`http://localhost:5000/api/post/${post._id}`,
                            {
                                method: "DELETE",
                                headers: {"Authorization": `Bearer ${token}`},
                            }
                        );

                        window.alert("Post deleted!");
                        displayPost();
                    }); 


                    profile.appendChild(container);
                });
            }
            
        }

        displayPost();
    } catch (error) {
        console.log(error);
    }
})