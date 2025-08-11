// Menambahkan opsi ke elemen select untuk bulan dan tahun secara otomatis
document.addEventListener("DOMContentLoaded", () => {

    const dynamicElementsContainer = document.getElementById("dynamic-elements");
    const lokasiContainer = document.getElementById("dynamic-lokasi-container");

    function setupLokasiSelects(container) {
        const kotaSelect = container.querySelector("#letak-tanah-dan-bangunan");
        const kecamatanSelect = container.querySelector("#letak-tanah-dan-bangunan-1");
        const kelurahanSelect = container.querySelector("#letak-tanah-dan-bangunan-2");

        // Tambahkan opsi untuk kota
        // const optionKota = document.createElement("option");
        // optionKota.value = "Salatiga";
        // optionKota.textContent = "Kota Salatiga";
        // kotaSelect.appendChild(optionKota);

        // Event listener untuk kota
        kotaSelect.addEventListener("change", () => {
            const kota = kotaSelect.value;
            kecamatanSelect.innerHTML = '<option value="">-- Kecamatan --</option>';
            kelurahanSelect.innerHTML = '<option value="">-- Desa/Kelurahan --</option>';

            if (kota === "Salatiga") {
                for (const kecamatan in dataSalatiga) {
                    const option = document.createElement("option");
                    option.value = kecamatan;
                    option.textContent = kecamatan.charAt(0).toUpperCase() + kecamatan.slice(1);
                    kecamatanSelect.appendChild(option);
                }
            }
        });

        // Event listener untuk kecamatan
        kecamatanSelect.addEventListener("change", () => {
            const kecamatan = kecamatanSelect.value;
            kelurahanSelect.innerHTML = '<option value="">-- Desa/Kelurahan --</option>';

            if (dataSalatiga[kecamatan]) {
                dataSalatiga[kecamatan].forEach((kelurahan) => {
                    const option = document.createElement("option");
                    option.value = kelurahan;
                    option.textContent = kelurahan;
                    kelurahanSelect.appendChild(option);
                });
            }
        });
    }


     // Event handler untuk tombol "+" dan "-"
     lokasiContainer.addEventListener("click", (event) => {
        // Tambahkan elemen baru
        if (event.target.classList.contains("add-lokasi")) {
            const newElement = event.target.closest(".lokasi-element").cloneNode(true);

        // Reset value elemen baru
        newElement.querySelector("#letak-tanah-dan-bangunan").value = "";
        newElement.querySelector("#letak-tanah-dan-bangunan-1").value = "";
        newElement.querySelector("#letak-tanah-dan-bangunan-2").value = "";

        // Tambahkan elemen baru ke dalam container
        document.getElementById("dynamic-lokasi-container").appendChild(newElement);

        // Pasang event listener pada elemen baru
        setupLokasiSelects(newElement);

        // Perbarui tombol setelah elemen baru ditambahkan
        updateButtons();
            
        }

        // Hapus elemen
        if (event.target.classList.contains("remove-lokasi")) {
            const lokasiElements = lokasiContainer.querySelectorAll(".lokasi-element");
            if (lokasiElements.length > 1) {
                event.target.closest(".lokasi-element").remove();
                updateButtons(); // Pastikan tombol diperbarui setelah elemen dihapus
            } else {
                alert("Minimal satu elemen diperlukan.");
            }
        }
    });

    // Fungsi untuk memperbarui tombol "+" dan "-" di semua elemen
    function updateButtons() {
        const lokasiElements = lokasiContainer.querySelectorAll(".lokasi-element");

        lokasiElements.forEach((element, index) => {
            // Pastikan setiap elemen memiliki tombol "+" dan "-"
            let addButton = element.querySelector(".add-lokasi");
            let removeButton = element.querySelector(".remove-lokasi");

            if (!addButton) {
                addButton = document.createElement("button");
                addButton.type = "button";
                addButton.className = "add-lokasi";
                addButton.textContent = "+";
                element.appendChild(addButton);
            }

            if (!removeButton) {
                removeButton = document.createElement("button");
                removeButton.type = "button";
                removeButton.className = "remove-lokasi";
                removeButton.textContent = "-";
                element.appendChild(removeButton);
            }

            // Untuk elemen pertama, hanya tampilkan tombol "+"
            if (index === 0) {
                addButton.style.display = "inline-block";
                removeButton.style.display = "none";
            } else {
                addButton.style.display = "inline-block";
                removeButton.style.display = "inline-block";
            }
        });
    }


    // Inisialisasi untuk elemen awal
   

       // Add new dynamic element
       dynamicElementsContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("add")) {
            const newElement = document.querySelector(".dynamic-element").cloneNode(true);
            newElement.querySelector(".jenis-hak").value = "";
            newElement.querySelector(".nomor-hak").value = "";

            // Ensure only the new elements have a remove button
            const removeButton = newElement.querySelector(".remove");
            if (!removeButton) {
                const newRemoveButton = document.createElement("button");
                newRemoveButton.type = "button";
                newRemoveButton.className = "remove";
                newRemoveButton.textContent = "-";
                newElement.querySelector(".form-row").appendChild(newRemoveButton);
            }

            dynamicElementsContainer.appendChild(newElement);
        }

        // Remove dynamic element
        if (event.target.classList.contains("remove")) {
            if (dynamicElementsContainer.children.length > 1) {
                event.target.closest(".dynamic-element").remove();
            } else {
                alert("Minimal satu elemen diperlukan.");
            }
        }
    });


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

    // Select elements for Kota, Kecamatan, and Kelurahan
    const kotaSelect = document.getElementById("letak-tanah-dan-bangunan");
    const kecamatanSelect = document.getElementById("letak-tanah-dan-bangunan-1");
    const kelurahanSelect = document.getElementById("letak-tanah-dan-bangunan-2");

    // Data Kota Salatiga
    const dataSalatiga = {
        "sidorejo": ["Blotongan", "Kauman Kidul", "Pulutan", "Salatiga","Sidorejo Lor", "Bugel"],
        "tingkir": ["Kalibening", "Gendongan", "Kutowinangun Lor", "Kutowinangun kidul","Kutowinangun", "Sidorejo Kidul", "Tingkir Lor", "Tingkir Tengah"],
        "argomulyo": ["Ledok", "Noborejo", "Kumpulrejo", "Tegalrejo", "Cebongan", "Randuacir"],
        "sidomukti": ["Dukuh", "Kalicacing", "Kecandran", "Mangunsari"],
    };

    // Menambahkan opsi untuk Kota Salatiga
    const optionKota = document.createElement("option");
    optionKota.value = "Salatiga";
    optionKota.textContent = "Kota Salatiga";
    kotaSelect.appendChild(optionKota);

    // Menampilkan kecamatan berdasarkan kota
    kotaSelect.addEventListener("change", () => {
        const kota = kotaSelect.value;
        kecamatanSelect.innerHTML = '<option value="">-- Kecamatan --</option>';
        kelurahanSelect.innerHTML = '<option value="">-- Desa/Kelurahan --</option>';

        if (kota === "Salatiga") {
            for (const kecamatan in dataSalatiga) {
                const option = document.createElement("option");
                option.value = kecamatan;
                option.textContent = kecamatan.charAt(0).toUpperCase() + kecamatan.slice(1);
                kecamatanSelect.appendChild(option);
            }
        }
    });

    // Menampilkan kelurahan berdasarkan kecamatan
    kecamatanSelect.addEventListener("change", () => {
        const kecamatan = kecamatanSelect.value;
        kelurahanSelect.innerHTML = '<option value="">-- Desa/Kelurahan --</option>';

        if (dataSalatiga[kecamatan]) {
            dataSalatiga[kecamatan].forEach((kelurahan) => {
                const option = document.createElement("option");
                option.value = kelurahan;
                option.textContent = kelurahan;
                kelurahanSelect.appendChild(option);
            });
        }
    });

});



