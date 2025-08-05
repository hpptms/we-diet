import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, detectUserLanguage, saveLanguagePreference } from '../utils/languageDetection';

interface LanguageContextType {
    currentLanguage: SupportedLanguage;
    setLanguage: (language: SupportedLanguage) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

// Translation function type
type TranslationFunction = (key: string, params?: Record<string, string | number>) => string;

// Basic translations - can be extended to load from external files
const translations: Record<SupportedLanguage, Record<string, string>> = {
    ja: {
        // App名とメタ情報
        'app.title': 'We diet - ダイエット・健康管理SNSアプリ',
        'app.description': 'ダイエットと健康管理を楽しくサポートするSNSアプリです。食事記録、運動記録、体重管理機能に加え、仲間と一緒に励まし合えるソーシャル機能で、継続的な健康習慣をサポートします。',
        'app.tagline': '仲間と一緒に楽しくダイエット！',

        // ナビゲーション
        'nav.home': 'ホーム',
        'nav.login': 'ログイン',
        'nav.dashboard': 'ダッシュボード',
        'nav.food_log': '食事記録',
        'nav.exercise': '運動記録',
        'nav.weight_management': '体重管理',
        'nav.social': 'ダイエット仲間',
        'nav.profile': 'プロフィール設定',

        // 機能説明
        'feature.food_tracking': '食事記録・カロリー管理',
        'feature.exercise_tracking': '運動記録・エクササイズ追跡',
        'feature.weight_management': '体重管理・進捗追跡',
        'feature.social': 'ソーシャル機能・仲間との励まし合い',
        'feature.analytics': '健康データ分析・レポート機能',

        // CTA・ボタン
        'cta.get_started': '始める',
        'cta.learn_more': 'もっと詳しく',
        'cta.sign_up': '新規登録',
        'cta.log_in': 'ログイン',
        'cta.try_free': '無料で始める',

        // FAQ
        'faq.free.question': 'We dietは無料で使えますか？',
        'faq.free.answer': 'はい、We dietは完全無料でご利用いただけます。食事記録、運動記録、体重管理、SNS機能など全ての機能を無料でお使いいただけます。',
        'faq.features.question': 'どのような機能がありますか？',
        'faq.features.answer': 'We dietには食事記録・カロリー管理、運動記録・エクササイズ追跡、体重管理・進捗追跡、仲間との励まし合いができるソーシャル機能、健康データ分析・レポート機能があります。',
        'faq.mobile.question': 'スマートフォンで使えますか？',
        'faq.mobile.answer': 'はい、We dietはレスポンシブデザインで、スマートフォン、タブレット、PCなど様々なデバイスでご利用いただけます。',

        // その他
        'common.loading': '読み込み中...',
        'common.error': 'エラーが発生しました',
        'common.retry': '再試行',
        'common.save': '保存',
        'common.cancel': 'キャンセル',
        'language.switch': '言語を切り替える',
    },
    zh: {
        // App名とメタ情報
        'app.title': 'We diet - 饮食健康管理社交应用',
        'app.description': 'We diet是一款让饮食和健康管理变得有趣且互相支持的社交应用。记录饮食、运动和体重，与朋友一起连接，持续激励，培养健康习惯。',
        'app.tagline': '一起减肥，共同成功！',

        // 导航
        'nav.home': '首页',
        'nav.login': '登录',
        'nav.dashboard': '仪表板',
        'nav.food_log': '饮食记录',
        'nav.exercise': '运动记录',
        'nav.weight_management': '体重管理',
        'nav.social': '减肥社区',
        'nav.profile': '个人设置',

        // 功能说明
        'feature.food_tracking': '饮食记录与卡路里管理',
        'feature.exercise_tracking': '运动记录与锻炼监控',
        'feature.weight_management': '体重管理与进度跟踪',
        'feature.social': '社交功能与社区支持',
        'feature.analytics': '健康数据分析与报告',

        // CTA与按钮
        'cta.get_started': '开始使用',
        'cta.learn_more': '了解更多',
        'cta.sign_up': '注册',
        'cta.log_in': '登录',
        'cta.try_free': '免费试用',

        // FAQ
        'faq.free.question': 'We diet是免费使用的吗？',
        'faq.free.answer': '是的，We diet完全免费使用。包括饮食记录、运动记录、体重管理和社交功能在内的所有功能都免费提供。',
        'faq.features.question': '有哪些功能？',
        'faq.features.answer': 'We diet包括饮食记录与卡路里管理、运动记录与锻炼监控、体重管理与进度跟踪、社区支持的社交功能以及健康数据分析与报告。',
        'faq.mobile.question': '可以在移动设备上使用吗？',
        'faq.mobile.answer': '是的，We diet采用响应式设计，可在智能手机、平板电脑、PC等各种设备上无缝使用。',

        // 其他
        'common.loading': '加载中...',
        'common.error': '发生错误',
        'common.retry': '重试',
        'common.save': '保存',
        'common.cancel': '取消',
        'language.switch': '切换语言',
    },
    ko: {
        // 앱명과 메타 정보
        'app.title': 'We diet - 다이어트 건강관리 SNS 앱',
        'app.description': 'We diet은 다이어트와 건강 관리를 재미있고 서로 지원하는 SNS 앱입니다. 식사, 운동, 체중을 기록하고 친구들과 연결하여 지속적인 동기부여와 건강한 습관을 길러보세요.',
        'app.tagline': '함께 다이어트하고, 함께 성공하세요!',

        // 내비게이션
        'nav.home': '홈',
        'nav.login': '로그인',
        'nav.dashboard': '대시보드',
        'nav.food_log': '식사 기록',
        'nav.exercise': '운동 기록',
        'nav.weight_management': '체중 관리',
        'nav.social': '다이어트 커뮤니티',
        'nav.profile': '프로필 설정',

        // 기능 설명
        'feature.food_tracking': '식사 기록 및 칼로리 관리',
        'feature.exercise_tracking': '운동 기록 및 운동 모니터링',
        'feature.weight_management': '체중 관리 및 진행 상황 추적',
        'feature.social': '소셜 기능 및 커뮤니티 지원',
        'feature.analytics': '건강 데이터 분석 및 리포트',

        // CTA 및 버튼
        'cta.get_started': '시작하기',
        'cta.learn_more': '더 알아보기',
        'cta.sign_up': '회원가입',
        'cta.log_in': '로그인',
        'cta.try_free': '무료 체험',

        // FAQ
        'faq.free.question': 'We diet은 무료로 사용할 수 있나요?',
        'faq.free.answer': '네, We diet은 완전 무료로 사용할 수 있습니다. 식사 기록, 운동 기록, 체중 관리, 소셜 기능 등 모든 기능을 무료로 이용하실 수 있습니다.',
        'faq.features.question': '어떤 기능들이 있나요?',
        'faq.features.answer': 'We diet에는 식사 기록 및 칼로리 관리, 운동 기록 및 운동 모니터링, 체중 관리 및 진행 상황 추적, 커뮤니티 지원을 위한 소셜 기능, 건강 데이터 분석 및 리포팅 기능이 있습니다.',
        'faq.mobile.question': '모바일 기기에서 사용할 수 있나요?',
        'faq.mobile.answer': '네, We diet은 반응형 디자인으로 스마트폰, 태블릿, PC 등 다양한 기기에서 원활하게 사용하실 수 있습니다.',

        // 기타
        'common.loading': '로딩 중...',
        'common.error': '오류가 발생했습니다',
        'common.retry': '다시 시도',
        'common.save': '저장',
        'common.cancel': '취소',
        'language.switch': '언어 변경',
    },
    de: {
        // App-Name und Meta-Informationen
        'app.title': 'We diet - Diät & Gesundheits-Management SNS App',
        'app.description': 'We diet ist eine SNS-App, die Diäten und Gesundheitsmanagement unterhaltsam und unterstützend gestaltet. Verfolgen Sie Ihre Mahlzeiten, Übungen und Ihr Gewicht, während Sie sich mit Freunden vernetzen für kontinuierliche Motivation und gesunde Gewohnheiten.',
        'app.tagline': 'Gemeinsam abnehmen, gemeinsam erreichen!',

        // Navigation
        'nav.home': 'Startseite',
        'nav.login': 'Anmelden',
        'nav.dashboard': 'Dashboard',
        'nav.food_log': 'Ernährungstagebuch',
        'nav.exercise': 'Training',
        'nav.weight_management': 'Gewichtsmanagement',
        'nav.social': 'Diät-Community',
        'nav.profile': 'Profileinstellungen',

        // Funktionsbeschreibungen
        'feature.food_tracking': 'Ernährungsverfolgung & Kalorienverwaltung',
        'feature.exercise_tracking': 'Trainingsverfolgung & Workout-Monitoring',
        'feature.weight_management': 'Gewichtsmanagement & Fortschrittsverfolgung',
        'feature.social': 'Soziale Funktionen & Community-Unterstützung',
        'feature.analytics': 'Gesundheitsdatenanalyse & Berichte',

        // CTA & Buttons
        'cta.get_started': 'Loslegen',
        'cta.learn_more': 'Mehr erfahren',
        'cta.sign_up': 'Registrieren',
        'cta.log_in': 'Anmelden',
        'cta.try_free': 'Kostenlos testen',

        // FAQ
        'faq.free.question': 'Ist We diet kostenlos nutzbar?',
        'faq.free.answer': 'Ja, We diet ist vollständig kostenlos nutzbar. Alle Funktionen einschließlich Ernährungsverfolgung, Trainingsprotokollierung, Gewichtsmanagement und soziale Funktionen sind kostenlos verfügbar.',
        'faq.features.question': 'Welche Funktionen sind verfügbar?',
        'faq.features.answer': 'We diet umfasst Ernährungsverfolgung & Kalorienverwaltung, Trainingsverfolgung & Workout-Monitoring, Gewichtsmanagement & Fortschrittsverfolgung, soziale Funktionen für Community-Unterstützung sowie Gesundheitsdatenanalyse & Berichterstattung.',
        'faq.mobile.question': 'Kann ich es auf mobilen Geräten verwenden?',
        'faq.mobile.answer': 'Ja, We diet verfügt über responsives Design und funktioniert nahtlos auf Smartphones, Tablets, PCs und verschiedenen anderen Geräten.',

        // Sonstiges
        'common.loading': 'Wird geladen...',
        'common.error': 'Ein Fehler ist aufgetreten',
        'common.retry': 'Wiederholen',
        'common.save': 'Speichern',
        'common.cancel': 'Abbrechen',
        'language.switch': 'Sprache wechseln',
    },
    es: {
        // Nombre de la app e información meta
        'app.title': 'We diet - App SNS de Gestión de Dieta y Salud',
        'app.description': 'We diet es una app SNS que hace que la dieta y la gestión de la salud sean divertidas y de apoyo mutuo. Registra tus comidas, ejercicios y peso mientras te conectas con amigos para motivación continua y hábitos saludables.',
        'app.tagline': '¡Haz dieta juntos, alcanza el éxito juntos!',

        // Navegación
        'nav.home': 'Inicio',
        'nav.login': 'Iniciar sesión',
        'nav.dashboard': 'Panel',
        'nav.food_log': 'Registro de comidas',
        'nav.exercise': 'Ejercicio',
        'nav.weight_management': 'Gestión de peso',
        'nav.social': 'Comunidad de dieta',
        'nav.profile': 'Configuración de perfil',

        // Descripciones de características
        'feature.food_tracking': 'Seguimiento de alimentos y gestión de calorías',
        'feature.exercise_tracking': 'Seguimiento de ejercicios y monitoreo de entrenamientos',
        'feature.weight_management': 'Gestión de peso y seguimiento de progreso',
        'feature.social': 'Características sociales y apoyo comunitario',
        'feature.analytics': 'Análisis de datos de salud e informes',

        // CTA y botones
        'cta.get_started': 'Comenzar',
        'cta.learn_more': 'Saber más',
        'cta.sign_up': 'Registrarse',
        'cta.log_in': 'Iniciar sesión',
        'cta.try_free': 'Probar gratis',

        // FAQ
        'faq.free.question': '¿We diet es gratuito?',
        'faq.free.answer': 'Sí, We diet es completamente gratuito. Todas las características incluyendo seguimiento de alimentos, registro de ejercicios, gestión de peso y características sociales están disponibles sin costo.',
        'faq.features.question': '¿Qué características están disponibles?',
        'faq.features.answer': 'We diet incluye seguimiento de alimentos y gestión de calorías, seguimiento de ejercicios y monitoreo de entrenamientos, gestión de peso y seguimiento de progreso, características sociales para apoyo comunitario, y análisis de datos de salud e informes.',
        'faq.mobile.question': '¿Puedo usarlo en dispositivos móviles?',
        'faq.mobile.answer': 'Sí, We diet cuenta con diseño responsivo y funciona perfectamente en smartphones, tabletas, PCs y varios otros dispositivos.',

        // Otros
        'common.loading': 'Cargando...',
        'common.error': 'Ocurrió un error',
        'common.retry': 'Reintentar',
        'common.save': 'Guardar',
        'common.cancel': 'Cancelar',
        'language.switch': 'Cambiar idioma',
    },
    en: {
        // App name and meta information
        'app.title': 'We diet - Diet & Health Management SNS App',
        'app.description': 'We diet is an SNS app that makes dieting and health management fun and supportive. Track your meals, exercises, and weight while connecting with friends for continuous motivation and healthy habits.',
        'app.tagline': 'Diet together, achieve together!',

        // Navigation
        'nav.home': 'Home',
        'nav.login': 'Login',
        'nav.dashboard': 'Dashboard',
        'nav.food_log': 'Food Log',
        'nav.exercise': 'Exercise',
        'nav.weight_management': 'Weight Management',
        'nav.social': 'Diet Community',
        'nav.profile': 'Profile Settings',

        // Feature descriptions
        'feature.food_tracking': 'Food Tracking & Calorie Management',
        'feature.exercise_tracking': 'Exercise Tracking & Workout Monitoring',
        'feature.weight_management': 'Weight Management & Progress Tracking',
        'feature.social': 'Social Features & Community Support',
        'feature.analytics': 'Health Data Analytics & Reports',

        // CTA & Buttons
        'cta.get_started': 'Get Started',
        'cta.learn_more': 'Learn More',
        'cta.sign_up': 'Sign Up',
        'cta.log_in': 'Log In',
        'cta.try_free': 'Try Free',

        // FAQ
        'faq.free.question': 'Is We diet free to use?',
        'faq.free.answer': 'Yes, We diet is completely free to use. All features including food tracking, exercise logging, weight management, and social features are available at no cost.',
        'faq.features.question': 'What features are available?',
        'faq.features.answer': 'We diet includes food tracking & calorie management, exercise tracking & workout monitoring, weight management & progress tracking, social features for community support, and health data analytics & reporting.',
        'faq.mobile.question': 'Can I use it on mobile devices?',
        'faq.mobile.answer': 'Yes, We diet features responsive design and works seamlessly on smartphones, tablets, PCs, and various other devices.',

        // Others
        'common.loading': 'Loading...',
        'common.error': 'An error occurred',
        'common.retry': 'Retry',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'language.switch': 'Switch Language',
    }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
        // Only run detection on client side
        if (typeof window !== 'undefined') {
            return detectUserLanguage();
        }
        return 'ja';
    });

    // Translation function
    const t: TranslationFunction = (key: string, params?: Record<string, string | number>) => {
        let translation = translations[currentLanguage]?.[key] || translations['en']?.[key] || key;
        
        // Simple parameter substitution
        if (params) {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
                translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
            });
        }
        
        return translation;
    };

    // Set language and save preference
    const setLanguage = (language: SupportedLanguage) => {
        setCurrentLanguage(language);
        saveLanguagePreference(language);
        
        // Update document lang attribute for SEO
        if (typeof document !== 'undefined') {
            const langMap: Record<SupportedLanguage, string> = {
                'ja': 'ja-JP',
                'en': 'en-US',
                'zh': 'zh-CN',
                'ko': 'ko-KR',
                'de': 'de-DE',
                'es': 'es-ES'
            };
            document.documentElement.lang = langMap[language] || 'ja-JP';
        }
    };

    // Update document language on mount and language change
    useEffect(() => {
        if (typeof document !== 'undefined') {
            const langMap: Record<SupportedLanguage, string> = {
                'ja': 'ja-JP',
                'en': 'en-US',
                'zh': 'zh-CN',
                'ko': 'ko-KR',
                'de': 'de-DE',
                'es': 'es-ES'
            };
            document.documentElement.lang = langMap[currentLanguage] || 'ja-JP';
        }
    }, [currentLanguage]);

    const value: LanguageContextType = {
        currentLanguage,
        setLanguage,
        t,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

// Utility hook for translations only
export const useTranslation = () => {
    const { t } = useLanguage();
    return { t };
};
