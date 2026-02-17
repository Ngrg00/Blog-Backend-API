document.addEventListener("DOMContentLoaded", async () => {
    const profile = document.querySelector(".profile");

    if(!profile) return;

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

        const userProfile = document.createElement("div");
        userProfile.className = "userProfile";
        userProfile.innerHTML = 
            `
                <p><strong>${user.username}</strong></p>
            `
        ;

        profile.appendChild(userProfile);
    } catch (error) {
        console.log(error);


    }
})