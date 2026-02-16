/****************************
 * script.js - Final merged version
 * - Signup / Login / Logout
 * - Profile popup toggle
 * - Quiz initialization, rendering & navigation
 * - Progress bar
 * - Save / Load leaderboard with best-score rank display
 ****************************/

/****************************
 * SIGNUP FUNCTION
 ****************************/
function signup(event) {
  if (event) event.preventDefault();

  const name = document.getElementById("name")?.value?.trim();
  const email = document.getElementById("emailId")?.value?.trim();
  const password = document.getElementById("password")?.value?.trim();

  if (!name || !email || !password) {
    alert("All fields are required!");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const exists = users.some((u) => u.email === email);

  if (exists) {
    alert("User already exists! Please login.");
    window.location.href = "login.html";
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful! Please login.");
  window.location.href = "login.html";
}

/****************************
 * LOGIN FUNCTION
 ****************************/
function login(event) {
  if (event) event.preventDefault();

  const email = document.getElementById("emailId")?.value?.trim();
  const password = document.getElementById("password")?.value?.trim();

  const emailErr = document.getElementById("email-err");
  const passwordErr = document.getElementById("password-err");

  if (emailErr) emailErr.textContent = "";
  if (passwordErr) passwordErr.textContent = "";

  let hasError = false;
  if (!email) {
    if (emailErr) emailErr.textContent = "Email is required";
    hasError = true;
  }
  if (!password) {
    if (passwordErr) passwordErr.textContent = "Password is required";
    hasError = true;
  }
  if (hasError) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const existingUser = users.find(
    (u) => u.email === email && u.password === password
  );

  if (existingUser) {
    localStorage.setItem("loggedInUser", JSON.stringify(existingUser));
    window.location.href = "home.html";
  } else {
    alert("Invalid email or password!");
  }
}

/****************************
 * LOGOUT FUNCTION
 ****************************/
function logout() {
  localStorage.removeItem("loggedInUser");
  alert("You have been logged out successfully!");
  window.location.href = "login.html";
}

/****************************
 * AUTH CHECK
 ****************************/
function checkAuthStatus() {
  // Skip auth check for login and signup pages
  if (
    window.location.pathname.includes("login.html") ||
    window.location.pathname.includes("signup.html")
  ) {
    return;
  }

  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    // Redirect to login for protected pages
    window.location.href = "login.html";
  }
}

/****************************
 * PROFILE POPUP (used on Home / Quiz / Leaderboard)
 ****************************/
function attachProfilePopup() {
  const profilePhoto = document.getElementById("profile-photo");
  const popupContainer = document.getElementById("popup-container");
  const logoutBtn = document.getElementById("logout-btn");

  if (!profilePhoto || !popupContainer) return;

  // Toggle popup on profile click
  profilePhoto.addEventListener("click", (e) => {
    e.stopPropagation();
    popupContainer.classList.toggle("hidden");
  });

  // Close popup when clicking outside
  document.addEventListener("click", (e) => {
    if (!popupContainer.contains(e.target) && e.target !== profilePhoto) {
      popupContainer.classList.add("hidden");
    }
  });

  // Attach logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}

/****************************
 * QUIZ QUESTIONS (default pool)
 ****************************/
const quizQuestions = [
  // HTML
  {
    question: "What does HTML stand for?",
    options: [
      { id: 1, value: "HyperText Markup Language" },
      { id: 2, value: "HighText Machine Language" },
      { id: 3, value: "Hyperlink Markup Language" },
      { id: 4, value: "None of the above" }
    ],
    answer: 1
  },
  {
    question: "Which tag is used to create a hyperlink in HTML?",
    options: [
      { id: 1, value: "<a>" },
      { id: 2, value: "<link>" },
      { id: 3, value: "<href>" },
      { id: 4, value: "<url>" }
    ],
    answer: 1
  },
  {
    question: "Which attribute specifies an image source in HTML?",
    options: [
      { id: 1, value: "src" },
      { id: 2, value: "href" },
      { id: 3, value: "alt" },
      { id: 4, value: "source" }
    ],
    answer: 1
  },
  {
    question: "Which tag is used to display a table row in HTML?",
    options: [
      { id: 1, value: "<td>" },
      { id: 2, value: "<tr>" },
      { id: 3, value: "<th>" },
      { id: 4, value: "<row>" }
    ],
    answer: 2
  },
  {
    question: "Which doctype is correct for HTML5?",
    options: [
      { id: 1, value: "<!DOCTYPE HTML5>" },
      { id: 2, value: "<!DOCTYPE html>" },
      { id: 3, value: "<DOCTYPE html5>" },
      { id: 4, value: "<html doctype>" }
    ],
    answer: 2
  },

  // CSS
  {
    question: "Which CSS property controls the text size?",
    options: [
      { id: 1, value: "font-style" },
      { id: 2, value: "text-size" },
      { id: 3, value: "font-size" },
      { id: 4, value: "text-style" }
    ],
    answer: 3
  },
  {
    question: "How do you select an element with id 'demo' in CSS?",
    options: [
      { id: 1, value: ".demo" },
      { id: 2, value: "#demo" },
      { id: 3, value: "demo" },
      { id: 4, value: "*demo" }
    ],
    answer: 2
  },
  {
    question: "Which property is used for background color?",
    options: [
      { id: 1, value: "color" },
      { id: 2, value: "background-color" },
      { id: 3, value: "bgcolor" },
      { id: 4, value: "background" }
    ],
    answer: 2
  },
  {
    question: "Which unit is relative to the root element font-size?",
    options: [
      { id: 1, value: "em" },
      { id: 2, value: "rem" },
      { id: 3, value: "%" },
      { id: 4, value: "px" }
    ],
    answer: 2
  },
  {
    question: "Which CSS property is used to make text bold?",
    options: [
      { id: 1, value: "font-style" },
      { id: 2, value: "font-weight" },
      { id: 3, value: "font-bold" },
      { id: 4, value: "text-weight" }
    ],
    answer: 2
  },

  // JavaScript
  {
    question: "Which symbol is used for comments in JavaScript?",
    options: [
      { id: 1, value: "//" },
      { id: 2, value: "/* */" },
      { id: 3, value: "#" },
      { id: 4, value: "<!-- -->" }
    ],
    answer: 1
  },
  {
    question: "Which keyword is used to declare a variable in JS?",
    options: [
      { id: 1, value: "var" },
      { id: 2, value: "let" },
      { id: 3, value: "const" },
      { id: 4, value: "All of the above" }
    ],
    answer: 4
  },
  {
    question: "Which operator is used to compare both value and type?",
    options: [
      { id: 1, value: "==" },
      { id: 2, value: "===" },
      { id: 3, value: "=" },
      { id: 4, value: "!=" }
    ],
    answer: 2
  },
  {
    question: "What is the output of typeof null?",
    options: [
      { id: 1, value: "null" },
      { id: 2, value: "undefined" },
      { id: 3, value: "object" },
      { id: 4, value: "boolean" }
    ],
    answer: 3
  },
  {
    question: "Which function is used to parse JSON in JavaScript?",
    options: [
      { id: 1, value: "JSON.parse()" },
      { id: 2, value: "JSON.stringify()" },
      { id: 3, value: "parse.JSON()" },
      { id: 4, value: "toJSON()" }
    ],
    answer: 1
  },
  {
    question: "What is the default value of uninitialized JS variables?",
    options: [
      { id: 1, value: "null" },
      { id: 2, value: "undefined" },
      { id: 3, value: "0" },
      { id: 4, value: "NaN" }
    ],
    answer: 2
  },
  {
    question: "Which method adds an element at the end of an array?",
    options: [
      { id: 1, value: "push()" },
      { id: 2, value: "pop()" },
      { id: 3, value: "shift()" },
      { id: 4, value: "unshift()" }
    ],
    answer: 1
  },
  {
    question: "Which keyword is used for asynchronous functions in JS?",
    options: [
      { id: 1, value: "await" },
      { id: 2, value: "async" },
      { id: 3, value: "promise" },
      { id: 4, value: "defer" }
    ],
    answer: 2
  },
  {
    question: "Which event is fired when a user clicks an HTML element?",
    options: [
      { id: 1, value: "onchange" },
      { id: 2, value: "onmouseover" },
      { id: 3, value: "onclick" },
      { id: 4, value: "onhover" }
    ],
    answer: 3
  },
  {
    question: "What is the correct way to write an array in JS?",
    options: [
      { id: 1, value: "var colors = (1:'red',2:'green',3:'blue')" },
      { id: 2, value: "var colors = ['red','green','blue']" },
      { id: 3, value: "var colors = 'red','green','blue'" },
      { id: 4, value: "var colors = {1:'red',2:'green',3:'blue'}" }
    ],
    answer: 2
  }
];

// ✅ Step 1: Save only 10 random questions
function loadQuizQuestions() {
  if (!localStorage.getItem("quizQuestions")) {
    // Shuffle and pick 10
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    localStorage.setItem("quizQuestions", JSON.stringify(selected));
  }
}

/****************************
 * QUIZ LOGIC & UI
 ****************************/
let currentQuestion = 0;
let selectedAnswers = {}; // keyed by question index
let savedQuestions = [];
let totalQuestions = 0;

// Elements used on quiz page
let questionCounter,
  questionTitle,
  optionsContainer,
  prevBtn,
  nextBtn,
  progressBar;

function initializeQuizPage() {
  // First, make sure we have questions loaded
  if (!localStorage.getItem("quizQuestions")) {
    loadQuizQuestions(); // Generate questions if they don't exist
  }

  savedQuestions = getLocalStorageItem("quizQuestions");

  if (savedQuestions.length === 0) {
    console.error("No quiz questions found. Please start a new quiz.");
    window.location.href = "home.html"; // Redirect to home if no questions
    return;
  }

  // Now get the DOM elements
  questionCounter = document.getElementById("question-counter");
  questionTitle = document.getElementById("question-title");
  optionsContainer = document.getElementById("options");
  prevBtn = document.getElementById("prevBtn");
  nextBtn = document.getElementById("nextBtn");
  progressBar = document.getElementById("progress");

  totalQuestions = savedQuestions.length;
  currentQuestion = 0;
  selectedAnswers = getLocalStorageItem("selectedAnswers", {});

  if (questionCounter && questionTitle && optionsContainer) {
    loadQuestion();
    attachQuizEventListeners();
  } else {
    console.error("Quiz elements not found on the page");
  }
}

// Add this helper function if it doesn't exist
function getLocalStorageItem(key, defaultValue = []) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function attachQuizEventListeners() {
  // Next button
  if (nextBtn) {
    // Remove any existing event listeners
    const newNextBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    nextBtn = newNextBtn;

    nextBtn.addEventListener("click", () => {
      // Save current selection
      localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));

      if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        loadQuestion();
      } else {
        finishQuiz();
      }
    });
  }

  // Prev button
  if (prevBtn) {
    const newPrevBtn = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    prevBtn = newPrevBtn;

    prevBtn.addEventListener("click", () => {
      // Save current selection
      localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));

      if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
      }
    });
  }
}

