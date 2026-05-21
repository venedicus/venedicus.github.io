(function () {

  const translations = {
    ru: {
      'topbar.mode': '~ режим: нормальный',
      'profile.head': 'ПРОФИЛЬ',
      'profile.name': 'Кирилл / venedicus',
      'kv.location': 'город',
      'kv.location.val': 'Санкт-Петербург',
      'kv.edu': 'образование',
      'kv.edu.val': '2023–2027 / бакалавриат',
      'kv.focus': 'интересы',
      'kv.focus.val': 'Go, Backend, DevOps, GameDev',
      'kv.lang': 'языки',
      'kv.lang.val': 'рус. (родной) / англ. (технический)',
      'stack.head': 'СТЕК',
      'stack.langs': 'Go, C#, Bash, Python',
      'stack.backend': 'REST API, CLI/TUI, слоистая архитектура, MVC',
      'stack.data': 'PostgreSQL, SQLite, основы проектирования БД',
      'stack.devops': 'Linux (Debian, Arch, Astra, WSL), Docker, Git, nginx/Apache, self-hosted',
      'stack.dotnet': 'прикладная логика, инструменты',
      'stack.unity': 'Unity, геймдизайн, симуляции',
      'projects.head': 'ПРОЕКТЫ',
      'projects.toggle': '[v] verbose: выкл',
      'projects.toggle.on': '[v] verbose: вкл',
      'p1.desc': 'движок имиджборды на Go',
      'p1.more': 'Слоистая архитектура Handler → Service → Repository. FTS5, SHA-256 дедупликация медиа, admin API, webhooks, RSS.',
      'p2.desc': 'кроссплатформенный GUI для yt-dlp',
      'p2.more': 'Desktop: live-превью командной строки, асинхронная очередь загрузок, пресеты, авто-установщик зависимостей. Tokyo Night.',
      'p3.name': 'ЭЛЕМЕР-КТ-200К',
      'p3.desc': 'симулятор промышленного прибора',
      'p3.more': 'Симулятор калибратора ЭЛЕМЕР-КТ-200К для кафедры: логика прибора и состояния измерений; UI по физической панели.',
      'p3.link': '// закрытый',
      'status.mode': 'НОРМАЛЬНЫЙ',
      'status.v': '[v] verbose',
      'status.d': '[d] диагностика',
      'toast.init': '~ сессия инициализирована',
      'toast.verbose.on': '~ verbose: вкл',
      'toast.verbose.off': '~ verbose: выкл',
      'diag.0': 'проверка зависимостей... [ok]',
      'diag.1': 'ping localhost... [ok]',
      'diag.2': 'проверка буфера... [ok]',
      'diag.3': 'система в норме.',
    },
    en: {
      'topbar.mode': '~ mode: normal',
      'profile.head': 'PROFILE',
      'profile.name': 'Kirill / venedicus',
      'kv.location': 'location',
      'kv.location.val': 'Saint Petersburg',
      'kv.edu': 'education',
      'kv.edu.val': '2023–2027 / Bachelor\'s degree',
      'kv.focus': 'focus',
      'kv.focus.val': 'Go, Backend, DevOps, GameDev',
      'kv.lang': 'languages',
      'kv.lang.val': 'RU (native) / EN (technical)',
      'stack.head': 'STACK',
      'stack.langs': 'Go, C#, Bash, Python',
      'stack.backend': 'REST API, CLI/TUI, layered architecture, MVC',
      'stack.data': 'PostgreSQL, SQLite, database design fundamentals',
      'stack.devops': 'Linux (Debian, Arch, Astra, WSL), Docker, Git, nginx/Apache, self-hosted',
      'stack.dotnet': 'application logic, tooling',
      'stack.unity': 'Unity, game design, simulations',
      'projects.head': 'PROJECTS',
      'projects.toggle': '[v] verbose: off',
      'projects.toggle.on': '[v] verbose: on',
      'p1.desc': 'imageboard engine in Go',
      'p1.more': 'Layered Handler → Service → Repository. FTS5, SHA-256 media dedup, admin API, webhooks, RSS.',
      'p2.desc': 'cross-platform GUI for yt-dlp',
      'p2.more': 'Desktop: live CLI preview, async download queue, presets, dependency auto-installer. Tokyo Night.',
      'p3.name': 'ELEMER-KT-200K',
      'p3.desc': 'industrial device simulator',
      'p3.more': 'ELEMER-KT-200K calibrator simulator for the department: device logic and measurement states; UI mirroring the physical panel.',
      'p3.link': '// private',
      'status.mode': 'NORMAL',
      'status.v': '[v] verbose',
      'status.d': '[d] diagnostics',
      'toast.init': '~ session initialized',
      'toast.verbose.on': '~ verbose: on',
      'toast.verbose.off': '~ verbose: off',
      'diag.0': 'checking dependencies... [ok]',
      'diag.1': 'ping localhost... [ok]',
      'diag.2': 'validating buffer... [ok]',
      'diag.3': 'system nominal.',
    }
  };

  let currentLang = localStorage.getItem('lang') || 'ru';
  const t = key => (translations[currentLang] || {})[key]
                || (translations.en || {})[key]
                || key;

  const clockEl         = document.getElementById('clock');
  const diagnosticsBtn  = document.getElementById('diagnosticsBtn');
  const toast           = document.getElementById('toast');
  const panels          = Array.from(document.querySelectorAll('.panel'));
  const projectsModeBtn = document.getElementById('projectsModeBtn');
  const projectsTable   = document.getElementById('projectsTable');
  const nameGlitch      = document.querySelector('.name-glitch');

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2000);
  }

  function updateClock() {
    if (!clockEl) return;
    clockEl.textContent = new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit', minute: '2-digit'
    });
  }

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = (translations[lang] || {})[el.getAttribute('data-i18n')];
      if (val !== undefined) el.textContent = val;
    });

    if (nameGlitch) {
      nameGlitch.setAttribute('data-text', nameGlitch.textContent.trim());
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
      const active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    if (projectsModeBtn && projectsTable) {
      const verbose = projectsTable.classList.contains('verbose');
      projectsModeBtn.textContent = t(verbose ? 'projects.toggle.on' : 'projects.toggle');
    }
  }

  panels.forEach(panel => {
    panel.addEventListener('mouseenter', () => {
      const tag = document.activeElement.tagName;
      if (tag !== 'A' && tag !== 'BUTTON') panel.focus({ preventScroll: true });
    });
  });

  if (projectsModeBtn && projectsTable) {
    projectsModeBtn.addEventListener('click', () => {
      const verbose = !projectsTable.classList.contains('verbose');
      projectsTable.classList.toggle('verbose', verbose);
      projectsModeBtn.setAttribute('aria-pressed', String(verbose));
      projectsModeBtn.textContent = t(verbose ? 'projects.toggle.on' : 'projects.toggle');
      showToast(t(verbose ? 'toast.verbose.on' : 'toast.verbose.off'));
    });
  }

  if (diagnosticsBtn) {
    let i = 0;
    diagnosticsBtn.addEventListener('click', () => {
      showToast(t(`diag.${i % 4}`));
      i++;
    });
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang !== currentLang) applyLang(lang);
    });
  });

  document.addEventListener('keydown', e => {
    if (document.activeElement.tagName === 'A') return;
    const key = e.key.toLowerCase();
    if      (key === 'v' && projectsModeBtn) projectsModeBtn.click();
    else if (key === 'd' && diagnosticsBtn)  diagnosticsBtn.click();
  });

  updateClock();
  setInterval(updateClock, 10000);
  applyLang(currentLang);

  const profilePanel = document.getElementById('profile');
  if (profilePanel) setTimeout(() => profilePanel.focus(), 100);
  setTimeout(() => showToast(t('toast.init')), 350);

})();