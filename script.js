// Slide elements
const slide1 = document.getElementById("slide-1");
const slide2 = document.getElementById("slide-2");
const slide3 = document.getElementById("slide-3");
const slides = [slide1, slide2, slide3];

// Audio and controls
const loveAudio = document.getElementById("love-audio");
const questionAudio = document.getElementById("question-audio");
const toSlide3Btn = document.getElementById("to-slide-3");

// Valentine question buttons
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const answerText = document.getElementById("answer-text");
const buttonsRow = document.querySelector(".valentine-buttons");
const questionTitle = document.querySelector(".question-title");
const questionSubtitle = document.querySelector(".question-subtitle");

function showSlide(targetId) {
  slides.forEach((s) => {
    if (!s) return;
    if (s.id === targetId) {
      s.classList.add("active");
    } else {
      s.classList.remove("active");
    }
  });

  if (targetId === 'slide-3') {
    initSlide3();
  } else {
    destroySlide3Accents();
  }
}

// initialize slide 3 behaviors (typewriter, ambient pixel accents)
let slide3Initialized = false;
let slide3AccentInterval = null;
let slide3ConfettiInterval = null;
function initSlide3() {
  if (slide3Initialized) return;
  slide3Initialized = true;

  const qTitle = document.querySelector('.question-title');
  const qSubtitle = document.querySelector('.question-subtitle');

  const titleText = qTitle ? qTitle.textContent.trim() : 'Will you be my Valentine!!!!';
  const subtitleText = qSubtitle ? qSubtitle.textContent.trim() : 'Warning: saying yes comes with unlimited hugs.';

  if (qTitle) qTitle.textContent = '';
  if (qSubtitle) qSubtitle.textContent = '';

  // small typewriter helper
  function typewriter(el, text, speed = 40, cb) {
    let i = 0;
    const id = setInterval(() => {
      i++;
      el.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(id);
        if (cb) cb();
      }
    }, speed);
  }

  if (qTitle) {
    typewriter(qTitle, titleText, 60, () => {
      if (qSubtitle) typewriter(qSubtitle, subtitleText, 28);
    });
  }

  // ambient pixel accents popping up softly
  slide3AccentInterval = setInterval(() => {
    const rect = document.getElementById('pixel-main').getBoundingClientRect();
    const x = rect.left + Math.random() * rect.width;
    const y = rect.top + Math.random() * rect.height;
    spawnPixelAccent(x, y);
  }, 900);
  
  // Periodic full-screen confetti bursts on slide 3
  slide3ConfettiInterval = setInterval(() => {
    if (Math.random() > 0.3) {
      fullScreenConfettiBurst();
    }
  }, 8000);
}

function destroySlide3Accents() {
  if (slide3AccentInterval) {
    clearInterval(slide3AccentInterval);
    slide3AccentInterval = null;
  }
  if (slide3ConfettiInterval) {
    clearInterval(slide3ConfettiInterval);
    slide3ConfettiInterval = null;
  }
}

// gently prime audio so it loads a bit earlier
if (loveAudio) {
  loveAudio.preload = "auto";
  loveAudio.load();
}
if (questionAudio) {
  questionAudio.preload = "auto";
  questionAudio.load();
}

// Create floating background hearts periodically
function spawnBackgroundHeart() {
  const heart = document.createElement('div');
  heart.className = 'bg-heart';
  heart.textContent = '♥';
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.fontSize = `${20 + Math.random() * 30}px`;
  const driftX = -100 + Math.random() * 200;
  heart.style.setProperty('--drift-x', driftX);
  heart.style.animationDuration = `${10 + Math.random() * 8}s`;
  document.body.appendChild(heart);
  
  setTimeout(() => heart.remove(), 18000);
}

// Spawn background hearts every few seconds
setInterval(spawnBackgroundHeart, 2000);
// Initial burst
for (let i = 0; i < 5; i++) {
  setTimeout(() => spawnBackgroundHeart(), i * 400);
}

// Random Compliment Generator
const compliments = [
  "You're absolutely gorgeous! 💕",
  "Your smile lights up my world! ✨",
  "You make every day special! 🌟",
  "I'm so lucky to have you! 💖",
  "You're my favorite person ever! 🥰",
  "You're sweeter than candy! 🍬",
  "My heart belongs to you! 💝",
  "You're perfect just the way you are! ⭐",
  "Being with you is magical! ✨",
  "You're the best thing in my life! 💕",
  "Your laugh is my favorite sound! 😊",
  "You make me so happy! 💗",
  "I adore everything about you! 💫",
  "You're incredibly special to me! 🌹"
];

