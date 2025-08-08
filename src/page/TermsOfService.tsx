import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const TermsOfService: React.FC = () => {
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
      <h1>{t('pages', 'termsOfService.title')}</h1>
      <p>{t('pages', 'termsOfService.lastUpdated')} {new Date().toLocaleDateString(getDateFormat())}</p>
      
      <h2>1. {t('pages', 'termsOfService.acceptanceTitle')}</h2>
      <p>{t('pages', 'termsOfService.acceptanceContent')}</p>

      <h2>2. {t('pages', 'termsOfService.serviceDescriptionTitle')}</h2>
      <p>{t('pages', 'termsOfService.serviceDescriptionContent')}</p>
      <ul>
        <li>{t('pages', 'termsOfService.serviceFeature1')}</li>
        <li>{t('pages', 'termsOfService.serviceFeature2')}</li>
        <li>{t('pages', 'termsOfService.serviceFeature3')}</li>
        <li>{t('pages', 'termsOfService.serviceFeature4')}</li>
      </ul>

      <h2>3. {t('pages', 'termsOfService.userAccountsTitle')}</h2>
      <p>{t('pages', 'termsOfService.userAccountsContent')}</p>
      <ul>
        <li>{t('pages', 'termsOfService.userAccountsItem1')}</li>
        <li>{t('pages', 'termsOfService.userAccountsItem2')}</li>
        <li>{t('pages', 'termsOfService.userAccountsItem3')}</li>
        <li>{t('pages', 'termsOfService.userAccountsItem4')}</li>
      </ul>

      <h2>4. {t('pages', 'termsOfService.userConductTitle')}</h2>
      <p>{t('pages', 'termsOfService.userConductContent')}</p>
      <ul>
        <li>{t('pages', 'termsOfService.userConductItem1')}</li>
        <li>{t('pages', 'termsOfService.userConductItem2')}</li>
        <li>{t('pages', 'termsOfService.userConductItem3')}</li>
        <li>{t('pages', 'termsOfService.userConductItem4')}</li>
        <li>{t('pages', 'termsOfService.userConductItem5')}</li>
      </ul>

      <h2>5. {t('pages', 'termsOfService.privacyTitle')}</h2>
      <p>{t('pages', 'termsOfService.privacyContent')}</p>

      <h2>6. {t('pages', 'termsOfService.thirdPartyTitle')}</h2>
      <p>{t('pages', 'termsOfService.thirdPartyContent')}</p>
      <ul>
        <li>{t('pages', 'termsOfService.thirdPartyItem1')}</li>
        <li>{t('pages', 'termsOfService.thirdPartyItem2')}</li>
        <li>{t('pages', 'termsOfService.thirdPartyItem3')}</li>
      </ul>
      <p>{t('pages', 'termsOfService.thirdPartyNote')}</p>

      <h2>7. {t('pages', 'termsOfService.disclaimersTitle')}</h2>
      <p>{t('pages', 'termsOfService.disclaimersContent')}</p>

      <h2>8. {t('pages', 'termsOfService.limitationTitle')}</h2>
      <p>{t('pages', 'termsOfService.limitationContent')}</p>

      <h2>9. {t('pages', 'termsOfService.modificationsTitle')}</h2>
      <p>{t('pages', 'termsOfService.modificationsContent')}</p>

      <h2>10. {t('pages', 'termsOfService.terminationTitle')}</h2>
      <p>{t('pages', 'termsOfService.terminationContent')}</p>

      <h2>11. {t('pages', 'termsOfService.contactTitle')}</h2>
      <p>
        {t('pages', 'termsOfService.contactContent')}<br/>
        {t('pages', 'termsOfService.contactEmail')}
      </p>

      <h2>12. {t('pages', 'termsOfService.governingLawTitle')}</h2>
      <p>{t('pages', 'termsOfService.governingLawContent')}</p>
    </div>
  );
};

export default TermsOfService;
