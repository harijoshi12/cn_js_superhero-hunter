// Function to show toast with dynamic message
export const showToast = (message) => {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.style.visibility = 'visible';
  setTimeout(() => {
    toast.style.visibility = 'hidden';
  }, 3000);
};

// Function to toggle loader
export const toggleLoader = (display) => {
  document.getElementById('loader').style.display = display ? 'block' : 'none';
};
