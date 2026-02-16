// script.js — toggle body/backbody image when the switch is clicked
(function(){
  const toggle = document.querySelector('.toggle-switch');
  const slider = document.querySelector('.toggle-slider');
  const bodyImg = document.querySelector('.body-image');
  const label = document.querySelector('.toggle-f');
  if(!toggle || !bodyImg) return;

  const frontSrc = bodyImg.getAttribute('src') || 'assests/body.png';
  const backSrc = 'assests/backbody.png'; // ensure this file exists in assests/

  let showingBack = false;

  // initialize slider position (in case CSS had odd left value)
  if(slider) slider.style.left = '2px';

  toggle.addEventListener('click', () => {
    showingBack = !showingBack;
    bodyImg.src = showingBack ? backSrc : frontSrc;

    // move the small slider circle for visual feedback
    if(slider){
      slider.style.left = showingBack ? '26px' : '2px';
    }

    // optional: toggle an "on" class for further styling
    toggle.classList.toggle('on', showingBack);
    // also toggle a class on the mannequin so CSS can switch which points are visible
    const mannequin = document.querySelector('.mannequin');
    if(mannequin) mannequin.classList.toggle('back-mode', showingBack);
    // update the small letter indicator: F for front, B for back
    if(label) label.textContent = showingBack ? 'B' : 'F';
    // accessibility: reflect pressed state
    toggle.setAttribute('aria-pressed', showingBack ? 'true' : 'false');
  });
})();

// show a small preview image inside the input container when an input is focused
(function(){
  const unitFields = document.querySelectorAll('.field-with-unit');
  const brandLogo = document.querySelector('.brand-logo');
  const originalLogoSrc = brandLogo ? brandLogo.src : '';
  if(!unitFields.length) return;

  // basic mapping from placeholder text to preview images
  const previewMap = {
    'neck/collar': 'assests/neck.png',
    'chest': 'assests/chest.png',
    'shoulder width': 'assests/uppershoulder.png',
    'bicep': 'assests/shoulder.png',
    'armhole': 'assests/armlengeth.png',
    'wrist around': 'assests/wrist.png',
    'sleeve length': 'assests/armlengeth.png',
    'front lenght': 'assests/waiste.png',
    'back length': 'assests/back.png',
    // 'age': ''
  };

  unitFields.forEach(container => {
    const input = container.querySelector('input');
    if(!input) return;

    // create preview element if not already present
    let preview = container.querySelector('.input-preview');
    if(!preview){
      preview = document.createElement('img');
      preview.className = 'input-preview';
      preview.alt = '';
      container.appendChild(preview);
    }

    input.addEventListener('focus', () => {
      const key = (input.placeholder || '').toLowerCase().trim();
      // don't show preview for the Age field
      if(key === 'age') return;

      const src = container.dataset.image || previewMap[key] || 'assests/modomeet.png';
      preview.src = src;
      container.classList.add('input-preview-visible');

      // update main brand logo to show the same preview
      if(brandLogo && src) brandLogo.src = src;
    });

    input.addEventListener('blur', () => {
      container.classList.remove('input-preview-visible');
      // clear src after a short delay to avoid flashing
      setTimeout(() => preview.src = '', 200);

      // restore brand logo: if a point is pinned keep it, otherwise revert
      if(brandLogo){
        const pinned = document.querySelector('.point.pinned');
        if(pinned && pinned.dataset.image) brandLogo.src = pinned.dataset.image;
        else brandLogo.src = originalLogoSrc;
      }
    });
  });
})();

  // Mode buttons: switch body image when Upper/Lower selected
  (function(){
    const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
    const body = document.querySelector('.body-image');
    if(!modeButtons.length || !body) return;

    modeButtons.forEach((btn, idx) => {
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // idx 0 -> Upper (front), idx 1 -> Lower (back)
        const mannequin = document.querySelector('.mannequin');
        const toggle = document.querySelector('.toggle-switch');
        if(idx === 0){
          // Upper: show front body and front points; enable toggle
          body.src = 'assests/body.png';
          if(mannequin){
            mannequin.classList.remove('back-mode');
            mannequin.classList.remove('lower-mode');
          }
          if(toggle){ toggle.classList.remove('disabled'); toggle.setAttribute('aria-disabled','false'); }
        } else {
          // Lower: show lower image and lower-specific points; disable the F/B toggle
          body.src = 'assests/lower.png';
          if(mannequin){
            mannequin.classList.remove('back-mode');
            mannequin.classList.add('lower-mode');
          }
          if(toggle){ toggle.classList.add('disabled'); toggle.setAttribute('aria-disabled','true'); }
        }
      });
    });
  })();
