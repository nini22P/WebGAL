import { FC, useEffect } from 'react';
import styles from './logo.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useValue } from '@/hooks/useValue';

/**
 * 标识
 * @constructor
 */
const Logo: FC = () => {
  const GUIState = useSelector((state: RootState) => state.GUI);
  const logoImage = GUIState.logoImage;
  const isEnterGame = GUIState.isEnterGame;
  const currentLogoIndex = useValue(-1);
  const currentTimeOutId = useValue<any>(-1);
  const animationDuration = 5000;

  const nextImg = () => {
    clearTimeout(currentTimeOutId.value);
    if (currentLogoIndex.value < logoImage.length - 1) {
      currentLogoIndex.set(currentLogoIndex.value + 1);
      currentTimeOutId.set(setTimeout(nextImg, animationDuration));
    } else {
      currentLogoIndex.set(-1);
    }
  };

  useEffect(() => {
    if (isEnterGame && logoImage.length > 0) {
      /**
       * 启动 Enter Logo
       */
      currentLogoIndex.set(0);
      currentTimeOutId.set(setTimeout(nextImg, animationDuration));
    }
  }, [isEnterGame]);

  const isShow = currentLogoIndex.value !== -1;

  return (
    <>
      {/* 预加载图片 */}
      {logoImage.map((url) => (
        <link key={`preload-${url}`} rel="preload" href={url} as="image" />
      ))}

      {isShow &&
        logoImage.map((url, index) => {
          const isSkipped = index < currentLogoIndex.value;
          const isCurrent = index === currentLogoIndex.value;
          return (
            <div
              key={`${index}-${currentLogoIndex.value}`}
              className={`${styles.Logo_main} ${isCurrent ? styles.Logo_animation : ''}`}
              onClick={nextImg}
              style={{
                backgroundImage: `url("${url}")`,
                animationDuration: `${animationDuration}ms`,
                zIndex: 14 + (logoImage.length - index),
                visibility: isSkipped ? 'hidden' : 'visible',
              }}
            />
          );
        })}
    </>
  );
};

export default Logo;
