const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1 confused
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 pleading
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 sad
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying runaway
]

const noMessages = [
    "Không",
    "Chắc chưa á? 🤔",
    "Thật sự không muốn à... 🥺",
    "Mình sẽ buồn lắm đấy...",
    "Đừng ấn nữa mà 😢",
    "Đi mà??? 💔",
    "Đố em bắt được anh =)))"
]

const yesTeasePokes = [
    "Thử ấn Không trước xem... có điều bất ngờ đấy 😏",
    "Ấn thử nút Không một lần xem sao 👀",
    "Không ấn là tiếc ráng chịu 😈",
    "Đố dám ấn Không 😏"
]

let yesTeasedCount = 0

let noClickCount = 0
let runawayEnabled = false
let musicPlaying = false

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Autoplay: audio starts muted (bypasses browser policy), unmute immediately
music.muted = true
music.volume = 0.3
music.play().then(() => {
    music.muted = false
}).catch(() => {
    // Fallback: unmute on first interaction
    document.addEventListener('click', () => {
        music.muted = false
        music.play().catch(() => {})
    }, { once: true })
})

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    if (!runawayEnabled) {
        // Tease her to try No first
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    window.location.href = 'yes.html'
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
    noClickCount++

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // --- ĐOẠN 1: SỬA KÍCH THƯỚC NÚT "YES" TRÊN MOBILE ---
    // Grow the Yes button bigger each time (Giới hạn kích thước trên mobile)
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    
    // Giới hạn font chữ to nhất là khoảng 80px
    const newSize = Math.min(currentSize * 1.35, 80)
    yesBtn.style.fontSize = `${newSize}px`
    
    // Giới hạn padding để nút không bị phình quá to
    const padY = Math.min(18 + noClickCount * 5, 40) 
    const padX = Math.min(45 + noClickCount * 10, 80)
    yesBtn.style.padding = `${padY}px ${padX}px`
    
    // Đảm bảo nút không bao giờ vượt quá chiều rộng màn hình (90% width)
    yesBtn.style.maxWidth = '90vw'
    yesBtn.style.wordWrap = 'break-word'
    // --- KẾT THÚC ĐOẠN 1 ---

    // Shrink No button to contrast
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // Swap cat GIF through stages
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // --- ĐOẠN 2: SỬA ĐIỀU KIỆN BAY NHẢY CHỈ CHẠY KHI ĐẾN CÂU CUỐI CÙNG ---
    // Lấy vị trí của câu thoại cuối cùng trong danh sách của bạn
    const lastMessageIndex = noMessages.length - 1;

    // Runaway (bay nhảy) chỉ bắt đầu khi Phương Anh đã nhìn thấy câu thoại cuối cùng
    if (noClickCount >= lastMessageIndex && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
    // --- KẾT THÚC ĐOẠN 2 ---
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway)
}

function runAway(e) {
    // Nếu là thao tác chạm trên điện thoại, chặn ngay cú "Ghost Click"
    if (e) {
        e.preventDefault() 
    }

    const margin = 20
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const randomX = Math.random() * maxX + margin / 2
    const randomY = Math.random() * maxY + margin / 2

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '50'
}
