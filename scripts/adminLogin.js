document.getElementById('adminLoginButton').addEventListener('click', handleLogin);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleLogin();
    }
});

async function handleLogin() {
    const nik = document.getElementById('nik').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!nik || !password) {
        showErrorMessage("NIK and Password cannot be empty.");
        return;
    }

    try {
        const response = await fetch(`https://apippat.kantahsalatiga.com/login/loginadmin.php?nik=${nik}&password=${password}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data[0].status === "admin") {
            // Redirect to user dashboard
            window.location.href = "dashboard-admin.html";
        } else {
            showErrorMessage("Invalid NIK or Password");
        }
    } catch (error) {
        showErrorMessage("An error occurred. Please try again later.");
        console.error(error);
    }
}

function showErrorMessage(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}
