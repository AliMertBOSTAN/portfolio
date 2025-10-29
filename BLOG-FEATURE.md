# Blog Sayfası - Kullanım Rehberi

## 🎉 Yeni Özellikler

### 📝 Blog Sayfası
- Medium makaleleriniz otomatik olarak çekiliyor
- Kart şeklinde güzel görünüm
- Makale başlığı, özet ve devamı için link
- Yayın tarihi ve kategori gösterimi

### 🏠 Alt Navigasyon Barı
- **Ana Sayfa** (🏠): Portfolio ana sayfasına götürür
- **Makaleler** (📝): Blog sayfasına götürür
- Sabit alt bar, her sayfada görünür
- Aktif sayfa vurgulanır

## 🔧 Nasıl Çalışıyor?

### Medium RSS Feed
Blog sayfası, Medium RSS feed'inizi kullanarak makalelerinizi çekiyor:
- URL: `https://medium.com/feed/@BOSTANmert`
- RSS2JSON API kullanılıyor (ücretsiz)
- Otomatik güncelleme

### Navigasyon
- Alt bardaki butonlara tıklayarak sayfalar arası geçiş
- Header'daki linkler ana sayfada ilgili bölüme scroll yapıyor
- Blog sayfasındayken header linklerine tıklanırsa, önce ana sayfaya dönüyor

## 📱 Responsive Tasarım
- Mobilde alt bar küçülür
- Blog kartları tek sütun olur
- Touch-friendly butonlar

## 🎨 Özelleştirme

### Renk Teması
Tüm renkler CSS değişkenlerinde tanımlı (`index.css`):
- `--green-primary`: Ana yeşil renk
- `--bg-dark`: Arka plan
- `--text-primary`: Yazı rengi

### Blog Kartları
`src/components/Blog.css` dosyasında:
- Kart boyutu
- Gap (aralık)
- Hover efektleri

### Alt Bar
`src/components/BottomNav.css` dosyasında:
- Yükseklik
- Icon boyutu
- Animasyonlar

## 🔗 Yönlendirme (Routing)

React Router kullanılıyor:
- `/` → Ana Sayfa (Portfolio)
- `/blog` → Blog/Makaleler Sayfası

## ⚠️ Önemli Notlar

### RSS2JSON API
- Ücretsiz planda saatte 10,000 istek
- Public API, API key gerektirmiyor
- Medium RSS feed'i otomatik parse ediyor

### Alternatif API (ihtiyaç olursa)
Eğer RSS2JSON çalışmazsa, doğrudan Medium API kullanabilirsiniz:
```javascript
// Blog.jsx içinde değiştirin:
const response = await fetch(
  'https://api.medium.com/@BOSTANmert/latest'
)
```

### SEO İçin
Blog sayfasına meta tag'ler eklemek isterseniz:
1. `react-helmet-async` paketini yükleyin
2. Her sayfaya ayrı title/description ekleyin

## 🚀 Deploy Sonrası

Digital Ocean'da deploy edildikten sonra:
1. Ana sayfa: `https://your-app.ondigitalocean.app/`
2. Blog: `https://your-app.ondigitalocean.app/blog`

### URL Routing Sorunu Olursa

Digital Ocean static site'larda 404 sorunu olabilir. Çözüm:

`.do/app.yaml` dosyasına ekleyin:
```yaml
static_sites:
  - name: web
    catchall_document: index.html  # Bu satırı ekleyin
```

Veya `public` klasörüne `_redirects` dosyası ekleyin:
```
/*    /index.html   200
```

## 📊 İstatistikler

- **Toplam dosya sayısı**: 4 yeni dosya
- **Blog.jsx**: ~130 satır
- **Blog.css**: ~210 satır
- **BottomNav.jsx**: ~35 satır
- **BottomNav.css**: ~90 satır

## 🎯 Gelecek Geliştirmeler (İsteğe Bağlı)

1. **Arama özelliği**: Blog makalelerinde arama
2. **Kategori filtreleme**: Kategorilere göre filtre
3. **Sayfalama**: Çok makale varsa sayfalama
4. **Dark/Light mode toggle**: Tema değiştirme
5. **Paylaşım butonları**: Sosyal medya paylaşımı

---

Başarılar! 🎉 Portfolio siteniz artık tam özellikli bir blog sayfasına sahip!
