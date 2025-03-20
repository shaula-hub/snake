import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const TouchControls = ({ onControl }) => {
  const [gestureStart, setGestureStart] = useState(null);
  const [lastActionTime, setLastActionTime] = useState(0);
  
  // Constants for gesture recognition
  const PRESS_THRESHOLD = 300; // ms to differentiate between short and long press
  const MOVEMENT_THRESHOLD = 10; // minimal pixels to recognize as movement
  const ACTION_COOLDOWN = 100; // ms cooldown between actions to prevent double triggers
  
  // Ref for the touch surface
  const touchSurfaceRef = useRef(null);

  // Prevent default touch behavior
  useEffect(() => {
    const touchSurface = touchSurfaceRef.current;
    if (!touchSurface) return;

    const preventDefaultTouch = (e) => {
      e.preventDefault();
    };

    touchSurface.addEventListener('touchstart', preventDefaultTouch, { passive: false });
    touchSurface.addEventListener('touchmove', preventDefaultTouch, { passive: false });
    touchSurface.addEventListener('touchend', preventDefaultTouch, { passive: false });

    return () => {
      touchSurface.removeEventListener('touchstart', preventDefaultTouch);
      touchSurface.removeEventListener('touchmove', preventDefaultTouch);
      touchSurface.removeEventListener('touchend', preventDefaultTouch);
    };
  }, []);

  const handleGestureStart = (event) => {
    const point = event.touches ? event.touches[0] : event;
    setGestureStart({
      x: point.clientX,
      y: point.clientY,
      time: new Date().getTime()
    });
  };

  const handleGestureEnd = (event) => {
    if (!gestureStart) return;

    const now = new Date().getTime();
    const point = event.changedTouches ? event.changedTouches[0] : event;
    const deltaX = point.clientX - gestureStart.x;
    const deltaY = point.clientY - gestureStart.y;
    const duration = now - gestureStart.time;

    // Check if we're still in cooldown period
    if (now - lastActionTime < ACTION_COOLDOWN) {
      setGestureStart(null);
      return;
    }

    // Check if there was significant movement
    if (Math.abs(deltaX) > MOVEMENT_THRESHOLD || Math.abs(deltaY) > MOVEMENT_THRESHOLD) {
      // Handle swipe
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        onControl(deltaX > 0 ? 'ArrowRight' : 'ArrowLeft');
      } else {
        // Vertical swipe
        onControl(deltaY > 0 ? 'ArrowDown' : 'ArrowUp');
      }
    } else {
      // No movement - handle as a tap (should accelerate)
      onControl(' '); // Space key for acceleration
    }

    // Update last action time
    setLastActionTime(now);
    setGestureStart(null);
  };

  // Handle gesture cancel
  const handleGestureCancel = () => {
    setGestureStart(null);
  };

  return (
    <div 
      ref={touchSurfaceRef}
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "transparent",
        zIndex: 20
      }}
      onTouchStart={handleGestureStart}
      onTouchEnd={handleGestureEnd}
      onTouchCancel={handleGestureCancel}
      onMouseDown={handleGestureStart}
      onMouseUp={handleGestureEnd}
      onMouseLeave={handleGestureCancel}
    />
  );
};

TouchControls.propTypes = {
  onControl: PropTypes.func.isRequired
};

export default TouchControls;