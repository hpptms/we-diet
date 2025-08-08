import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const PrivacyPolicy: React.FC = () => {
  const { t, language } = useTranslation();
  
  const getDateFormat = () => {
    switch (language) {
      case 'ja': return 'ja-JP';
      case 'en': return 'en-US';
      case 'zh-CN': return 'zh-CN';
      case 'ko': return 'ko-KR';
      case 'es': return 'es-ES';
      default: return 'en-US';
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
      <h1>{t('pages', 'privacyPolicy.title')}</h1>
      <p>{t('pages', 'privacyPolicy.lastUpdated')} {new Date().toLocaleDateString(getDateFormat())}</p>
      
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
      <p>
        {t('pages', 'privacyPolicy.contactContent')}<br/>
        {t('pages', 'privacyPolicy.contactEmail')}
      </p>

      <h2>8. {t('pages', 'privacyPolicy.changesTitle')}</h2>
      <p>{t('pages', 'privacyPolicy.changesContent')}</p>
    </div>
  );
};

export default PrivacyPolicy;