document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();
      
    const lokasiElements = document.querySelectorAll(".lokasi-element");
    const lokasiPayload = Array.from(lokasiElements)
        .map((element) => {
            const kota = element.querySelector("#letak-tanah-dan-bangunan").value;
            const kecamatan = element.querySelector("#letak-tanah-dan-bangunan-1").value;
            const kelurahan = element.querySelector("#letak-tanah-dan-bangunan-2").value;

            // Gabungkan kota, kecamatan, dan kelurahan jika semuanya diisi
            return kota && kecamatan && kelurahan ? `${kota}-${kecamatan}-${kelurahan}` : null;
        })
        .filter(Boolean) // Hapus nilai null jika ada elemen yang tidak lengkap
        .join(","); // Gabungkan semua elemen dengan koma



    const jenisDanNomorHak = Array.from(document.querySelectorAll(".dynamic-element"))
    .map((element) => {
        const jenis = element.querySelector(".jenis-hak").value;
        const nomor = element.querySelector(".nomor-hak").value;
        return jenis && nomor ? `${jenis}-${nomor}` : null;
    })
    .filter(Boolean);

if (jenisDanNomorHak.length === 0) {
    alert("Harap isi setidaknya satu Jenis dan Nomor Hak.");
    return;
}


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

    for (const input of inputsToValidate) {
        const element = document.getElementById(input.id);
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
        jenis_dan_nomor_hak: jenisDanNomorHak.join(", ") ,
        letak_tanah_dan_bangunan: lokasiPayload,
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
