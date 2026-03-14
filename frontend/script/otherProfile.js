
document.addEventListener("DOMContentLoaded", async () => {
    const profile = document.querySelector(".profile");

    if(!profile) return;

    const token = sessionStorage.getItem("token");

    if(!token) {
        window.location.href = "./login.html";

        return;
    }

    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    try {
        const userRes = await fetch(`http://localhost:5000/api/user/${userId}/`,
            { headers: {"Authorization": `Bearer ${token}`} }
        );

        const user = await userRes.json();

        const date = new Date(user.createdAt).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        const profile = document.querySelector(".profile");

        const profileTop = document.createElement("div");
        profileTop.className = "profileTop";

        if(user.profileBackground) {
            profileTop.innerHTML = `<img src="http://localhost:5000/${user.profileBackground}" />`
        }

        let icon;

        if(user.profilePic) {
            icon = `<img src="http://localhost:5000/${user.profilePic}" />`;
        } else {
            icon = user.profileIcon.initial;
        }

        const bio = user.bio ? user.bio : "";
        
        const profileBottom = document.createElement("div");
        profileBottom.className = "profileBottom";
        profileBottom.innerHTML = 
            `
                <p class="author_name"><strong>${user.username}</strong></p>
                <div class="userIcon">${icon}</div>
                <p class="bio">${bio}</p>
                <p class="date"><small>Joined ${date}</small></p><br>
                <p><small>Post:</small></p>
            `
        ;

        if(!user.profilePic) {
            profileBottom.querySelector(".userIcon").style.backgroundColor = user.profileIcon.color;
        } else {
            profileBottom.querySelector(".userIcon").style.backgroundColor = "white";
        }

        const displayPost = async () => {
            const postsRes = await fetch(`http://localhost:5000/api/post/${userId}/post`,
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

                    const imgs = (post.imgs || []).map(i => 
                        `<div class="slide">
                            <img src="http://localhost:5000/${i}">
                        </div>`)
                        .join("")
                    ;
                    
                    const container = document.createElement("div");
                    container.className = "post";

                    container.addEventListener("click", () => {
                        window.location.href = `./postPage.html?id=${post._id}`;
                    })
                    
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
                    `;

                    profile.appendChild(container);
                });
            }
            
        }

        displayPost();
    } catch (error) {
        console.log(error);
    }
})