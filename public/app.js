const form = document.querySelector('#inquiry-form');
if (form) {
  form.hidden = false;
  const review = document.querySelector('#email-review');
  const preview = document.querySelector('#inquiry-preview');
  const draft = document.querySelector('#email-draft');
  const status = document.querySelector('#copy-status');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const get = key => String(data.get(key) || '').trim();
    const body = `Hello I Do Bar Co.,\n\nI’d love to ask about availability and bar service.\n\nName: ${get('name')}\nEmail: ${get('email')}\nEvent date: ${get('date') || 'Still deciding'}\nEstimated guests: ${get('guests') || 'Still deciding'}\nVenue / location: ${get('venue') || 'Still deciding'}\n\n${get('message')}\n\nThank you!`;
    preview.textContent = body;
    draft.href = `mailto:Buckeyebartendingohio@gmail.com?subject=${encodeURIComponent('Bar service inquiry' + (get('date') ? ' · ' + get('date') : ''))}&body=${encodeURIComponent(body)}`;
    status.textContent = '';
    form.hidden = true;
    review.hidden = false;
    review.focus();
  });
  document.querySelector('#edit-inquiry').addEventListener('click', () => {
    review.hidden = true;
    form.hidden = false;
    form.querySelector('input').focus();
  });
  document.querySelector('#copy-inquiry').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(preview.textContent);
      status.textContent = 'Copied. Paste into your email app, review, and send.';
    } catch {
      status.textContent = 'Copy is unavailable here. Select the inquiry text above and copy it manually.';
    }
  });
}
