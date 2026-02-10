const registerForm = document.querySelector(".registerForm");

if(registerForm) {
    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const username = document.querySelector(".username").value;
        const email = document.querySelector(".email").value;
        const password = document.querySelector(".password").value;

        try {
            const res = await fetch("http://localhost:5000/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await res.json();

            if (!res.ok) {

                throw new Error(data.message);
            }

            console.log("User registered:", data);
        } catch (error) {
            console.error("Register error:", error.message);
        }
    });
}

const loginForm = document.querySelector(".loginForm")

if(loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.querySelector(".email").value;
        const password = document.querySelector(".password").value;

        try {
            const res = await fetch("http://localhost:5000/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {

                throw new Error(data.message);
            }

            sessionStorage.setItem("token", data.accessToken);

            console.log("User logged");

            window.location.href = "./homepage.html";
        } catch (error) {
            console.error("Login error:", error.message);
        }
    });
}


document.addEventListener("DOMContentLoaded", async () => {
    const homepage = document.querySelector(".homepage");

    if(!homepage) return;
    
    const token = sessionStorage.getItem("token");

    if(!token) {
        window.location.href = "./login.html";

        return;
    }

    try {
        const resUser = await fetch("http://localhost:5000/api/user/current", 
            { headers: {"Authorization": `Bearer ${token}` } 
        });

        if(!resUser.ok) {
            throw new Error("Token is invalid or expired.");
        }

        const user = await resUser.json();

        window.alert(`Welcome ${user.username}`)
    } catch (error) {
        console.log(error);

        sessionStorage.removeItem("token");
        window.location.href = "./login.html";
    }

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
            
            let commentHtml = "";
            
            if(post.comments.length > 0) {
                commentHtml = "<ul>";

                post.comments.forEach(comment => {
                    commentHtml += `<li><strong>${comment.author_id.username}: <strong>${comment.text}</li>`
                });

                commentHtml += "</ul>";
            }

            container.innerHTML = 
            `
                <small>${post.author_id.username}<small>
                <h3>${post.title}<h3>
                <p>${post.content}<p>
                <div class="comments">
                    <h4>Comments: </h4>
                    ${commentHtml}
                </div>
            `;

            homepage.appendChild(container);
        })
       

    } catch (error) {
        console.log(error);

        sessionStorage.removeItem("token");
        window.location.href = "./login.html";

    }
});

