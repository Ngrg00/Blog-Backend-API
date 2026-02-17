document.addEventListener("DOMContentLoaded", async () => {
    const profile = document.querySelector(".profile");

    if(!profile) return;

    const token = sessionStorage.getItem("token");

    if(!token) {
        window.location.href = "./login.html";

        return;
    }

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
                <p class="author_name"><strong>${user.username}</strong></p>
                <p><small>Joined ${date}</small></p><br>
                <p><small>Post:</small></p>
            `
        ;

        const displayPost = async () => {
            const postsRes = await fetch ("http://localhost:5000/api/post/me", 
                { headers: {"Authorization": `Bearer ${token}`} }
            );

            if(!postsRes.ok) { throw new Error("Token is invalid or expired.") };

            const posts = await postsRes.json();

            profile.innerHTML = "";
            profile.appendChild(profileTop);
            profile.appendChild(profileBottom);

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
                        <p id="author"><strong>${post.author_id.username}</strong> - <small>${date} ${time}</small></p>
                        <p>${post.content}</p>
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

                const deleteBtn = container.querySelector(".delete");
                deleteBtn.addEventListener("click", async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const confirmed = window.confirm("Are you sure you want to delete this post?");
                    if(!confirmed) return;

                    await fetch(`http://localhost:5000/api/post/${post._id}`,
                        {
                            method: "DELETE",
                            headers: {"Authorization": `Bearer ${token}`}
                        }
                    );

                    window.alert("Post deleted!");
                    displayPost();
                }); 


                profile.appendChild(container);
            });
        }

        displayPost();
    } catch (error) {
        console.log(error);
    }
})