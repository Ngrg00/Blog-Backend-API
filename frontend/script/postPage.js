document.addEventListener("DOMContentLoaded", async () => {
    const postDisplay = document.querySelector(".post");

    const token = sessionStorage.getItem("token");

    if(!token) {
        window.location.href = "./login.html";

        return;
    }

    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");

    const loadPost = async () => {
        try {
            const resUser = await fetch("http://localhost:5000/api/user/current", 
                { headers: {"Authorization": `Bearer ${token}` } 
            });

            if(!resUser.ok) {
                throw new Error("Token is invalid or expired.");
            }

            const user = await resUser.json();

            const res = await fetch(`http://localhost:5000/api/post/${postId}`, 
                { headers: {"Authorization": `Bearer ${token}`} }
            );

            if(!res.ok) { throw new Error("Token is invalid or expired") };

            const post = await res.json();

            const date = new Date(post.createdAt).toLocaleDateString();
            const time = new Date(post.createdAt).toLocaleTimeString();

            let icon;
                
            if(post.author_id.profilePic) {
                icon = `<img src="http://localhost:5000/${post.author_id.profilePic}"/>`
            } else {
                icon = 
                `   
                    <div class="profileIcon" style="background: ${post.author_id.profileIcon.color}">
                        ${post.author_id.profileIcon.initial}
                    </div>
                `;
            }
            postDisplay.innerHTML = 
                `
                    <div class="top">
                        <div>
                            ${icon}
                        </div>
                        <div class="userPost">
                            <p class="author"><strong class="authorName">${post.author_id.username}</strong> - <small>${date} ${time}</small></p>
                            <p>${post.content}</p>
                        </div>
                    </div>
                `
            ;

            const comments = post.comments;

            if(comments.length === 0) {
                const commentDisplay = document.createElement("div");
                commentDisplay.className = "commentDisplay";

                commentDisplay.innerHTML = "<p>No comments!</p>"

                postDisplay.appendChild(commentDisplay);
            } else {

                comments.forEach(c => {
                    const commentDisplay = document.createElement("div");
                    commentDisplay.className = "commentDisplay";

                    const date = new Date(c.createdAt).toLocaleDateString();
                    const time = new Date(c.createdAt).toLocaleTimeString();

                    let icon;
                
                    if(c.author_id.profilePic) {
                        icon = `<img src="http://localhost:5000/${c.author_id.profilePic}"/>`
                    } else {
                        icon = 
                        `   
                            <div class="profileIcon" style="background: ${c.author_id.profileIcon.color}">
                                ${c.author_id.profileIcon.initial}
                            </div>
                        `;
                    }

                    commentDisplay.innerHTML = 
                        `   
                            <div class="top">
                                <div>
                                    ${icon}
                                </div>
                                <div class="userPost">
                                    <p class="author"><strong class="authorName">${c.author_id.username}</strong> - <small>${date} ${time}</small></p>
                                    <p>${c.text}</p>
                                </div>
                            </div>
                            
                        `
                    ;

                    const otherProfile = commentDisplay.querySelector(".author");

                    otherProfile.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if(user._id === c.author_id._id) {
                            window.location.href = "./profile.html";
                        } else {
                            window.location.href = `./otherProfile.html?id=${c.author_id._id}`;
                        }
                        
                    });

                    postDisplay.appendChild(commentDisplay);
                });
            }

            const otherProfile = document.querySelector(".author");

            otherProfile.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();

                if(user._id === post.author_id._id) {
                    window.location.href = "./profile.html";
                } else {
                    window.location.href = `./otherProfile.html?id=${post.author_id._id}`;
                }
                
            });

            const commentInput = document.createElement("div");
            commentInput.className = "commentBottom";

            commentInput.innerHTML = 
                `
                    <input type="text" placeholder="Write a comment..." class="commentInput">
                    <button class="addCommentBtn">Send</button>
                `
            ;

            const addCommentBtn = commentInput.querySelector(".addCommentBtn");
                        

            addCommentBtn.addEventListener("click", async () => {

                const commentText = commentInput.querySelector(".commentInput").value;

                if(!commentText) return;

                try {
                    const res = await fetch(`http://localhost:5000/api/post/${postId}/add-comment`, {
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}` 
                        },
                        body: JSON.stringify({ text: commentText })
                    });

                    if(!res) { throw new Error("Unable to write comment!") };

                    loadPost();

                    console.log("Done");
                    
                    commentInput.querySelector(".commentInput").value = "";

                } catch (error) {
                    console.log(error);
                }
            }); 

            postDisplay.appendChild(commentInput);

        } catch (error) {
            console.log(error);
        }
    }

    loadPost();
    
})