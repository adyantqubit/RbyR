import React, { useState, useRef } from 'react';

const SimpleMagnifier = ({ src, className }) => {
  const imgRef = useRef(null);
  const magnifierSize = 150; // diameter of magnifier circle

  const [magnifier, setMagnifier] = useState({
    display: false,
    x: 0,
    y: 0,
    bgX: 0,
    bgY: 0,
  });

  const handleMouseMove = (e) => {
    const { top, left, width, height } = imgRef.current.getBoundingClientRect();
    let x = e.clientX - left;
    let y = e.clientY - top;

    if (x < 0 || y < 0 || x > width || y > height) {
      setMagnifier({ ...magnifier, display: false });
      return;
    }

    // radius
    const r = magnifierSize / 2;

    // bound the magnifier center inside the image
    x = Math.max(r, Math.min(x, width - r));
    y = Math.max(r, Math.min(y, height - r));

    // calculate background position (zoomed)
    const bgX = -((x / width) * imgRef.current.naturalWidth - r);
    const bgY = -((y / height) * imgRef.current.naturalHeight - r);

    setMagnifier({
      display: true,
      x: x - r,
      y: y - r,
      bgX,
      bgY,
    });
  };

  const handleMouseLeave = () => {
    setMagnifier({ ...magnifier, display: false });
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src={src}
        alt=""
        ref={imgRef}
        className={className}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ display: 'block' }}
        draggable={false}
      />
      {magnifier.display && (
        <div
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            left: magnifier.x,
            top: magnifier.y,
            width: magnifierSize,
            height: magnifierSize,
            borderRadius: '50%',
            border: '2px solid #000',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `${magnifier.bgX}px ${magnifier.bgY}px`,
            backgroundSize: `${imgRef.current.naturalWidth}px ${imgRef.current.naturalHeight}px`,
            zIndex: 1000,
          }}
        />
      )}
    </div>
  );
};

export default SimpleMagnifier;
