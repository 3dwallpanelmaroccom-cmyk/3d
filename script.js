(() => {
  const gallery = document.querySelector('[data-gallery]');
  const wallPanelPosts = Array.isArray(window.WALLPANEL_POSTS) ? window.WALLPANEL_POSTS : [];
  const escapeAttribute = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

  wallPanelPosts.forEach((post, postIndex) => {
    const article = document.createElement('article');
    article.className = `project${post.images.length > 1 ? ' project--carousel' : ''}`;
    article.dataset.category = 'wallpanel';
    if (post.reference) article.dataset.reference = post.reference;
    if (post.width && post.height) article.style.setProperty('--wallpanel-carousel-ratio', `${Number(post.width)} / ${Number(post.height)}`);
    article.hidden = true;

    if (post.images.length === 1) {
      article.innerHTML = `<div class="image-slot"><img src="${post.images[0]}" alt="${escapeAttribute(post.alt || 'CrÃ©ation murale 3D Wall Panel sur mesure')}" width="${Number(post.width) || 1080}" height="${Number(post.height) || 1350}" loading="lazy" decoding="async"></div>`;
    } else {
      const slides = post.images.map((image, imageIndex) => (
        `<figure class="carousel-slide"><img src="${image}" alt="${escapeAttribute(post.alts?.[imageIndex] || `CrÃ©ation murale 3D Wall Panel â€” image ${imageIndex + 1} sur ${post.images.length}`)}" width="${Number(post.sizes?.[imageIndex]?.width || post.width) || 1080}" height="${Number(post.sizes?.[imageIndex]?.height || post.height) || 1080}" loading="lazy" decoding="async"></figure>`
      )).join('');
      article.innerHTML = `
        <div class="carousel" data-carousel aria-roledescription="carrousel" aria-label="Publication 3D Wall Panel ${postIndex + 1}">
          <div class="carousel-track" data-carousel-track tabindex="0">${slides}</div>
          <button class="carousel-arrow carousel-arrow--prev" type="button" data-carousel-prev aria-label="Image prÃ©cÃ©dente">â†</button>
          <button class="carousel-arrow carousel-arrow--next" type="button" data-carousel-next aria-label="Image suivante">â†’</button>
        </div>`;
    }

    gallery.appendChild(article);
  });

  const collections = window.BOURAZKI_COLLECTIONS || [];
  const body = document.body;
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  const links = document.querySelectorAll('.menu a');
  const filters = document.querySelectorAll('.filter');
  const projects = document.querySelectorAll('.project');
  const whatsappNumber = '212661745373';

  // One enquiry belongs to one image, including each individual carousel slide.
  const referencePrefixes = {
    produit: 'MEUBLE', wallpanel: '3DWP', interieur: 'INT', exterieur: 'EXT',
    mobilier: 'MOB', separations: 'SEP', portes: 'PORTE', sculptures: 'SCULP',
    papiers: 'PAPIER', tableaux: 'TAB', luminaires: 'LUM'
  };
  const referenceCounts = {};
  const whatsappIcon = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.8A8.5 8.5 0 1 1 20.5 11.7Z"/><path d="M8.2 7.4c.3-.2.6-.1.8.2l1 1.8c.1.3.1.5-.1.7l-.7.8a7.1 7.1 0 0 0 3.2 3.1l.8-.9c.2-.2.5-.2.7-.1l1.8.9c.3.2.4.5.3.8-.3 1.2-1.2 1.7-2.3 1.5-3.6-.7-6.5-3.6-7.1-6.8-.2-1 .5-1.7 1.6-2Z"/></svg>';

  projects.forEach((project) => {
    const category = project.dataset.category;
    referenceCounts[category] = (referenceCounts[category] || 0) + 1;
    const baseReference = project.dataset.reference || `${referencePrefixes[category] || 'DESIGN'}-${String(referenceCounts[category]).padStart(3, '0')}`;
    project.dataset.reference = baseReference;
    const images = [...project.querySelectorAll('.image-slot > img, .carousel-slide > img')];
    images.forEach((image, index) => {
      const reference = images.length > 1 ? `${baseReference}-${String(index + 1).padStart(2, '0')}` : baseReference;
      const imageUrl = new URL(image.getAttribute('src'), window.location.href).href;
      const message = `Bonjour, je souhaite connaÃ®tre le prix ou obtenir un devis pour cette crÃ©ation.\n\nRÃ©fÃ©rence : ${reference}\n${image.alt || 'CrÃ©ation Bourazki Design'}\nImage : ${imageUrl}`;
      const link = document.createElement('a');
      link.className = 'project-enquiry';
      link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      link.target = '_blank';
      link.rel = 'noopener';
      link.dataset.contactContext = `gallery_${project.dataset.collection || category}`;
      link.dataset.contactIntent = 'quote_request';
      link.dataset.itemId = reference;
      link.setAttribute('aria-label', `Demander le prix ou un devis pour la rÃ©fÃ©rence ${reference} sur WhatsApp`);
      link.title = 'Prix ou devis sur WhatsApp';
      link.innerHTML = whatsappIcon;
      image.parentElement.appendChild(link);
    });
  });

  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };

  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  links.forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  const picker = document.querySelector('.collection-picker');
  const resetCollection = document.getElementById('collection-reset');
  const collectionSection = document.getElementById('galerie');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pickerTimer = 0;
  let pickerAnimation = null;
  const animatePickerHeight = (before) => {
    pickerAnimation?.cancel();
    if (reducedMotion.matches || !picker.animate) return;
    const after = picker.getBoundingClientRect().height;
    pickerAnimation = picker.animate([{ height: `${before}px` }, { height: `${after}px` }], { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' });
  };
  const focusCollection = (filter, instant = false) => {
    clearTimeout(pickerTimer);
    pickerAnimation?.cancel();
    filters.forEach((item) => { item.inert = item !== filter; });
    const collapse = () => {
      const before = picker.getBoundingClientRect().height;
      filters.forEach((item) => { item.hidden = item !== filter; });
      resetCollection.hidden = false;
      picker.classList.remove('is-fading');
      picker.classList.add('is-focused');
      collectionSection.classList.add('is-collection-focused');
      if (!instant) {
        animatePickerHeight(before);
        picker.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      }
    };
    if (instant || reducedMotion.matches || picker.classList.contains('is-focused')) collapse();
    else {
      picker.classList.add('is-fading');
      pickerTimer = window.setTimeout(collapse, 180);
    }
  };
  const showCollections = () => {
    clearTimeout(pickerTimer);
    pickerAnimation?.cancel();
    const before = picker.getBoundingClientRect().height;
    picker.classList.remove('is-focused', 'is-fading');
    collectionSection.classList.remove('is-collection-focused');
    resetCollection.hidden = true;
    filters.forEach((item) => { item.hidden = false; item.inert = false; });
    animatePickerHeight(before);
    history.replaceState(null, '', '#galerie');
    document.querySelector('.filter.is-active')?.focus({ preventScroll: true });
  };
  resetCollection.addEventListener('click', showCollections);
  picker.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && picker.classList.contains('is-focused')) {
      event.preventDefault();
      showCollections();
    }
  });

  const activateFilter = (filter, options = {}) => {
    if (!filter) return;
    const category = filter.dataset.filter;

    filters.forEach((item) => {
      const active = item === filter;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });

    projects.forEach((project) => {
      const previousCollection = project.dataset.collection || project.dataset.category;
      const mergedCollection = { habillages: 'wallpanel', facades: 'exterieur', consoles: 'mobilier' }[previousCollection] || previousCollection;
      project.hidden = mergedCollection !== category;
    });

    const definition = collections.find((item) => item.key === category);
    if (definition) {
      document.getElementById('collection-title').textContent = definition.title;
      document.getElementById('collection-description').textContent = definition.description;
      const expertise = document.getElementById('collection-expertise');
      expertise.hidden = !definition.expertise;
      if (definition.expertise) expertise.href = definition.expertise;
      document.getElementById('collection-empty').hidden = category === 'wallpanel' || Array.from(projects).some((project) => !project.hidden);
      gallery.dataset.collection = category;
      gallery.setAttribute('aria-labelledby', filter.id);
      document.querySelectorAll('[data-collection-link]').forEach((link) => {
        if (link.dataset.collectionLink === category) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
      if (!options.fromHash) history.replaceState(null, '', '#collection-' + definition.slug);
    }
    if (!options.keepPickerOpen) focusCollection(filter, Boolean(options.instant));
    if (options.focus) filter.focus({ preventScroll: true });
  };

  filters.forEach((filter) => {
    filter.addEventListener('click', () => activateFilter(filter));
    filter.addEventListener('keydown', (event) => {
      if (picker.classList.contains('is-focused') || picker.classList.contains('is-fading')) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const current = Array.from(filters).indexOf(filter);
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const target = filters[(current + direction + filters.length) % filters.length];
      activateFilter(target, { focus: true });
    });
  });

  const applyCollectionHash = (scroll = true) => {
    const slug = location.hash.replace('#collection-', '');
    const definition = collections.find((item) => item.slug === slug || item.aliases?.includes(slug));
    if (!definition) return;
    const target = Array.from(filters).find((item) => item.dataset.filter === definition.key);
    activateFilter(target, { instant: true, fromHash: true });
    if (scroll) picker.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  };
  document.querySelectorAll('[data-collection-link]').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    history.pushState(null, '', link.getAttribute('href'));
    setMenu(false);
    applyCollectionHash();
    document.getElementById('collection-title').tabIndex = -1;
    document.getElementById('collection-title').focus({ preventScroll: true });
  }));
  window.addEventListener('hashchange', () => applyCollectionHash());
  applyCollectionHash();
  if (!location.hash.startsWith('#collection-')) activateFilter(document.querySelector('.filter.is-active'), { instant: true, fromHash: true, keepPickerOpen: true });

  const gallerySection = document.querySelector('#galerie');
  let categoryTouchStartX = 0;
  let categoryTouchStartY = 0;
  let categoryTouchTarget = null;

  gallerySection?.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1) return;
    categoryTouchTarget = event.target;
    categoryTouchStartX = event.touches[0].clientX;
    categoryTouchStartY = event.touches[0].clientY;
  }, { passive: true });

  gallerySection?.addEventListener('touchend', (event) => {
    if (!categoryTouchTarget || categoryTouchTarget.closest('[data-carousel]')) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - categoryTouchStartX;
    const deltaY = touch.clientY - categoryTouchStartY;
    categoryTouchTarget = null;
    if (Math.abs(deltaX) < 65 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.25) return;

    const activeIndex = Array.from(filters).findIndex((item) => item.classList.contains('is-active'));
    const direction = deltaX < 0 ? 1 : -1;
    const nextIndex = Math.max(0, Math.min(filters.length - 1, activeIndex + direction));
    if (nextIndex !== activeIndex) activateFilter(filters[nextIndex]);
  }, { passive: true });

  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const previous = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');

    const activeIndex = () => Math.max(0, Math.min(
      slides.length - 1,
      Math.round(track.scrollLeft / (track.clientWidth || 1))
    ));

    const update = () => {
      const index = activeIndex();
      previous.disabled = index === 0;
      next.disabled = index === slides.length - 1;
    };

    const move = (direction) => {
      const index = Math.max(0, Math.min(slides.length - 1, activeIndex() + direction));
      track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
    };

    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('scroll', update, { passive: true });
    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        move(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        move(1);
      }
    });
    window.addEventListener('resize', update, { passive: true });
    update();
  });
})();

// Load a realisation only after a visitor asks to watch it.
const realisationVideos = [...document.querySelectorAll('.reel-card video[data-video-src]')];

realisationVideos.forEach((video) => {
  const card = video.closest('.reel-card');
  const playButton = card?.querySelector('.reel-card__play');

  const loadAndPlay = async () => {
    realisationVideos.forEach((other) => {
      if (other !== video) other.pause();
    });

    if (!video.src) {
      video.src = video.dataset.videoSrc;
      video.load();
    }

    if (playButton) playButton.hidden = true;
    try {
      await video.play();
    } catch {
      if (playButton) playButton.hidden = false;
    }
  };

  playButton?.addEventListener('click', loadAndPlay);
  video.addEventListener('play', () => {
    realisationVideos.forEach((other) => {
      if (other !== video) other.pause();
    });
    if (playButton) playButton.hidden = true;
  });
  video.addEventListener('error', () => {
    if (playButton) playButton.hidden = false;
  });
});