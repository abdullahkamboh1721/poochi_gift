let musicStarted = false;
let recordingStarted = false;
let mediaRecorder;
let recordedChunks = [];
let stream;

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(screenId);
    if (el) el.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    showScreen('loginScreen');

    document.getElementById('enterBtn').addEventListener('click', () => {
        const pw = document.getElementById('passwordInput').value;
        if (pw === 'Poochi') {
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
    setupMemories();
    setupFinale();
});

function startMusic() {
    if (musicStarted) return;
    const iframe = document.getElementById('youtubePlayer');
    iframe.src = iframe.src.replace('autoplay=0', 'autoplay=1');
    musicStarted = true;
    checkAndProceed();
}

async function startRecording() {
    if (recordingStarted) return;
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
        mediaRecorder = new MediaRecorder(stream);
        recordedChunks = [];
        mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
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

const butterflyMessage = "Saba, tumhari yaadon mein sukoon hai.";
function initButterfly() {
    const textDiv = document.getElementById('butterflyText');
    const nextBtn = document.getElementById('butterflyNext');
    let i = 0;
    textDiv.textContent = '';
    nextBtn.style.display = 'none';
    const interval = setInterval(() => {
        if (i < butterflyMessage.length) {
            textDiv.textContent += butterflyMessage[i];
            i++;
        } else {
            clearInterval(interval);
            nextBtn.style.display = 'inline-block';
        }
    }, 200);
}

const compliments = [
    "Tumhari muskurahat din roshan kar deti hai.",
    "Jab tum saath hoti ho, sab aasan lagta hai.",
    "Tumhari aankhon mein ek apnapan hai.",
    "Tumhari awaaz sun kar dil ko sukoon milta hai.",
    "Tumse milkar zindagi aur khoobsurat lagti hai."
];
function setupFlowers() {
    const garden = document.getElementById('flowerGarden');
    garden.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const flower = document.createElement('div');
        flower.className = 'flower';
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

let starsCaught = 0;
function setupStars() {
    const field = document.getElementById('starField');
    starsCaught = 0;
    document.getElementById('starCounter').textContent = '0 / 5';
    field.innerHTML = '';
    for (let i = 0; i < 15; i++) createStar(field);
    setInterval(() => {
        if (document.getElementById('scene4').classList.contains('active') && field.querySelectorAll('.star').length < 10) {
            createStar(field);
        }
    }, 2000);
}
function createStar(field) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 90 + '%';
    star.style.top = Math.random() * -20 + '%';
    star.style.animationDuration = (Math.random() * 3 + 3) + 's';
    star.addEventListener('click', () => {
        if (star.parentNode && document.getElementById('scene4').classList.contains('active')) {
            star.remove();
            starsCaught++;
            document.getElementById('starCounter').textContent = starsCaught + ' / 5';
            if (starsCaught >= 5) {
                document.getElementById('starsNext').style.display = 'inline-block';
            }
        }
    });
    field.appendChild(star);
}

const memories = [
    "Pehli baar jab tumse mila tha, laga jaise pehle se jaanta hoon.",
    "Tumhari choti choti baatein dil ko choo jaati hain.",
    "Jab tum gussa hoti ho, tab bhi pyaari lagti ho.",
    "Har pal tumhare saath yaadgaar hai."
];
function setupMemories() {
    const wall = document.getElementById('memoriesWall');
    wall.innerHTML = '';
    memories.forEach(text => {
        const frame = document.createElement('div');
        frame.className = 'frame';
        frame.textContent = text;
        frame.addEventListener('click', () => alert(text));
        wall.appendChild(frame);
    });
    setTimeout(() => {
        document.getElementById('memoriesNext').style.display = 'inline-block';
    }, 5000);
}

// Finale – Upload to Cloudinary
function setupFinale() {
    document.getElementById('submitFinalBtn').addEventListener('click', async () => {
        const msg = document.getElementById('finalMessage').value;
        if (!msg) return alert('Kuch toh likho... 💌');

        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            mediaRecorder.onstop = async () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                stream.getTracks().forEach(t => t.stop());

                const CLOUD_NAME = "c4zkzlpm";
                const UPLOAD_PRESET = "poochi_gift";

                const VIDEO_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;
                const TEXT_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`;

                try {
                    const videoForm = new FormData();
                    videoForm.append('file', blob, 'recording.webm');
                    videoForm.append('upload_preset', UPLOAD_PRESET);
                    videoForm.append('folder', 'poochi_gift');
                    const vidRes = await fetch(VIDEO_URL, { method: 'POST', body: videoForm });
                    const vidData = await vidRes.json();
                    console.log('Video uploaded:', vidData.secure_url);

                    const textBlob = new Blob([msg], { type: 'text/plain' });
                    const textForm = new FormData();
                    textForm.append('file', textBlob, 'message.txt');
                    textForm.append('upload_preset', UPLOAD_PRESET);
                    textForm.append('folder', 'poochi_gift');
                    const txtRes = await fetch(TEXT_URL, { method: 'POST', body: textForm });
                    const txtData = await txtRes.json();
                    console.log('Message saved:', txtData.secure_url);

                    document.getElementById('uploadStatus').textContent = 'Sab kuch save ho gaya! ❤️';
                    document.getElementById('finaleForm').style.display = 'none';
                    document.getElementById('grandLetter').style.display = 'block';
                    document.getElementById('finaleSky').classList.add('fireworks-effect');
                } catch (error) {
                    alert('Upload failed: ' + error.message);
                }
            };
        } else {
            alert('Recording not active.');
        }
    });
}
