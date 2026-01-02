import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children }) => {
  const modalRoot = document.getElementById('modal-root') || document.body;
  
  useEffect(() => {
    // Modal ochilganda body scroll ni to'xtatish
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Modal yopilganda scroll ni qaytarish
      document.body.style.overflow = 'unset';
    };
  }, []);

  return createPortal(children, modalRoot);
};

export default Portal;