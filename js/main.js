document.addEventListener('DOMContentLoaded', () => {
  // Инициализация ripple эффекта
  initRippleEffects();
  
  // Восстановление сохраненных данных
  restoreSavedData();
  
  // Настройка наблюдателя за изменениями
  setupMutationObserver();
  
  // Настройка кнопки скачивания
  setupDownloadButton();
});

function initRippleEffects() {
  document.querySelectorAll('.editable, .download-btn').forEach(element => {
      element.addEventListener('click', function(e) {
          const rect = this.getBoundingClientRect();
          const ripple = document.createElement('div');
          ripple.className = 'ripple-effect';
          
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size/2;
          const y = e.clientY - rect.top - size/2;
          
          ripple.style.width = ripple.style.height = `${size}px`;
          ripple.style.left = `${x}px`;
          ripple.style.top = `${y}px`;
          
          this.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
      });
  });
}

function restoreSavedData() {
  document.querySelectorAll('.editable').forEach(element => {
      const key = element.classList[1] || 'default';
      const savedData = localStorage.getItem(key);
      if (savedData) {
          element.innerHTML = savedData;
      }
  });
}

function setupMutationObserver() {
  const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
          if (mutation.type === 'characterData' || mutation.type === 'childList') {
              const target = mutation.target.closest('.editable');
              if (target) {
                  const key = target.classList[1] || 'default';
                  localStorage.setItem(key, target.innerHTML);
              }
          }
      });
  });

  document.querySelectorAll('.editable').forEach(element => {
      observer.observe(element, {
          characterData: true,
          subtree: true,
          childList: true
      });
  });
}

function setupDownloadButton() {
  document.getElementById('downloadBtn').addEventListener('click', async () => {
      try {
          const resumeElement = document.getElementById('resume');
          const canvas = await html2canvas(resumeElement, {
              scale: 2,
              useCORS: true
          });
          
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
          const imgWidth = pdf.internal.pageSize.getWidth();
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          pdf.save('resume.pdf');
      } catch (error) {
          console.error('Ошибка генерации PDF:', error);
          alert('Произошла ошибка при генерации PDF');
      }
  });
}