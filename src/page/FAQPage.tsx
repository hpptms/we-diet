import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from '../hooks/useTranslation';

const FAQPage: React.FC = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: "ダイエットSNS We dietは無料で使えますか？",
      answer: "はい、ダイエットSNS We dietは完全無料でご利用いただけます。食事レコード、運動レコード、体重記録、SNS機能など全ての機能を無料でお使いいただけます。"
    },
    {
      question: "どのようなレコード機能がありますか?",
      answer: "We dietには食事レコード・カロリー記録、運動レコード・エクササイズ記録、体重記録・進捗記録、仲間との励まし合いができるダイエットSNS機能、健康記録データ分析・レポート機能があります。"
    },
    {
      question: "ダイエット記録をSNSで共有できますか？",
      answer: "はい、We dietはダイエットSNSとして食事レコード、運動レコード、体重記録を仲間と共有できます。ダイエット記録をSNSで励まし合い、継続的な健康管理をサポートします。"
    },
    {
      question: "アカウントの作成方法は？",
      answer: "メールアドレスでの登録、またはGoogle、Facebook、LINE、X（Twitter）、TikTokなどのソーシャルアカウントで簡単に登録できます。登録後すぐに全機能をご利用いただけます。"
    },
    {
      question: "スマートフォンでも利用できますか？",
      answer: "はい、We dietはレスポンシブデザインを採用しており、スマートフォン、タブレット、PCなど、あらゆるデバイスで快適にご利用いただけます。"
    },
    {
      question: "データのプライバシーは保護されますか？",
      answer: "はい、お客様のプライバシーとデータセキュリティを最優先に考えています。詳しくは<a href='/privacy-policy' style='color: #29b6f6; text-decoration: underline;'>プライバシーポリシー</a>をご確認ください。"
    },
    {
      question: "食事レコードの記録方法は？",
      answer: "ダッシュボードから「食事ログ」セクションにアクセスし、食事内容、カロリー、写真などを記録できます。記録した内容はタイムラインで共有することも可能です。"
    },
    {
      question: "運動レコードの記録方法は？",
      answer: "ダッシュボードから「運動記録」セクションにアクセスし、運動の種類、時間、消費カロリーなどを記録できます。様々な運動タイプに対応しています。"
    },
    {
      question: "体重記録はグラフで確認できますか？",
      answer: "はい、記録した体重データは自動的にグラフ化され、進捗を視覚的に確認できます。日別、週別、月別での表示が可能です。"
    },
    {
      question: "他のユーザーとどのように交流できますか？",
      answer: "投稿への「いいね」やコメント、フォロー機能を使って他のユーザーと交流できます。同じ目標を持つ仲間と励まし合いながらダイエットを継続できます。"
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.replace(/<[^>]*>/g, '')
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>よくある質問（FAQ） - ダイエットSNS We diet</title>
        <meta name="description" content="ダイエットSNS We dietに関するよくある質問（FAQ）。利用方法、機能、プライバシー、料金などについての疑問にお答えします。" />
        <meta name="keywords" content="FAQ,よくある質問,ダイエットSNS,使い方,機能,料金,プライバシー" />
        <link rel="canonical" href="https://we-diet.net/faq" />
        
        {/* Open Graph */}
        <meta property="og:title" content="よくある質問（FAQ） - ダイエットSNS We diet" />
        <meta property="og:description" content="ダイエットSNS We dietに関するよくある質問。利用方法、機能、プライバシーなどについての疑問にお答えします。" />
        <meta property="og:url" content="https://we-diet.net/faq" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="よくある質問（FAQ） - ダイエットSNS We diet" />
        <meta name="twitter:description" content="ダイエットSNS We dietに関するよくある質問。利用方法、機能、プライバシーなどについての疑問にお答えします。" />
        
        {/* 構造化データ */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 8
      }}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              align="center"
              sx={{ 
                fontWeight: 700,
                color: '#333',
                mb: 2,
                fontSize: { xs: '1.75rem', md: '2.5rem' }
              }}
            >
              よくある質問（FAQ）
            </Typography>
            
            <Typography 
              variant="body1" 
              align="center" 
              sx={{ 
                mb: 5, 
                color: '#666',
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}
            >
              ダイエットSNS We dietについてのよくある質問をまとめました
            </Typography>

            <Box sx={{ mt: 3 }}>
              {faqs.map((faq, index) => (
                <Accordion 
                  key={index}
                  sx={{
                    mb: 2,
                    '&:before': {
                      display: 'none',
                    },
                    borderRadius: '8px !important',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      '& .MuiAccordionSummary-content': {
                        my: 2,
                      },
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      component="h2"
                      sx={{ 
                        fontWeight: 600,
                        color: '#333',
                        fontSize: { xs: '0.95rem', md: '1.1rem' }
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, pb: 3 }}>
                    <Typography 
                      sx={{ 
                        color: '#666',
                        lineHeight: 1.8,
                        fontSize: { xs: '0.9rem', md: '1rem' }
                      }}
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            <Box sx={{ mt: 6, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
                その他のご質問
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                上記以外のご質問がある場合は、<a href="/privacy-policy" style={{ color: '#29b6f6', textDecoration: 'underline' }}>プライバシーポリシー</a>または
                <a href="/terms-of-service" style={{ color: '#29b6f6', textDecoration: 'underline' }}>利用規約</a>をご確認ください。
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default FAQPage;
