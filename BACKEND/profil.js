// --- Mobilmenü toggle ---
document.getElementById("mobile-menu")?.addEventListener("click", () => {
    document.querySelector(".navbar-menu")?.classList.toggle("active");
});

// --- Lapfülek (tabok) kezelése ---
function showTab(tabName, event) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-buttons button');

    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName)?.classList.add('active');
    if (event?.target) event.target.classList.add('active');
}

// --- Regisztráció és bejelentkezés logika ---

// Felhasználó mentése localStorage-be
function saveUser(username, email, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ username, email, password, phone: "", address: "" });
    localStorage.setItem("users", JSON.stringify(users));
}

// Regisztráció
function registerUser() {
    const username = document.querySelector("#register input[placeholder='Felhasználónév']")?.value.trim();
    const email = document.querySelector("#register input[placeholder='Email']")?.value.trim();
    const password = document.querySelector("#register input[placeholder='Jelszó']")?.value.trim();

    if (!username || !email || !password) {
        alert("Minden mezőt ki kell tölteni!");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(u => u.email === email)) {
        alert("Ez az email már regisztrálva van!");
        return;
    }

    saveUser(username, email, password);
    alert("Sikeres regisztráció!");

    // Vissza a bejelentkezés fülre
    const firstBtn = document.querySelector(".tab-buttons button:first-child");
    if (firstBtn) firstBtn.click();
}

// Bejelentkezés
function loginUser() {
    const userOrEmail = document.querySelector("#login input[placeholder='Felhasználónév vagy email']")?.value.trim();
    const password = document.querySelector("#login input[placeholder='Jelszó']")?.value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(u =>
        (u.username === userOrEmail || u.email === userOrEmail) && u.password === password
    );

    if (found) {
        // Beállítjuk a bejelentkezett felhasználót és átirányítunk a profiloldalra
        localStorage.setItem("loggedInUser", found.email);
        window.location.href = "profiladatok.html";
    } else {
        alert("Hibás felhasználónév/email vagy jelszó!");
    }
}

// --- Események hozzárendelése ---
document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.querySelector("#login .primary");
    const registerBtn = document.querySelector("#register .primary");

    if (loginBtn) loginBtn.addEventListener("click", loginUser);
    if (registerBtn) registerBtn.addEventListener("click", registerUser);
});