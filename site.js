(() => {
  'use strict';
  const config = window.PRACT_BETA || {};
  const $ = id => document.getElementById(id);
  function safeHttps(value) {
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; } catch { return ''; }
  }
  const candidate = safeHttps(config.repositoryUrl);
  const repo = candidate && /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/.test(candidate) ? candidate.replace(/\/$/,'') : '';
  const email = typeof config.feedbackEmail === 'string' && /^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(config.feedbackEmail) ? config.feedbackEmail : '';
  const install = safeHttps(config.installUrl);
  function link(id, href) { if (!href) return; const node = $(id); node.href = href; node.hidden = false; }
  link('repo-link', repo);
  link('contact-link', email ? 'mailto:' + email : '');
  if (config.invitationsOpen === true && install && email && config.copyrightOwner && repo) {
    link('install-link', install);
    $('launch-status').textContent = 'Small-group beta invitations are open. Review setup, eligibility, and privacy before installing.';
  }
  $('feedback-form').addEventListener('submit', event => {
    event.preventDefault();
    const text = ['Pract beta feedback', 'Type: ' + $('report-type').value,
      'Device / Android: ' + $('device').value.trim(), 'Pract version: ' + $('version').value.trim(),
      'Returned for another session: ' + $('returned').value, '', $('message').value.trim()].join('\n');
    $('report').value = text; $('report-panel').hidden = false;
    if (email) link('send-feedback', 'mailto:' + email + '?subject=' + encodeURIComponent('Pract beta feedback') + '&body=' + encodeURIComponent(text));
    if (repo) link('issue-link', repo + '/issues/new/choose');
    $('feedback-status').textContent = email || repo ? 'Review your report, then choose a destination. Nothing has been sent.' : 'No feedback destination is configured yet. Your report stays on this page until you copy or send it.';
    $('report').focus();
  });
  $('copy-report').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('report').value); $('feedback-status').textContent = 'Report copied. Nothing has been sent.'; }
    catch { $('report').focus(); $('report').select(); $('feedback-status').textContent = 'Use your device’s Copy command to copy the selected report.'; }
  });
})();
