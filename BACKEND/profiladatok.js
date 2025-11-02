document.getElementById("mobile-menu")?.addEventListener("click", function() {
document.querySelector(".navbar-menu").classList.toggle("active");
});


function getUsers(){
return JSON.parse(localStorage.getItem("users")) || [];
}
function saveUsers(users){
localStorage.setItem("users", JSON.stringify(users));
}


function getLoggedInEmail(){
return localStorage.getItem("loggedInUser");
}


function loadProfile(){
const email = getLoggedInEmail();
if (!email) {
// nincs bejelentkezve -> vissza a login oldalra
window.location.href = "profil.html";
return;
}


const users = getUsers();
const me = users.find(u => u.email === email);
if (!me) {
// ha nincs meg a user (például törlés történt), kijelentkeztetjük
localStorage.removeItem("loggedInUser");
window.location.href = "profil.html";
return;
}


document.getElementById("welcomeText").textContent = `Üdv, ${me.username}!`;
document.getElementById("email").value = me.email || "";
document.getElementById("phone").value = me.phone || "";
document.getElementById("address").value = me.address || "";
}


function saveProfile(){
const emailOld = getLoggedInEmail();
const users = getUsers();
const meIndex = users.findIndex(u => u.email === emailOld);
if (meIndex === -1) return;


const newEmail = document.getElementById("email").value.trim();
const newPhone = document.getElementById("phone").value.trim();
const newAddress = document.getElementById("address").value.trim();


// Ellenőrizzük, hogy az új email-e egy másik felhasználóhoz tartozik-e
if (newEmail !== emailOld && users.some((u, idx) => u.email === newEmail && idx !== meIndex)){
alert("Ez az email már egy másik felhasználóhoz tartozik.");
return;
}


users[meIndex].email = newEmail;
users[meIndex].phone = newPhone;
users[meIndex].address = newAddress;


saveUsers(users);
// ha megváltozott az email, frissítjük a loggedInUser értékét is
localStorage.setItem("loggedInUser", newEmail);


const status = document.getElementById("status");
status.textContent = "Mentés sikeres.";
status.style.display = "block";
setTimeout(()=> status.style.display = "none", 2500);
}


function logout(){
localStorage.removeItem("loggedInUser");
window.location.href = "profil.html";
}


// Események
document.addEventListener("DOMContentLoaded", () => {
loadProfile();
document.getElementById("saveBtn").addEventListener("click", saveProfile);
document.getElementById("logoutBtn").addEventListener("click", logout);
});