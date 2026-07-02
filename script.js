let musicStarted = false;
let recordingStarted = false;
let mediaRecorder;
let recordedChunks = [];
let stream;

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
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
        // Lower bitrate to keep file size small
        const options = { mimeType: 'video/webm; codecs=vp8', videoBitsPerSecond: 500000 };
        mediaRecorder = new MediaRecorder(stream, options);
        recordedChunks = [];
        mediaRecorder.ondataavailable = e => recordedChunks.push(e.data);
        mediaRecorder.start();
        recordingStarted = true;
        document.getElementById('recordStatus').textContent = 'Recording... 📹';
        checkAndProceed();
    } catch (err) {
        alert('Please allow camera access! 🙏');
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
const butterflyMessage = "Saba, aapki yaadon mein sukoon hai.";
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
    "Aapki muskurahat din roshan kar deti hai.",
    "Jab aap saath hoti hain, sab aasan lagta hai.",
    "Aapki aankhon mein ek apnapan hai.",
    "Aapki awaaz sun kar dil ko sukoon milta hai.",
    "Aapse milkar zindagi aur khoobsurat lagti hai."
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

// Hearts
function setupHearts() {
    const area = document.getElementById('heartsArea');
    const heartSymbols = ['❤️','💖','💝','💕','💗','💓','💞','💌','💟','❣️','💔','💋'];
    area.innerHTML = '';
    for (let i=0;i<12;i++) {
        const h = document.createElement('span'); h.className = 'heart';
        h.textContent = heartSymbols[i];
        h.addEventListener('click', () => {
            h.classList.add('found');
            if ([...document.querySelectorAll('.heart')].every(hh => hh.classList.contains('found')))
                document.getElementById('heartsNext').style.display = 'inline-block';
        });
        area.appendChild(h);
    }
}

// Memories
const memories = [
    "Pehli baar jab aapse mila tha, laga jaise pehle se jaanta hoon.",
    "Aapki choti choti baatein dil ko choo jaati hain.",
    "Jab aap gussa hoti hain, tab bhi pyaari lagti hain.",
    "Har pal aapke saath yaadgaar hai."
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

// Finale – Upload via Netlify Function (Base64 video, reduced size)
function setupFinale() {
    document.getElementById('submitFinalBtn').addEventListener('click', async () => {
        const msg = document.getElementById('finalMessage').value;
        if (!msg) return alert('Kuch toh likho... 💌');

        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            mediaRecorder.onstop = async () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                stream.getTracks().forEach(t => t.stop());

                // Convert to base64
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = async () => {
                    const videoBase64 = reader.result;
                    try {
                        const res = await fetch('/api/upload', {
                            method: 'POST',
                            body: JSON.stringify({ video: videoBase64, message: msg }),
                            headers: { 'Content-Type': 'application/json' }
                        });
                        const data = await res.json();
                        if (data.videoUrl) {
                            document.getElementById('uploadStatus').textContent = 'Sab kuch save ho gaya! ❤️';
                            document.getElementById('finaleForm').style.display = 'none';
                            document.getElementById('grandLetter').style.display = 'block';
                            document.getElementById('finaleSky').classList.add('fireworks-effect');
                            document.getElementById('letterContent').innerHTML =
                                "Har subah sirf aapki yaad aati hai.<br>Jab aap door hoti ho toh har pal adhoora lagta hai. Aap meri zindagi ki sabse khoobsurat kahani hain. Har khushi mein aapka saath chahiye, har mushkil mein aapka haath thaamna chahta hoon. I miss you more than words can say.<br><br>You are my forever.";
                        } else {
                            alert('Upload failed: ' + (data.error || 'Unknown error'));
                        }
                    } catch (e) {
                        alert('Upload error: ' + e.message);
                    }
                };
            };
        } else {
            alert('Recording not active.');
        }
    });
}
