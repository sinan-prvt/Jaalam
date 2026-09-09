import React, { useState } from 'react';

interface GiftBoxAnimationProps {
  onOpen: () => void;
  title?: string;
  subtitle?: string;
  boxColor?: string;
  ribbonColor?: string;
}

export default function GiftBoxAnimation({
  onOpen,
  title = "A Special Gift",
  subtitle = "Tap to open",
  boxColor = "#F6E6D8", // Default soft cream
  ribbonColor = "#D6B5A7" // Default soft rose gold/brown
}: GiftBoxAnimationProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    // Wait for animation to finish before triggering parent onOpen
    setTimeout(() => {
      onOpen();
    }, 1500); // 1.5s matches the lid flying off animation roughly
  };

  return (
    <div 
      className={`relative flex flex-col items-center justify-center cursor-pointer transition-opacity duration-1000 ${isOpening ? 'opacity-0 delay-1000' : 'opacity-100'}`}
      onClick={handleClick}
    >
      <style>{`
        .gift-wrapper {
          perspective: 1000px;
          width: 200px;
          height: 200px;
          margin-bottom: 40px;
        }

        .gift-box {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transform: rotateX(-20deg) rotateY(25deg);
          transition: transform 0.5s ease;
        }

        .gift-wrapper:hover .gift-box {
          transform: rotateX(-20deg) rotateY(45deg);
        }

        .gift-box.opening .gift-lid {
          transform: translate3d(0, -100px, 100px) rotateX(60deg) rotateY(20deg) rotateZ(20deg);
          opacity: 0;
          transition: transform 1s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease 0.5s;
        }

        .gift-box.opening .gift-body-container {
          animation: box-shake 0.5s ease-in-out;
        }

        @keyframes box-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotateY(-5deg); }
          50% { transform: translateX(5px) rotateY(5deg); }
          75% { transform: translateX(-5px) rotateY(-5deg); }
        }

        .face {
          position: absolute;
          width: 100%;
          height: 100%;
          background: ${boxColor};
          border: 1px solid rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .face::before, .face::after {
          content: '';
          position: absolute;
          background: ${ribbonColor};
        }

        /* Box Body */
        .gift-body-container {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .body-front  { transform: translateZ(100px); }
        .body-back   { transform: rotateY(180deg) translateZ(100px); }
        .body-right  { transform: rotateY(90deg) translateZ(100px); }
        .body-left   { transform: rotateY(-90deg) translateZ(100px); }
        .body-bottom { transform: rotateX(-90deg) translateZ(100px); }

        /* Vertical Ribbon */
        .body-front::before, .body-back::before, .body-right::before, .body-left::before {
          width: 30px;
          height: 100%;
          top: 0;
        }

        /* Horizontal Ribbon */
        .body-front::after, .body-back::after, .body-right::after, .body-left::after {
          width: 100%;
          height: 30px;
          top: 50%;
          transform: translateY(-50%);
        }

        /* Lid */
        .gift-lid {
          position: absolute;
          width: 105%;
          height: 40px;
          top: -40px;
          left: -2.5%;
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
          transform-origin: bottom center;
          z-index: 10;
        }

        .lid-face {
          position: absolute;
          background: ${boxColor};
          border: 1px solid rgba(0,0,0,0.08);
        }

        .lid-face::before, .lid-face::after {
          content: '';
          position: absolute;
          background: ${ribbonColor};
        }

        .lid-top {
          width: 100%;
          height: 210px;
          transform: rotateX(90deg) translateZ(105px) translateY(-105px);
        }

        /* Ribbon Cross on top */
        .lid-top::before { width: 30px; height: 100%; left: 50%; transform: translateX(-50%); }
        .lid-top::after { width: 100%; height: 30px; top: 50%; transform: translateY(-50%); }

        .lid-front  { width: 100%; height: 40px; transform: translateZ(105px); }
        .lid-back   { width: 100%; height: 40px; transform: rotateY(180deg) translateZ(105px); }
        .lid-right  { width: 210px; height: 40px; transform: rotateY(90deg) translateZ(105px) translateX(105px); left: 50%; margin-left: -105px;}
        .lid-left   { width: 210px; height: 40px; transform: rotateY(-90deg) translateZ(105px) translateX(-105px); left: 50%; margin-left: -105px;}

        /* Ribbon on lid sides */
        .lid-front::before, .lid-back::before, .lid-right::before, .lid-left::before {
          width: 30px;
          height: 100%;
          left: 50%;
          transform: translateX(-50%);
        }

        /* Bow */
        .bow {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, -100%) rotateX(90deg);
          transform-style: preserve-3d;
          width: 60px;
          height: 60px;
          z-index: 20;
        }
        
        .bow-left, .bow-right {
          position: absolute;
          width: 40px;
          height: 40px;
          border: 10px solid ${ribbonColor};
          border-radius: 50% 50% 0 50%;
          top: 10px;
        }
        .bow-left {
          left: -15px;
          transform: rotateZ(45deg);
        }
        .bow-right {
          right: -15px;
          border-radius: 50% 50% 50% 0;
          transform: rotateZ(-45deg);
        }
        .bow-center {
          position: absolute;
          width: 20px;
          height: 20px;
          background: ${ribbonColor};
          border-radius: 50%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }
      `}</style>

      <div className="gift-wrapper">
        <div className={`gift-box ${isOpening ? 'opening' : ''}`}>
          
          <div className="gift-body-container">
            <div className="face body-front"></div>
            <div className="face body-back"></div>
            <div className="face body-right"></div>
            <div className="face body-left"></div>
            <div className="face body-bottom"></div>
          </div>

          <div className="gift-lid">
            <div className="lid-face lid-top">
              <div className="bow">
                <div className="bow-left"></div>
                <div className="bow-right"></div>
                <div className="bow-center"></div>
              </div>
            </div>
            <div className="lid-face lid-front"></div>
            <div className="lid-face lid-back"></div>
            <div className="lid-face lid-right"></div>
            <div className="lid-face lid-left"></div>
          </div>

        </div>
      </div>

      <div className="text-center mt-12 z-10 bg-white/50 backdrop-blur-sm px-8 py-6 rounded-3xl border border-white/60 shadow-lg">
        <h2 className="text-3xl font-serif text-[#5C554F] italic mb-2 tracking-wide">{title}</h2>
        <p className="text-sm uppercase tracking-widest text-[#8C8279]">{subtitle}</p>
      </div>

    </div>
  );
}
