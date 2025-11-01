// Menü megjelenítés mobilon
document.getElementById("mobile-menu").addEventListener("click", () => {
  document.querySelector(".navbar-menu").classList.toggle("active");
});

// Segédfüggvények
function readUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}
function writeUsers(data) {
  localStorage.setItem("users", JSON.stringify(data));
}
function encodePwd(pwd) {
  return btoa(pwd);
}
function findUser(input) {
  const users = readUsers();
  return users.find(u => u.username === input || u.email === input);
}

// Tab váltás
const tabs = document.querySelectorAll(".tab");
const panes = {
  login: document.getElementById("login"),
  register: document.getElementById("register")
};
const profileCard = document.getElementById("profileCard");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    for (let key in panes)
      panes[key].style.display = key === tab.dataset.tab ? "block" : "none";
    profileCard.classList.remove("visible");
  });
});

// Regisztráció
document.getElementById("regForm").addEventListener("submit", e => {
  e.preventDefault();
  const username = regUser.value.trim();
  const email = regEmail.value.trim();
  const password = regPass.value.trim();

  if (findUser(username) || findUser(email)) {
    regMsg.textContent = "A felhasználónév vagy email már létezik.";
    regMsg.style.color = "red";
    return;
  }

  const users = readUsers();
  users.push({ username, email, password: encodePwd(password), created: new Date().toISOString() });
  writeUsers(users);
  regMsg.textContent = "Sikeres regisztráció!";
  regMsg.style.color = "green";

  setTimeout(() => {
    document.querySelector('.tab[data-tab="login"]').click();
    regForm.reset();
  }, 1000);
});

// Bejelentkezés
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const input = loginUser.value.trim();
  const pass = loginPass.value.trim();

  const user = readUsers().find(u =>
    (u.username === input || u.email === input) &&
    u.password === encodePwd(pass)
  );

  if (!user) {
    loginMsg.textContent = "Hibás bejelentkezési adatok.";
    loginMsg.style.color = "red";
    return;
  }

  sessionStorage.setItem("currentUser", JSON.stringify(user));
  showProfile(user);
});

function showProfile(user) {
  profileName.textContent = user.username;
  profileEmail.textContent = user.email;
  profileJoined.textContent = "Csatlakozott: " + new Date(user.created).toLocaleDateString("hu-HU");
  profileCard.classList.add("visible");
  panes.login.style.display = "none";
  panes.register.style.display = "none";
  tabs.forEach(t => t.classList.remove("active"));
}

// Kijelentkezés
logout.addEventListener("click", () => {
  sessionStorage.removeItem("currentUser");
  profileCard.classList.remove("visible");
  document.querySelector('.tab[data-tab="login"]').classList.add("active");
  panes.login.style.display = "block";
});

// Fiók törlés
deleteAccount.addEventListener("click", () => {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!user) return;
  if (!confirm("Biztosan törlöd a fiókodat?")) return;

  const users = readUsers().filter(u => u.username !== user.username);
  writeUsers(users);
  sessionStorage.removeItem("currentUser");
  profileCard.classList.remove("visible");
  alert("Fiók törölve.");
});

// Automatikus belépés
window.addEventListener("load", () => {
  const cur = JSON.parse(sessionStorage.getItem("currentUser"));
  if (cur) showProfile(cur);
});