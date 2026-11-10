/* =========================================
   MINI TWEET - MICRO BLOGGING APPLICATION
========================================= */


/* =========================================
   FIVE BUILT-IN USER PICTURES
========================================= */

const images = {
    alex:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",

    david:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",

    sophia:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",

    michael:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",

    emma:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80"
};


/* =========================================
   INITIAL POSTS
========================================= */

const defaultPosts = [

    {
        id: 1,
        name: "Sophia Lee",
        username: "@sophialee",
        avatar: images.sophia,
        text:
            "Just finished designing my new portfolio! 🎨 What do you think about the new purple theme?",
        image:
            "https://images.unsplash.com/photo-1558655146-d09347e92766?w=900&q=80",
        likes: 124,
        comments: 18,
        reposts: 12,
        liked: false,
        reposted: false,
        time: "2h"
    },

    {
        id: 2,
        name: "David Smith",
        username: "@davidsmith",
        avatar: images.david,
        text:
            "Learning JavaScript is one of the best decisions I have made. Small projects every day really make a difference. 💻",
        image: null,
        likes: 89,
        comments: 11,
        reposts: 7,
        liked: false,
        reposted: false,
        time: "4h"
    },

    {
        id: 3,
        name: "Michael Brown",
        username: "@michaelb",
        avatar: images.michael,
        text:
            "Beautiful morning for a walk. Sometimes the best ideas come when you step away from the screen. ☀️",
        image:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80",
        likes: 207,
        comments: 26,
        reposts: 19,
        liked: false,
        reposted: false,
        time: "6h"
    },

    {
        id: 4,
        name: "Emma Wilson",
        username: "@emmawilson",
        avatar: images.emma,
        text:
            "Reading, learning and building something new every day. 🚀 #StudentLife #Learning",
        image: null,
        likes: 64,
        comments: 8,
        reposts: 4,
        liked: false,
        reposted: false,
        time: "8h"
    }
];


/* =========================================
   GET POSTS FROM LOCAL STORAGE
========================================= */

let posts = JSON.parse(
    localStorage.getItem("miniTweetPosts")
);

if (!posts) {
    posts = defaultPosts;
    savePosts();
}


/* =========================================
   SAVE POSTS
========================================= */

function savePosts() {

    localStorage.setItem(
        "miniTweetPosts",
        JSON.stringify(posts)
    );
}


/* =========================================
   HTML ESCAPE
   Prevents HTML injection in posts
========================================= */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================================
   DISPLAY POSTS
========================================= */

function renderPosts(searchTerm = "") {

    const feed = document.getElementById("feed");

    let filteredPosts = posts.filter(post => {

        const searchableText =
            `${post.name} ${post.username} ${post.text}`
                .toLowerCase();

        return searchableText.includes(
            searchTerm.toLowerCase()
        );
    });


    if (filteredPosts.length === 0) {

        feed.innerHTML = `
            <div class="empty">
                <div class="empty-icon">🔎</div>

                <h3>No posts found</h3>

                <p>
                    Try searching for another word.
                </p>
            </div>
        `;

        return;
    }


    feed.innerHTML = filteredPosts
        .map(post => createPostHTML(post))
        .join("");
}


/* =========================================
   CREATE POST HTML
========================================= */

function createPostHTML(post) {

    const imageHTML = post.image
        ? `
            <img
                class="post-image"
                src="${post.image}"
                alt="Post image"
                loading="lazy"
            >
        `
        : "";


    return `
        <article class="post-card">

            <div class="post-header">

                <img
                    src="${post.avatar}"
                    alt="${escapeHTML(post.name)}"
                >

                <div class="user-info">

                    <strong>
                        ${escapeHTML(post.name)}
                    </strong>

                    <span>
                        ${escapeHTML(post.username)}
                        · ${post.time}
                    </span>

                </div>

                <button class="more-btn">
                    •••
                </button>

            </div>


            <div class="post-text">
                ${escapeHTML(post.text)}
            </div>


            ${imageHTML}


            <div class="post-actions">

                <button
                    class="action-btn"
                    onclick="commentPost(${post.id})"
                >
                    💬
                    <span>${post.comments}</span>
                </button>


                <button
                    class="action-btn ${
                        post.reposted ? "reposted" : ""
                    }"
                    onclick="repostPost(${post.id})"
                >
                    🔁
                    <span>${post.reposts}</span>
                </button>


                <button
                    class="action-btn ${
                        post.liked ? "liked" : ""
                    }"
                    onclick="likePost(${post.id})"
                >
                    ${
                        post.liked
                            ? "❤️"
                            : "♡"
                    }

                    <span>${post.likes}</span>
                </button>


                <button
                    class="action-btn"
                    onclick="sharePost(${post.id})"
                >
                    ↗️
                    <span>Share</span>
                </button>

            </div>

        </article>
    `;
}


/* =========================================
   LIKE POST
========================================= */

