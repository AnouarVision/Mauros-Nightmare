document.addEventListener('DOMContentLoaded', () => {
  // Redireziona alla home se è scaduto il tempo (timeout)
  const timeoutMessage = document.getElementById('timeout-message');
  if (timeoutMessage) {
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  }
});
