import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './Blog.css'

function Blog() {
  const { t, language } = useLanguage()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMediumArticles()
  }, [])

  const fetchMediumArticles = async () => {
    try {
      // Medium RSS feed'i JSON'a çeviren servis
      const response = await fetch(
        'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@BOSTANmert'
      )
      const data = await response.json()
      
      if (data.status === 'ok') {
        setArticles(data.items)
      }
      setLoading(false)
    } catch (error) {
      console.error('Makaleler yüklenirken hata:', error)
      setLoading(false)
    }
  }

  const stripHtml = (html) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  const getExcerpt = (content, maxLength = 150) => {
    const text = stripHtml(content)
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...'
    }
    return text
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    const locale = language === 'tr' ? 'tr-TR' : 'en-US'
    return new Date(dateString).toLocaleDateString(locale, options)
  }

  if (loading) {
    return (
      <section className="blog">
        <div className="blog-container">
          <h1 className="blog-title">{t('blogTitle')}</h1>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>{t('loading')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="blog">
      <div className="blog-container">
        <div className="blog-header">
          <h1 className="blog-title">{t('blogTitle')}</h1>
          <p className="blog-subtitle">
            {t('blogSubtitle')}
          </p>
          <a 
            href="https://medium.com/@BOSTANmert" 
            target="_blank" 
            rel="noopener noreferrer"
            className="medium-link"
          >
            📝 {t('visitMedium')}
          </a>
        </div>

        <div className="articles-grid">
          {articles.length === 0 ? (
            <div className="no-articles">
              <p>Henüz makale bulunmuyor.</p>
            </div>
          ) : (
            articles.map((article, index) => (
              <article key={index} className="article-card">
                {article.thumbnail && (
                  <div className="article-image">
                    <img src={article.thumbnail} alt={article.title} />
                  </div>
                )}
                <div className="article-content">
                  <div className="article-meta">
                    <span className="article-date">{formatDate(article.pubDate)}</span>
                    {article.categories && article.categories.length > 0 && (
                      <span className="article-category">{article.categories[0]}</span>
                    )}
                  </div>
                  <h2 className="article-title">{article.title}</h2>
                  <p className="article-excerpt">
                    {getExcerpt(article.description)}
                  </p>
                  <a 
                    href={article.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="read-more-btn"
                  >
                    {t('readMore')} →
                  </a>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default Blog
