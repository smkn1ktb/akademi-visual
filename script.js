document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.id;

    // --- DATA PROGRESS (disimpan di Local Storage browser) ---
    // Inisialisasi progress jika belum ada
    if (!localStorage.getItem('progressMPLS')) {
        localStorage.setItem('progressMPLS', JSON.stringify([false, false, false, false, false]));
    }
    const progress = JSON.parse(localStorage.getItem('progressMPLS'));

    // Fungsi untuk menyimpan progress
    const simpanProgress = (tantanganIndex) => {
        progress[tantanganIndex] = true;
        localStorage.setItem('progressMPLS', JSON.stringify(progress));
    };

    // --- LOGIKA UNTUK SETIAP HALAMAN ---
    if (page === 'dashboard') {
        // --- LOGIKA HALAMAN UTAMA (INDEX.HTML) ---
        const kartu = [1, 2, 3, 4, 5].map(i => document.getElementById(`kartu${i}`));
        const link = [1, 2, 3, 4, 5].map(i => document.getElementById(`link${i}`));
        const tombolTes = document.getElementById('tombolTes');

        progress.forEach((isSelesai, index) => {
            const statusIcon = kartu[index].querySelector('.status-icon');
            const adalahTantanganPertama = index === 0;
            const tantanganSebelumnyaSelesai = adalahTantanganPertama || progress[index - 1];

            if (isSelesai) {
                kartu[index].classList.add('selesai');
                statusIcon.textContent = '✅';
            } else if (tantanganSebelumnyaSelesai) {
                kartu[index].classList.remove('terkunci');
                statusIcon.textContent = '▶️';
            } else {
                kartu[index].classList.add('terkunci');
                statusIcon.textContent = '🔒';
                link[index].href = '#';
                link[index].onclick = (e) => e.preventDefault();
            }
        });
        
        // Aktifkan tombol tes jika semua progress adalah true
        if (progress.every(p => p === true)) {
            tombolTes.disabled = false;
            tombolTes.textContent = 'Mulai Tes Akhir!';
            tombolTes.onclick = () => { window.location.href = 'tes_akhir.html'; };
        }

    } else if (page === 'tantangan1') {
        // --- LOGIKA TANTANGAN 1: HIERARKI ---
        const semuaElemenDesain = document.querySelectorAll('.elemen-desain');
        const tombolKontrol = document.querySelectorAll('.tombol-kontrol');
        const tombolCekJawaban = document.querySelector('.tombol-aksi');
        let elemenTerpilih = null;

        semuaElemenDesain.forEach(elemen => {
            elemen.addEventListener('click', () => {
                semuaElemenDesain.forEach(el => el.classList.remove('terpilih'));
                elemen.classList.add('terpilih');
                elemenTerpilih = elemen;
            });
        });

        tombolKontrol.forEach(tombol => {
            tombol.addEventListener('click', () => {
                if (!elemenTerpilih) { alert("Pilih elemen dulu!"); return; }
                elemenTerpilih.style.fontSize = '';
                elemenTerpilih.style.fontWeight = '';
                if (tombol.textContent === 'Jadikan Judul Utama') {
                    elemenTerpilih.style.fontSize = '32px';
                    elemenTerpilih.style.fontWeight = '700';
                } else if (tombol.textContent === 'Jadikan Sub-Judul') {
                    elemenTerpilih.style.fontSize = '24px';
                } else if (tombol.textContent === 'Jadikan Info Tambahan') {
                    elemenTerpilih.style.fontSize = '14px';
                }
            });
        });

        tombolCekJawaban.addEventListener('click', () => {
            const isJudulBenar = document.getElementById('elemen2').style.fontSize === '32px';
            const isSubJudulBenar = document.getElementById('elemen1').style.fontSize === '24px';
            const isInfoBenar = document.getElementById('elemen3').style.fontSize === '14px';

            if (isJudulBenar && isSubJudulBenar && isInfoBenar) {
                alert("Kerja Bagus! Hierarki benar.");
                simpanProgress(0); // Simpan progress untuk tantangan 1 (index 0)
                window.location.href = 'index.html';
            } else {
                alert("Belum tepat! Coba periksa lagi.");
            }
        });

    } else if (page === 'tantangan2') {
        // --- LOGIKA TANTANGAN 2: KESEIMBANGAN ---
        const areaKanan = document.querySelector('.area-kanan');
        const tombolTambah = document.querySelector('#tambah-elemen');
        const tombolCek = document.querySelector('.tombol-aksi');
        const bobotKiri = 100; // Bobot elemen besar di kiri
        let bobotKanan = 0;

        tombolTambah.addEventListener('click', () => {
            const bobotBaru = Math.floor(Math.random() * 20) + 10; // Bobot acak 10-29
            bobotKanan += bobotBaru;

            const elemenBaru = document.createElement('div');
            elemenBaru.classList.add('item-seimbang');
            elemenBaru.style.width = (bobotBaru * 2) + 'px'; // Lebar proporsional
            elemenBaru.style.height = (bobotBaru * 2) + 'px';
            elemenBaru.textContent = bobotBaru;
            areaKanan.appendChild(elemenBaru);
        });

        tombolCek.addEventListener('click', () => {
             if (bobotKanan >= bobotKiri * 0.9 && bobotKanan <= bobotKiri * 1.1) {
                alert("Seimbang! Kerja bagus.");
                simpanProgress(1);
                window.location.href = 'index.html';
            } else {
                alert(`Belum seimbang! Bobot kanan (${bobotKanan}) harus mendekati bobot kiri (${bobotKiri}).`);
            }
        });


    } else if (page === 'tantangan3') {
        // --- LOGIKA TANTANGAN 3: KONTRAST ---
        const kanvas = document.querySelector('.kanvas');
        const teks = kanvas.querySelector('h2');
        const palet = document.querySelectorAll('.warna-pilihan');
        const tombolCek = document.querySelector('.tombol-aksi');
        const warnaLatar = '#0D47A1'; // Biru Tua
        kanvas.style.backgroundColor = warnaLatar;
        
        palet.forEach(warna => {
            warna.style.backgroundColor = warna.dataset.color;
            warna.addEventListener('click', () => {
                teks.style.color = warna.dataset.color;
            });
        });

        tombolCek.addEventListener('click', () => {
            if (teks.style.color === 'rgb(255, 255, 255)') { // Membandingkan dengan format rgb
                alert("Kontrasnya pas! Mudah dibaca.");
                simpanProgress(2);
                window.location.href = 'index.html';
            } else {
                alert("Kurang kontras! Coba pilih warna lain yang lebih cerah.");
            }
        });

    } else if (page === 'tantangan4') {
        // --- LOGIKA TANTANGAN 4: RULE OF THIRDS ---
        const ikon = document.getElementById('ikon-rot');
        const kanvas = document.querySelector('.kanvas');
        const tombolCek = document.querySelector('.tombol-aksi');
        let isDragging = false;

        ikon.addEventListener('mousedown', () => { isDragging = true; });
        window.addEventListener('mouseup', () => { isDragging = false; });
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const rect = kanvas.getBoundingClientRect();
            // hitung posisi mouse relatif terhadap kanvas
            let x = e.clientX - rect.left - (ikon.offsetWidth / 2);
            let y = e.clientY - rect.top - (ikon.offsetHeight / 2);
            // Batasi agar ikon tidak keluar kanvas
            x = Math.max(0, Math.min(x, rect.width - ikon.offsetWidth));
            y = Math.max(0, Math.min(y, rect.height - ikon.offsetHeight));
            ikon.style.left = x + 'px';
            ikon.style.top = y + 'px';
        });

        tombolCek.addEventListener('click', () => {
            const rect = kanvas.getBoundingClientRect();
            const ikonRect = ikon.getBoundingClientRect();
            const centerX = ikonRect.left - rect.left + (ikonRect.width / 2);
            const centerY = ikonRect.top - rect.top + (ikonRect.height / 2);
            
            const sepertigaX = rect.width / 3;
            const sepertigaY = rect.height / 3;

            const dekatTitikPotongX = Math.abs(centerX - sepertigaX) < 20 || Math.abs(centerX - 2 * sepertigaX) < 20;
            const dekatTitikPotongY = Math.abs(centerY - sepertigaY) < 20 || Math.abs(centerY - 2 * sepertigaY) < 20;

            if (dekatTitikPotongX && dekatTitikPotongY) {
                alert("Tepat di titik emas! Komposisi yang kuat.");
                simpanProgress(3);
                window.location.href = 'index.html';
            } else {
                alert("Belum pas! Coba letakkan ikon di dekat salah satu persilangan garis.");
            }
        });

    } else if (page === 'tantangan5') {
        // --- LOGIKA TANTANGAN 5: RUANG KOSONG ---
        const elemenHapus = document.querySelectorAll('.elemen-hapus');
        const tombolCek = document.querySelector('.tombol-aksi');
        let jumlahDihapus = 0;

        elemenHapus.forEach(elemen => {
            elemen.addEventListener('click', () => {
                if (elemen.classList.toggle('dihapus')) {
                    jumlahDihapus++;
                } else {
                    jumlahDihapus--;
                }
            });
        });
        
        tombolCek.addEventListener('click', () => {
            const elemenPenting1 = document.getElementById('penting1');
            const elemenPenting2 = document.getElementById('penting2');
            
            if (jumlahDihapus >= 5 && !elemenPenting1.classList.contains('dihapus') && !elemenPenting2.classList.contains('dihapus')) {
                alert("Desain jadi lebih lega dan fokus! Bagus.");
                simpanProgress(4);
                window.location.href = 'index.html';
            } else {
                alert("Belum tepat! Hapus elemen yang tidak perlu, tapi jangan hapus informasi utamanya.");
            }
        });
        
    } else if (page === 'tes_akhir') {
        // --- LOGIKA HALAMAN TES AKHIR ---
        const semuaPilihan = document.querySelectorAll('.pilihan');
        const tombolSelesai = document.getElementById('tombolSelesaiTes');
        
        semuaPilihan.forEach(pilihan => {
            pilihan.addEventListener('click', () => {
                const grup = pilihan.closest('.pilihan-jawaban');
                grup.querySelectorAll('.pilihan').forEach(p => p.classList.remove('terpilih'));
                pilihan.classList.add('terpilih');
            });
        });

        tombolSelesai.addEventListener('click', () => {
            const totalSoal = 3;
            const jawabanTerpilih = document.querySelectorAll('.pilihan.terpilih');
            
            if (jawabanTerpilih.length < totalSoal) {
                alert('Harap jawab semua pertanyaan terlebih dahulu!');
                return;
            }

            let skor = 0;
            let jawabanBenar = { q1: false, q2: false, q3: false };

            const jawabanSoal1 = document.querySelector('[data-soal="1"] .terpilih');
            if (jawabanSoal1 && jawabanSoal1.dataset.jawaban === 'benar') {
                skor++;
                jawabanBenar.q1 = true;
            }
            
            const jawabanSoal2 = document.querySelector('[data-soal="2"] .terpilih');
            if (jawabanSoal2 && jawabanSoal2.dataset.jawaban === 'benar') {
                skor++;
                jawabanBenar.q2 = true;
            }
            
            const jawabanSoal3 = document.querySelector('[data-soal="3"] .terpilih');
            if (jawabanSoal3 && jawabanSoal3.dataset.jawaban === 'benar') {
                skor++;
                jawabanBenar.q3 = true;
            }

            const nilaiAkhir = Math.round((skor / totalSoal) * 100);

            const hasilTes = {
                skor: nilaiAkhir,
                jawaban: jawabanBenar
            };
            
            // Simpan hasil ke localStorage dan arahkan ke halaman hasil
            localStorage.setItem('hasilTesMPLS', JSON.stringify(hasilTes));
            window.location.href = 'hasil.html';
        });

    } else if (page === 'hasil') {
        // --- LOGIKA HALAMAN HASIL ---
        const hasil = JSON.parse(localStorage.getItem('hasilTesMPLS'));

        if (!hasil) {
            window.location.href = 'index.html'; // Kembali ke awal jika tidak ada data hasil
            return;
        }

        document.getElementById('nilai-akhir').textContent = hasil.skor;
        const pesanHasil = document.getElementById('pesan-hasil');
        const areaSaran = document.getElementById('area-saran');
        
        if (hasil.skor === 100) {
            pesanHasil.textContent = 'Sempurna! Anda Menguasai Semuanya!';
        } else if (hasil.skor >= 60) {
            pesanHasil.textContent = 'Kerja Bagus, Pemahaman Anda Baik!';
        } else {
            pesanHasil.textContent = 'Perlu Sedikit Latihan Lagi!';
        }

        if (!hasil.jawaban.q1) {
            areaSaran.innerHTML += `
                <div class="saran-item">
                    <h4>Saran untuk Hierarki Visual</h4>
                    <p>Ingat, informasi paling penting harus paling menonjol. Gunakan ukuran, ketebalan, atau warna untuk membedakan judul utama, sub-judul, dan info tambahan.</p>
                </div>
            `;
        }
        if (!hasil.jawaban.q2) {
            areaSaran.innerHTML += `
                <div class="saran-item">
                    <h4>Saran untuk Kontras Warna</h4>
                    <p>Pastikan warna teks dan latar belakang memiliki perbedaan yang jelas. Teks gelap di atas latar terang (atau sebaliknya) adalah kunci agar mudah dibaca.</p>
                </div>
            `;
        }
        if (!hasil.jawaban.q3) {
            areaSaran.innerHTML += `
                <div class="saran-item">
                    <h4>Saran untuk Ruang Kosong</h4>
                    <p>Jangan takut pada ruang kosong! Beri "nafas" pada setiap elemen agar desain tidak terasa sesak dan audiens bisa fokus pada informasi penting.</p>
                </div>
            `;
        }
        
        // Hapus data hasil agar tidak muncul lagi jika halaman di-refresh
        localStorage.removeItem('hasilTesMPLS');
    }
});