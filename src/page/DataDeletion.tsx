import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHelmet } from '../component/SEOHelmet';
import { useTranslation } from '../hooks/useTranslation';

const DataDeletion: React.FC = () => {
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
    const langPrefix = language === 'ja' ? '/' : `/${language === 'zh-CN' ? 'zh' : language}/`;
    navigate(langPrefix);
  };

  return (
    <>
      <SEOHelmet
        title={`${t('pages', 'dataDeletion.title')} | We Diet`}
        description={t('pages', 'dataDeletion.overviewContent')}
        canonicalUrl={`https://we-diet.net${language === 'ja' ? '' : `/${language === 'zh-CN' ? 'zh' : language}`}/data-deletion`}
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
        <h1>{t('pages', 'dataDeletion.title')}</h1>
        <p>{t('pages', 'dataDeletion.lastUpdated')} {new Date().toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'ko' ? 'ko-KR' : language === 'zh-CN' ? 'zh-CN' : language === 'es' ? 'es-ES' : language === 'pt' ? 'pt-BR' : 'en-US')}</p>

        <h2>{t('pages', 'dataDeletion.overviewTitle')}</h2>
        <p>{t('pages', 'dataDeletion.overviewContent')}</p>

        <h2>{t('pages', 'dataDeletion.deletedDataTitle')}</h2>
        <ul>
          <li>{t('pages', 'dataDeletion.deletedDataItem1')}</li>
          <li>{t('pages', 'dataDeletion.deletedDataItem2')}</li>
          <li>{t('pages', 'dataDeletion.deletedDataItem3')}</li>
          <li>{t('pages', 'dataDeletion.deletedDataItem4')}</li>
          <li>{t('pages', 'dataDeletion.deletedDataItem5')}</li>
          <li>{t('pages', 'dataDeletion.deletedDataItem6')}</li>
          <li>{t('pages', 'dataDeletion.deletedDataItem7')}</li>
          <li>{t('pages', 'dataDeletion.deletedDataItem8')}</li>
          <li>{t('pages', 'dataDeletion.deletedDataItem9')}</li>
        </ul>

        <h2>{t('pages', 'dataDeletion.methodsTitle')}</h2>

        <h3>{t('pages', 'dataDeletion.method1Title')}</h3>
        <ol>
          <li>{t('pages', 'dataDeletion.method1Step1')}</li>
          <li>{t('pages', 'dataDeletion.method1Step2')}</li>
          <li>{t('pages', 'dataDeletion.method1Step3')}</li>
          <li>{t('pages', 'dataDeletion.method1Step4')}</li>
          <li>{t('pages', 'dataDeletion.method1Step5')}</li>
        </ol>

        <h3>{t('pages', 'dataDeletion.method2Title')}</h3>
        <p>{t('pages', 'dataDeletion.method2Content')}</p>
        <div style={{
          background: '#f5f5f5',
          padding: '20px',
          borderRadius: '5px',
          margin: '20px 0'
        }}>
          <p><strong>{t('pages', 'dataDeletion.method2EmailLabel')}</strong></p>
          <p>{t('pages', 'dataDeletion.method2Email')}</p>
          <p><strong>{t('pages', 'dataDeletion.method2SubjectLabel')}</strong></p>
          <p><strong>{t('pages', 'dataDeletion.method2BodyLabel')}</strong></p>
          <ul>
            <li>{t('pages', 'dataDeletion.method2BodyItem1')}</li>
            <li>{t('pages', 'dataDeletion.method2BodyItem2')}</li>
            <li>{t('pages', 'dataDeletion.method2BodyItem3')}</li>
            <li>{t('pages', 'dataDeletion.method2BodyItem4')}</li>
          </ul>
        </div>

        <h2>{t('pages', 'dataDeletion.facebookTitle')}</h2>
        <p>{t('pages', 'dataDeletion.facebookContent')}</p>
        <ol>
          <li>{t('pages', 'dataDeletion.facebookStep1')}</li>
          <li>{t('pages', 'dataDeletion.facebookStep2')}</li>
        </ol>

        <h2>{t('pages', 'dataDeletion.processingTimeTitle')}</h2>
        <ul>
          <li><strong>{t('pages', 'dataDeletion.processingTimeApp')}</strong></li>
          <li><strong>{t('pages', 'dataDeletion.processingTimeEmail')}</strong></li>
          <li><strong>{t('pages', 'dataDeletion.processingTimeComplete')}</strong></li>
        </ul>

        <h2>{t('pages', 'dataDeletion.notesTitle')}</h2>
        <ul>
          <li>{t('pages', 'dataDeletion.notesItem1')}</li>
          <li>{t('pages', 'dataDeletion.notesItem2')}</li>
          <li>{t('pages', 'dataDeletion.notesItem3')}</li>
        </ul>

        <h2>{t('pages', 'dataDeletion.contactTitle')}</h2>
        <p>{t('pages', 'dataDeletion.contactContent')}</p>
        <p>{t('pages', 'dataDeletion.contactEmail')}</p>

        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          padding: '15px',
          borderRadius: '5px',
          marginTop: '30px'
        }}>
          <strong>{t('pages', 'dataDeletion.importantNote')}</strong>
        </div>
      </div>
    </>
  );
};

export default DataDeletion;
