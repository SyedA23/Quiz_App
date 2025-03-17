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
  users.push({ fullName: fullName, email: email, password: password });
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
  } else {
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
