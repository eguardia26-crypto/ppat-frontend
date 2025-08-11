// Menambahkan opsi ke elemen select untuk bulan dan tahun secara otomatis
document.addEventListener("DOMContentLoaded", () => {

    if (!sessionStorage.getItem('sessionToken')) {
        alert('Anda harus login terlebih dahulu.');
        window.location.href = '../index.html'; // Redirect ke halaman login
    }

    const bulanSelect = document.getElementById("bulan");
    const tahunSelect = document.getElementById("tahun");

    

    // Array bulan dalam format [nama, nilai]
    const bulanOptions = [
        ["Januari", "01"], ["Februari", "02"], ["Maret", "03"], ["April", "04"],
        ["Mei", "05"], ["Juni", "06"], ["Juli", "07"], ["Agustus", "08"],
        ["September", "09"], ["Oktober", "10"], ["November", "11"], ["Desember", "12"]
    ];

    // Menambahkan opsi bulan
    bulanOptions.forEach(([nama, nilai]) => {
        const option = document.createElement("option");
        option.value = nilai;
        option.textContent = nama;
        bulanSelect.appendChild(option);
    });

    // Tahun awal dan tahun sekarang
    const startYear = 2019;
    const currentYear = new Date().getFullYear();

    // Menambahkan opsi tahun
    for (let year = startYear; year <= currentYear; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        tahunSelect.appendChild(option);
    }

 

    // Menampilkan kelurahan berdasarkan kecamatan
    // kecamatanSelect.addEventListener("change", () => {
    //     const kecamatan = kecamatanSelect.value;
    //     kelurahanSelect.innerHTML = '<option value="">-- Desa/Kelurahan --</option>';

    //     if (dataSalatiga[kecamatan]) {
    //         dataSalatiga[kecamatan].forEach((kelurahan) => {
    //             const option = document.createElement("option");
    //             option.value = kelurahan;
    //             option.textContent = kelurahan;
    //             kelurahanSelect.appendChild(option);
    //         });
    //     }
    // });
});

document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = document.getElementById('submit-button');
    const buttonText = document.getElementById('button-text');
    const buttonSpinner = document.getElementById('button-spinner');

    // Tampilkan animasi spinner dan nonaktifkan tombol
    submitButton.disabled = true;
    buttonText.style.display = 'none';
    buttonSpinner.style.display = 'inline';

   // Tampilkan animasi spinner dan nonaktifkan tombol
   submitButton.disabled = true;
   buttonText.style.display = 'none';
   buttonSpinner.style.display = 'inline';

    const sessionToken = sessionStorage.getItem('sessionToken');
    const { token, nik, nama_lengkap } = JSON.parse(sessionToken);

     // Validasi semua input
     const inputsToValidate = [
        { id: 'bulan', message: 'Pilih Bulan wajib diisi.' },
        { id: 'tahun', message: 'Pilih Tahun wajib diisi.' },
        { id: 'nomor-akta', message: 'Nomor Akta wajib diisi.' },
        { id: 'tanggal-akta', message: 'Tanggal Akta wajib diisi.' },
        { id: 'pihak-yang-mengalihkan', message: 'Pihak Yang Mengalihkan wajib diisi.' },
        { id: 'pihak-yang-menerima', message: 'Pihak Yang Menerima wajib diisi.' },
        { id: 'jenis-dan-nomor-hak', message: 'Jenis dan Nomor Hak wajib dipilih.' },
        { id: 'letak-tanah-dan-bangunan', message: 'Letak tanah dan bangunan wajib diisi.' },
        { id: 'luas-tanah', message: 'Luas Tanah wajib diisi.' },
        { id: 'luas-bangunan', message: 'Luas Bangunan wajib diisi.' },
        { id: 'nilai-transaksi', message: 'Nilai Transaksi wajib diisi.' },
        { id: 'nop', message: 'NOP/Tahun wajib diisi.' },
        { id: 'njop', message: 'NJOP wajib diisi.' },
        { id: 'ssp-tanggal', message: 'SSP Tanggal wajib diisi.' },
        { id: 'ssp-rp', message: 'SSP Rp wajib diisi.' },
        { id: 'ssb-tanggal', message: 'SSB Tanggal wajib diisi.' },
        { id: 'ssb-rp', message: 'SSB Rp wajib diisi.' },
        { id: 'keterangan', message: 'Keterangan wajib diisi atau -.' }
    ];

    // for (const input of inputsToValidate) {
    //     const element = document.getElementById(input.id);
    //     if (!element.value || element.value === "Pilih Bulan" || element.value === "Pilih Tahun") {
    //         alert(input.message);
    //         element.focus();

    //         // Kembalikan tombol ke kondisi semula
    //         buttonText.style.display = 'inline';
    //         buttonSpinner.style.display = 'none';
    //         submitButton.disabled = false;
    //         return;
    //     }
    // }

    for (const input of inputsToValidate) {
        const element = document.getElementById(input.id);
    
        if (!element) {
            console.error(`Elemen dengan ID "${input.id}" tidak ditemukan.`);
            continue; // Lewati iterasi jika elemen tidak ditemukan
        }
    
        if (!element.value || element.value === "Pilih Bulan" || element.value === "Pilih Tahun") {
            alert(input.message);
            element.focus();
    
            // Kembalikan tombol ke kondisi semula
            buttonText.style.display = 'inline';
            buttonSpinner.style.display = 'none';
            submitButton.disabled = false;
            return;
        }
    }
    const payload = {
        nik: nik,
        akta_nomor: document.getElementById('nomor-akta').value,
        akta_tanggal: document.getElementById('tanggal-akta').value,
        bentuk_perbuatan_hukum: document.getElementById('bentu-perbuatan-hukum').value,
        nama_pengalihan: document.getElementById('pihak-yang-mengalihkan').value,
        nama_penerima: document.getElementById('pihak-yang-menerima').value,
        jenis_dan_nomor_hak: `${document.getElementById('jenis-dan-nomor-hak').value}` ,
        letak_tanah_dan_bangunan: `${document.getElementById('letak-tanah-dan-bangunan').value}`,
        luas_tanah: document.getElementById('luas-tanah').value,
        luas_bangunan: document.getElementById('luas-bangunan').value,
        nilai_transaksi: document.getElementById('nilai-transaksi').value,
        nop_tahun: document.getElementById('nop').value,
        njop_rp: document.getElementById('njop').value,
        ssp_tanggal: document.getElementById('ssp-tanggal').value,
        ssp_rp: document.getElementById('ssp-rp').value,
        ssb_tanggal: document.getElementById('ssb-tanggal').value,
        ssb_rp: document.getElementById('ssb-rp').value,
        ket: document.getElementById('keterangan').value,
        bulan_ini: `${document.getElementById('tahun').value}-${document.getElementById('bulan').value}`,
        nama_ppat: nama_lengkap
    };
    // console.log(payload);
    try {
        const response = await fetch(`https://apippat.kantahsalatiga.com/api/laporan-bulanan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Sisipkan token di header Authorization
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            window.location.href = '../view/dashboard.html';
        } else {
            alert(`Error: ${result.message}`);
            window.location.href = '../index.html';
            
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat mengirim data.');
    } finally {
        // Sembunyikan spinner dan aktifkan tombol kembali
        buttonText.style.display = 'inline';
        buttonSpinner.style.display = 'none';
        submitButton.disabled = false;
    }
});