function loadQuestion() {
  if (!savedQuestions.length || currentQuestion >= savedQuestions.length) {
    console.error("Quiz questions not available or invalid index");
    return;
  }

  const q = savedQuestions[currentQuestion];

  if (questionCounter) {
    questionCounter.innerText = `Question ${
      currentQuestion + 1
    } of ${totalQuestions}`;
  }

  if (questionTitle) {
    questionTitle.innerText = q.question;
  }

  if (optionsContainer) {
    optionsContainer.innerHTML = "";
    q.options.forEach((opt) => {
      const li = document.createElement("li");
      li.classList.add("option-item");
      li.setAttribute("role", "button");
      li.setAttribute("tabindex", "0");
      li.innerHTML = ""; // clear

      const strong = document.createElement("strong");
      strong.textContent = `${opt.id}.`;

      const span = document.createElement("span");
      span.textContent = ` ${opt.value}`; // ✅ renders "<a>" literally

      li.appendChild(strong);
      li.appendChild(span);

      // Apply selected state
      if (selectedAnswers[currentQuestion] === opt.id) {
        li.classList.add("selected");
      }

      li.addEventListener("click", () => {
        selectedAnswers[currentQuestion] = opt.id;
        // Rerender to reflect selection
        loadQuestion();
      });

      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectedAnswers[currentQuestion] = opt.id;
          loadQuestion();
        }
      });

      optionsContainer.appendChild(li);
    });
  }

  // Prev button state
  if (prevBtn) {
    prevBtn.disabled = currentQuestion === 0;
  }

  // Next button label
  if (nextBtn) {
    nextBtn.innerText =
      currentQuestion === totalQuestions - 1
        ? "Finish Quiz"
        : "Next Question →";
  }

  // Update progress bar
  if (progressBar) {
    progressBar.style.width = `${
      ((currentQuestion + 1) / totalQuestions) * 100
    }%`;
  }
}

