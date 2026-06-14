// 히어로 배경 영상 소리 토글 (자동재생은 음소거 상태에서만 허용됨)
(function () {
  var video = document.querySelector('.hero-video');
  var btn = document.getElementById('heroSound');
  if (!video || !btn) return;

  function render() {
    btn.textContent = video.muted ? '🔇' : '🔊';
    btn.setAttribute('aria-label', video.muted ? '소리 켜기' : '소리 끄기');
    btn.title = video.muted ? '소리 켜기' : '소리 끄기';
  }

  btn.addEventListener('click', function () {
    video.muted = !video.muted;
    if (!video.muted) { video.volume = 1; video.play().catch(function () {}); }
    render();
  });

  render();
})();

// 모바일 햄버거 메뉴
(function () {
  var header = document.getElementById('header');
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  if (!header || !toggle || !nav) return;

  function setOpen(open) {
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  }

  toggle.addEventListener('click', function () {
    setOpen(!header.classList.contains('nav-open'));
  });

  // 메뉴 항목 클릭 시 닫기
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  // 데스크탑 크기로 넓어지면 닫기
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) setOpen(false);
  });
})();

// 상담신청 폼 — 동의 펼치기 + 검증/제출
(function () {
  var toggle = document.getElementById('consentToggle');
  var body = document.getElementById('consentBody');
  if (toggle && body) {
    toggle.addEventListener('click', function () {
      var open = body.hidden;
      body.hidden = !open;
      toggle.textContent = open ? '닫기' : '자세히보기';
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  var form = document.getElementById('leadForm');
  var result = document.getElementById('formResult');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var agree = document.getElementById('agree');
    var name = document.getElementById('lfName');
    var region = document.getElementById('lfRegion');
    var phone = document.getElementById('lfPhone');

    [name, region, phone].forEach(function (f) { f.classList.remove('lf-error'); });
    result.hidden = true; result.className = 'lf-result';

    function fail(msg, field) {
      result.hidden = false; result.classList.add('err'); result.textContent = msg;
      if (field) { field.classList.add('lf-error'); field.focus(); }
    }

    if (!agree.checked) return fail('개인정보 수집 및 이용에 동의해 주세요.');
    if (!name.value.trim()) return fail('성함을 입력해 주세요.', name);
    if (!region.value.trim()) return fail('활동지역을 입력해 주세요.', region);
    if (!/[0-9]{9,}/.test(phone.value.replace(/[^0-9]/g, ''))) return fail('연락처를 정확히 입력해 주세요.', phone);

    // TODO: 실제 DB 저장은 백엔드(Formspree/구글시트/이메일 등) 연동 필요
    result.hidden = false; result.classList.add('ok');
    result.textContent = '상담 신청이 접수되었습니다. 빠른 시일 내 연락드리겠습니다.';
    form.reset();
    if (body) { body.hidden = true; if (toggle) toggle.textContent = '자세히보기'; }
  });
})();

// 후기 캐러셀 (좌우 슬라이드)
(function () {
  var track = document.getElementById('reviewTrack');
  var prev = document.getElementById('revPrev');
  var next = document.getElementById('revNext');
  if (!track || !prev || !next) return;

  function step() {
    var card = track.querySelector('.review-card');
    if (!card) return track.clientWidth;
    var gap = parseInt(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 20, 10) || 20;
    return card.offsetWidth + gap;
  }

  function update() {
    var maxScroll = track.scrollWidth - track.clientWidth - 8;
    prev.disabled = track.scrollLeft <= 8;
    next.disabled = track.scrollLeft >= maxScroll;
  }

  prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
  next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