function likePost(id) {

    const post = posts.find(
        post => post.id === id
    );

    if (!post) return;


    if (post.liked) {

        post.likes--;

        post.liked = false;

    } else {

        post.likes++;

        post.liked = true;

    }


    savePosts();

    renderPosts(
        document.getElementById("searchInput").value
    );
}


/* =========================================
   REPOST
========================================= */

function repostPost(id) {

    const post = posts.find(
        post => post.id === id
    );

    if (!post) return;


    if (post.reposted) {

        post.reposts--;

        post.reposted = false;

        showToast("Repost removed");

    } else {

        post.reposts++;

        post.reposted = true;

        showToast("Post reposted 🔁");

    }


    savePosts();

    renderPosts(
        document.getElementById("searchInput").value
    );
}


/* =========================================
   COMMENT
========================================= */

function commentPost(id) {

    const post = posts.find(
        post => post.id === id
    );

    if (!post) return;


    const comment = prompt(
        "Write your comment:"
    );


    if (comment && comment.trim()) {

        post.comments++;

        savePosts();

        renderPosts(
            document.getElementById("searchInput").value
        );

        showToast("Comment added 💬");
    }
}


/* =========================================
   SHARE
========================================= */

async function sharePost(id) {

    const post = posts.find(
        post => post.id === id
    );

    if (!post) return;


    const shareText =
        `${post.name}: ${post.text}`;


    if (navigator.share) {

        try {

            await navigator.share({
                title: "MiniTweet",
                text: shareText
            });

        } catch (error) {

            console.log("Share cancelled");

        }

    } else {

        try {

            await navigator.clipboard.writeText(
                shareText
            );

            showToast("Post copied to clipboard 📋");

        } catch (error) {

            alert(shareText);

        }
    }
}


/* =========================================
   PUBLISH NEW POST
========================================= */

const postText =
    document.getElementById("postText");

const publishBtn =
    document.getElementById("publishBtn");

const charCount =
    document.getElementById("charCount");


postText.addEventListener(
    "input",
    function () {

        const length = this.value.length;

        charCount.textContent =
            `${length}/280`;

        publishBtn.disabled =
            length === 0;

    }
);


/* =========================================
   PUBLISH BUTTON
========================================= */

publishBtn.addEventListener(
    "click",
    publishPost
);


/* =========================================
   PUBLISH FUNCTION
========================================= */

function publishPost() {

    const text =
        postText.value.trim();


    if (!text) {

        showToast("Please write something first!");

        return;
    }


    const newPost = {

        id: Date.now(),

        name: "Alex Johnson",

        username: "@alexjohnson",

        avatar: images.alex,

        text: text,

        image: null,

        likes: 0,

        comments: 0,

        reposts: 0,

        liked: false,

        reposted: false,

        time: "now"

    };


    posts.unshift(newPost);

    savePosts();


    postText.value = "";

    charCount.textContent = "0/280";

    publishBtn.disabled = true;


    renderPosts();

    showToast(
        "Your post was published! 🎉"
    );
}


/* =========================================
   SEARCH
========================================= */

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        function () {

            renderPosts(this.value);

        }
    );


/* =========================================
   FOLLOW BUTTONS
========================================= */

document
    .querySelectorAll(".follow-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                if (
                    this.classList.contains(
                        "following"
                    )
                ) {

                    this.classList.remove(
                        "following"
                    );

                    this.textContent =
                        "Follow";

                    showToast(
                        "Unfollowed user"
                    );

                } else {

                    this.classList.add(
                        "following"
                    );

                    this.textContent =
                        "Following";

                    showToast(
                        "You are now following this user! ✓"
                    );
                }

            }
        );

    });


/* =========================================
   NAVIGATION
========================================= */

document
    .querySelectorAll(".nav-item")
    .forEach(item => {

        item.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                document
                    .querySelectorAll(".nav-item")
                    .forEach(nav => {

                        nav.classList.remove(
                            "active"
                        );

                    });


                this.classList.add("active");


                const section =
                    this.dataset.section;


                const title =
                    document.getElementById(
                        "pageTitle"
                    );


                if (section === "home") {

                    title.textContent = "Home";

                    renderPosts();

                }

                else if (
                    section === "explore"
                ) {

                    title.textContent =
                        "Explore";

                    document
                        .getElementById(
                            "searchInput"
                        )
                        .focus();

                }

                else if (
                    section === "notifications"
                ) {

                    title.textContent =
                        "Notifications";

                    showToast(
                        "No new notifications 🔔"
                    );

                }

                else if (
                    section === "profile"
                ) {

                    title.textContent =
                        "Profile";

                    showToast(
                        "Profile page selected 👤"
                    );

                }

            }
        );

    });


/* =========================================
   SIDEBAR POST BUTTON
========================================= */

document
    .getElementById("sidebarPostBtn")
    .addEventListener(
        "click",
        function () {

            postText.focus();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


/* =========================================
   TOAST
========================================= */

let toastTimer;

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );
}


/* =========================================
   INITIALIZE APPLICATION
========================================= */

renderPosts();

publishBtn.disabled = true;