export function initContactForm(formId, statusId) {
    const contactForm = document.getElementById(formId);
    const formStatus = document.getElementById(statusId);

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const submitText = submitBtn.querySelector('span');
            const originalText = submitText.textContent;
            
            submitBtn.disabled = true;
            submitText.textContent = "Sending message...";
            formStatus.textContent = "";
            formStatus.className = "form-status";

            setTimeout(() => {
                submitBtn.disabled = false;
                submitText.textContent = originalText;
                
                formStatus.textContent = "Pesan berhasil terkirim! Terima kasih telah menghubungi Al Hafiz.";
                formStatus.classList.add('success');
                
                contactForm.reset();

                setTimeout(() => {
                    formStatus.textContent = "";
                    formStatus.classList.remove('success');
                }, 5000);
            }, 1800);
        });
    }
}
