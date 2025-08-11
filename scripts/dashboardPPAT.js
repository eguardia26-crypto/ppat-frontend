 
 // Validasi Token
 (function validateSession() {
    const sessionToken = sessionStorage.getItem('sessionToken');

    if (!sessionToken) {
        redirectToLogin();
        return;
    }

    try {
        const { token, nik, expiration } = JSON.parse(sessionToken);
        const currentTime = new Date().getTime();

        if (currentTime >= expiration) {
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
    window.location.href = '../index.html';
}

// Tambahkan Tahun ke Select
const yearSelect = document.getElementById('year-select');
const currentYear = new Date().getFullYear();
for (let year = 2019; year <= currentYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
}

function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

async function cariData() {
    const bulan = document.getElementById('bulan').value;
    const tahun = document.getElementById('year-select').value;

    if (!bulan || !tahun) {
        alert('Silakan pilih bulan dan tahun terlebih dahulu!');
        return;
    }

    const sessionToken = JSON.parse(sessionStorage.getItem('sessionToken'));
    const token = sessionToken?.token;
    const nik = sessionToken?.nik; // Ambil NIK dari sessionStorage

    if (!token || !nik) {
        alert('Token atau NIK tidak ditemukan. Silakan login kembali.');
        redirectToLogin();
        return;
    }

    const bulanIni = `${tahun}-${bulan}`;
    const apiUrl = `https://apippat.kantahsalatiga.com/api/laporan?nik=${nik}&bulan_ini=${bulanIni}`;

    showLoading();

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Gagal mengambil data dari server');
        }

        const data = await response.json();
        tampilkanData(data);
        sessionStorage.setItem("itemDataLengkap", JSON.stringify(data));
    } catch (error) {
        const emptData = [];
        console.error('Terjadi kesalahan:', error);
        alert('Terjadi kesalahan saat mengambil data.');
        tampilkanData(emptData);
        sessionStorage.setItem("itemDataLengkap", JSON.stringify(emptData));
    } finally {
        hideLoading();
    }
}

function tampilkanData(data) {
    const tableBody = document.getElementById('table-body');

    if ($.fn.DataTable.isDataTable('#data-table')) {
        $('#data-table').DataTable().destroy();
    }

    tableBody.innerHTML = '';

    // Urutkan data berdasarkan ID, ID yang lebih besar di atas
    data.sort((a, b) => b.id - a.id); // Menggunakan ID, yang lebih besar akan muncul di atas

    if (data.length === 0) {
        tableBody.innerHTML = `<tr class="no-items">
            <td colspan="7">No items <span style="color: red;">&#128683;</span></td>
        </tr>`;
        return;
    }

    data.forEach((item) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${item.nama_ppat}</td>
            <td>${item.jenis_dan_nomor_hak}</td>
            <td>${item.bentuk_perbuatan_hukum}</td>
            <td>${item.letak_tanah_dan_bangunan}</td>
            <td>${item.nilai_transaksi}</td>
            <td><button class="btn btn-sm btn-primary edit-button"><i class="fas fa-edit"></i></button></td>
            <td><button class="btn btn-sm btn-danger delete-button"><i class="fas fa-trash"></i></button></td>
        `;

        tableBody.appendChild(row);

        // Event listener untuk tombol Edit
        const editButton = row.querySelector(".edit-button");
        editButton.addEventListener("click", (e) => {
            sessionStorage.setItem("itemData", JSON.stringify(item));
            window.location.href='pageEdit.html'
        });

        // Tambahkan event listener untuk tombol Hapus
        const deleteButton = row.querySelector(".delete-button");
        deleteButton.addEventListener("click", async () => {
            const confirmed = confirm(`Apakah Anda yakin ingin menghapus data dengan Jenis dan Nomor Hak : ${item.jenis_dan_nomor_hak}?`);
            if (!confirmed) return;

            try {
                const sessionToken = JSON.parse(sessionStorage.getItem('sessionToken'));
                const token = sessionToken?.token;
                const response = await fetch(`https://apippat.kantahsalatiga.com/api/laporan/${item.id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    row.remove();
                    alert(`Jenis dan Nomor Hak : ${item.jenis_dan_nomor_hak} berhasil dihapus.`);
                    location.reload();
                } else {
                    const result = await response.json();
                    alert(`Gagal menghapus data: ${result.message}`);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Terjadi kesalahan saat menghapus data.");
            }
        });
    });

    // Reinitialize DataTable
    $('#data-table').DataTable();
}

function exportData() {
    const bulan = document.getElementById('bulan').value;
    const tahun = document.getElementById('year-select').value;

    
    if (!bulan || !tahun) {
        alert('Silakan pilih bulan dan tahun terlebih dahulu!');
        return;
      } else {
        const itemDataLengkap = JSON.parse(sessionStorage.getItem('itemDataLengkap'));
        if (Array.isArray(itemDataLengkap) && itemDataLengkap.length === 0) {
          alert("Data tidak bisa diproses");
          return;
        }


        window.location.href = 'pageLaporanDetail.html';
        // Lanjutkan proses jika data tidak kosong...
      }
       
       
    

    
   
}

function handleKembaliDashboard() {
    window.location.href = 'dashboard.html';
}