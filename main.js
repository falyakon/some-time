import './style.css';

gsap.registerPlugin(ScrollTrigger);
let revealAnimations = [];

// Mouse movement interaction
document.addEventListener('DOMContentLoaded', () => {
  const interBubble = document.querySelector('.interactive');
  let curX = 0;
  let curY = 0;
  let tgX = 0;
  let tgY = 0;

  function move() {
    curX += (tgX - curX) / 20;
    curY += (tgY - curY) / 20;
    interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
    requestAnimationFrame(move);
  }

  window.addEventListener('mousemove', (event) => {
    tgX = event.clientX;
    tgY = event.clientY;
  });

  // Mobile touch event
  window.addEventListener('touchmove', (event) => {
    tgX = event.touches[0].clientX;
    tgY = event.touches[0].clientY;
  });  

  move();
});

// Scroll setup
const lenis = new Lenis({
  lerp: 0.07
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

  // Get the audio element
  const audio = document.getElementById('background-music');

  // Add event listener to play audio on touch or click
  document.addEventListener('touchstart', () => {
    audio.play();
  });

  document.addEventListener('click', () => {
    audio.play();
  });

  // Prevents multiple plays if the user taps multiple times quickly
  audio.addEventListener('play', () => {
    document.removeEventListener('touchstart', () => {
      audio.play();
    });
    document.removeEventListener('click', () => {
      audio.play();
    });
  });
  
// Reveal animations
const revealText = document.querySelectorAll('.reveal');

revealText.forEach(text => {
  // Split text
  let splitText = new SplitType(text, {
    type: 'words'
  });

  // Animation for words reveal
  const section = text.closest('section');
  gsap.from(splitText.words, {
    opacity: 0,
    ease: 'none',
    stagger: 1,
    duration: 5,
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * 5}px`,
      scrub: true,
      pin: true,
      onComplete: () => {
        // Add scroll listener after the poem is fully revealed
        window.addEventListener('scroll', onScrollAfterReveal);
      }
    }
  });
});

// Function to handle scroll after the poem is fully revealed
function onScrollAfterReveal() {
  const poemContainer = document.querySelector('.container');
  const endMessage = document.querySelector('.end-message');

  // Fade out the poem and display the end message
  gsap.to(poemContainer, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      // Show end message
      endMessage.style.display = 'flex'; // or 'block' based on your CSS
      gsap.fromTo(endMessage, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    }
  });

  // Remove the scroll event listener to prevent repeated actions
  window.removeEventListener('scroll', onScrollAfterReveal);
}

// Animate background gradient starting with saturate(0)
const gradientBg = document.querySelector('.gradient-bg');
gsap.fromTo(gradientBg, {
  filter: 'saturate(0)', // Starting filter value
}, {
  filter: 'saturate(1)', // Ending filter value
  ease: 'none',
  scrollTrigger: {
    trigger: '.reveal',
    start: 'top top',
    end: () => `+=${window.innerHeight * 5}px`,
    scrub: true,
  }
});

// Instruction message functionality
const instructionMessage = document.querySelector('.instruction-message');
let messageVisible = true;

// Hide the message on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 0 && messageVisible) {
    instructionMessage.classList.add('hidden');
    messageVisible = false; // Update visibility state
  } else if (window.scrollY === 0 && !messageVisible) {
    instructionMessage.classList.remove('hidden');
    messageVisible = true; // Update visibility state
  }
});

