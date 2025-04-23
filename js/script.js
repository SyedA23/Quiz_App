// Utility Functions
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString();
}

function getOrdinalSuffix(rank) {
  if (rank > 3 && rank < 21) return "th";
  switch (rank % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

// User Management
function loadUsers() {
  try {
    let users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Error loading users:", error);
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem("users", JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users:", error);
  }
}

function getLoggedInUser() {
  try {
    const loggedInUserString = localStorage.getItem("loggedInUser");
    return loggedInUserString ? JSON.parse(loggedInUserString) : null;
  } catch (error) {
    console.error("Error parsing loggedIn user:", error);
    return null;
  }
}

// Validation Functions
var nameErr = document.getElementById("name-err");
var emailErr = document.getElementById("email-err");
var passwordErr = document.getElementById("password-err");

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    emailErr.textContent = "Invalid Email ID";
    return false;
  }
  return true;
}

function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  if (!passwordRegex.test(password)) {
    passwordErr.innerHTML =
      "Password Must Contains at least Uppercase, <br>Lowercase, Number(0-9) and a <br>special character";
    return false;
  }
  return true;
}

function validateFullName(fullName) {
  const fullNameRegex = /^[a-zA-Z\s'.-]{2,50}$/;
  if (!fullNameRegex.test(fullName)) {
    nameErr.textContent =
      "Name should not contain any special characters or numbers";
    return false;
  }
  return true;
}

// Auth Functions
function signup() {
  nameErr.textContent = "";
  passwordErr.textContent = "";
  emailErr.textContent = "";

  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("emailId").value;
  const password = document.getElementById("password").value;
  const checkbox = document.getElementById("terms");

  if (!fullName || !email || !password) {
    if (!fullName) nameErr.textContent = "Name is required";
    if (!password) passwordErr.textContent = "Password is required";
    if (!email) emailErr.textContent = "Email is required";
    return;
  }

  if (
    !validateFullName(fullName) ||
    !validateEmail(email) ||
    !validatePassword(password)
  ) {
    return;
  }

  if (!checkbox.checked) {
    alert("You must accept the terms and conditions to sign up.");
    return;
  }

  const users = loadUsers();
  if (users.some((user) => user.email === email)) {
    emailErr.textContent = "Email already registered";
    return;
  }

  users.push({ fullName, email, password: simpleHash(password) });
  saveUsers(users);
  alert("Sign Up Successful");
  window.location.href = "index.html";
}

function login() {
  const email = document.getElementById("emailId").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    passwordErr.textContent = password ? "" : "Password is required";
    emailErr.textContent = email ? "" : "Email is required";
    return;
  }

  if (!validateEmail(email) || !validatePassword(password)) {
    return;
  }

  const users = loadUsers();
  const user = users.find(
    (u) => u.email === email && u.password === simpleHash(password)
  );

  if (user) {
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({
        email: user.email,
        fullName: user.fullName
      })
    );
    alert("Login Successful");
    window.location.href = "home.html";
  } else {
    alert("Invalid Email or Password");
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// Quiz Functions
let questions = [];
let currentQuestionIndex = 0;
let selectedAnswers = JSON.parse(localStorage.getItem("selectedAnswers")) || {};

function getRandomQuestions() {
  try {
    const allQuestions =
      JSON.parse(localStorage.getItem("quizQuestions")) || [];
    if (allQuestions.length < 10) {
      console.error("Not enough questions available");
      return [];
    }

    // Fisher-Yates shuffle
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    return allQuestions.slice(0, 10);
  } catch (error) {
    console.error("Error getting random questions:", error);
    return [];
  }
}

function displayQuestion() {
  const quizContainer = document.getElementById("quiz-container");
  if (!quizContainer) return;

  if (currentQuestionIndex >= questions.length) {
    quizContainer.innerHTML = "<h3>Quiz Completed! Thank you.</h3>";
    return;
  }

  const questionObj = questions[currentQuestionIndex];
  let questionHTML = `
    <h2 id="question-counter"></h2>
    <div class="progress-bar">
      <div class="progress" id="progress"></div>
    </div>
    <h3 id="question-title">${currentQuestionIndex + 1}. ${
    questionObj.question
  }</h3>
    <ol class="options" id="options">
  `;

  questionObj.options.forEach((option) => {
    const isChecked =
      selectedAnswers[questionObj.question] === option.id ? "checked" : "";
    questionHTML += `
      <li>
        <label>
          <input type="radio" name="question" value="${option.id}" ${isChecked}>
          ${option.value}
        </label>
      </li>
    `;
  });

  questionHTML += `</ol>`;
  quizContainer.innerHTML = questionHTML;

  updateProgressBar();
  updateQuestionCounter();
}

function updateProgressBar() {
  const progress = document.getElementById("progress");
  if (progress) {
    const percent = ((currentQuestionIndex + 1) / questions.length) * 100;
    progress.style.width = `${percent}%`;
  }
}

function updateQuestionCounter() {
  const counter = document.getElementById("question-counter");
  if (!counter) return;

  if (currentQuestionIndex === questions.length - 2) {
    counter.textContent = "Last 2 Questions Left";
  } else if (currentQuestionIndex === questions.length - 1) {
    counter.textContent = "Hey this is the Last Question";
  } else {
    counter.textContent = `Question ${currentQuestionIndex + 1} of ${
      questions.length
    }`;
  }
}

function nextQuestion() {
  const selectedOption = document.querySelector(
    "input[name='question']:checked"
  );
  if (!selectedOption) {
    alert("Please select an option before proceeding.");
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  selectedAnswers[currentQuestion.question] = parseInt(selectedOption.value);
  localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    calculateAndSubmitScore();
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
}

function calculateAndSubmitScore() {
  let score = 0;
  questions.forEach((q) => {
    if (selectedAnswers[q.question] === q.answer) {
      score += 10;
    }
  });

  updateLeaderboard(score);
  localStorage.setItem("finalAnswers", JSON.stringify(selectedAnswers));
  window.location.href = "leaderboard.html";
}

// Leaderboard Functions
function updateLeaderboard(score) {
  const loggedInUser = getLoggedInUser();
  if (!loggedInUser) return false;

  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const existingIndex = leaderboard.findIndex(
    (u) => u.email === loggedInUser.email
  );

  const entry = {
    name: loggedInUser.fullName,
    email: loggedInUser.email,
    score: score,
    timestamp: Date.now()
  };

  if (existingIndex >= 0) {
    if (score > leaderboard[existingIndex].score) {
      leaderboard[existingIndex] = entry;
    }
  } else {
    leaderboard.push(entry);
  }

  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  return true;
}

function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const currentUser = getLoggedInUser();

  // Sort by score descending
  leaderboard.sort((a, b) => b.score - a.score);

  // Update Top 3
  const topThree = leaderboard.slice(0, 3);
  if (topThree[0]) {
    document.getElementById("firstName").textContent = topThree[0].name;
    document.getElementById("first").textContent = topThree[0].score;
  }
  if (topThree[1]) {
    document.getElementById("secondName").textContent = topThree[1].name;
    document.getElementById("second").textContent = topThree[1].score;
  }
  if (topThree[2]) {
    document.getElementById("thirdName").textContent = topThree[2].name;
    document.getElementById("third").textContent = topThree[2].score;
  }

  // Show current user rank
  const currentIndex = leaderboard.findIndex(
    (u) => u.email === currentUser?.email
  );
  const rankHeading = document.getElementById("rank-heading");
  const rankSubtext = document.getElementById("rank");

  if (currentUser && currentIndex !== -1) {
    rankHeading.textContent = `Wow! You Rank ${
      currentIndex + 1
    }${getOrdinalSuffix(currentIndex + 1)}`;
    rankSubtext.textContent = `Keep it up, ${currentUser.name}!`;

    const currentUserDiv = document.querySelector(".current-user");
    if (currentUserDiv) {
      currentUserDiv.querySelector(".current-user-rank").textContent = `#${
        currentIndex + 1
      }`;
      currentUserDiv.querySelector(".current-user-name").textContent =
        currentUser.name;
      currentUserDiv.querySelector(".current-user-score").textContent =
        leaderboard[currentIndex].score;
    }
  }

  // Display other users
  const otherUsersContainer = document.querySelector(".other-users-container");
  if (otherUsersContainer) {
    otherUsersContainer.innerHTML = "";
    leaderboard.slice(3).forEach((user, index) => {
      const userDiv = document.createElement("div");
      userDiv.className = "other-user";
      userDiv.innerHTML = `
        <div class="other-user-rank">#${index + 4}</div>
        <div class="other-user-name">${user.name}</div>
        <div class="other-user-score">${user.score}</div>
      `;
      otherUsersContainer.appendChild(userDiv);
    });
  }
}

// Initialize Quiz Questions
const quizQuestions = [
  // ... (your existing quiz questions array remains exactly the same)
];

// Event Listeners and Initialization
document.addEventListener("DOMContentLoaded", function () {
  // Initialize quiz questions if not already set
  if (!localStorage.getItem("quizQuestions")) {
    localStorage.setItem("quizQuestions", JSON.stringify(quizQuestions));
  }

  // Set up quiz navigation buttons
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  if (nextBtn) nextBtn.addEventListener("click", nextQuestion);
  if (prevBtn) prevBtn.addEventListener("click", prevQuestion);

  // Set up logout button
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("selectedAnswers");
      localStorage.removeItem("finalAnswers");
      logout();
    });
  }

  // Profile photo popup
  const profilePhoto = document.getElementById("profile-photo");
  const popupContainer = document.getElementById("popup-container");
  if (profilePhoto && popupContainer) {
    profilePhoto.addEventListener("click", (e) => {
      e.stopPropagation();
      popupContainer.classList.toggle("hidden");
    });

    document.addEventListener("click", function (e) {
      if (
        !profilePhoto.contains(e.target) &&
        !popupContainer.contains(e.target)
      ) {
        popupContainer.classList.add("hidden");
      }
    });
  }

  // Load appropriate content based on page
  if (window.location.pathname.includes("quiz")) {
    loadQuiz();
  } else if (window.location.pathname.includes("leaderboard")) {
    displayLeaderboard();
  }
});

function loadQuiz() {
  questions = getRandomQuestions();
  if (questions.length === 0) {
    alert("Error loading quiz questions. Please try again later.");
    return;
  }
  displayQuestion();
}

// Start quiz function
function startQuiz() {
  localStorage.removeItem("selectedAnswers");
  localStorage.removeItem("finalAnswers");
  window.location.href = "quizstartpage.html";
}
