import React from 'react';

export interface AppImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
}

const AppImage: React.FC<AppImageProps> = ({
  src,
  alt,
  fallback = '/assets/images/placeholder.png',
  className = '',
  onError,
  ...props
}) => {
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null);
  const imgSrc = failedSrc === src ? fallback : src;

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (failedSrc !== src) {
      setFailedSrc(src);
    }
    onError?.(e);
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};

export default AppImage;
