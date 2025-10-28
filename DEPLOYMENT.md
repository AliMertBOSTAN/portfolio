# Digital Ocean'da Yayınlama Rehberi

## Yöntem 1: Digital Ocean App Platform (Önerilen - En Kolay)

### Adım 1: GitHub'a Yükleyin
```bash
# Projeyi GitHub'a yükleyin
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/portfolio.git
git push -u origin main
```

### Adım 2: Digital Ocean'da App Oluşturun

1. **Digital Ocean'a giriş yapın**: https://cloud.digitalocean.com/
2. **Apps** sekmesine gidin
3. **Create App** butonuna tıklayın
4. **GitHub'ı bağlayın** ve repository'nizi seçin
5. **Branch**: `main` seçin
6. **Build & Run Commands**:
   - Build Command: `npm run build`
   - Run Command: `npm run preview`
7. **Environment Variables** (İsteğe bağlı): Şimdilik boş bırakabilirsiniz
8. **App Info**:
   - Name: `portfolio` veya istediğiniz isim
   - Region: Frankfurt veya en yakın bölge
9. **Review** yapın ve **Create Resources** tıklayın

### Adım 3: Deploy
- Digital Ocean otomatik olarak deploy edecek
- İşlem 5-10 dakika sürer
- Tamamlandığında size bir URL verilir (örn: `portfolio-xxxxx.ondigitalocean.app`)

---

## Yöntem 2: Digital Ocean Droplet ile Deploy

### Adım 1: Droplet Oluşturun
1. Digital Ocean'da **Create** > **Droplets**
2. **Ubuntu 22.04 LTS** seçin
3. **Basic Plan** - $6/ay
4. SSH key ekleyin veya şifre oluşturun

### Adım 2: Droplet'a Bağlanın
```bash
ssh root@DROPLET_IP_ADRESI
```

### Adım 3: Sunucuyu Hazırlayın
```bash
# Node.js ve npm yükleyin
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Nginx yükleyin
apt-get install -y nginx

# PM2 yükleyin (process manager)
npm install -g pm2

# Git yükleyin
apt-get install -y git
```

### Adım 4: Projeyi Klonlayın
```bash
cd /var/www
git clone https://github.com/KULLANICI_ADINIZ/portfolio.git
cd portfolio
npm install
npm run build
```

### Adım 5: Nginx Yapılandırın
```bash
nano /etc/nginx/sites-available/portfolio
```

Aşağıdaki içeriği ekleyin:
```nginx
server {
    listen 80;
    server_name DOMAIN_ADINIZ_VEYA_IP;

    root /var/www/portfolio/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Siteyi aktif edin:
```bash
ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Adım 6: Firewall Ayarları
```bash
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw enable
```

---

## Yöntem 3: Static Site Hosting (En Ucuz)

### Digital Ocean Spaces kullanarak
1. **Spaces** oluşturun
2. CDN aktif edin
3. Build dosyalarını yükleyin:
```bash
npm run build
# dist klasörünü Spaces'e yükleyin
```

---

## SSL Sertifikası (HTTPS) Ekleme

### App Platform için:
- Otomatik olarak gelir, bir şey yapmanıza gerek yok

### Droplet için (Let's Encrypt):
```bash
apt-get install certbot python3-certbot-nginx
certbot --nginx -d DOMAIN_ADINIZ
```

---

## Domain Bağlama

1. Domain sağlayıcınızda (GoDaddy, Namecheap vb):
   - A Record: `@` -> `DROPLET_IP` veya App Platform IP
   - CNAME: `www` -> `@`

2. Digital Ocean'da domain ekleyin:
   - **Networking** > **Domains** > Domain ekleyin

---

## Güncelleme

### App Platform:
- GitHub'a push yaptığınızda otomatik güncellenir

### Droplet:
```bash
cd /var/www/portfolio
git pull
npm install
npm run build
systemctl restart nginx
```

---

## Maliyet Tahmini

| Yöntem | Aylık Maliyet |
|--------|---------------|
| App Platform (Static Site) | $0 (Başlangıç) - $5 |
| Droplet (Basic) | $6 |
| Spaces + CDN | $5 |

**Önerim**: Başlangıç için App Platform'u deneyin, ücretsiz veya çok ucuz.

---

## Destek

Sorun olursa Digital Ocean dokümantasyonu çok iyi:
- https://docs.digitalocean.com/products/app-platform/
- https://docs.digitalocean.com/products/droplets/
