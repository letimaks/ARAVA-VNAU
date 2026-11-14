(() => {
  const REPOSITORY = 'letimaks/Polymath';
  const EXPECTED_ASSET = /^AravaVNAU.*\.zip$/i;
  const $ = (id) => document.getElementById(id);

  async function loadLatestRelease() {
    const state = $('release-state');
    const button = $('download-button');
    state.textContent = 'Перевіряю GitHub…';
    button.classList.add('disabled');
    button.removeAttribute('href');
    button.setAttribute('aria-disabled', 'true');
    try {
      const response = await fetch(`https://api.github.com/repos/${REPOSITORY}/releases/latest`, {
        headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store'
      });
      if (!response.ok) throw new Error(response.status === 404 ? 'Реліз ще не опублікований.' : `GitHub API: ${response.status}`);
      const release = await response.json();
      const asset = (release.assets || []).find((item) => EXPECTED_ASSET.test(item.name));
      $('version').textContent = release.tag_name || 'Остання версія';
      $('release-date').textContent = release.published_at ? new Date(release.published_at).toLocaleDateString('uk-UA') : 'GitHub Release';
      $('release-notes').textContent = release.name || 'Останній стабільний реліз Арава ВНАУ.';
      $('release-link').href = release.html_url || `https://github.com/${REPOSITORY}/releases`;
      if (!asset) throw new Error('Реліз знайдено, але ZIP AravaVNAU*.zip ще не додано до його файлів.');
      button.href = asset.browser_download_url;
      button.classList.remove('disabled');
      button.setAttribute('aria-disabled', 'false');
      $('download-status').textContent = `${asset.name} · ${(asset.size / 1024 / 1024).toFixed(2)} МБ`;
      state.textContent = 'Остання версія доступна';
    } catch (error) {
      state.textContent = 'Очікує публікації релізу';
      $('release-notes').textContent = error.message || 'Не вдалося отримати дані GitHub.';
      $('download-status').textContent = 'Перевір сторінку GitHub Releases.';
      $('release-link').href = `https://github.com/${REPOSITORY}/releases`;
      $('version').textContent = '2.2.7';
    }
  }

  $('refresh-button').addEventListener('click', loadLatestRelease);
  loadLatestRelease();
})();
