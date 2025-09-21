
console.log("MCQ AI Helper content script loaded");


function showOnlyCorrect() {
  
  const correct = document.querySelector('.correct, [data-correct="true"]');
  if (correct) {
    const container = correct.closest('.options, .answers') || correct.parentElement;
    if (container) {
      Array.from(container.children).forEach(child => {
        if (child !== correct) child.style.display = 'none';
        else {
          child.style.display = '';
          child.style.fontWeight = '700';
          child.style.border = '2px solid #2b8aef';
          child.style.borderRadius = '6px';
        }
      });
    }
    return;
  }


  const keyEl = document.querySelector('#answerKey, .answer-key, .correct-answer');
  if (keyEl) {
    const keyText = keyEl.textContent.trim();
    let token = keyText.split('.').slice(1).join('.').trim() || keyText;

    const options = document.querySelectorAll('.option, .choice, .answer, label');
    let matched = null;

    options.forEach(opt => {
      const text = opt.textContent.trim();
      if (text.includes(token) || text.includes(keyText)) {
        matched = opt;
      }
    });

    if (matched) {
      const container = matched.closest('.options, .answers') || matched.parentElement;
      Array.from(container.children).forEach(child => {
        if (child !== matched) child.style.display = 'none';
        else {
          child.style.display = '';
          child.style.background = '#f0f8ff';
          child.style.fontWeight = '700';
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', showOnlyCorrect);