let currentComplimentIndex = 0;

function showNextCompliment() {
  const complimentEl = document.getElementById('compliment-text');
  if (complimentEl && compliments.length > 0) {
    currentComplimentIndex = (currentComplimentIndex + 1) % compliments.length;
    
    // Fade out
    complimentEl.style.opacity = '0';
    complimentEl.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
      complimentEl.textContent = compliments[currentComplimentIndex];
      // Fade in
      complimentEl.style.opacity = '1';
      complimentEl.style.transform = 'scale(1)';
    }, 300);
  }
}

// Change compliment every 4 seconds
setInterval(showNextCompliment, 4000);

// Initial compliment
const complimentEl = document.getElementById('compliment-text');
if (complimentEl) {
  complimentEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  complimentEl.textContent = compliments[0];
}

// Slide 1 -> Slide 2 on click anywhere
if (slide1) {
  slide1.addEventListener("click", () => {
    if (loveAudio) {
      loveAudio.currentTime = 0;
      loveAudio.play().catch(() => {
        // ignore autoplay errors; user can trigger later
      });
    }
    showSlide("slide-2");
  });
}

// Slide 2 -> Slide 3 via heart chip
if (toSlide3Btn) {
  toSlide3Btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (loveAudio) {
      loveAudio.pause();
      loveAudio.currentTime = 0;
    }
    if (questionAudio) {
      questionAudio.currentTime = 0;
      questionAudio.play().catch(() => {
        // ignore autoplay errors
      });
    }
    showSlide("slide-3");
  });
}

// Make the "No" button impossible to click - escapes cursor
let noAttempts = 0;
let yesBtnScale = 1;
if (noBtn && buttonsRow) {
  const yeetAway = (increaseLove = true) => {
    noAttempts++;
    
    // Increase love meter
    if (increaseLove) {
      const loveMeter = document.getElementById('love-meter-fill');
      const loveMeterText = document.getElementById('love-meter-text');
      const noAttemptsText = document.getElementById('no-attempts-text');
      
      const lovePercent = Math.min(noAttempts * 15, 100);
      if (loveMeter) loveMeter.style.width = `${lovePercent}%`;
      if (loveMeterText) loveMeterText.textContent = `${lovePercent}% convinced (just say yes! 💕)`;
      
      // Fun messages
      const messages = [
        "Come on! You know you want to! 💕",
        "The button is getting lonely! 😢",
        "Just click YES already! 😊",
        "I see you trying... 👀",
        "NO is not an option! 💖",
        "YES button is waiting! ✨",
        "You can't resist forever! 😘",
        "Pretty please? 🥺"
      ];
      if (noAttemptsText && noAttempts <= messages.length) {
        noAttemptsText.textContent = messages[noAttempts - 1];
      }
      
      // Grow the Yes button
      yesBtnScale = 1 + (noAttempts * 0.08);
      if (yesBtn) {
        yesBtn.classList.add('grow');
        yesBtn.style.transform = `scale(${yesBtnScale})`;
      }
      
      // Sparkle effect on No button position
      const rect = noBtn.getBoundingClientRect();
      spawnSparkles(rect.left + rect.width/2, rect.top + rect.height/2, 5);
    }
    
    // Calculate escape position away from cursor
    const noBtnRect = noBtn.getBoundingClientRect();
    const btnCenterX = noBtnRect.left + noBtnRect.width / 2;
    const btnCenterY = noBtnRect.top + noBtnRect.height / 2;
    
    // Move away from button center
    const radius = 150 + Math.random() * 150;
    const angle = Math.random() * Math.PI * 2;
    const offsetX = Math.cos(angle) * radius;
    const offsetY = Math.sin(angle) * radius;
    
    noBtn.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${0.9 + Math.random() * 0.2})`;
    noBtn.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    
    // Screen shake effect
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 500);
  };
  
  // Detect mouse getting close to No button
  document.addEventListener('mousemove', (e) => {
    if (!noBtn || buttonsRow.classList.contains('answered')) return;
    
    const rect = noBtn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(e.clientX - btnCenterX, 2) + 
      Math.pow(e.clientY - btnCenterY, 2)
    );
    
    // If cursor gets within 100px, button runs away
    if (distance < 100) {
      yeetAway();
    }
  });

  // move as soon as the pointer hovers it (backup)
  noBtn.addEventListener("pointerenter", () => yeetAway());

  // if she somehow clicks fast, cancel the click and jump again
  noBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    yeetAway();
  });
  
  // Prevent any click from registering
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    yeetAway();
  });
}

// When she clicks "Yes"
if (yesBtn) {
  yesBtn.addEventListener("click", () => {
    if (buttonsRow) {
      buttonsRow.classList.add("answered");
    }
    if (answerText) {
      answerText.classList.add("show");
    }
    
    // Special messages based on attempts
    const loveMeter = document.getElementById('love-meter-fill');
    if (loveMeter) loveMeter.style.width = '100%';
    
    const loveMeterText = document.getElementById('love-meter-text');
    if (loveMeterText) loveMeterText.textContent = '100% LOVE! 💕💕💕';
    
    if (questionTitle) {
      if (noAttempts === 0) {
        questionTitle.textContent = "Yesss! No hesitation! 💕";
      } else if (noAttempts < 3) {
        questionTitle.textContent = "Finally! I knew you'd say yes! 😊";
      } else if (noAttempts < 6) {
        questionTitle.textContent = "Worth the wait! You're mine now! 💖";
      } else {
        questionTitle.textContent = "YES! After all that... I love you! 😍";
      }
    }
    if (questionSubtitle) {
      questionSubtitle.textContent =
        "Get ready for a very cheesy, very lovely Valentine with me.";
    }

    // spawn a little burst of pixel hearts + confetti around the Yes button
    const rect = yesBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    spawnHearts(centerX, centerY, 20);
    spawnConfetti(centerX, centerY - 20, 30);
    
    // Full-screen confetti celebration!
    setTimeout(() => fullScreenConfettiBurst(), 300);
    setTimeout(() => fullScreenConfettiBurst(), 1000);
    setTimeout(() => fullScreenConfettiBurst(), 1700);
    setTimeout(() => fullScreenConfettiBurst(), 2500);

    const pixelMain = document.getElementById("pixel-main");
    if (pixelMain) {
      pixelMain.classList.add("show-final");
    }
  });
}

// Pop confetti if she clicks anywhere on the final window
if (slide3) {
  slide3.addEventListener("click", (e) => {
    const rect = slide3.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;
    spawnConfetti(x, y - 30, 25);
    spawnSparkles(x, y, 8);
    
    // Random chance for full-screen burst
    if (Math.random() > 0.6) {
      fullScreenConfettiBurst();
    }
  });
}

// Add sparkle effect helper
function spawnSparkles(x, y, count) {
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    const offsetX = (Math.random() - 0.5) * 60;
    const offsetY = (Math.random() - 0.5) * 60;
    sparkle.style.left = `${x + offsetX}px`;
    sparkle.style.top = `${y + offsetY}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1100);
  }
}

