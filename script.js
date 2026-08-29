(() => {
  const nav = document.getElementById('siteNav');
  const toggle = document.getElementById('mobileToggle');
  const navLinks = [...document.querySelectorAll('.site-nav a')];
  const sections = [...document.querySelectorAll('[data-section]')];
  const stars = document.getElementById('stars');
  const year = document.getElementById('year');
  const dialog = document.getElementById('bookDialog');
  const dialogTitle = document.getElementById('dialogTitle');
  const dialogDescription = document.getElementById('dialogDescription');
  const dialogClose = document.getElementById('dialogClose');
  const characterDialog = document.getElementById('characterDialog');
  const characterDialogTitle = document.getElementById('characterDialogTitle');
  const characterDialogDescription = document.getElementById('characterDialogDescription');
  const characterDialogClose = document.getElementById('characterDialogClose');
  const defaultBookDescription = 'This book card is ready to link to its own story page. We can add a synopsis, sample pages, gallery images and a purchase or enquiry button here.';

  // Current year in the footer.
  year.textContent = new Date().getFullYear();

  // Mobile navigation.
  const closeMenu = () => {
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.textContent = '☰';
  };

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    toggle.textContent = open ? '×' : '☰';
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', event => {
    if (!nav.classList.contains('open')) return;
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });

  // Active navigation item while scrolling.
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
    });
  }, {
    rootMargin: '-25% 0px -58% 0px',
    threshold: [0.05, 0.25, 0.5]
  });

  sections.forEach(section => sectionObserver.observe(section));

  // Scroll reveal animation.
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));

  // Create a lightweight star field without extra image files.
  const starCount = window.matchMedia('(max-width: 700px)').matches ? 38 : 72;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < starCount; i += 1) {
    const star = document.createElement('span');
    star.className = `star${Math.random() > 0.78 ? ' gold' : ''}`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty('--twinkle-duration', `${2.8 + Math.random() * 4.5}s`);
    star.style.setProperty('--twinkle-delay', `${Math.random() * -6}s`);

    const size = Math.random() > 0.86 ? 3 : Math.random() > 0.6 ? 2 : 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    fragment.appendChild(star);
  }

  stars.appendChild(fragment);

  // Book preview dialog. Replace this with links to individual book pages later if preferred.
  document.querySelectorAll('.book-card, [data-book-card]').forEach(card => {
    card.querySelectorAll('.book-cover, .book-details').forEach(trigger => trigger.addEventListener('click', () => {
      dialogTitle.textContent = card.dataset.bookTitle;
      const paragraphs = (card.dataset.bookDescription || defaultBookDescription).split('\n\n');
      dialogDescription.replaceChildren(...paragraphs.map(text => {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        return paragraph;
      }));
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      }
    }));
  });

  dialogClose.addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) dialog.close();
  });

  // Character profile dialog.
  document.querySelectorAll('.character-card').forEach(card => {
    card.addEventListener('click', () => {
      characterDialogTitle.textContent = card.dataset.characterName;
      characterDialogDescription.textContent = card.dataset.characterDescription;
      if (typeof characterDialog.showModal === 'function') {
        characterDialog.showModal();
      }
    });
  });

  characterDialogClose.addEventListener('click', () => characterDialog.close());

  characterDialog.addEventListener('click', event => {
    const rect = characterDialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) characterDialog.close();
  });

  // Close the mobile menu if the layout changes back to desktop.
  window.addEventListener('resize', () => {
    if (window.innerWidth > 920) closeMenu();
  });
})();
