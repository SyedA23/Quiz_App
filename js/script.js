function loadUsers() {
  let users = localStorage.getItem("users");
  if (users) {
    return JSON.parse(users);
  } else {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

var nameErr = document.getElementById("name-err");
var emailErr = document.getElementById("email-err");
var passwordErr = document.getElementById("password-err");

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    // alert("Invalid Email ID");
    emailErr.textContent = "Invalid Email ID";
    return false;
  }
  return true;
}
function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  if (!passwordRegex.test(password)) {
    // alert("Password Must Contains at least Uppercase, Lowercase, Number(0-9) and a special character");
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
function signup() {
  nameErr.textContent = "";
  passwordErr.textContent = "";
  emailErr.textContent = "";
  var fullName = document.getElementById("fullName").value;
  var email = document.getElementById("emailId").value;
  var password = document.getElementById("password").value;
  var checkbox = document.getElementById("terms");

  if (fullName === "" || email === "" || password === "") {
    // alert("Please Fill Required Fields");
    if (fullName === "") nameErr.textContent = "Name is required";
    if (password === "") passwordErr.textContent = "Password is required";
    if (email === "") emailErr.textContent = "Email is required";
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
  var users = loadUsers();
  users.push({ fullName, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Sign Up Successfull");
  console.log(users);
  window.location.href = "index.html";
}
function login() {
  var email = document.getElementById("emailId").value;
  var password = document.getElementById("password").value;
  if (email === "admin@gmail.com" && password === "admin") {
    alert("Admin Login Successfull");
    window.location.href = "./Admin Panel/dashboard.html";
    return;
  }

  if (email === "" || password === "") {
    // alert("Email and Password are required");
    passwordErr.textContent = "Password is required";
    emailErr.textContent = "Email is required";
    return;
  }

  if (!validateEmail(email) || !validatePassword(password)) {
    // if (!validateEmail(email))
    return;
  }

  var users = loadUsers();
  let userFound = false;
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      // users[i].isLoggedIn = true;
      var loggedInUser = {
        email: users[i].email,
        fullName: users[i].fullName
      };
      // saveUsers(users);
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      alert("Login Successful");
      window.location.href = "home.html";
      userFound = true;
      break;
    }
  }
  if (!userFound) {
    alert("Invalid Email or Password");
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

function getLoggedInUser() {
  const loggedInUserString = localStorage.getItem("loggedInUser");
  if (loggedInUserString) {
    try {
      return JSON.parse(loggedInUserString);
    } catch (error) {
      console.error("Error parsing loggedIn user from localStorage:", error);
      return null; // Or handle the error as needed
    }
  }
  return null;
}

const quizQuestions = [
  // HTML Questions
  {
    question: "What does HTML stand for?",
    options: [
      { id: 1, value: "Hyper Text Markup Language" },
      { id: 2, value: "High Tech Modern Language" },
      { id: 3, value: "Hyper Transfer Machine Learning" },
      { id: 4, value: "Hyperlink and Text Markup Language" }
    ],
    answer: 1
  },
  {
    question: "Which HTML tag is used to create a hyperlink?",
    options: [
      { id: 1, value: "<a>" },
      { id: 2, value: "<link>" },
      { id: 3, value: "<href>" },
      { id: 4, value: "<url>" }
    ],
    answer: 1
  },
  {
    question: "What is the correct way to comment in HTML?",
    options: [
      { id: 1, value: "// Comment" },
      { id: 2, value: "<!-- Comment -->" },
      { id: 3, value: "/* Comment */" },
      { id: 4, value: "{ Comment }" }
    ],
    answer: 2
  },
  {
    question: "Which tag is used to define an unordered list in HTML?",
    options: [
      { id: 1, value: "<ul>" },
      { id: 2, value: "<ol>" },
      { id: 3, value: "<li>" },
      { id: 4, value: "<list>" }
    ],
    answer: 1
  },
  {
    question: "What is the purpose of the <meta> tag in HTML?",
    options: [
      { id: 1, value: "Defines metadata" },
      { id: 2, value: "Creates a new paragraph" },
      { id: 3, value: "Links an external stylesheet" },
      { id: 4, value: "Displays an image" }
    ],
    answer: 1
  },

  // CSS Questions
  {
    question: "Which property is used to change the text color in CSS?",
    options: [
      { id: 1, value: "text-color" },
      { id: 2, value: "font-color" },
      { id: 3, value: "color" },
      { id: 4, value: "text-style" }
    ],
    answer: 3
  },
  {
    question: "Which CSS property is used to make a website responsive?",
    options: [
      { id: 1, value: "flexbox" },
      { id: 2, value: "grid" },
      { id: 3, value: "media queries" },
      { id: 4, value: "animation" }
    ],
    answer: 3
  },
  {
    question: "What is the default position value in CSS?",
    options: [
      { id: 1, value: "absolute" },
      { id: 2, value: "relative" },
      { id: 3, value: "static" },
      { id: 4, value: "fixed" }
    ],
    answer: 3
  },
  {
    question:
      "Which CSS unit is relative to the font size of the root element?",
    options: [
      { id: 1, value: "px" },
      { id: 2, value: "rem" },
      { id: 3, value: "em" },
      { id: 4, value: "%" }
    ],
    answer: 2
  },
  {
    question:
      "Which property is used to create space inside an element’s border?",
    options: [
      { id: 1, value: "margin" },
      { id: 2, value: "padding" },
      { id: 3, value: "spacing" },
      { id: 4, value: "border-spacing" }
    ],
    answer: 2
  },

  // JavaScript Questions
  {
    question: "Which keyword is used to declare a variable in JavaScript?",
    options: [
      { id: 1, value: "var" },
      { id: 2, value: "let" },
      { id: 3, value: "const" },
      { id: 4, value: "All of the above" }
    ],
    answer: 4
  },
  {
    question: "Which function is used to print output in the console?",
    options: [
      { id: 1, value: "print()" },
      { id: 2, value: "log()" },
      { id: 3, value: "console.log()" },
      { id: 4, value: "write()" }
    ],
    answer: 3
  },
  {
    question: "How do you declare a function in JavaScript?",
    options: [
      { id: 1, value: "function myFunc() {}" },
      { id: 2, value: "def myFunc() {}" },
      { id: 3, value: "myFunc = function() {}" },
      { id: 4, value: "Both 1 and 3" }
    ],
    answer: 4
  },
  {
    question: "Which method is used to add an element at the end of an array?",
    options: [
      { id: 1, value: "push()" },
      { id: 2, value: "pop()" },
      { id: 3, value: "shift()" },
      { id: 4, value: "unshift()" }
    ],
    answer: 1
  },
  {
    question: "What does `typeof null` return in JavaScript?",
    options: [
      { id: 1, value: "null" },
      { id: 2, value: "undefined" },
      { id: 3, value: "object" },
      { id: 4, value: "string" }
    ],
    answer: 3
  },

  {
    question: "Which operator is used for strict equality comparison?",
    options: [
      { id: 1, value: "==" },
      { id: 2, value: "===" },
      { id: 3, value: "!=" },
      { id: 4, value: "<=>" }
    ],
    answer: 2
  },
  {
    question: "Which method is used to convert a string into an integer?",
    options: [
      { id: 1, value: "parseInt()" },
      { id: 2, value: "parseFloat()" },
      { id: 3, value: "toFixed()" },
      { id: 4, value: "Number()" }
    ],
    answer: 1
  }
];

// Store in localStorage
localStorage.setItem("quizQuestions", JSON.stringify(quizQuestions));

console.log("Quiz questions stored in localStorage!");

function getRandomQuestions() {
  let questions = JSON.parse(localStorage.getItem("quizQuestions"));

  if (!questions) {
    console.error("No quiz questions found in localStorage!");
    return [];
  }

  // Shuffle and get 10 random questions
  questions = questions.sort(() => Math.random() - 0.5);
  return questions.slice(0, 10);
}

// Global Variables
let questions = [];
let currentQuestionIndex = 0;
let selectedAnswers = {};

// Function to fetch 10 random questions on page load
function loadQuiz() {
    let allQuestions = JSON.parse(localStorage.getItem("quizQuestions")) || [];
    
    if (allQuestions.length < 10) {
        console.error("Not enough questions in localStorage!");
        return;
    }

    // Select 10 random questions
    questions = allQuestions.sort(() => Math.random() - 0.5).slice(0, 10);

    // Display the first question
    displayQuestion();
}

// Function to display the current question
function displayQuestion() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = ""; // Clear previous content

    if (currentQuestionIndex >= questions.length) {
        quizContainer.innerHTML = "<h3>Quiz Completed! Thank you.</h3>";
        console.log("Selected Answers:", selectedAnswers);
        return;
    }

    const questionObj = questions[currentQuestionIndex];

    // Inject Question HTML
    let questionHTML = `
        <h3>${currentQuestionIndex + 1}. ${questionObj.question}</h3>
        <ul>
    `;

    questionObj.options.forEach(option => {
        const isChecked = selectedAnswers[questionObj.id] === option.id ? "checked" : "";
        questionHTML += `
            <li>
                <label>
                    <input type="radio" name="question${questionObj.id}" value="${option.id}" ${isChecked}>
                    ${option.value}
                </label>
            </li>
        `;
    });

    questionHTML += "</ul>";

    // Inject Next Button
    questionHTML += `<button onclick="nextQuestion()">Submit & Continue →</button>`;

    quizContainer.innerHTML = questionHTML;
}

// Function to handle next question
function nextQuestion() {
    const selectedOption = document.querySelector(`input[name="question${questions[currentQuestionIndex].id}"]:checked`);
    
    if (!selectedOption) {
        alert("Please select an option before proceeding.");
        return;
    }

    // Store the selected answer
    selectedAnswers[questions[currentQuestionIndex].id] = parseInt(selectedOption.value);

    // Move to the next question
    currentQuestionIndex++;
    displayQuestion();
}

// Load quiz when the page loads
window.onload = loadQuiz;

