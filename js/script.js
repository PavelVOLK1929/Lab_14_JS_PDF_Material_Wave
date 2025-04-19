document.addEventListener('DOMContentLoaded', () => {

    
    // Настройка наблюдателя за изменениями
    setupMutationObserver();
    
    // Настройка кнопки скачивания
    setupDownloadButton();
});



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