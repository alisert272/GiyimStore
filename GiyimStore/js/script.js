// Tüm kodlar DOM yüklendikten sonra çalışsın
document.addEventListener("DOMContentLoaded", function () {

    /*  SEPET SAYISI */
    function sepetSayisiniGuncelle() {
        const sepet = JSON.parse(localStorage.getItem("sepet")) || [];
        let toplamAdet = 0;

        sepet.forEach(urun => {
            toplamAdet += urun.adet;
        });

        const badge = document.getElementById("sepetSayisi");
        if (badge) badge.textContent = toplamAdet;
    }

    /*  GİRİŞ FORMU */
    const girisForm = document.getElementById("girisForm");

    if (girisForm) {
        girisForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const sifre = document.getElementById("sifre").value.trim();

            if (!email || !sifre) {
                alert("Lütfen e-posta ve şifre alanlarını doldurun!");
                return;
            }

            if (sifre.length < 4) {
                alert("Şifreniz en az 4 karakter olmalıdır!");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Geçerli bir e-posta girin!");
                return;
            }

            window.location.href = "index.html";
        });
    }

    /*  KAYIT FORMU */
    const kayitForm = document.getElementById("kayitForm");

    if (kayitForm) {
        kayitForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const ad = document.getElementById("ad").value.trim();
            const soyad = document.getElementById("soyad").value.trim();
            const email = document.getElementById("emailKayit").value.trim();
            const sifre = document.getElementById("sifreKayit").value.trim();
            const sifreTekrar = document.getElementById("sifreTekrar").value.trim();
            const kvkk = document.getElementById("kvkk").checked;

            if (!ad || !soyad || !email || !sifre || !sifreTekrar) {
                alert("Tüm alanları doldurun!");
                return;
            }

            if (sifre.length < 4) {
                alert("Şifre en az 4 karakter olmalı!");
                return;
            }

            if (sifre !== sifreTekrar) {
                alert("Şifreler uyuşmuyor!");
                return;
            }

            if (!kvkk) {
                alert("KVKK onayını kabul etmelisiniz!");
                return;
            }

            alert("Kayıt başarılı!");
            window.location.href = "giris.html";
        });
    }

    /*  BANNER SLIDER  */
    const banner = document.getElementById("banner");

    if (banner) {
        const bannerFotos = [
            "img/hero.png",
            "img/hero2.jpg",
            "img/hero3.png"
        ];

        let index = 0;

        function bannerDegistir() {
            banner.style.backgroundImage =
                `linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,.25)), url(${bannerFotos[index]})`;
            index = (index + 1) % bannerFotos.length;
        }

        bannerDegistir();
        setInterval(bannerDegistir, 4000);
    }

    /*  İLETİŞİM FORMU  */
    const iletisimForm = document.getElementById("iletisimForm");
    const mesajKutusu = document.getElementById("mesajKutusu");

    if (iletisimForm) {
        iletisimForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const adsoyad = document.getElementById("adsoyad").value.trim();
            const email = document.getElementById("emailIletisim").value.trim();
            const konu = document.getElementById("konu").value.trim();
            const mesaj = document.getElementById("mesaj").value.trim();

            if (!adsoyad || !email || !konu || !mesaj) {
                mesajKutusu.style.display = "block";
                mesajKutusu.style.background = "#dc3545";
                mesajKutusu.textContent = "Lütfen tüm alanları doldurun!";
                return;
            }

            mesajKutusu.style.display = "block";
            mesajKutusu.style.background = "#28a745";
            mesajKutusu.textContent = "Mesajınız gönderildi!";
            iletisimForm.reset();

            setTimeout(() => {
                mesajKutusu.style.display = "none";
            }, 4000);
        });
    }

    /*  SEPET  */
    let sepet = JSON.parse(localStorage.getItem("sepet")) || [];

    document.querySelectorAll(".sepete-ekle").forEach(btn => {
        btn.addEventListener("click", () => {

            const kart = btn.closest(".urun-kart");
            const bedenSelect = kart.querySelector(".beden-sec");

            if (bedenSelect && bedenSelect.value === "") {
                alert("Lütfen beden seçiniz!");
                return;
            }

            const secilenBeden = bedenSelect
                ? bedenSelect.options[bedenSelect.selectedIndex].text
                : "-";

            const urun = {
                ad: btn.dataset.ad,
                fiyat: Number(btn.dataset.fiyat),
                resim: btn.dataset.resim,
                beden: secilenBeden,
                adet: 1
            };

            const mevcut = sepet.find(
                item => item.ad === urun.ad && item.beden === urun.beden
            );

            if (mevcut) {
                mevcut.adet++;
            } else {
                sepet.push(urun);
            }

            localStorage.setItem("sepet", JSON.stringify(sepet));
            sepetSayisiniGuncelle();

            alert(`${urun.ad} (${urun.beden}) sepete eklendi 🛒`);
        });
    });

    /*  SEPETİ LİSTELE  */
    function sepetiYukle() {
        const sepetListe = document.getElementById("sepetListe");
        const sepetBos = document.getElementById("sepetBos");
        const toplamFiyat = document.getElementById("toplamFiyat");

        if (!sepetListe) return;

        sepetListe.innerHTML = "";
        let toplam = 0;

        if (sepet.length === 0) {
            sepetBos.style.display = "block";
            toplamFiyat.textContent = "0 TL";
            sepetSayisiniGuncelle();
            return;
        }

        sepetBos.style.display = "none";

        sepet.forEach((urun, index) => {
            toplam += urun.fiyat * urun.adet;

            sepetListe.innerHTML += `
                <div class="sepet-urun">
                    <img src="${urun.resim}">
                    <h4>
                        ${urun.ad}
                        <small style="color:#666;">(Beden: ${urun.beden})</small>
                    </h4>
                    <span>${urun.fiyat} TL x ${urun.adet}</span>
                    <button class="sil-btn" onclick="urunuSil(${index})">Sil</button>
                </div>
            `;
        });

        toplamFiyat.textContent = toplam + " TL";
        sepetSayisiniGuncelle();
    }

    function urunuSil(index) {
        sepet.splice(index, 1);
        localStorage.setItem("sepet", JSON.stringify(sepet));
        sepetiYukle();
        sepetSayisiniGuncelle();
    }

    window.urunuSil = urunuSil;

    sepetiYukle();
    sepetSayisiniGuncelle();

    /*  ÜRÜN DETAY MODAL */
    const urunModal = document.getElementById("urunModal");
    const modalKapat = document.getElementById("modalKapat");
    const modalResim = document.getElementById("modalResim");
    const modalBaslik = document.getElementById("modalBaslik");
    const modalFiyat = document.getElementById("modalFiyat");
    const modalAciklama = document.getElementById("modalAciklama");

    document.querySelectorAll(".incele-btn").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();

            modalResim.src = this.dataset.resim || "";
            modalBaslik.textContent = this.dataset.ad || "";
            modalAciklama.textContent = this.dataset.aciklama || "Ürün açıklaması mevcut değil.";

            if (this.dataset.fiyat !== undefined) {
                modalFiyat.textContent = this.dataset.fiyat + " TL";
                modalFiyat.style.display = "block";
            } else {
                modalFiyat.style.display = "none";
            }

            urunModal.style.display = "flex";
        });
    });

    if (modalKapat) {
        modalKapat.addEventListener("click", () => {
            urunModal.style.display = "none";
        });
    }

    if (urunModal) {
        urunModal.addEventListener("click", (e) => {
            if (e.target === urunModal) urunModal.style.display = "none";
        });
    }

    /*  ÜRÜN ARAMA  */
    const urunAraBtn = document.getElementById("urunAraBtn");
    const urunAraInput = document.getElementById("urunAraInput");

    function urunAra() {
        const aranan = urunAraInput.value.toLowerCase();
        const urunler = document.querySelectorAll(".urun-kart");

        urunler.forEach(urun => {
            const baslik = urun.querySelector("h3").innerText.toLowerCase();
            urun.style.display = baslik.includes(aranan) ? "block" : "none";
        });
    }

    if (urunAraBtn && urunAraInput) {
        urunAraBtn.addEventListener("click", urunAra);
        urunAraInput.addEventListener("keyup", urunAra);
    }

    
        /*  SATIN AL MODAL  */
    const satinAlBtn = document.getElementById("satinAlBtn");
    const satinAlModal = document.getElementById("satinAlModal");
    const modalKapatSatin = document.getElementById("modalKapatSatin");
    const satinAlForm = document.getElementById("satinAlForm");

    // SATIN AL butonuna tıklayınca
    if (satinAlBtn && satinAlModal) {
        satinAlBtn.addEventListener("click", () => {

            const sepet = JSON.parse(localStorage.getItem("sepet")) || [];

            // 🛒 Sepet boşsa
            if (sepet.length === 0) {
                alert("❗ Sepetiniz boş. Lütfen ürün ekleyin.");
                return;
            }

            satinAlModal.style.display = "flex";
        });
    }

    // X ile modal kapatma
    if (modalKapatSatin && satinAlModal) {
        modalKapatSatin.addEventListener("click", () => {
            satinAlModal.style.display = "none";
        });
    }

    // Form submit (ödeme)
    if (satinAlForm) {
    satinAlForm.onsubmit = function (e) {
        e.preventDefault();

        const alanlar = satinAlForm.querySelectorAll("input, textarea");

        const adSoyad = alanlar[0].value.trim();
        const adres   = alanlar[1].value.trim();
        const kartNo  = alanlar[2].value.trim();
        const tarih   = alanlar[3].value.trim();
        const cvv     = alanlar[4].value.trim();

       
        if (!adSoyad || !adres || !kartNo || !tarih || !cvv) {
            alert("❗ Lütfen tüm alanları doldurun.");
            return;
        }

        
        if (!/^\d{16}$/.test(kartNo)) {
            alert("❗ Kart numarası 16 haneli olmalıdır.");
            return;
        }

        
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(tarih)) {
            alert("❗ Kart tarihi AA/YY formatında olmalıdır.");
            return;
        }

        
        if (!/^\d{3}$/.test(cvv)) {
            alert("❗ CVV 3 haneli olmalıdır.");
            return;
        }

        
        alert("🎉 Siparişiniz başarıyla alındı!");

        localStorage.removeItem("sepet");
        location.reload();
    };
    }
    
        /*  SIRALAMA  */
    const siralaSelect = document.getElementById("siralaSelect");
    const urunGrid = document.querySelector(".urun-grid");

    if (siralaSelect && urunGrid) {
        siralaSelect.addEventListener("change", () => {
            const secim = siralaSelect.value;
            const urunler = Array.from(urunGrid.querySelectorAll(".urun-kart"));

            urunler.sort((a, b) => {
                const fiyatA = Number(a.dataset.fiyat);
                const fiyatB = Number(b.dataset.fiyat);
                const adA = a.querySelector("h3").innerText.toLowerCase();
                const adB = b.querySelector("h3").innerText.toLowerCase();

                switch (secim) {
                    case "fiyat-asc":
                        return fiyatA - fiyatB;
                    case "fiyat-desc":
                        return fiyatB - fiyatA;
                    case "ad-asc":
                        return adA.localeCompare(adB);
                    case "ad-desc":
                        return adB.localeCompare(adA);
                    default:
                        return 0;
                }
            });

            // DOM'u yeniden sırala
            urunler.forEach(urun => urunGrid.appendChild(urun));
        });
    }


       
        /*  FAVORİLER  */
