// --- AUTHENTICATION LOGIC ---

function showRegister() {
    // Secret function: I-click ang "Contact Admin" para mogawas ang Register button
    document.getElementById('reg-btn').style.display = 'inline-block';
}

function register() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    if(user && pass) {
        localStorage.setItem('sysUser', user);
        localStorage.setItem('sysPass', pass);
        document.getElementById('auth-msg').style.color = "#4ade80";
        document.getElementById('auth-msg').innerText = "Account Created! You can now Login.";
        document.getElementById('reg-btn').style.display = 'none';
    } else {
        alert("Please enter Username and Password!");
    }
}

function login() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const sUser = localStorage.getItem('sysUser');
    const sPass = localStorage.getItem('sysPass');

    if(user === sUser && pass === sPass && user !== null) {
        sessionStorage.setItem('isLoggedIn', 'true');
        checkAuth();
    } else {
        document.getElementById('auth-msg').style.color = "#ff4d4d";
        document.getElementById('auth-msg').innerText = "Invalid Username or Password!";
    }
}

function logout() {
    sessionStorage.removeItem('isLoggedIn');
    location.reload();
}

function checkAuth() {
    if(sessionStorage.getItem('isLoggedIn') === 'true') {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }
}

window.onload = checkAuth;

// --- DIRI DAPIT ANG IMONG KARAAN NGA MGA DASHBOARD FUNCTIONS ---
// I-keep ang imong functions sama sa updateStats(), changeCategory(), etc. sa ubos ani.