function finishQuiz() {
  const qs = savedQuestions || [];
  if (!qs.length) {
    alert("No questions found.");
    return;
  }

  // Check if all questions are answered
  const unanswered = qs.findIndex(
    (_, idx) => !selectedAnswers.hasOwnProperty(idx)
  );
  if (unanswered !== -1) {
    alert(
      `Please answer question ${unanswered + 1} before finishing the quiz.`
    );
    currentQuestion = unanswered;
    loadQuestion();
    return;
  }

  let score = 0;
  qs.forEach((q, idx) => {
    if (Number(selectedAnswers[idx]) === q.answer) score++;
  });

  const percentage = Math.round((score / totalQuestions) * 100);
  alert(
    `Quiz finished! Your score: ${score}/${totalQuestions} (${percentage}%)`
  );

  localStorage.removeItem("selectedAnswers");
  localStorage.removeItem("quizQuestions"); // Reset for next quiz
  saveToLeaderboard(score);
  window.location.href = "leaderboard.html";
}

/****************************
 * LEADERBOARD
 ****************************/
function saveToLeaderboard(score) {
  const loggedInUserData = localStorage.getItem("loggedInUser");
  if (!loggedInUserData) return;

  try {
    const user = JSON.parse(loggedInUserData);
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    const entry = {
      username: user.name,
      email: user.email,
      score: score,
      totalQuestions: totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      date: new Date().toISOString()
    };

    leaderboard.push(entry);

    // Sort by score desc then date desc (recent first when tie)
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.date) - new Date(a.date);
    });

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  } catch (err) {
    console.error("Error saving to leaderboard:", err);
  }
}

function loadLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const loggedInUserData = localStorage.getItem("loggedInUser");
  if (!loggedInUserData) {
    console.error("No logged in user found");
    return;
  }

  try {
    const currentUser = JSON.parse(loggedInUserData);

    // Sort leaderboard consistently
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.date) - new Date(a.date);
    });

    // Get all entries for current user
    const userEntries = leaderboard.filter(
      (entry) => entry.email === currentUser.email
    );

    // Choose best entry: highest score, tie -> latest date
    const bestUserEntry = userEntries.reduce((best, cur) => {
      if (!best) return cur;
      if (cur.score > best.score) return cur;
      if (cur.score === best.score && new Date(cur.date) > new Date(best.date))
        return cur;
      return best;
    }, null);

    const userIndex = bestUserEntry
      ? leaderboard.findIndex(
          (entry) =>
            entry.email === bestUserEntry.email &&
            entry.score === bestUserEntry.score &&
            entry.date === bestUserEntry.date
        )
      : -1;

    // Update rank heading & score display if present
    const rankHeading = document.getElementById("rank-heading");
    const rankScore = document.getElementById("rank");

    if (rankHeading && rankScore && userIndex !== -1) {
      rankHeading.innerText = `Wow! You Rank #${userIndex + 1}`;
      rankScore.innerText = `Your Score: ${bestUserEntry.score}/${bestUserEntry.totalQuestions} (${bestUserEntry.percentage}%)`;
    } else {
      // If not found, show friendly message if elements exist
      if (rankHeading) rankHeading.innerText = `No rank to show yet`;
      if (rankScore) rankScore.innerText = `Complete a quiz to see your rank!`;
    }

    // Fill top 3 (IDs: firstName, first ; secondName, second ; thirdName, third)
    updateTopThree(leaderboard);

    // Fill other users and the current user's card if not in top 3
    updateOtherUsers(leaderboard, userIndex);
  } catch (err) {
    console.error("Error loading leaderboard:", err);
  }
}

