import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";

const SimpleMagnifier = ({ src, className }) => {
  const imgRef = useRef(null);

  /* ================= DESKTOP CONFIG ================= */
  const lensSize = 120;          // left lens (same as before)
  const zoomBoxWidth = 520;      // RIGHT zoom width
  const zoomBoxHeight = 520;     // RIGHT zoom height
  const zoomLevel = 1.8;         // controlled zoom

  /* ================= MOBILE CONFIG ================= */
  const isMobile = window.innerWidth <= 768;

  const [lens, setLens] = useState({
    show: false,
    x: 0,
    y: 0,
    bgX: 0,
    bgY: 0,
    boxLeft: 0,
    boxTop: 0,
  });

  const [showMobileZoom, setShowMobileZoom] = useState(false);

  /* ================= DESKTOP HOVER ================= */
  const moveLens = (e) => {
    if (isMobile) return;

    const img = imgRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setLens((p) => ({ ...p, show: false }));
      return;
    }

    const half = lensSize / 2;
    x = Math.max(half, Math.min(x, rect.width - half));
    y = Math.max(half, Math.min(y, rect.height - half));

    const bgX =
      -((x / rect.width) * img.naturalWidth * zoomLevel -
        zoomBoxWidth / 2);

    const bgY =
      -((y / rect.height) * img.naturalHeight * zoomLevel -
        zoomBoxHeight / 2);

    setLens({
      show: true,
      x: x - half,
      y: y - half,
      bgX,
      bgY,
      boxLeft: rect.right + 20,
      boxTop: rect.top,
    });
  };

  return (
    <>
      {/* ================= IMAGE ================= */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <img
          ref={imgRef}
          src={src}
          className={className}
          draggable={false}
          onMouseMove={moveLens}
          onMouseLeave={() =>
            setLens((p) => ({ ...p, show: false }))
          }
          onClick={() => {
            if (isMobile) setShowMobileZoom(true);
          }}
        />

        {/* ================= DESKTOP LENS ================= */}
        {lens.show && !isMobile && (
          <div
            style={{
              position: "absolute",
              left: lens.x,
              top: lens.y,
              width: lensSize,
              height: lensSize,
              border: "2px solid #999",
              background: "rgba(255,255,255,0.3)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        )}
      </div>

      {/* ================= DESKTOP POPUP ZOOM ================= */}
      {lens.show &&
        !isMobile &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: lens.boxLeft,
              top: lens.boxTop,
              width: zoomBoxWidth,
              height: zoomBoxHeight,
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              zIndex: 999999,

              backgroundImage: `url(${src})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: `${lens.bgX}px ${lens.bgY}px`,
              backgroundSize: `${
                imgRef.current.naturalWidth * zoomLevel
              }px ${
                imgRef.current.naturalHeight * zoomLevel
              }px`,
            }}
          />,
          document.body
        )}

      {/* ================= MOBILE FULLSCREEN ZOOM ================= */}
      {showMobileZoom &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "#000",
              zIndex: 999999,
            }}
          >
            <img
              src={src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transform: "scale(2)",
              }}
            />

            <button
              onClick={() => setShowMobileZoom(false)}
              style={{
                position: "absolute",
                top: 15,
                right: 15,
                color: "#fff",
                fontSize: 26,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>,
          document.body
        )}
    </>
  );
};

export default SimpleMagnifier;
