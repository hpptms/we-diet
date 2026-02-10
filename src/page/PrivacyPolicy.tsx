import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHelmet } from '../component/SEOHelmet';
import { useTranslation } from '../hooks/useTranslation';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  const backButtonStyle = {
    display: 'inline-block',
    background: '#29b6f6',
    color: 'white',
    textDecoration: 'none',
    padding: '12px 24px',
    borderRadius: '25px',
    marginBottom: '2rem',
    fontWeight: 'bold',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 5px rgba(41, 182, 246, 0.3)',
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <>
      <SEOHelmet
        title={`${t('pages', 'privacyPolicy.title')} | We Diet`}
        description={t('pages', 'privacyPolicy.collectionContent')}
        canonicalUrl="https://we-diet.net/privacy-policy"
        ogType="article"
      />
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
        <button
          style={backButtonStyle}
          onClick={handleBackClick}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#1e88e5';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(41, 182, 246, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#29b6f6';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 5px rgba(41, 182, 246, 0.3)';
          }}
        >
          {t('pages', 'backToTop')}
        </button>
        <h1>{t('pages', 'privacyPolicy.title')}</h1>
        <p>{t('pages', 'privacyPolicy.lastUpdated')} {new Date().toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'ko' ? 'ko-KR' : language === 'zh-CN' ? 'zh-CN' : language === 'es' ? 'es-ES' : language === 'pt' ? 'pt-BR' : 'en-US')}</p>

        <h2>1. {t('pages', 'privacyPolicy.collectionTitle')}</h2>
        <p>{t('pages', 'privacyPolicy.collectionContent')}</p>
        <ul>
          <li>{t('pages', 'privacyPolicy.collectionItem1')}</li>
          <li>{t('pages', 'privacyPolicy.collectionItem2')}</li>
          <li>{t('pages', 'privacyPolicy.collectionItem3')}</li>
          <li>{t('pages', 'privacyPolicy.collectionItem4')}</li>
        </ul>

        <h2>2. {t('pages', 'privacyPolicy.usageTitle')}</h2>
        <p>{t('pages', 'privacyPolicy.usageContent')}</p>
        <ul>
          <li>{t('pages', 'privacyPolicy.usageItem1')}</li>
          <li>{t('pages', 'privacyPolicy.usageItem2')}</li>
          <li>{t('pages', 'privacyPolicy.usageItem3')}</li>
        </ul>

        <h2>3. {t('pages', 'privacyPolicy.thirdPartyTitle')}</h2>
        <p>{t('pages', 'privacyPolicy.thirdPartyContent')}</p>

        <h2>4. {t('pages', 'privacyPolicy.managementTitle')}</h2>
        <p>{t('pages', 'privacyPolicy.managementContent')}</p>

        <h2>5. {t('pages', 'privacyPolicy.cookiesTitle')}</h2>
        <p>{t('pages', 'privacyPolicy.cookiesContent')}</p>

        <h2>6. {t('pages', 'privacyPolicy.externalServicesTitle')}</h2>
        <p>{t('pages', 'privacyPolicy.externalServicesContent')}</p>
        <ul>
          <li>{t('pages', 'privacyPolicy.externalServicesItem1')}</li>
          <li>{t('pages', 'privacyPolicy.externalServicesItem2')}</li>
          <li>{t('pages', 'privacyPolicy.externalServicesItem3')}</li>
        </ul>
        <p>{t('pages', 'privacyPolicy.externalServicesNote')}</p>

        <h2>7. {t('pages', 'privacyPolicy.contactTitle')}</h2>
        <p>{t('pages', 'privacyPolicy.contactContent')}<br/>{t('pages', 'privacyPolicy.contactEmail')}</p>

        <h2>8. {t('pages', 'privacyPolicy.changesTitle')}</h2>
        <p>{t('pages', 'privacyPolicy.changesContent')}</p>
      </div>
    </>
  );
};

export default PrivacyPolicy;
