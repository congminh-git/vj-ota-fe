'use client';

import { useEffect, useState } from 'react';

export default function SwaggerPage() {
  const [iframeHeight, setIframeHeight] = useState('100vh');

  useEffect(() => {
    const updateHeight = () => {
      setIframeHeight(`${window.innerHeight}px`);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: iframeHeight,
        overflow: 'hidden',
      }}
    >
      <iframe
        src={process.env.NEXT_PUBLIC_SWAGGER_URL || 'http://localhost:3001/api-docs'}
        title="Swagger API Docs"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        allow="fullscreen"
      />
    </div>
  );
}
