let currentStep = 0;
const steps = document.querySelectorAll('.form-step');
const bgMusic = document.getElementById("bgMusic");
const toggleBtn = document.getElementById("toggleMusicBtn");
const scriptURL = 'https://script.google.com/macros/s/AKfycbxDg2JNDpIVPvAXu6-fewBeGhnFYSQ5gDpI2t8ky3Sb3snn5JvtxxTFU-2qjL8UEAcJYw/exec';
const form = document.forms['feedback-form'];

function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
  });
}

function nextStep() {
  const inputs = steps[currentStep].querySelectorAll("input[required]");
  for (const input of inputs) {
    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }
  }
  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

function startProtocol() {
  document.getElementById('landing').style.display = 'none';
  document.getElementById('formContainer').style.display = 'block';
  bgMusic.muted = false;
  bgMusic.play().catch(() => {}); // suppress autoplay error
  toggleBtn.innerText = "🔊 Music On";
  showStep(currentStep);
}

function toggleMusic() {
  if (bgMusic.muted) {
    bgMusic.muted = false;
    bgMusic.play().catch(() => {});
    toggleBtn.innerText = "🔊 Music On";
  } else {
    bgMusic.muted = true;
    bgMusic.pause();
    toggleBtn.innerText = "🔇 Music Off";
  }
}

function submitForm(event) {
  event.preventDefault();

  const form = document.forms['feedback-form'];
  const formData = new FormData(form);

  // Get all checked domains
  const domainCheckboxes = document.querySelectorAll('input[name="domains"]:checked');
  const selectedDomains = Array.from(domainCheckboxes).map(cb => cb.value).join(', ');
  formData.append("domains", selectedDomains);

  fetch(scriptURL, {
    method: 'POST',
    body: formData
  })
  .then(() => {
    console.log("✅ Data sent to Google Sheet!");
    currentStep++; // move to thank-you screen
    showStep(currentStep);
    
    // 🔁 Do NOT redirect or reset
    // form.reset(); // <-- removed on your request
  })
  .catch(error => {
    console.error('❌ Submission failed:', error);
    alert("Something went wrong. Please try again.");
  });
}
