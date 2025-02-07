//show or hide errorDisplay, you must modify its display style attribute.
//Part 2: General Requirements
//Part 3: Registration Form Validation Requirements
//PART 4 : Login form validation

const form = document.getElementById("registration");
const username = form.elements.username; //get the username from html
const email = form.elements.email; //get the email cache it
const password = form.elements.password; //get the password cache it
const reTypedPassword = form.elements.passwordCheck; //get the retyped password to check
const terms = form.elements.terms;

//Retrieve login form and cache it in a varaible
const loginForm = document.getElementById("login");
const loginUserName = loginForm.elements.username;
const loginPassword = loginForm.elements.password;
const LoggedIn=loginForm.elements.persist;

//const ul=document.createElement("ul");
let errorMessage = "";

const errorDisplay = document.getElementById("errorDisplay");
let errormessages = [];
const ul = document.createElement("ul");
errorDisplay.appendChild(ul);

//Regsiteration form submit button click
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (errormessages.length > 0) {
    return false;
  }

  //store in local storage if validation is successfull
  else {
    //USername and email should be in small case
    let userName = username.value.trim().toLowerCase();
    let userEmail = email.value.trim().toLowerCase();
    let userPassword = password.value.trim();
    //Creating a user object to store in local storage
    //adding functionality of unique user
    let userObj = JSON.parse(localStorage.getItem(userName));

    errorMessage = "User already exists pick another User Name";
    //console.log("Line 41",users.Name)
    if (userObj) {
      CheckIfErrorExists(errorMessage);
      //alert("User exists");
    }
    //Set data in localStorage
    else {
      removeErrorIfExists(errorMessage);
      let users = {};
      users = {
        Name: userName,
        Email: userEmail,
        Password: userPassword,
      };

      localStorage.setItem(userName, JSON.stringify(users));
      console.log(localStorage);

      //Clear form fields
      username.value = "";
      email.value = "";
      password.value = "";
      reTypedPassword.value = "";
      terms.checked = false;
      //alert("Successfull Registeration");
      displaySuccess("User successfully Registered.",3000); //Display sucess function displays the message on scrren
    }
  }
});

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const UserName = loginUserName.value.trim();
  const password = loginPassword.value.trim();
  let userObj = JSON.parse(localStorage.getItem(UserName.toLowerCase()));
  console.log(userObj);
  errorMessage = "UserName and Password does not exists. Please correct.";
  if (userObj) {
    removeErrorIfExists(errorMessage);
    errorMessage = "UserName is incorrect.Please retype UserName.";
    if (userObj.Name != UserName.toLowerCase()) {
      //Check for userName
      CheckIfErrorExists(errorMessage);
    } else {
      removeErrorIfExists(errorMessage);
      errorMessage = "Password is incorrect.Please retype password.";
      if (userObj.Password !== password) {
        //Check for matching password
        CheckIfErrorExists(errorMessage);
      } else {
        removeErrorIfExists(errorMessage);
        let successMessage=`Login successfull!! Welcome ${UserName}`
        //if keep me logged in button is checked
        if(LoggedIn.checked===true)
        {
            successMessage += "You will stay logged in."
        }
        else
        {
            successMessage += "You will be logged out soon."
        }
        displaySuccess(successMessage,3000); //Calling success display method, so it will show and remove message as we are not refreshing page after submit 
      }
    }
  } else {
    CheckIfErrorExists(errorMessage); //CHeck if the error alrady exists if not add it
  }
});

//adding validation for userName from Registeration form
username.addEventListener("change", validateUserName);

//adding validation for email from registeration form
email.addEventListener("change", validateEmail);

//adding validation for password from registeration form
password.addEventListener("change", validatePassword);

//adding validation for repeat password from registeration form
reTypedPassword.addEventListener("change", validatePassword);

function validateUserName() {
  const userName = username.value;
  const uniqueChars = new Set(userName); //  Set will give characters which are uniqur so we can check its length
  console.log(uniqueChars);
  const regex = /^[A-Za-z0-9]+$/;
  errorMessage = "Username cannot contain special characters or whitespace.";
  if (!regex.test(userName)) {
    //errorMessage="Username cannot contain special characters or whitespace."
    CheckIfErrorExists(errorMessage);
    username.focus();
  } else {
    removeErrorIfExists(errorMessage);
  }
  //2 Unique characters constraint validation
  errorMessage = "Username should contain atleast 2 unique characters.";
  if (uniqueChars.size < 2) {
    //errorMessage="Username should contain atleast 2 unique characters.";
    CheckIfErrorExists(errorMessage);
    username.focus();
  } else {
    removeErrorIfExists(errorMessage);
  }

  errorMessage = "User already exists pick another User Name";
  let userObj = JSON.parse(localStorage.getItem(userName.toLowerCase())); //Using UserName as key check  if exists in storage
  //console.log("user",users);
  if (userObj) {
    CheckIfErrorExists(errorMessage);
  } else {
    removeErrorIfExists(errorMessage);
  }
}

