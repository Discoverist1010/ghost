// Fit the accepted composition as one unit; resizing never changes presenter state.
export const DISPLAY_REFERENCE = Object.freeze({width:1920,height:1080});

export function presentationScale(width, height) {
  return Math.min(width / DISPLAY_REFERENCE.width, height / DISPLAY_REFERENCE.height);
}

export function installPresentationScale(frame, viewport) {
  if (!frame?.style?.setProperty || !viewport?.addEventListener) return;
  const fit = () => frame.style.setProperty('--presentation-scale', String(presentationScale(viewport.innerWidth, viewport.innerHeight)));
  fit();
  viewport.addEventListener('resize', fit, {passive:true});
  return () => viewport.removeEventListener('resize', fit);
}
