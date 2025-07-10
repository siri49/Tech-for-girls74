// Get DOM elements
const whatsappBtn = document.getElementById('whatsappBtn');
const shareCountText = document.getElementById('shareCount');
const shareMessage = document.getElementById('shareMessage');
const submitBtn = document.getElementById('submitBtn');
const form = document.getElementById('registrationForm');
const submissionMessage = document.getElementById('submissionMessage');

// Constants
const maxShares = 5;
const whatsappMessage = encodeURIComponent("Hey Buddy, Join Tech For Girls Community");

// Local storage keys
const shareCountKey = 'tfg_share_count';
const submittedKey = 'tfg_submitted';

// Initialize share count from localStorage or 0
let shareCount = parseInt(localStorage.getItem(shareCountKey)) || 0;
updateShareCountUI();

// Check if already submitted
if (localStorage.getItem(submittedKey) === 'true') {
  disableFormAfterSubmit();
}

// WhatsApp Share Button Click Handler
whatsappBtn.addEventListener('click', () => {
  if (shareCount < maxShares) {
    // Open WhatsApp share URL in new tab
    const url = `https://wa.me/?text=${whatsappMessage}`;
    window.open(url, '_blank');

    shareCount++;
    localStorage.setItem(shareCountKey, shareCount);
    updateShareCountUI();

    if (shareCount === maxShares) {
      shareMessage.classList.remove('hidden');
      submitBtn.disabled = false;  // Enable submit button after 5 shares
    }
  }
});

function updateShareCountUI() {
  shareCountText.textContent = `Click count: ${shareCount}/${maxShares}`;
  if (shareCount < maxShares) {
    submitBtn.disabled = true;
    shareMessage.classList.add('hidden');
  }
}

// Form submit handler
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (shareCount < maxShares) {
    alert('Please share on WhatsApp 5 times before submitting.');
    return;
  }

  submitBtn.disabled = true;
  whatsappBtn.disabled = true;

  // Collect form data
  const formData = new FormData(form);

  // Upload file & save other data to Google Sheets
  try {
    // 1. Upload file to somewhere (e.g., Google Drive, Imgur, or your own backend)
    // For this example, we just simulate this step.

    // Simulate file upload URL (You should replace this with actual upload logic)
    const file = formData.get('screenshot');
    const fileName = file.name;

    // Prepare data for Google Apps Script Web App
    const dataToSend = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      college: formData.get('college'),
      screenshotName: fileName,
      timestamp: new Date().toISOString()
    };

    // Send data to Google Apps Script Web App URL
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbypFe-Ez1CS6scl6EOgoSQxrChD-QPuSIft1Vezkl0RljCygLDZ_iG3-4_TpyVfcYEDvg/exec'; // Replace with your URL

    const response = await fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors', // Depending on your GAS setup
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend)
    });

    // If success
    localStorage.setItem(submittedKey, 'true');
    disableFormAfterSubmit();
    submissionMessage.textContent = '🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!';
    submissionMessage.classList.remove('hidden');

  } catch (error) {
    alert('Submission failed. Please try again.');
    submitBtn.disabled = false;
    whatsappBtn.disabled = false;
  }
});

function disableFormAfterSubmit() {
  // Disable all inputs and buttons
  [...form.elements].forEach(el => el.disabled = true);
  submitBtn.disabled = true;
  whatsappBtn.disabled = true;
}
