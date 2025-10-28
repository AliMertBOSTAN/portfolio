import React from 'react'
import './About.css'

function About() {
  return (
    <section id="about" className="about">
      <h2 className="section-title">Hakkımda</h2>
      <div className="about-content">
        <div className="about-text">
          <p className="about-paragraph">
            Merhaba! Ben Ali Mert BOSTAN, tutkulu bir yazılım geliştiriciyim. 
            Modern web teknolojileriyle kullanıcı deneyimini ön planda tutan 
            projeler geliştiriyorum.
          </p>
          <p className="about-paragraph">
            Yazılım alanında özellikle blokzincir teknolojileri, akıllı sözleşmeler (Solidity), DeFi protokolleri ve ön yüz geliştirme (React, TypeScript) üzerine çalışıyorum. Hem akademik hem girişimsel projelerde yer alarak Web3, yapay zekâ, gömülü sistemler ve oyun teknolojilerini bir araya getiren yenilikçi çözümler geliştiriyorum. Kod yazarken sadece teknik doğruluğa değil, aynı zamanda tasarım, kullanıcı deneyimi ve güvenlik prensiplerine de önem veriyorum. Hedefim, mühendislik bilgisini gerçek dünyadaki sorunlara akıllı, ölçeklenebilir ve sürdürülebilir teknolojilerle dönüştürmek.
          </p>
          <div className="about-stats">
            <div className="stat-item">
              <span className="stat-number">3+</span>
              <span className="stat-label">Yıl Deneyim</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">Tamamlanan Proje</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">20+</span>
              <span className="stat-label">Bağlantı</span>
            </div>
          </div>
        </div>
        <div className="about-image">
          <div className="image-placeholder">
            <div className="image-icon">👨‍💻</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
