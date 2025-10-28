import React, { useState } from 'react'
import './Contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Form gönderme işlemini buraya ekleyebilirsiniz
    console.log('Form data:', formData)
    alert('Mesajınız gönderildi! (Bu bir demo mesajdır)')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="contact">
      <h2 className="section-title">İletişim</h2>
      <div className="contact-content">
        <div className="contact-info">
          <h3 className="contact-subtitle">Benimle İletişime Geçin</h3>
          <p className="contact-description">
            Bir proje fikriniz mi var veya birlikte çalışmak mı istiyorsunuz? 
            Mesajınızı bırakın, size en kısa sürede dönüş yapayım.
          </p>
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">�</span>
              <div>
                <h4>Konum</h4>
                <p>Ankara, Türkiye</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">�</span>
              <div>
                <h4>Blog</h4>
                <a href="https://medium.com/@BOSTANmert" target="_blank" rel="noopener noreferrer">Medium Blog</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">�</span>
              <div>
                <h4>CV</h4>
                <a href="/CV-Ali-Mert-BOSTAN.pdf" download>CV İndir (PDF)</a>
              </div>
            </div>
          </div>
        </div>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Adınız</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Adınızı girin"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="email@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Mesajınız</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Mesajınızı buraya yazın..."
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">
            Gönder
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