// create floating pixel hearts
function spawnHearts(x, y, count) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = "♥";

    const offsetX = (Math.random() - 0.5) * 120;
    const offsetY = (Math.random() - 0.3) * 40;

    heart.style.left = `${x + offsetX}px`;
    heart.style.top = `${y + offsetY}px`;

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1500);
  }
}

// small pixel accent pops (tiny block squares that rise)
function spawnPixelAccent(x, y) {
  const piece = document.createElement('div');
  piece.className = 'pixel-acc';
  const size = 8 + Math.round(Math.random() * 8);
  piece.style.width = `${size}px`;
  piece.style.height = `${size}px`;
  piece.style.left = `${x - size/2}px`;
  piece.style.top = `${y - size/2}px`;
  piece.style.background = ['#ff6b8a', '#ff9bb0', '#ffadbf'][Math.floor(Math.random()*3)];
  document.body.appendChild(piece);
  // trigger animate
  requestAnimationFrame(() => piece.classList.add('animate'));
  setTimeout(() => piece.remove(), 1200);
}

// create flying red confetti pieces (poppers) - enhanced for full screen
function spawnConfetti(x, y, count, fullScreen = false) {
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    
    // Random confetti types
    const types = ['alt', 'heart', 'circle', 'square'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    piece.classList.add(randomType);

    const spread = fullScreen ? window.innerWidth * 0.6 : 160;
    const dx = (Math.random() - 0.5) * spread;
    const dy = fullScreen ? 300 + Math.random() * 400 : 120;
    const rotate = Math.random() * 720 - 360;

    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    piece.style.setProperty("--dx", `${dx}px`);
    piece.style.setProperty("--dy", `${dy}px`);
    piece.style.setProperty("--rotate", `${rotate}deg`);

    document.body.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 2100);
  }
}

// Full-screen confetti burst from random top positions
function fullScreenConfettiBurst() {
  const positions = 5;
  for (let i = 0; i < positions; i++) {
    const x = (window.innerWidth / (positions + 1)) * (i + 1);
    const y = -20;
    setTimeout(() => {
      spawnConfetti(x, y, 25, true);
    }, i * 100);
  }
}
