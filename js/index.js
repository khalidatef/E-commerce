const images = document.querySelectorAll('.slider-img');
let currentIndex = 0;

// Image slider logic
setInterval(() => {
  images[currentIndex].classList.remove('active');
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].classList.add('active');
}, 3000); // Change image every 3 seconds
