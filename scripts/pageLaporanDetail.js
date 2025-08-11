// Ambil data dari sessionStorage
const data = JSON.parse(sessionStorage.getItem("itemDataLengkap"));

// Fungsi untuk mengubah format bulan ke dalam teks
function formatBulan(bulan) {
    const bulanNama = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return bulanNama[parseInt(bulan, 10) - 1]; // Kurangi 1 karena index array dimulai dari 0
}

// Fungsi untuk memasukkan data ke dalam tabel
function loadData(dataArray) {
    if (!dataArray || dataArray.length === 0) {
        console.error("Data tidak ditemukan atau kosong di sessionStorage.");
        return;
    }

    // Set nama PPAT dari sessionStorage
    document.getElementById("nama-ppat").innerText = dataArray[0].nama_ppat;

    // Set bulan dan tahun
    const [tahun, bulan] = dataArray[0].bulan_ini.split("-");
    document.getElementById("bulan-ini").innerText = `${formatBulan(bulan)} ${tahun}`;

    // Tambahkan data ke tabel
    const tabelBody = document.getElementById("data-tabel");
    let rows = "";
    dataArray.forEach((item,index) => {
        rows += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.akta_nomor}</td>
                <td>${item.akta_tanggal}</td>
                <td>${item.bentuk_perbuatan_hukum}</td>
                <td>${item.nama_pengalihan}</td>
                <td>${item.nama_penerima}</td>
                <td>${item.jenis_dan_nomor_hak}</td>
                <td>${item.letak_tanah_dan_bangunan}</td>
                <td>${item.luas_tanah}</td>
                <td>${item.luas_bangunan}</td>
                <td>${item.nilai_transaksi}</td>
                <td>${item.nop_tahun}</td>
                <td>${item.njop_rp}</td>
                <td>${item.ssp_tanggal}</td>
                <td>${item.ssp_rp}</td>
                <td>${item.ssb_tanggal}</td>
                <td>${item.ssb_rp}</td>
                <td>${item.ket}</td>
            </tr>
        `;
    });
    tabelBody.innerHTML = rows;
}

// Placeholder fungsi tombol
function downloadExcel() {
const table = document.getElementById("tabel-data"); // Ambil tabel HTML
const workbook = XLSX.utils.table_to_book(table, { sheet: "Laporan PPAT" }); // Convert tabel ke Excel
const worksheet = workbook.Sheets["Laporan PPAT"]; // Ambil worksheet

// Menambahkan border hitam untuk setiap cell
const range = XLSX.utils.decode_range(worksheet["!ref"]);
for (let row = range.s.r; row <= range.e.r; row++) {
for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
    if (!worksheet[cellAddress]) {
        worksheet[cellAddress] = { t: "s", v: "" }; // Tambahkan cell kosong jika tidak ada data
    }
    worksheet[cellAddress].s = {
        border: {
            top: { style: "thin", color: { rgb: "000000" } }, // Border atas
            bottom: { style: "thin", color: { rgb: "000000" } }, // Border bawah
            left: { style: "thin", color: { rgb: "000000" } }, // Border kiri
            right: { style: "thin", color: { rgb: "000000" } }, // Border kanan
        },
        alignment: {
            horizontal: "center", // Set teks di tengah secara horizontal
            vertical: "center",   // Set teks di tengah secara vertikal
        },
    };
}
}

// Menyesuaikan lebar kolom agar rapi
const colWidths = [];
for (let col = range.s.c; col <= range.e.c; col++) {
let maxWidth = 10; // Lebar default
for (let row = range.s.r; row <= range.e.r; row++) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
    const cell = worksheet[cellAddress];
    if (cell && cell.v) {
        const cellValue = String(cell.v);
        maxWidth = Math.max(maxWidth, cellValue.length);
    }
}
colWidths.push({ wch: maxWidth });
}
worksheet["!cols"] = colWidths;

// Simpan file Excel
XLSX.writeFile(workbook, "Laporan_PPAT.xlsx");
}

function getCurrentDateFormatted() {
const now = new Date();
let day = now.getDate();
let month = now.getMonth() + 1; // Bulan dalam JavaScript dimulai dari 0
const year = now.getFullYear();

// Menambahkan angka 0 di depan jika nilai hari atau bulan kurang dari 10
day = day < 10 ? '0' + day : day;
month = month < 10 ? '0' + month : month;

return `${day}-${month}-${year}`;
}

async function isDataUploaded() {
    document.getElementById('loading').style.display = 'flex';
    const sessionToken = sessionStorage.getItem('sessionToken');
    const responseData = JSON.parse(sessionToken);
    const bulanIni = data.length > 0 ? data[0].bulan_ini : "";
    const toInt = val => {
        const num = parseInt(val);
        return isNaN(num) ? 0 : num;
        };
        
        // ==================== Jual Beli ====================
        const jualBeliData = data.filter(item => item.bentuk_perbuatan_hukum.trim().toLowerCase() === "jual beli");
        const jualBeliCount = jualBeliData.length;
        const jualBeliNik = jualBeliCount > 0 ? jualBeliData[0].nik : "";
        const jualBeliTotalLuasTanah = jualBeliData.reduce((total, item) => total + toInt(item.luas_tanah), 0);
        const jualBeliTotalNilaiTransaksi = jualBeliData.reduce((total, item) => total + toInt(item.nilai_transaksi), 0);
        const jualBeliTotalSsp = jualBeliData.reduce((total, item) => total + toInt(item.ssp_rp), 0);
        const jualBeliTotalSsb = jualBeliData.reduce((total, item) => total + toInt(item.ssb_rp), 0);
        
        // console.log("Jual Beli:");
        // console.log("  Nik:", jualBeliNik);
        // console.log("  Jumlah record:", jualBeliCount);
        // console.log("  Total luas_tanah:", jualBeliTotalLuasTanah);
        // console.log("  Total nilai_transaksi:", jualBeliTotalNilaiTransaksi);
        // console.log("  Total ssp:", jualBeliTotalSsp);
        // console.log("  Total ssb:", jualBeliTotalSsb);
        // console.log("---------------------------------------------------");
        
        // ==================== Tukar Menukar ====================
        const tukarMenukarData = data.filter(item => item.bentuk_perbuatan_hukum.trim().toLowerCase() === "tukar menukar");
        const tukarMenukarCount = tukarMenukarData.length; 
        const tukarMenukarTotalLuasTanah = tukarMenukarData.reduce((total, item) => total + toInt(item.luas_tanah), 0);
        const tukarMenukarTotalNilaiTransaksi = tukarMenukarData.reduce((total, item) => total + toInt(item.nilai_transaksi), 0);
        const tukarMenukarTotalSsp = tukarMenukarData.reduce((total, item) => total + toInt(item.ssp_rp), 0);
        const tukarMenukarTotalSsb = tukarMenukarData.reduce((total, item) => total + toInt(item.ssb_rp), 0);
        
        // console.log("Tukar Menukar:");
        // console.log("  Jumlah record:", tukarMenukarCount);
        // console.log("  Total luas_tanah:", tukarMenukarTotalLuasTanah);
        // console.log("  Total nilai_transaksi:", tukarMenukarTotalNilaiTransaksi);
        // console.log("  Total ssp:", tukarMenukarTotalSsp);
        // console.log("  Total ssb:", tukarMenukarTotalSsb);
        // console.log("---------------------------------------------------");
        
        // ==================== Hibah ====================
        const hibahData = data.filter(item => item.bentuk_perbuatan_hukum.trim().toLowerCase() === "hibah");
        const hibahCount = hibahData.length;
        const hibahTotalLuasTanah = hibahData.reduce((total, item) => total + toInt(item.luas_tanah), 0);
        const hibahTotalNilaiTransaksi = hibahData.reduce((total, item) => total + toInt(item.nilai_transaksi), 0);
        const hibahTotalSsp = hibahData.reduce((total, item) => total + toInt(item.ssp_rp), 0);
        const hibahTotalSsb = hibahData.reduce((total, item) => total + toInt(item.ssb_rp), 0);
        
        // console.log("Hibah:");
        // console.log("  Jumlah record:", hibahCount);
        // console.log("  Total luas_tanah:", hibahTotalLuasTanah);
        // console.log("  Total nilai_transaksi:", hibahTotalNilaiTransaksi);
        // console.log("  Total ssp:", hibahTotalSsp);
        // console.log("  Total ssb:", hibahTotalSsb);
        // console.log("---------------------------------------------------");
        
        // // ==================== APHB ====================
        const aphbData = data.filter(item => item.bentuk_perbuatan_hukum.trim().toLowerCase() === "aphb");
        const aphbCount = aphbData.length;
        const aphbTotalLuasTanah = aphbData.reduce((total, item) => total + toInt(item.luas_tanah), 0);
        const aphbTotalNilaiTransaksi = aphbData.reduce((total, item) => total + toInt(item.nilai_transaksi), 0);
        const aphbTotalSsp = aphbData.reduce((total, item) => total + toInt(item.ssp_rp), 0);
        const aphbTotalSsb = aphbData.reduce((total, item) => total + toInt(item.ssb_rp), 0);
        
        // console.log("APHB:");
        // console.log("  Jumlah record:", aphbCount);
        // console.log("  Total luas_tanah:", aphbTotalLuasTanah);
        // console.log("  Total nilai_transaksi:", aphbTotalNilaiTransaksi);
        // console.log("  Total ssp:", aphbTotalSsp);
        // console.log("  Total ssb:", aphbTotalSsb);
        // console.log("---------------------------------------------------");
        
        // ==================== APHT ====================
        const aphtData = data.filter(item => item.bentuk_perbuatan_hukum.trim().toLowerCase() === "apht");
        const aphtCount = aphtData.length;
        const aphtTotalLuasTanah = aphtData.reduce((total, item) => total + toInt(item.luas_tanah), 0);
        const aphtTotalNilaiTransaksi = aphtData.reduce((total, item) => total + toInt(item.nilai_transaksi), 0);
        const aphtTotalSsp = aphtData.reduce((total, item) => total + toInt(item.ssp_rp), 0);
        const aphtTotalSsb = aphtData.reduce((total, item) => total + toInt(item.ssb_rp), 0);
        
        // console.log("APHT:");
        // console.log("  Jumlah record:", aphtCount);
        // console.log("  Total luas_tanah:", aphtTotalLuasTanah);
        // console.log("  Total nilai_transaksi:", aphtTotalNilaiTransaksi);
        // console.log("  Total ssp:", aphtTotalSsp);
        // console.log("  Total ssb:", aphtTotalSsb);
        // console.log("---------------------------------------------------");
        
        // ==================== Nihil ====================
        const nihilData = data.filter(item => item.bentuk_perbuatan_hukum.trim().toLowerCase() === "nihil");
        const nihilCount = nihilData.length;
        const nihilNik = nihilCount > 0 ? nihilData[0].nik : "";
        
        // console.log("Nihil:");
        // console.log("  Jumlah record:", nihilCount);
        // console.log("---------------------------------------------------");
        
        // ==================== Total Global ====================
        const totalNilaiTransaksiSemua =
        jualBeliTotalNilaiTransaksi +
        tukarMenukarTotalNilaiTransaksi +
        hibahTotalNilaiTransaksi +
        aphbTotalNilaiTransaksi +
        aphtTotalNilaiTransaksi ;
        
        const totalSspSemua =
        jualBeliTotalSsp +
        tukarMenukarTotalSsp +
        hibahTotalSsp +
        aphbTotalSsp +
        aphtTotalSsp ;
        
        const totalSsbSemua =
        jualBeliTotalSsb +
        tukarMenukarTotalSsb +
        hibahTotalSsb +
        aphbTotalSsb +
        aphtTotalSsb ;
        
        // Menghitung total record dari semua kategori
        const totalRecord =
        jualBeliCount +
        tukarMenukarCount +
        hibahCount +
        aphbCount +
        aphtCount +
        nihilCount;
        
        // console.log("Total nilai_transaksi dari semua kategori:", totalNilaiTransaksiSemua);
        // console.log("Total ssp dari semua kategori:", totalSspSemua);
        // console.log("Total ssb dari semua kategori:", totalSsbSemua);
        // console.log("Total record dari semua kategori:", totalRecord);
        // console.log(getCurrentDateFormatted());
        const namaPpat = data.length > 0 ? data[0].nama_ppat : "";
        const bulanini = data.length > 0 ? data[0].bulan_ini : "";
        // console.log("Data nama_ppat:", namaPpat);
        // console.log("Data bulan_ini:", bulanini);

    try {
      const response = await fetch(`https://apippat.kantahsalatiga.com/api/validasi-bulan-ini`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${responseData.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "nik" : responseData.nik ,
          "bulan_ini": bulanIni
        })
      });
      if (!response.ok) {
        // console.error("Validation API error:", response.statusText);
        alert("Session Expired/Token tidak valid, Silahkan Login kembali")
        window.location.href = 'dashboard.html';
        document.getElementById('loading').style.display = 'none';
        return false;
      }
      const data = await response.json();

      if(data.message === "Data tidak ditemukan."){
        // alert("Upload Berkas")
        fetch(`https://apippat.kantahsalatiga.com/api/laporan-lengkap/upload`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${responseData.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "nik": responseData.nik,
            "bulan_ini": bulanIni,
            "nama_ppat": namaPpat,
            "jumlah_jual_beli": jualBeliCount,
            "total_luas_tanah_jual_beli": jualBeliTotalLuasTanah,
            "total_nilai_jual_beli": jualBeliTotalNilaiTransaksi,
            "jumlah_tukar_menukar": tukarMenukarCount,
            "total_luas_tanah_tukar_menukar": tukarMenukarTotalLuasTanah,
            "total_nilai_tukar_menukar": tukarMenukarTotalNilaiTransaksi,
            "jumlah_hibah": hibahCount,
            "total_luas_tanah_hibah": hibahTotalLuasTanah,
            "total_nilai_hibah": hibahTotalNilaiTransaksi,
            "jumlah_aphb": aphbCount,
            "total_luas_tanah_aphb": aphbTotalLuasTanah,
            "total_nilai_aphb": aphbTotalNilaiTransaksi,
            "jumlah_apht": aphtCount,
            "total_luas_tanah_apht": aphtTotalLuasTanah,
            "total_nilai_apht": aphtTotalNilaiTransaksi,
            "total_nihil": nihilCount,
            "total_nilai": totalNilaiTransaksiSemua,
            "total_ssp": totalSspSemua,
            "total_ssb": totalSsbSemua,
            "tanggal_laporan": getCurrentDateFormatted()
          })

        })
        .then(response => response.json())
        .then(result => {
          alert("Data berhasil di upload !!!")
          window.location.href = 'dashboardPPAT.html';
        })
        .catch(error => {
            alert("Data tidak berhasil di upload !!!")
        })
        .finally(() => {
          // Aksi yang selalu dijalankan untuk menyembunyikan overlay loading
          document.getElementById('loading').style.display = 'none';
        });
        
      }else{
        fetch(`https://apippat.kantahsalatiga.com/api/laporan-lengkap/update`, {
            method: 'PUT', // Gunakan metode PUT untuk update data (atau POST, sesuai dengan API Anda)
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${responseData.token}`
            },
            body: JSON.stringify({
            "nik": responseData.nik,
            "bulan_ini": bulanIni,
            "nama_ppat": namaPpat,
            "jumlah_jual_beli": jualBeliCount,
            "total_luas_tanah_jual_beli": jualBeliTotalLuasTanah,
            "total_nilai_jual_beli": jualBeliTotalNilaiTransaksi,
            "jumlah_tukar_menukar": tukarMenukarCount,
            "total_luas_tanah_tukar_menukar": tukarMenukarTotalLuasTanah,
            "total_nilai_tukar_menukar": tukarMenukarTotalNilaiTransaksi,
            "jumlah_hibah": hibahCount,
            "total_luas_tanah_hibah": hibahTotalLuasTanah,
            "total_nilai_hibah": hibahTotalNilaiTransaksi,
            "jumlah_aphb": aphbCount,
            "total_luas_tanah_aphb": aphbTotalLuasTanah,
            "total_nilai_aphb": aphbTotalNilaiTransaksi,
            "jumlah_apht": aphtCount,
            "total_luas_tanah_apht": aphtTotalLuasTanah,
            "total_nilai_apht": aphtTotalNilaiTransaksi,
            "total_nihil": nihilCount,
            "total_nilai": totalNilaiTransaksiSemua,
            "total_ssp": totalSspSemua,
            "total_ssb": totalSsbSemua,
            "tanggal_laporan": getCurrentDateFormatted()
            })
          })
          .then(response => response.json())
          .then(result => {
            alert("Data berhasil di update !!!!")
            window.location.href = 'dashboardPPAT.html';
          })
          .catch(error => {
            console.error('Error updating data:', error);
          })
          .finally(() => {
            // Sembunyikan overlay loading
            document.getElementById('loading').style.display = 'none';
          });
      }
    //   // Misal, API mengembalikan { uploaded: true/false }
    //   return data.uploaded;
    //   console.log(data.message)
    } catch (error) {
      console.error("Error during validation API call:", error);
      document.getElementById('loading').style.display = 'none';
      return false;
    }

   

  }

function uploadData() {
isDataUploaded();

}

// Panggil fungsi untuk load data jika data tersedia
if (data) {
    loadData(data);
} else {
    console.error("Data tidak ditemukan di sessionStorage.");
}