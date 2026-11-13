document.querySelectorAll('button[data-copy]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(button.dataset.copy);
    button.textContent = 'copied';
    setTimeout(() => (button.textContent = 'copy'), 1200);
  });
});
