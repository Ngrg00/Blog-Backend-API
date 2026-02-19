const registerForm = document.querySelector(".registerForm");

if(registerForm) {
    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const username = document.querySelector(".username").value;
        const email = document.querySelector(".email").value;
        const password = document.querySelector(".password")
        const confirm = document.querySelector(".confirm")

        try {
            if(password.value !== confirm.value) {

                password.style.border = "1px solid red";
                confirm.style.border = "1px solid red";

                password.value = "";
                confirm.value = "";

                throw new Error("Passwords do not match");
            }

            const res = await fetch("http://localhost:5000/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password: password.value })
            });

            const data = await res.json();

            if (!res.ok) {

                throw new Error(data.message);
            }

            window.alert("Account created!");
            window.location.href = "./login.html";

        } catch (error) {
            window.alert(`${error.message}`);
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

            const resUser = await fetch("http://localhost:5000/api/user/current", 
                { headers: {"Authorization": `Bearer ${data.accessToken}` } 
            });

            if(!resUser.ok) {
                throw new Error("Token is invalid or expired.");
            }

            const user = await resUser.json();

            window.alert(`Welcome ${user.username}`);


            sessionStorage.setItem("token", data.accessToken);

            window.location.href = "./homepage.html";
        } catch (error) {
            window.alert(error.message);
        }
    });
}


