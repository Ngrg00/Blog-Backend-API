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