function validateEmail() {
  const emailValue = email.value;
  //Check for valid email

  errorMessage = "Email is not in a valid format.";
  let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(emailValue)) {
    CheckIfErrorExists(errorMessage);
    email.focus();
  } else {
    removeErrorIfExists(errorMessage);
  }
  //Email should not be from domain example.com
  let domain = emailValue.split("@")[1]; // domain will hld part after @
  errorMessage = "Email cannot be from the domain example.com";
  if (domain && domain.toLowerCase() === "example.com") {
    CheckIfErrorExists(errorMessage);
    email.focus();
  } else {
    removeErrorIfExists(errorMessage);
  }
}

//function to validate password
function validatePassword() {
  const userName = username.value.trim();
  const passwordValue = password.value.trim();
  const confirmPassword = reTypedPassword.value.trim();
  errorMessage =
    "Passwords must have at least one uppercase and one lowercase letter";
  if (!/[a-z]/.test(passwordValue) || !/[A-Z]/.test(passwordValue)) {
    //check there is atleast one upper and lower case
    CheckIfErrorExists(errorMessage);
  } else {
    removeErrorIfExists(errorMessage);
  }

  //Must contain atleast one number
  errorMessage = "Passwords must contain at least one number";
  if (!/[0-9]/.test(passwordValue)) {
    CheckIfErrorExists(errorMessage);
  } else {
    removeErrorIfExists(errorMessage);
  }

  //errormessages.push("Passwords must contain at least one special character.");
  errorMessage = "Passwords must contain at least one special character.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)) {
    //Regex to check at least one special characyer is there
    CheckIfErrorExists(errorMessage);
  } else {
    removeErrorIfExists(errorMessage);
  }

  //Shouldnt contain word password case insensitive
  errorMessage = "Passwords cannot contain the word 'password'.";
  if (/password/i.test(passwordValue)) {
    CheckIfErrorExists(errorMessage);
  } else {
    removeErrorIfExists(errorMessage);
  }

  errorMessage = "Passwords cannot contain the username.";
  if (
    userName &&
    passwordValue.toLowerCase().includes(userName.toLowerCase())
  ) {
    CheckIfErrorExists(errorMessage);
  }
  //errormessages.push("Passwords cannot contain the username.") //Retyped passowrd does not match password
  else {
    removeErrorIfExists(errorMessage);
  }

  errorMessage = "Passwords must match.";
  if (confirmPassword && passwordValue !== confirmPassword) {
    //errormessages.push('Passwords must match.');
    CheckIfErrorExists(errorMessage);
    reTypedPassword.focus();
  } else {
    removeErrorIfExists(errorMessage);
  }
  // if(errormessages.length>0)
  //     displayErrors(errormessages)
}

//Function to display successfull message after registeration
function displaySuccess(successMessage,duration) {
  errorDisplay.textContent = successMessage;
  errorDisplay.style.display = "block";
  errorDisplay.style.color = "green";
  setTimeout(() => {
    errorDisplay.innerHTML = ""; 
    errorDisplay.style.display = "none";// Clear the message
  }, duration);
}

function displayErrors(errormessages) {
  ul.innerHTML = "";

  console.log("Error called", errormessages.length);
  if (errormessages.length > 0) {
    console.log("Display", errormessages);
    errorDisplay.appendChild(ul);
    errormessages.forEach(function (message) {
      const li = document.createElement("li");
      li.textContent = message;
      ul.appendChild(li);
    });
    errorDisplay.style.display = "block";
  } else {
    errorDisplay.innerHTML = "";
    errorDisplay.style.display = "none";
  }
}
function ClearErrorMessages() {
  //errormessages=[]
  errorDisplay.innerHTML = "";
  errorDisplay.style.display = "none";
}
function removeErrorIfExists(message) {
  console.log(message);
  console.log("Remove", errormessages);

  console.log(errormessages.includes(message));
  if (errormessages.includes(message)) {
    // If yes, remove it
    const index = errormessages.indexOf(message);
    errormessages.splice(index, 1);
    const ul = document.querySelector("ul");
    const liList = document.querySelectorAll("li");
    liList.forEach((li) => {
      console.log(li.textContent.includes(message));
      if (li.textContent.includes(message)) {
        ul.removeChild(li);
      }
    });
    displayErrors(errormessages);
  }
}
function CheckIfErrorExists(message) {
  //console.log("If exists",errormessages);

  //console.log("If exists",message);
  if (!errormessages.includes(message)) {
    errormessages.push(message);
  }
  displayErrors(errormessages);
}

