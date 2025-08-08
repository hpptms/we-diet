import React from 'react';
import { getCurrentLanguage, getTranslation } from '../i18n';

const PrivacyPolicy: React.FC = () => {
  const currentLanguage = getCurrentLanguage();
  
  const t = (key: string) => getTranslation(currentLanguage, 'pages', key, key);
  
  const getDateFormat = () => {
    switch (currentLanguage) {
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
      <h1>{t('privacyPolicy.title')}</h1>
      <p>{t('privacyPolicy.lastUpdated')} {new Date().toLocaleDateString(getDateFormat())}</p>
      
      <h2>1. {t('privacyPolicy.collectionTitle')}</h2>
      <p>{t('privacyPolicy.collectionContent')}</p>
      <ul>
        <li>{t('privacyPolicy.collectionItem1')}</li>
        <li>{t('privacyPolicy.collectionItem2')}</li>
        <li>{t('privacyPolicy.collectionItem3')}</li>
        <li>{t('privacyPolicy.collectionItem4')}</li>
      </ul>

      <h2>2. {t('privacyPolicy.usageTitle')}</h2>
      <p>{t('privacyPolicy.usageContent')}</p>
      <ul>
        <li>{t('privacyPolicy.usageItem1')}</li>
        <li>{t('privacyPolicy.usageItem2')}</li>
        <li>{t('privacyPolicy.usageItem3')}</li>
      </ul>

      <h2>3. {t('privacyPolicy.thirdPartyTitle')}</h2>
      <p>{t('privacyPolicy.thirdPartyContent')}</p>

      <h2>4. {t('privacyPolicy.managementTitle')}</h2>
      <p>{t('privacyPolicy.managementContent')}</p>

      <h2>5. {t('privacyPolicy.cookiesTitle')}</h2>
      <p>{t('privacyPolicy.cookiesContent')}</p>

      <h2>6. {t('privacyPolicy.externalServicesTitle')}</h2>
      <p>{t('privacyPolicy.externalServicesContent')}</p>
      <ul>
        <li>{t('privacyPolicy.externalServicesItem1')}</li>
        <li>{t('privacyPolicy.externalServicesItem2')}</li>
        <li>{t('privacyPolicy.externalServicesItem3')}</li>
      </ul>
      <p>{t('privacyPolicy.externalServicesNote')}</p>

      <h2>7. {t('privacyPolicy.contactTitle')}</h2>
      <p>
        {t('privacyPolicy.contactContent')}<br/>
        {t('privacyPolicy.contactEmail')}
      </p>

      <h2>8. {t('privacyPolicy.changesTitle')}</h2>
      <p>{t('privacyPolicy.changesContent')}</p>
    </div>
  );
};

export default PrivacyPolicy;
