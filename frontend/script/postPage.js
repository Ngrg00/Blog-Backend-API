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
            const res = await fetch(`http://localhost:5000/api/post/${postId}`, 
                { headers: {"Authorization": `Bearer ${token}`} }
            );

            if(!res.ok) { throw new Error("Token is invalid or expired") };

            const post = await res.json();

            const date = new Date(post.createdAt).toLocaleDateString();
            const time = new Date(post.createdAt).toLocaleTimeString();

            postDisplay.innerHTML = 
                `
                    <p><strong>${post.author_id.username}</strong> - <small>${date} ${time}</p>
                    <p>${post.content}</p><br>
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

                    commentDisplay.innerHTML = 
                        `   
                            <p><strong>${c.author_id.username}</strong> - <small>${date} ${time}</small></p>
                            <p>${c.text}</p>
                        `
                    ;

                    postDisplay.appendChild(commentDisplay);
                });
            }

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