function updateTopThree(leaderboard) {
  // expected IDs in DOM
  const firstName = document.getElementById("firstName");
  const firstScore = document.getElementById("first");
  const secondName = document.getElementById("secondName");
  const secondScore = document.getElementById("second");
  const thirdName = document.getElementById("thirdName");
  const thirdScore = document.getElementById("third");

  const top = leaderboard.slice(0, 3);

  if (firstName) firstName.innerText = top[0] ? top[0].username : "---";
  if (firstScore)
    firstScore.innerText = top[0]
      ? `${top[0].score}/${top[0].totalQuestions}`
      : "---";

  if (secondName) secondName.innerText = top[1] ? top[1].username : "---";
  if (secondScore)
    secondScore.innerText = top[1]
      ? `${top[1].score}/${top[1].totalQuestions}`
      : "---";

  if (thirdName) thirdName.innerText = top[2] ? top[2].username : "---";
  if (thirdScore)
    thirdScore.innerText = top[2]
      ? `${top[2].score}/${top[2].totalQuestions}`
      : "---";
}

function updateOtherUsers(leaderboard, userIndex) {
  const currentUserContainer = document.querySelector(".current-users");
  const otherUsersContainer = document.querySelector(".other-users-container");

  // If user isn't in top 3 and exists, show their card separately
  if (currentUserContainer) {
    if (userIndex > 2) {
      const userEntry = leaderboard[userIndex];
      currentUserContainer.innerHTML = `
        <div class="current-user">
          <div class="current-user-rank">#${userIndex + 1}</div>
          <div class="current-user-name">${userEntry.username}</div>
          <div class="current-user-score">${userEntry.score}/${
        userEntry.totalQuestions
      }</div>
        </div>
      `;
    } else {
      currentUserContainer.innerHTML = "";
    }
  }

  if (otherUsersContainer) {
    otherUsersContainer.innerHTML = "";
    leaderboard.forEach((user, index) => {
      if (index > 2 && index !== userIndex) {
        const userHTML = `
          <div class="other-user">
            <div class="other-user-rank">#${index + 1}</div>
            <div class="other-user-name">${user.username}</div>
            <div class="other-user-score">${user.score}/${
          user.totalQuestions
        }</div>
          </div>
        `;
        otherUsersContainer.innerHTML += userHTML;
      }
    });
  }
}

/****************************
 * START QUIZ BUTTON HANDLER
 ****************************/
function startQuiz() {
  if (!localStorage.getItem("loggedInUser")) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  // Reset quiz state
  localStorage.removeItem("selectedAnswers");
  localStorage.removeItem("quizQuestions"); // Reset questions for a new quiz
  loadQuizQuestions(); // Generate new questions

  window.location.href = "quizstartpage.html";
}

/****************************
 * PAGE-SPECIFIC INITIALIZATION
 ****************************/
document.addEventListener("DOMContentLoaded", () => {
  // Check auth first (redirects to login if needed)
  checkAuthStatus();

  // Attach profile popup if profile elements exist
  attachProfilePopup();

  // Page-based initialization:
  const path = window.location.pathname;

  if (path.includes("quizstartpage.html")) {
    // Initialize quiz page after a small delay to ensure DOM is ready
    setTimeout(initializeQuizPage, 100);
  } else if (path.includes("leaderboard.html")) {
    loadLeaderboard();
  } else if (
    path.includes("home.html") ||
    path.endsWith("/") ||
    path.includes("index.html")
  ) {
    // Hook start button on home page to redirect to quiz.html
    const startBtn = document.getElementById("start");
    if (startBtn) {
      startBtn.addEventListener("click", startQuiz);
    }

    // Optionally pre-load quiz questions so they are ready
    loadQuizQuestions();
  }

  // Hook signup/login forms (if present)
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", signup);
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", login);
  }
});
