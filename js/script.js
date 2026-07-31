// Small script for nav toggle, year update, and image lightbox

document.addEventListener('DOMContentLoaded', function(){
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');
  const modal = document.getElementById('image-modal');
  const modalContent = document.getElementById('image-modal-content');
  const closeButton = modal ? modal.querySelector('.image-modal-close') : null;

  if (navToggle && nav) {
    navToggle.addEventListener('click', function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      nav.setAttribute('aria-expanded', String(!expanded));
      if (!expanded) {
        nav.style.display = 'flex';
      } else {
        nav.style.display = '';
      }
    });

    window.addEventListener('resize', function(){
      if (window.innerWidth > 800) {
        nav.style.display = '';
        navToggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('aria-expanded', 'false');
      }
    });
    
    nav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        if (window.innerWidth <= 800) {
          nav.style.display = '';
          navToggle.setAttribute('aria-expanded', 'false');
          nav.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  document.querySelectorAll('.preview-trigger').forEach(function(trigger){
    trigger.addEventListener('click', function(event){
      event.preventDefault();
      event.stopPropagation();
      if (!modal || !modalContent) return;


      modalContent.innerHTML = '';

      const src = this.dataset.src || this.src;
      
      if (this.dataset.type === 'iframe' || (typeof src === 'string' && src.match(/\.html?$|^data:text\/html/))) {
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.title = this.title || 'Expanded preview';
        modalContent.appendChild(iframe);
      } else {
        const image = document.createElement('img');
        image.src = src;
        image.alt = this.alt || 'Expanded preview';
        modalContent.appendChild(image);
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    });
  });

  document.querySelectorAll('.code-trigger').forEach(function(trigger){
    trigger.addEventListener('click', async function(event){
      event.preventDefault();
      event.stopPropagation();
      if (!modal || !modalContent) return;

      modalContent.innerHTML = '';
      const src = trigger.dataset.src || 'assets/template_.html';
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
        const text = await res.text();
        const codeBlock = document.createElement('pre');
        codeBlock.textContent = text;
        modalContent.appendChild(codeBlock);
      } catch (err) {
        const errEl = document.createElement('div');
        errEl.style.color = '#fff';
        errEl.style.background = 'rgba(0,0,0,0.4)';
        errEl.style.padding = '.75rem';
        errEl.style.borderRadius = '8px';
        if (location.protocol === 'file:') {
          errEl.textContent = 'Could not load template (running from file://). Start a local HTTP server and open via http://localhost, e.g. run: python -m http.server';
        } else {
          errEl.textContent = 'Could not load template: ' + err.message;
        }
        modalContent.appendChild(errEl);
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    });
  });

  function closeModal(){
    if (!modal || !modalContent) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modalContent.innerHTML = '';
    document.body.classList.remove('modal-open');
  }

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', function(event){
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', function(event){
    if (event.key === 'Escape') {
      closeModal();
    }
  });

  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
});
