document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Tampilkan animasi loading
    document.getElementById('loading').style.display = 'flex';
    
    // Mengambil nilai dari form
    const nik = document.getElementById('nik').value;
    const nama_lengkap = document.getElementById('nama_lengkap').value;
    const alamat = document.getElementById('alamat').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const img = document.getElementById('img').files[0];

    // Validasi form
    if (!nik || !nama_lengkap || !alamat || !email || !password || !img) {
        document.getElementById('message').innerText = 'Semua field harus diisi!';
        document.getElementById('loading').style.display = 'none';
        return;
    }

    // Membuat FormData untuk mengirimkan file gambar
    const formData = new FormData();
    formData.append('nik', nik);
    formData.append('nama_lengkap', nama_lengkap);
    formData.append('alamat', alamat);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('img', img);

    // Mengirimkan data ke API
    fetch(`https://apippat.kantahsalatiga.com/api/auth/register`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Sembunyikan animasi loading setelah proses selesai
        document.getElementById('loading').style.display = 'none';
        
        if (data.message === "User registered successfully") {
            alert("Pendaftaran Berhasil!");
            window.location.href = '..' + data.redirect;
        } else {
            alert("Pendaftaran Gagal!");
            // document.getElementById('message').innerText = 'Pendaftaran gagal: ' + data.message;
        }
    })
    .catch(error => {
        // Sembunyikan animasi loading jika terjadi error
        document.getElementById('loading').style.display = 'none';
        document.getElementById('message').innerText = 'Terjadi kesalahan: ' + error.message;
    });
});
