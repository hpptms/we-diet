import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 画像情報（統一サイズ情報）
const bgImages = [
  {
    url: "https://res.cloudinary.com/drmyhhtjo/image/upload/v1753593907/afa4835f-e2b4-49f9-b342-1c272be930d3_cngflc.webp",
    aspectRatio: 1.5, // 1536×1024
  },
  {
    url: "https://res.cloudinary.com/drmyhhtjo/image/upload/v1750225603/Sleeping_emcryh.webp", 
    aspectRatio: 1.5, // 1536×1024（統一済み）
  },
  {
    url: "https://res.cloudinary.com/drmyhhtjo/image/upload/v1750225603/Mountaineering_s7wwxh.webp",
    aspectRatio: 1.5, // 1536×1024
  },
  {
    url: "https://res.cloudinary.com/drmyhhtjo/image/upload/v1750225603/Eating_h5psox.webp",
    aspectRatio: 1.5, // 1536×1024
  }
];

export const ImageSlider: React.FC = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // react-slick用設定
  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500, // 0.5秒
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000, // 6秒周期
    pauseOnHover: false,
    cssEase: "cubic-bezier(0.4,0,0.2,1)",
    draggable: false,
    swipe: false,
  };

  // 全ての画像が統一されたので、シンプルな表示処理
  const getImageStyles = () => {
    // coverに変更して白いスペースを排除し、コンテナを完全に覆う
    return {
      objectFit: 'cover' as const,
      objectPosition: 'center'
    };
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
      }}
    >
      <Slider {...sliderSettings}>
        {bgImages.map((imageInfo, idx) => (
          <div key={imageInfo.url} style={{ height: '100%' }}>
            <img
              src={imageInfo.url}
              alt={`slide${idx}`}
              style={{
                width: '100%',
                height: '100%',
                ...getImageStyles(),
                background: '#000',
                userSelect: 'none',
                pointerEvents: 'none',
                display: 'block',
              }}
              draggable={false}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};
