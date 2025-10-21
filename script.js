// Handle download clicks: show countdown, trigger download, show thank-you and fallback link

const downloadLinks = document.querySelectorAll('.download-link');
const modal = document.getElementById('download-modal');
const modalText = document.getElementById('modal-text');
const countdownEl = document.getElementById('countdown');
const fallback = document.getElementById('fallback');
const fallbackLink = document.getElementById('fallback-link');
const modalClose = document.getElementById('modal-close');

let countdownTimer = null;

function openModal() {
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    fallback.style.display = 'none';
    clearInterval(countdownTimer);
}

modalClose.addEventListener('click', closeModal);

downloadLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const url = link.getAttribute('href');
        const name = link.dataset.filename || url.split('/').pop();

        modalText.textContent = `Preparing your download: ${name}`;
        openModal();

        // start 5-second countdown
        let seconds = 5;
        countdownEl.textContent = `Starting download in ${seconds}...`;

        // set fallback link target
        fallbackLink.href = url;

        countdownTimer = setInterval(() => {
            seconds -= 1;
            if (seconds > 0) {
                countdownEl.textContent = `Starting download in ${seconds}...`;
            } else {
                clearInterval(countdownTimer);
                countdownEl.textContent = `Download should begin now.`;

                // try programmatic download
                const a = document.createElement('a');
                a.href = url;
                a.download = name;
                document.body.appendChild(a);
                a.click();
                a.remove();

                // show thank-you and fallback
                modalText.textContent = `Thank you — your download of ${name} started.`;
                fallback.style.display = 'block';
            }
        }, 1000);
    });
});

// close modal when clicking outside modal content
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// enhance fallback link to force download when clicked
fallbackLink.addEventListener('click', (e) => {
    e.preventDefault();
    const url = fallbackLink.getAttribute('href');
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop();
    document.body.appendChild(a);
    a.click();
    a.remove();
});
