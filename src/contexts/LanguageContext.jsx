import React, { createContext, useState, useContext, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Çeviriler
const translations = {
  tr: {
    // Hero
    greeting: "Merhaba, ben",
    title: "Full Stack Developer",
    description: "Web teknolojileri ve blockchain ile yenilikçi çözümler geliştiriyorum. Modern web uygulamaları ve akıllı kontratlar konusunda uzmanım.",
    viewProjects: "Projelerimi Görüntüle",
    contactMe: "İletişime Geç",
    downloadCV: "CV İndir",
    
    // About
    aboutTitle: "Hakkımda",
    aboutSubtitle: "Tutkulu Bir Geliştirici",
    aboutParagraph1: "Merhaba! Ben Ali Mert BOSTAN, tutkulu bir yazılım geliştiriciyim. Modern web teknolojileriyle kullanıcı deneyimini ön planda tutan projeler geliştiriyorum.",
    aboutParagraph2: "Yazılım alanında özellikle blokzincir teknolojileri, akıllı sözleşmeler (Solidity), DeFi protokolleri ve ön yüz geliştirme (React, TypeScript) üzerine çalışıyorum. Hem akademik hem girişimsel projelerde yer alarak Web3, yapay zekâ, gömülü sistemler ve oyun teknolojilerini bir araya getiren yenilikçi çözümler geliştiriyorum. Kod yazarken sadece teknik doğruluğa değil, aynı zamanda tasarım, kullanıcı deneyimi ve güvenlik prensiplerine de önem veriyorum. Hedefim, mühendislik bilgisini gerçek dünyadaki sorunlara akıllı, ölçeklenebilir ve sürdürülebilir teknolojilerle dönüştürmek.",
    yearsExperience: "Yıl Deneyim",
    completedProjects: "Tamamlanan Proje",
    connections: "Bağlantı",
    aboutText1: "Merhaba! Ben Ali Mert Bostan, full-stack web geliştirme ve blockchain teknolojileri konusunda uzmanlaşmış bir yazılım geliştiriciyim.",
    aboutText2: "Modern web teknolojileri ile kullanıcı dostu, ölçeklenebilir ve güvenli uygulamalar geliştirmeyi seviyorum. Her projede en iyi uygulamaları takip ederek kaliteli kod yazmaya özen gösteriyorum.",
    
    // Skills
    skillsTitle: "Yetenekler",
    frontend: "Frontend",
    backend: "Backend",
    blockchain: "Blockchain",
    tools: "Araçlar",
    
    // Projects
    projectsTitle: "Projeler",
    viewDemo: "Demo",
    viewCode: "Kod",
    
    // Contact
    contactTitle: "İletişim",
    contactSubtitle: "Benimle İletişime Geçin",
    contactDescription: "Bir proje fikriniz mi var veya birlikte çalışmak mı istiyorsunuz? Mesajınızı bırakın, size en kısa sürede dönüş yapayım.",
    location: "Konum",
    locationText: "Ankara, Türkiye",
    linkedin: "LinkedIn",
    linkedinText: "LinkedIn Profilim",
    cv: "CV",
    cvText: "CV İndir (PDF)",
    nameLabel: "Adınız",
    namePlaceholder: "Adınızı girin",
    emailLabel: "Email",
    emailPlaceholder: "email@example.com",
    messageLabel: "Mesajınız",
    messagePlaceholder: "Mesajınızı buraya yazın...",
    sendButton: "Gönder",
    sending: "Gönderiliyor...",
    
    // Footer
    footerTitle: "Ali Mert Bostan",
    footerDescription: "Full Stack Developer & Blockchain Uzmanı",
    quickLinks: "Hızlı Bağlantılar",
    home: "Ana Sayfa",
    about: "Hakkımda",
    skills: "Yetenekler",
    projects: "Projeler",
    contact: "İletişim",
    blog: "Blog",
    social: "Sosyal Medya",
    github: "GitHub",
    medium: "Medium Blog",
    footerCopyright: "Tüm hakları saklıdır.",
    
    // Blog
    blogTitle: "Makaleler",
    blogSubtitle: "Medium'da yazdığım en son makaleler",
    visitMedium: "Medium'u Ziyaret Et",
    readMore: "Devamını Oku",
    loading: "Yükleniyor...",
    
    // Bottom Nav
    homePage: "Ana Sayfa",
    articles: "Makaleler",
    settings: "Ayarlar",
    
    // Settings
    theme: "Tema",
    dark: "Koyu",
    light: "Açık",
    language: "Dil",
    turkish: "Türkçe",
    english: "English"
  },
  en: {
    // Hero
    greeting: "Hello, I'm",
    title: "Full Stack Developer",
    description: "I develop innovative solutions with web technologies and blockchain. I specialize in modern web applications and smart contracts.",
    viewProjects: "View My Projects",
    contactMe: "Contact Me",
    downloadCV: "Download CV",
    
    // About
    aboutTitle: "About Me",
    aboutSubtitle: "A Passionate Developer",
    aboutParagraph1: "Hello! I'm Ali Mert BOSTAN, a passionate software developer. I develop projects that prioritize user experience with modern web technologies.",
    aboutParagraph2: "I specialize in blockchain technologies, smart contracts (Solidity), DeFi protocols, and frontend development (React, TypeScript). I participate in both academic and entrepreneurial projects, developing innovative solutions that combine Web3, artificial intelligence, embedded systems, and gaming technologies. When coding, I pay attention not only to technical accuracy but also to design, user experience, and security principles. My goal is to transform engineering knowledge into smart, scalable, and sustainable technologies for real-world problems.",
    yearsExperience: "Years Experience",
    completedProjects: "Completed Projects",
    connections: "Connections",
    aboutText1: "Hello! I'm Ali Mert Bostan, a software developer specialized in full-stack web development and blockchain technologies.",
    aboutText2: "I love creating user-friendly, scalable, and secure applications with modern web technologies. I strive to write quality code by following best practices in every project.",
    
    // Skills
    skillsTitle: "Skills",
    frontend: "Frontend",
    backend: "Backend",
    blockchain: "Blockchain",
    tools: "Tools",
    
    // Projects
    projectsTitle: "Projects",
    viewDemo: "Demo",
    viewCode: "Code",
    
    // Contact
    contactTitle: "Contact",
    contactSubtitle: "Get In Touch With Me",
    contactDescription: "Have a project idea or want to work together? Leave your message, and I'll get back to you as soon as possible.",
    location: "Location",
    locationText: "Ankara, Turkey",
    linkedin: "LinkedIn",
    linkedinText: "My LinkedIn Profile",
    cv: "CV",
    cvText: "Download CV (PDF)",
    nameLabel: "Your Name",
    namePlaceholder: "Enter your name",
    emailLabel: "Email",
    emailPlaceholder: "email@example.com",
    messageLabel: "Your Message",
    messagePlaceholder: "Write your message here...",
    sendButton: "Send",
    sending: "Sending...",
    
    // Footer
    footerTitle: "Ali Mert Bostan",
    footerDescription: "Full Stack Developer & Blockchain Expert",
    quickLinks: "Quick Links",
    home: "Home",
    about: "About",
    skills: "Skills",
    projects: "Projects",
    contact: "Contact",
    blog: "Blog",
    social: "Social Media",
    github: "GitHub",
    medium: "Medium Blog",
    footerCopyright: "All rights reserved.",
    
    // Blog
    blogTitle: "Articles",
    blogSubtitle: "Latest articles I wrote on Medium",
    visitMedium: "Visit Medium",
    readMore: "Read More",
    loading: "Loading...",
    
    // Bottom Nav
    homePage: "Home",
    articles: "Articles",
    settings: "Settings",
    
    // Settings
    theme: "Theme",
    dark: "Dark",
    light: "Light",
    language: "Language",
    turkish: "Türkçe",
    english: "English"
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // localStorage'dan dil tercihini oku
    return localStorage.getItem('language') || 'tr'
  })

  useEffect(() => {
    // Dil değiştiğinde localStorage'a kaydet
    localStorage.setItem('language', language)
  }, [language])

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage)
  }

  const t = (key) => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
