import React, { useState } from 'react'
import emailjs from '@emailjs/browser'
import { FaMapMarkerAlt, FaLinkedin, FaFileDownload } from 'react-icons/fa'
import './Contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // EmailJS ile e-posta gönderme
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_email: 'alimert930@gmail.com'
    }

    // EmailJS service ID, template ID ve public key'i buraya ekleyin
    emailjs.send(
      'YOUR_SERVICE_ID',        // EmailJS'den alacağınız Service ID
      'YOUR_TEMPLATE_ID',       // EmailJS'den alacağınız Template ID
      templateParams,
      'YOUR_PUBLIC_KEY'         // EmailJS'den alacağınız Public Key
    )
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text)
      alert('✅ Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağım.')
      setFormData({ name: '', email: '', message: '' })
      setIsLoading(false)
    })
    .catch((error) => {
      console.error('FAILED...', error)
      alert('❌ Mesaj gönderilemedi. Lütfen doğrudan alimert930@gmail.com adresine e-posta gönderin.')
      setIsLoading(false)
    })
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
              <span className="contact-icon"><FaMapMarkerAlt /></span>
              <div>
                <h4>Konum</h4>
                <p>Ankara, Türkiye</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon"><FaLinkedin /></span>
              <div>
                <h4>LinkedIn</h4>
                <a href="https://www.linkedin.com/in/ali-mert-bostan/" target="_blank" rel="noopener noreferrer">LinkedIn Profilim</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon"><FaFileDownload /></span>
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
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
