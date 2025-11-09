// ---------- Utility: Cookie Helpers ----------
function setCookie(name, value, days = 7) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/`;
}
function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
}
function eraseCookie(name) {
    document.cookie = `${name}=; Max-Age=-99999999; path=/`;
}

// ---------- DOM Elements ----------
const likeBtn = document.getElementById("like-btn");
const dislikeBtn = document.getElementById("dislike-btn");
const likeCountEl = document.getElementById("like-count");
const dislikeCountEl = document.getElementById("dislike-count");
const commentInput = document.getElementById("comment-input");
const submitBtn = document.getElementById("submit-btn");
const clearBtn = document.getElementById("clear-btn");
const commentsList = document.getElementById("comments-list");
const resetBtn = document.getElementById("reset-btn");

// ---------- State ----------
let likes = 100;
let dislikes = 20;
let comments = [];

// ---------- Load cookies on start ----------
window.onload = () => {
    const savedChoice = getCookie("vote");
    const savedComments = getCookie("comments");

    if (savedChoice === "like") {
        likeBtn.disabled = true;
        dislikeBtn.disabled = true;
    } else if (savedChoice === "dislike") {
        likeBtn.disabled = true;
        dislikeBtn.disabled = true;
    }

    if (savedComments) {
        comments = JSON.parse(savedComments);
        renderComments();
    }
};

// ---------- Update Display ----------
function renderComments() {
    commentsList.innerHTML = "";
    comments.forEach(c => {
        const li = document.createElement("li");
        li.textContent = c;
        commentsList.appendChild(li);
    });
}

// ---------- Like / Dislike Handlers ----------
likeBtn.addEventListener("click", () => {
    if (getCookie("vote")) {
        alert("You already voted!");
        return;
    }
    likes++;
    likeCountEl.textContent = likes;
    setCookie("vote", "like");
    likeBtn.disabled = true;
    dislikeBtn.disabled = true;
});

dislikeBtn.addEventListener("click", () => {
    if (getCookie("vote")) {
        alert("You already voted!");
        return;
    }
    dislikes++;
    dislikeCountEl.textContent = dislikes;
    setCookie("vote", "dislike");
    likeBtn.disabled = true;
    dislikeBtn.disabled = true;
});

// ---------- Comment Submission ----------
submitBtn.addEventListener("click", () => {
    if (getCookie("commented")) {
        alert("You already submitted a comment!");
        return;
    }
    const text = commentInput.value.trim();
    if (text === "") return alert("Please write something first!");
    comments.push(text);
    renderComments();
    commentInput.value = "";
    setCookie("comments", JSON.stringify(comments));
    setCookie("commented", "true");
});

clearBtn.addEventListener("click", () => {
    commentInput.value = "";
});

// ---------- Reset ----------
resetBtn.addEventListener("click", () => {
    if (!confirm("Are you sure you want to reset likes, dislikes, and comments?")) return;
    eraseCookie("vote");
    eraseCookie("comments");
    eraseCookie("commented");
    likes = 100;
    dislikes = 20;
    comments = [];
    likeCountEl.textContent = likes;
    dislikeCountEl.textContent = dislikes;
    likeBtn.disabled = false;
    dislikeBtn.disabled = false;
    renderComments();
    alert("Reset complete! You can vote and comment again.");
});
