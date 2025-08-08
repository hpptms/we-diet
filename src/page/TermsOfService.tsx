import React from 'react';
import { getCurrentLanguage, getTranslation } from '../i18n';

const TermsOfService: React.FC = () => {
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
      <h1>{t('termsOfService.title')}</h1>
      <p>{t('termsOfService.lastUpdated')} {new Date().toLocaleDateString(getDateFormat())}</p>
      
      <h2>1. {t('termsOfService.acceptanceTitle')}</h2>
      <p>{t('termsOfService.acceptanceContent')}</p>

      <h2>2. {t('termsOfService.serviceDescriptionTitle')}</h2>
      <p>{t('termsOfService.serviceDescriptionContent')}</p>
      <ul>
        <li>{t('termsOfService.serviceFeature1')}</li>
        <li>{t('termsOfService.serviceFeature2')}</li>
        <li>{t('termsOfService.serviceFeature3')}</li>
        <li>{t('termsOfService.serviceFeature4')}</li>
      </ul>

      <h2>3. {t('termsOfService.userAccountsTitle')}</h2>
      <p>{t('termsOfService.userAccountsContent')}</p>
      <ul>
        <li>{t('termsOfService.userAccountsItem1')}</li>
        <li>{t('termsOfService.userAccountsItem2')}</li>
        <li>{t('termsOfService.userAccountsItem3')}</li>
        <li>{t('termsOfService.userAccountsItem4')}</li>
      </ul>

      <h2>4. {t('termsOfService.userConductTitle')}</h2>
      <p>{t('termsOfService.userConductContent')}</p>
      <ul>
        <li>{t('termsOfService.userConductItem1')}</li>
        <li>{t('termsOfService.userConductItem2')}</li>
        <li>{t('termsOfService.userConductItem3')}</li>
        <li>{t('termsOfService.userConductItem4')}</li>
        <li>{t('termsOfService.userConductItem5')}</li>
      </ul>

      <h2>5. {t('termsOfService.privacyTitle')}</h2>
      <p>{t('termsOfService.privacyContent')}</p>

      <h2>6. {t('termsOfService.thirdPartyTitle')}</h2>
      <p>{t('termsOfService.thirdPartyContent')}</p>
      <ul>
        <li>{t('termsOfService.thirdPartyItem1')}</li>
        <li>{t('termsOfService.thirdPartyItem2')}</li>
        <li>{t('termsOfService.thirdPartyItem3')}</li>
      </ul>
      <p>{t('termsOfService.thirdPartyNote')}</p>

      <h2>7. {t('termsOfService.disclaimersTitle')}</h2>
      <p>{t('termsOfService.disclaimersContent')}</p>

      <h2>8. {t('termsOfService.limitationTitle')}</h2>
      <p>{t('termsOfService.limitationContent')}</p>

      <h2>9. {t('termsOfService.modificationsTitle')}</h2>
      <p>{t('termsOfService.modificationsContent')}</p>

      <h2>10. {t('termsOfService.terminationTitle')}</h2>
      <p>{t('termsOfService.terminationContent')}</p>

      <h2>11. {t('termsOfService.contactTitle')}</h2>
      <p>
        {t('termsOfService.contactContent')}<br/>
        {t('termsOfService.contactEmail')}
      </p>

      <h2>12. {t('termsOfService.governingLawTitle')}</h2>
      <p>{t('termsOfService.governingLawContent')}</p>
    </div>
  );
};

export default TermsOfService;
