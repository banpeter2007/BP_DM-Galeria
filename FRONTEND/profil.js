// Egyszerű felhasználókezelés localStorage-ban (demó)
const tabs = document.querySelectorAll('.tab');
const panes = {
  login: document.getElementById('login'),
  register: document.getElementById('register')
};
const profileCard = document.getElementById('profileCard');

tabs.forEach(t => t.addEventListener('click', () => {
  tabs.forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  const which = t.dataset.tab;
  for (const k in panes) panes[k].style.display = (k === which) ? 'block' : 'none';
  profileCard.classList.remove('visible');
}));

function readUsers() {
  try { return JSON.parse(localStorage.getItem('simple_users') || '[]'); }
  catch (e) { return []; }
}
function writeUsers(u) { localStorage.setItem('simple_users', JSON.stringify(u)); }

function encodePwd(p) { return btoa(p); } // nem biztonságos
function findUserByNameOrEmail(val) {
  const users = readUsers();
  return users.find(u =>
    u.username.toLowerCase() === val.toLowerCase() ||
    u.email.toLowerCase() === val.toLowerCase()
  );
}

// Regisztráció
document.getElementById('regForm').addEventListener('submit', e => {
  e.preventDefault();
  const u = regUser.value.trim();
  const em = regEmail.value.trim();
  const p = regPass.value;
  const msg = regMsg;
  msg.textContent = '';

  if (findUserByNameOrEmail(u) || findUserByNameOrEmail(em)) {
    msg.textContent = 'A felhasználónév vagy email már foglalt.';
    msg.className = 'error';
    return;
  }

  const users = readUsers();
  users.push({ username: u, email: em, password: encodePwd(p), created: new Date().toISOString() });
  writeUsers(users);
  msg.textContent = 'Sikeres regisztráció! Most bejelentkezhetsz.';
  msg.className = 'success';

  document.querySelector('.tab[data-tab=\"login\"]').click();
  regForm.reset();
});

// Bejelentkezés
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const who = loginUser.value.trim();
  const pass = loginPass.value;
  const msg = loginMsg;
  msg.textContent = '';

  const users = readUsers();
  const user = users.find(u =>
    (u.username.toLowerCase() === who.toLowerCase() ||
     u.email.toLowerCase() === who.toLowerCase()) &&
    u.password === encodePwd(pass)
  );

  if (!user) {
    msg.textContent = 'Hibás adatok.';
    msg.className = 'error';
    return;
  }

  sessionStorage.setItem('simple_current', JSON.stringify(user));
  showProfile(user);
  loginForm.reset();
});

function showProfile(user) {
  profileName.textContent = user.username;
  profileEmail.textContent = user.email;
  profileJoined.textContent = 'Csatlakozott: ' + new Date(user.created).toLocaleString();
  profileCard.classList.add('visible');
  panes.login.style.display = 'none';
  panes.register.style.display = 'none';
  tabs.forEach(x => x.classList.remove('active'));
}

logout.addEventListener('click', () => {
  sessionStorage.removeItem('simple_current');
  profileCard.classList.remove('visible');
  document.querySelector('.tab[data-tab=\"login\"]').classList.add('active');
  panes.login.style.display = 'block';
});

deleteAccount.addEventListener('click', () => {
  const cur = JSON.parse(sessionStorage.getItem('simple_current') || 'null');
  if (!cur) return;
  if (!confirm('Biztosan törlöd a fiókodat?')) return;

  const users = readUsers().filter(u => u.username !== cur.username && u.email !== cur.email);
  writeUsers(users);
  sessionStorage.removeItem('simple_current');
  profileCard.classList.remove('visible');
  alert('Fiók törölve.');
});

fillTest.addEventListener('click', () => {
  const users = readUsers();
  if (!users.some(u => u.username === 'tester')) {
    users.push({ username: 'tester', email: 'tester@example.com', password: encodePwd('password123'), created: new Date().toISOString() });
    writeUsers(users);
    alert('Teszt felhasználó létrehozva: tester / password123');
  } else alert('Teszt felhasználó már létezik.');
});

toLogin.addEventListener('click', () => {
  document.querySelector('.tab[data-tab=\"login\"]').click();
});

window.addEventListener('load', () => {
  const cur = JSON.parse(sessionStorage.getItem('simple_current') || 'null');
  if (cur) showProfile(cur);
});
