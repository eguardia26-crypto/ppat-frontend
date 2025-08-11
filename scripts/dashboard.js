const buttonDashboard = document.getElementById('buttonDashboard');

// Tambahkan event listener untuk menangani klik tombol
buttonDashboard.addEventListener('click', function () {
    // Pindah ke halaman yang diinginkan, misalnya dashboard.html
    window.location.href = 'dashboardPPAT.html';
});

(function validateSession() {
    const sessionToken = sessionStorage.getItem('sessionToken');

    if (!sessionToken) {
        // Jika token tidak ada, redirect ke halaman login
        redirectToLogin();
        return;
    }

    try {
        const { token, expiration } = JSON.parse(sessionToken);
        const currentTime = new Date().getTime();

        // Periksa apakah token sudah expired
        if (currentTime >= expiration) {
            // Hapus token jika expired
            sessionStorage.removeItem('sessionToken');
            redirectToLogin();
            return;
        }

    } catch (error) {
        console.error('Error validating session:', error);
        sessionStorage.removeItem('sessionToken');
        redirectToLogin();
    }
})();

function redirectToLogin() {
    if (window.location.pathname !== '/index.html') {
        window.location.href = "../index.html"; // Redirect ke login
    }
}


// Fungsi untuk redirect ke halaman login
function redirectToLogin() {
    window.location.href = "../index.html";
}

// (Opsional) Fungsi untuk validasi token dengan backend
async function validateTokenWithBackend(token) {
    try {
        const response = await fetch(`https://apippat.kantahsalatiga.com/api/auth/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Token invalid or expired');
        }

    } catch (error) {
        console.error('Token validation failed:', error.message);
        redirectToLogin();
    }
}
