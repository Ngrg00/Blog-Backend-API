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

        if(user.profileBackground) {
            profileTop.innerHTML = `<img src="http://localhost:5000/${user.profileBackground}" />`
        }

        const profileBottom = document.createElement("div");
        profileBottom.className = "profileBottom";

        let icon;
        if(user.profilePic) {
            icon = `<img src="http://localhost:5000/${user.profilePic}" />`;
        } else {
            icon = user.profileIcon.initial;
        }

        if(user.bio === "undefined") {
            user.bio = "";
        }

        profileBottom.innerHTML = 
            `
                <button class="editProfile">Edit profile</button>
                <div class="userIcon">${icon}</div>
                <p><strong class="authorName">${user.username}</strong></p>
                <p class="bio">${user.bio}</p>
                <p class="author"><small>Joined ${date}</small></p><br>
                <p><small>Post:</small></p>
            `
        ;

        if(!user.profilePic) {
            profileBottom.querySelector(".userIcon").style.backgroundColor = user.profileIcon.color;
        } else {
            profileBottom.querySelector(".userIcon").style.backgroundColor = "white";
        }
        

        const editProfile = profileBottom.querySelector(".editProfile");
        editProfile.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            if(profileBottom.querySelector(".editProfilePopup")) { profileBottom.removeChild(".editProfilePopup") };

            document.body.style.overflow = "hidden";

            const editProfilePopup = document.createElement("div");
            editProfilePopup.className = "editProfilePopup";
            editProfilePopup.style.display = "flex";

            editProfilePopup.innerHTML = 
                `   
                    
                    <form class="editProfileForm" enctype="multipart/form-data">
                        <div class="editHeader">
                            <button class="closePopup">X</button>
                            <p>Edit profile</p>
                            <button type="submit">Save</button>
                        </div>

                        <div class="top">
                            <label class="profileBackground">
                                <img src="../img/edit.svg" class="editImg">
                                <input type="file" name="profileBackground" hidden>
                            </label>
                        </div>
                        
                        <div class="bottom">
                            <label class="profileIcon">
                                <img src="../img/edit.svg" class="editImg">
                                <input type="file" name="profilePic" hidden>
                            </label>

                            <div class="inputGroup">
                                <label>Username</label>
                                <input type="text" name="username">
                            </div>
                            <div class="inputGroup">
                                <label>Bio</label>
                                <textarea name="bio" maxlength="150"></textarea>
                            </div>
                            <div class="inputGroup">
                                <label>Email</label>
                                <input type="email" name="email">
                            </div>
                            <div class="inputGroup password">
                                <label>Password</label>
                                <input type="password" name="password">
                            </div>
                            <div class="inputGroup confirmPass">
                                <label>Confirm password</label>
                                <input type="password" name="confirmPass">
                            </div>
                        </div>
                    </form>
                `
            ;

            profileBottom.appendChild(editProfilePopup);

            profileBottom.querySelector(".closePopup").addEventListener("click", () => {
                editProfilePopup.remove();

                document.body.style.overflow = "auto";
            });

            profileBottom.querySelector('input[name="username"]').value = user.username;
            profileBottom.querySelector('input[name="email"]').value = user.email;
            profileBottom.querySelector('textarea[name="bio"]').value = user.bio;
            
            const backgroundPreview = profileBottom.querySelector('.profileBackground');

            if(user.profileBackground) {
                backgroundPreview.style.backgroundImage = `url(http://localhost:5000/${user.profileBackground})`;
                backgroundPreview.style.backgroundSize = "cover";
                backgroundPreview.style.backgroundPosition = "center";
                backgroundPreview.style.opacity = "0.6";
            }

            backgroundPreview.addEventListener("change", () => {
                const file = profileBottom.querySelector('input[name="profileBackground"]').files[0];

                if(file) {
                    const url = URL.createObjectURL(file);

                    backgroundPreview.style.backgroundImage = `url(${url})`;
                    backgroundPreview.style.backgroundSize = "cover";
                    backgroundPreview.style.backgroundPosition = "center";
                    backgroundPreview.style.opacity = "0.6";
                }
            })

            const profilePicPreview = profileBottom.querySelector('.profileIcon');

            if(user.profileIcon) {
                profilePicPreview.style.backgroundImage = `
                    url(http://localhost:5000/${user.profilePic})`;
                profilePicPreview.style.backgroundSize = "cover";
                profilePicPreview.style.backgroundPosition = "center";
                profilePicPreview.style.backgroundColor = "white"
            }

            profilePicPreview.addEventListener("change", () => {
                const file = profileBottom.querySelector('input[name="profilePic"]').files[0];

                if(file) {
                    const url = URL.createObjectURL(file);

                    profilePicPreview.style.backgroundImage = `url(${url})`;
                    profilePicPreview.style.backgroundSize = "cover";
                    profilePicPreview.style.backgroundPosition = "center";
                    profilePicPreview.style.backgroundColor = "white"
                }
            })

            const editProfileForm = profileBottom.querySelector(".editProfileForm");

            editProfileForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                const password = profileBottom.querySelector('input[name="password"]');
                const confirmPass = profileBottom.querySelector('input[name="confirmPass"]');

                if(password.value || confirmPass.value) {
                    if(!password.value || !confirmPass.value) {
                        profileBottom.querySelector(".password").style.border = "1px solid red";
                        profileBottom.querySelector(".confirmPass").style.border = "1px solid red";

                        window.alert("Both password fields must be required!");
                        
                        return;
                    }
                }

                if(password.value !== confirmPass.value) {
                    profileBottom.querySelector(".password").style.border = "1px solid red";
                    profileBottom.querySelector(".confirmPass").style.border = "1px solid red";

                    window.alert("Passwords do not match!");

                    return;
                }

                const formData = new FormData(editProfileForm);

                try {
                    const res = await fetch("http://localhost:5000/api/user/update",
                        { 
                            method: "PUT",
                            headers: {"Authorization": `Bearer ${token}`},
                            body: formData
                        }
                    );

                    if(!res.ok) {
                        throw new Error("Failed to update!");
                    }

                    editProfilePopup.remove();
                    document.body.style.overflow = "auto";

                    window.location.reload();

                } catch (error) {
                    
                }
            })
        });

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

                        <div class="bottom">
                            <button class="postOptionBtn">...</button>
                            <div class="options hidden">
                                <p class="edit">Edit post</p>
                                <p class="delete">Delete post</p>
                            </div>
                        </div>
                        
                    `;

                    if(!user.profilePic) {
                        container.querySelector(".profilePic").style.backgroundColor = user.profileIcon.color;
                    } else {
                        container.querySelector(".profilePic").style.backgroundColor = "white";
                    }

                    const slider = container.querySelector(".postImgs");

                    if(post.imgs.length > 1) {
                        slider.innerHTML = 
                            `
                                <button class="slideBtn left">←</button>
                                ${imgs}
                                <button class="slideBtn right">→</button>
                            `;

                        const dots = document.createElement("div");
                        dots.className = "dots";

                        post.imgs.forEach((_, index) => {
                                const dot = document.createElement("span");
                                dot.className = "dot";
                                if(index === 0) dot.classList.add("active");

                                dot.addEventListener("click", (e) => {
                                    e.stopPropagation();

                                    slider.scrollTo({
                                        left: slider.clientWidth * index,
                                        behavior: "smooth"
                                    });
                                });

                                dots.appendChild(dot); 
                        });

                        container.appendChild(dots);

                        slider.addEventListener("scroll", () => {
                            const index = Math.round(slider.scrollLeft / slider.clientWidth);

                            const markers = dots.querySelectorAll(".dot");

                            markers.forEach((dot, i) => dot.classList.toggle("active", i === index)); 
                        });
                    }
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
        // sessionStorage.removeItem("token");

        // window.location.href = "./login.html";
    }
})