let favoriler = JSON.parse(localStorage.getItem("favoriler")) || [];

document.querySelectorAll(".favori-btn").forEach(btn => {

    const urun = {
        id: btn.dataset.id,
        ad: btn.dataset.ad,
        fiyat: Number(btn.dataset.fiyat),
        resim: btn.dataset.resim
    };

    // Sayfa yüklenince aktif mi?
    if (favoriler.some(f => f.id === urun.id)) {
        btn.classList.add("aktif");
        btn.textContent = "❤️";
    }

    btn.addEventListener("click", () => {
        const index = favoriler.findIndex(f => f.id === urun.id);

        if (index > -1) {
            favoriler.splice(index, 1);
            btn.classList.remove("aktif");
            btn.textContent = "🤍";
        } else {
            favoriler.push(urun);
            btn.classList.add("aktif");
            btn.textContent = "❤️";
        }

        localStorage.setItem("favoriler", JSON.stringify(favoriler));
    });
});



    /*  FAVORİLER SAYFASI  */
const favoriListe = document.getElementById("favoriListe");
const favoriBos = document.getElementById("favoriBos");

if (favoriListe) {
    const favoriler = JSON.parse(localStorage.getItem("favoriler")) || [];

    if (favoriler.length === 0) {
        favoriBos.style.display = "block";
    } else {
        favoriler.forEach(urun => {
            favoriListe.innerHTML += `
                <div class="urun-kart">
                    <img src="${urun.resim}" class="urun-resim">
                    <h3>${urun.ad}</h3>
                    <p class="fiyat">${urun.fiyat} TL</p>

                    <button class="btn-kucuk" onclick="favoridenCikar('${urun.id}')">
                        ❌ Favoriden Çıkar
                    </button>
                </div>
            `;
        });
    }
}

// Favoriden çıkarma
function favoridenCikar(id) {
    let favoriler = JSON.parse(localStorage.getItem("favoriler")) || [];
    favoriler = favoriler.filter(f => f.id !== id);
    localStorage.setItem("favoriler", JSON.stringify(favoriler));
    location.reload();
}

window.favoridenCikar = favoridenCikar;




});
