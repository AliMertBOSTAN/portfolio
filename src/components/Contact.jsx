import React, { useState } from 'react'
import emailjs from '@emailjs/browser'
import { FaMapMarkerAlt, FaLinkedin, FaFileAlt } from 'react-icons/fa'
import { useLanguage } from '../contexts/LanguageContext'
import './Contact.css'

function Contact() {
  const { t } = useLanguage()
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
      <h2 className="section-title">{t('contactTitle')}</h2>
      <div className="contact-content">
        <div className="contact-info">
          <h3 className="contact-subtitle">{t('contactSubtitle')}</h3>
          <p className="contact-description">
            {t('contactDescription')}
          </p>
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon"><FaMapMarkerAlt /></span>
              <div>
                <h4>{t('location')}</h4>
                <p>{t('locationText')}</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon"><FaLinkedin /></span>
              <div>
                <h4>{t('linkedin')}</h4>
                <a href="https://www.linkedin.com/in/ali-mert-bostan/" target="_blank" rel="noopener noreferrer">{t('linkedinText')}</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon"><FaFileAlt /></span>
              <div>
                <h4>{t('cv')}</h4>
                <a href="/CV-Ali-Mert-BOSTAN.pdf" target="_blank" rel="noopener noreferrer">{t('cvText')}</a>
              </div>
            </div>
          </div>
        </div>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{t('nameLabel')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={t('namePlaceholder')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">{t('emailLabel')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={t('emailPlaceholder')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">{t('messageLabel')}</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              placeholder={t('messagePlaceholder')}
            ></textarea>
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? t('sending') : t('sendButton')}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
