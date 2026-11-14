(() => {
  const REPOSITORY = 'letimaks/ARAVA-VNAU';
  const EXPECTED_ASSET = /^AravaVNAU.*\.zip$/i;
  const CHROME_STORE_URL = ''; // Set this after the item is published in Chrome Web Store.
  const $ = (id) => document.getElementById(id);
  async function loadLatestRelease() {
    const state = $('release-state'), button = $('download-button');
    state.textContent = 'Перевіряю GitHub…';
    button.classList.add('disabled'); button.removeAttribute('href'); button.setAttribute('aria-disabled','true');
    try {
      const response = await fetch(`https://api.github.com/repos/${REPOSITORY}/releases/latest`, {
        headers:{Accept:'application/vnd.github+json'}, cache:'no-store'
      });
      if (!response.ok) throw new Error(response.status===404 ? 'ZIP ще не опублікований у GitHub Releases.' : `GitHub API: ${response.status}`);
      const release = await response.json();
      const asset = (release.assets||[]).find(item=>EXPECTED_ASSET.test(item.name));
      $('version').textContent = (release.tag_name||'v2.2.7').replace(/^v/i,'');
      $('release-date').textContent = release.published_at ? new Date(release.published_at).toLocaleDateString('uk-UA') : 'GitHub Release';
      $('release-notes').textContent = release.name || 'Останній реліз Арава ВНАУ.';
      $('release-link').href = release.html_url || `https://github.com/${REPOSITORY}/releases`;
      if (!asset) throw new Error('Реліз є, але ZIP AravaVNAU*.zip не прикріплений до нього.');
      button.href = asset.browser_download_url; button.classList.remove('disabled'); button.setAttribute('aria-disabled','false');
      $('download-status').textContent = `${asset.name} · ${(asset.size/1024/1024).toFixed(2)} МБ`;
      state.textContent = 'Остання версія доступна';
    } catch(error) {
      state.textContent = 'Очікує публікації ZIP';
      $('release-notes').textContent = error.message || 'Не вдалося отримати дані GitHub.';
      $('download-status').textContent = 'Створи GitHub Release і додай AravaVNAU_2_2_7.zip.';
      $('release-link').href = `https://github.com/${REPOSITORY}/releases/new?tag=v2.2.7`;
      $('version').textContent = '2.2.7';
    }
    const store=$('store-button');
    if (CHROME_STORE_URL) {
      store.href=CHROME_STORE_URL; store.classList.remove('disabled'); store.setAttribute('aria-disabled','false');
      $('store-status').textContent='Розширення опубліковане. Натисни «Додати в Chrome».';
    }
  }
  $('refresh-button').addEventListener('click',loadLatestRelease);
  loadLatestRelease();
})();