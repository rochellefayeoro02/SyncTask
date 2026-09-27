const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  navigation.classList.toggle('open', !expanded);
});

navigation.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });

});

const dialog = document.querySelector('#plan-dialog');
document.querySelectorAll('[data-plan]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('#dialog-title').textContent = `Your ${button.dataset.plan} plan`;
    dialog.showModal();
  });
});
dialog.querySelectorAll('.close, .close-dialog').forEach(button => {
  button.addEventListener('click', () => dialog.close());
});
const insightsButton = document.querySelector('#insights-toggle');
const insights = document.querySelector('#insights');
insightsButton.addEventListener('click', () => {
  insights.hidden = !insights.hidden;
  insightsButton.setAttribute('aria-expanded', String(!insights.hidden));
  insightsButton.textContent = insights.hidden ? 'Explore detailed stats ↗' : 'Hide detailed stats ↑';
});
