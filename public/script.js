const greetingButton = document.querySelector('#greeting-button');
const greetingOutput = document.querySelector('#greeting-output');

function runGreeting() {
  const time = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date());

  greetingOutput.innerHTML = `Hello, world! <span class="output-meta">// ${time}</span><span class="cursor" aria-hidden="true"></span>`;
  greetingButton.querySelector('span').textContent = 'Run it again';
}

greetingButton.addEventListener('click', runGreeting);
