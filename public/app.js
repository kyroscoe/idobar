const form = document.querySelector('#inquiry-form');
if (form) {
  const result = document.querySelector('#form-result');
  const submit = form.querySelector('button[type="submit"]');
  let submitting = false;
  const announce = (message, state) => {
    result.textContent = message;
    result.dataset.state = state;
    result.focus();
  };
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;
    // The static development server cannot process Netlify Forms.
    if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) || location.hostname.endsWith('.localhost')) {
      announce('This local preview cannot send inquiries. Please use the deployed website, email Buckeyebartendingohio@gmail.com, or call 740-707-1821. Nothing has been sent.', 'error');
      return;
    }
    submitting = true;
    submit.disabled = true;
    submit.textContent = 'Sending...';
    form.setAttribute('aria-busy', 'true');
    result.dataset.state = 'pending';
    result.textContent = 'Sending your inquiry...';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      });
      if (!response.ok) throw new Error('Submission not confirmed');
      form.reset();
      announce('Thank you! Your inquiry has been received. Your date is not reserved until booking is confirmed.', 'success');
    } catch {
      announce('We could not confirm your inquiry was received. Your details are still here. Please try again, email Buckeyebartendingohio@gmail.com, or call 740-707-1821.', 'error');
    } finally {
      submitting = false;
      submit.disabled = false;
      submit.textContent = 'Send Inquiry';
      form.removeAttribute('aria-busy');
    }
  });
}
