const loginButton = document.getElementById('loginButton');
const errorMessage = document.getElementById('errorMessage');
const nikInput = document.getElementById('nik');
const passwordInput = document.getElementById('password');

// Spinner untuk loading
const spinner = document.createElement('div');
spinner.classList.add('spinner');
spinner.style.display = 'none';
document.querySelector('.login-box').appendChild(spinner);

loginButton.addEventListener('click', handleLogin);

// Login saat menekan tombol "Enter"
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleLogin();
    }
});

async function handleLogin() {
    const nik = nikInput.value.trim();
    const password = passwordInput.value.trim();

    // Validasi input
    if (!nik || !password) {
        showErrorMessage("NIK and Password cannot be empty.");
        return;
    }

    // Tampilkan spinner dan nonaktifkan tombol
    spinner.style.display = 'block';
    loginButton.disabled = true;

    try {
        // Kirim request ke REST API
        const response = await fetch(`https://apippat.kantahsalatiga.com/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nik, password }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Invalid NIK or Password.");
        }

        // Simpan token dan NIK ke sessionStorage
        sessionStorage.setItem('sessionToken', JSON.stringify({
            token: data.token,
            nik: data.data.nik,
            nama_lengkap: data.data.nama_lengkap, // Menyesuaikan dengan struktur API
            expiration: new Date().getTime() + 60 * 60 * 1000 // 1 jam
        }));

        // Redirect ke dashboard
        window.location.href = "view/dashboard.html";
    } catch (error) {
        showErrorMessage(error.message || "An error occurred. Please try again.");
        console.error("Login error:", error);
    } finally {
        // Sembunyikan spinner dan aktifkan tombol
        spinner.style.display = 'none';
        loginButton.disabled = false;
    }
}

(function redirectIfLoggedIn() {
    const sessionToken = sessionStorage.getItem('sessionToken');

    if (sessionToken) {
        try {
            const { token, expiration } = JSON.parse(sessionToken);
            const currentTime = new Date().getTime();

            // Periksa apakah token masih valid
            if (currentTime < expiration) {
                // Jika token valid, redirect ke dashboard
                window.location.href = "view/dashboard.html";
            } else {
                // Hapus token jika sudah expired
                sessionStorage.removeItem('sessionToken');
            }
        } catch (error) {
            console.error('Error parsing session token:', error);
            sessionStorage.removeItem('sessionToken'); // Hapus token jika parsing gagal
        }
    }
})();


function showErrorMessage(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Periksa token pada halaman
(function checkSession() {
    const sessionToken = sessionStorage.getItem('sessionToken');

    if (sessionToken) {
        const { token, expiration } = JSON.parse(sessionToken);
        const currentTime = new Date().getTime();

        // Redirect jika token masih valid
        if (currentTime < expiration) {
            if (window.location.pathname.includes('index.html')) {
                window.location.href = "view/dashboard.html";
            }
        } else {
            // Hapus session jika token expired
            sessionStorage.removeItem('sessionToken');
            if (window.location.pathname.includes('view/dashboard.html')) {
                window.location.href = "../index.html";
            }
        }
    } else {
        // Jika tidak ada token, redirect ke login
        if (window.location.pathname.includes('view/dashboard.html')) {
            window.location.href = "../index.html";
        }
    }
})();
