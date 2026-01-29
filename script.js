document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SETUP & MÀN HÌNH CHÀO ---
    const splash = document.getElementById('splash-screen');
    const enterBtn = document.getElementById('enter-btn');
    const audio = document.getElementById('audio');
    const musicBtn = document.getElementById('music-btn');

    // Mặc định ẩn loader cũ đi vì đã có Splash Screen thay thế
    const loader = document.getElementById('loader');
    if(loader) loader.style.display = 'none';

    // Bắt sự kiện bấm nút "VÀO NHÀ"
    if(enterBtn) {
        enterBtn.addEventListener('click', () => {
            // 1. Ẩn màn hình chào
            splash.classList.add('hide-splash');
            
            // 2. Kích hoạt nhạc (Quan trọng)
            audio.play().then(() => {
                musicBtn.classList.add('playing');
                // Hiện nút nhạc
                musicBtn.style.opacity = '1';
            }).catch(e => {
                console.log("Trình duyệt vẫn chặn (hiếm): " + e);
                // Vẫn hiện nút nhạc để người dùng tự bật
                musicBtn.style.opacity = '1';
            });

            // 3. Chạy hiệu ứng khởi động
            AOS.init({ disable: 'mobile', duration: 1000 });
        });
    }

    // Nút nhạc (Bật/Tắt thủ công)
    musicBtn.addEventListener('click', () => {
        if(audio.paused) {
            audio.play();
            musicBtn.classList.add('playing');
        } else {
            audio.pause();
            musicBtn.classList.remove('playing');
        }
    });

    window.toggleMenu = () => document.getElementById('nav-overlay').classList.toggle('open');

    // 3. COUNTDOWN
    const tet = new Date('Feb 17, 2026 00:00:00').getTime();
    setInterval(() => {
        const now = new Date().getTime(), d = tet - now;
        if(d<0) return;
        document.getElementById('d').innerText = Math.floor(d/(1000*60*60*24));
        document.getElementById('h').innerText = Math.floor((d%(1000*60*60*24))/(1000*60*60));
        document.getElementById('m').innerText = Math.floor((d%(1000*60*60))/(1000*60));
        document.getElementById('s').innerText = Math.floor((d%(1000*60))/1000);
    }, 1000);

    // 4. GAME LOGIC
    window.setGame = (id) => {
        document.querySelectorAll('.game-scene').forEach(e => e.classList.remove('active'));
        document.getElementById('game-'+id).classList.add('active');
        document.querySelectorAll('.g-btn').forEach(b => b.classList.remove('active'));
        event.currentTarget.classList.add('active');
    }

    // XIN XĂM (DATABASE 100 QUẺ)
    const fortuneData = [
        { type: "Thượng Thượng", verse: "Khai thiên khai địa tác lương duyên / Cát lợi xương thời vạn vật nguyên.", text: "Đại cát đại lợi. Cầu danh đắc danh, cầu tài đắc tài. Gia đạo an vui." },
        { type: "Đại Cát", verse: "Xuân lai hoa phát ánh dương hồng / Vạn sự tòng tâm nhất điểm thông.", text: "Mọi việc thuận lợi. Quý nhân phù trợ, công việc thăng tiến." },
        { type: "Trung Bình", verse: "Hảo tương tâm địa lực canh vân / Bỉ thủ sơn đầu tổng thị phần.", text: "Nên giữ gìn sức khỏe, an phận thủ thường. Chớ tham vọng quá cao." },
        { type: "Tiểu Cát", verse: "Tiểu nhân mạc dụng, quân tử nghi thân / Sự nghiệp hanh thông.", text: "Có lộc nhỏ. Tránh xa thị phi, gần gũi người tốt." },
        { type: "Hạ Hạ", verse: "Khẩu thiệt thị phi hưu thính / Nhàn sự mạc quản an thân.", text: "Cẩn trọng lời ăn tiếng nói. Đề phòng tiểu nhân. Lấy đức thắng số." },
        { type: "Thượng Cát", verse: "Công thành danh toại vạn nhân ngưỡng / Bộ bộ cao thăng thượng thanh vân.", text: "Sự nghiệp thăng hoa. Tiền tài vào như nước." },
        { type: "Bình An", verse: "Gia môn hỷ khí mãn đình tiền / Tử hiếu tôn hiền phúc thọ toàn.", text: "Gia đình hòa thuận, con cháu hiếu thảo. Một năm bình yên." },
        { type: "Cát Tường", verse: "Nhất phiến cô phàm vạn lý chinh / Kim triêu đắc ngộ thuận phong hành.", text: "Đi xa có lợi. Gặp được cơ hội tốt để phát triển." },
        { type: "Như Ý", verse: "Dục hoãn cầu mưu mạc cấp ban / Chu toàn tự hữu đắc song quan.", text: "Cầu được ước thấy. Mọi tâm nguyện đều thành hiện thực." },
        { type: "Lộc Tồn", verse: "Kim ngân mãn thất, phúc lâm môn / Chiêu tài tiến bảo, lợi hanh thông.", text: "Tiền bạc dồi dào. Kinh doanh buôn bán phát đạt." }
        // (Đây là mẫu 10 quẻ điển hình, code sẽ random xoay vòng để tạo cảm giác 100 quẻ)
    ];

    // Hàm lấy quẻ ngẫu nhiên
    function getFortune(number) {
        const index = number % fortuneData.length; 
        return fortuneData[index];
    }

    // Shake Logic
    let isShaking = false;
    window.shake = () => {
        if(isShaking) return; isShaking = true;
        const tube = document.getElementById('tube');
        const stick = document.getElementById('stick');
        stick.classList.remove('out');
        stick.style.opacity = 0;
        tube.style.animation = "shake 0.5s infinite";
        if(navigator.vibrate) navigator.vibrate(200);

        setTimeout(() => {
            tube.style.animation = "none";
            const num = Math.floor(Math.random() * 100) + 1;
            const fortune = getFortune(num);
            stick.innerText = "Số " + num;
            stick.classList.add('out');
            stick.style.opacity = 1;
            setTimeout(() => {
                showPopup(`QUẺ SỐ ${num} - ${fortune.type.toUpperCase()}`, `${fortune.verse}\n\nLỜI BÀN:\n${fortune.text}`);
                isShaking = false;
            }, 1000);
        }, 1500);
    }

    // Lixi Logic
    const lixiWishes = ["10k", "20k", "50k", "100k", "500k", "Lời Chúc May Mắn", "Voucher Trà Sữa", "Vé Xem Phim"];
    const lixiGrid = document.getElementById('lixi-grid');
    for(let i=0; i<9; i++) {
        let d = document.createElement('div');
        d.className = 'lixi-box';
        d.innerHTML = '<i class="fas fa-envelope"></i>';
        d.onclick = function() {
            if(this.style.opacity === '0') return;
            if(typeof confetti === 'function') confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
            const w = lixiWishes[Math.floor(Math.random()*lixiWishes.length)];
            showPopup("LÌ XÌ ĐẦU NĂM", "Bạn nhận được: " + w);
            this.style.transition = "0.5s"; this.style.opacity = '0'; this.style.pointerEvents = 'none';
        }
        lixiGrid.appendChild(d);
    }

    // 5. CARD MAKER
    const wishesDB = {
        family: ["Chúc gia đình năm mới an khang thịnh vượng.", "Chúc cha mẹ sống lâu trăm tuổi.", "Gia đình hòa thuận, vạn sự như ý.", "Chúc gia đình năm mới hạnh phúc, thịnh vượng và bình an.", "Năm mới, gia đình luôn tràn ngập niềm vui và sức khỏe.", "Chúc gia đình một năm mới vui vẻ, khỏe mạnh, và an lành.", "Mong gia đình mình luôn mạnh khỏe, hòa thuận, và vui vẻ trong năm mới.", "Chúc gia đình mình năm mới an khang, tài lộc dồi dào.", "Chúc gia đình mình luôn luôn bên nhau, cùng nhau vượt qua mọi thử thách.", "Mong rằng năm mới sẽ mang đến cho gia đình mình sức khỏe và niềm vui vô bờ bến."],
        work: ["Chúc sếp năm mới đại cát đại lợi.", "Công việc thuận buồm xuôi gió.", "Tiền vào như nước, tiền ra nhỏ giọt.", "Chúc bạn năm mới thành công, thăng tiến trong công việc.", "Năm mới, chúc bạn đạt nhiều thành tựu trong công việc.", "Chúc công việc năm mới thuận lợi và phát triển vượt bậc.", "Năm mới, chúc bạn công việc suôn sẻ, sức khỏe dồi dào.", "Chúc bạn năm mới sáng tạo, đạt mọi mục tiêu trong công việc.", "Năm mới, chúc bạn gặt hái nhiều thành công và vui vẻ trong công việc."],
        friend: ["Chúc bạn thân sớm có người yêu.", "Năm mới bớt sống ảo, tiền nhiều như kẹo.", "Ăn nhanh chóng béo, tiền nhiều như nước.", "Chúc người thân năm mới hạnh phúc, khỏe mạnh và an lành.", "Năm mới, chúc gia đình mình luôn vui vẻ, đoàn kết và mạnh khỏe.", "Chúc người thân một năm mới tràn ngập niềm vui và bình an.", "Năm mới, chúc cả gia đình mạnh khỏe, may mắn và hạnh phúc.", "Chúc người thân năm mới vạn sự như ý, tài lộc dồi dào.", "Chúc người thân năm mới an khang, thịnh vượng và luôn bên nhau.", "Năm mới, chúc người thân sức khỏe dồi dào và niềm vui trọn vẹn.", "Chúc người thân năm mới bình an, hạnh phúc, và thành công."],
        love: ["Chúc tình yêu mình mãi bền chặt.", "Năm mới, anh chỉ cần em bên cạnh.", "Yêu em nhiều hơn năm cũ.", "Chúc em năm mới luôn xinh đẹp, hạnh phúc và bên anh mãi mãi.", "Năm mới, anh chúc em sức khỏe, bình an và tất cả mọi ước mơ sẽ thành hiện thực.", "Chúc em năm mới tràn ngập niềm vui, tình yêu và mọi điều tốt lành.", "Năm mới đến, anh mong sẽ luôn bên em, cùng nhau vượt qua mọi khó khăn.", "Chúc em năm mới yêu thương ngập tràn, và luôn nở nụ cười hạnh phúc.", "Năm mới, anh mong em sẽ luôn mạnh mẽ, hạnh phúc và luôn là người anh yêu thương nhất.", "Chúc em năm mới thành công trong mọi điều em làm, và luôn được yêu thương như em xứng đáng.", "Chúc em năm mới an lành, may mắn và tình yêu chúng ta mãi bền chặt."]
    };

    window.loadWishes = () => {
        const cat = document.getElementById('cat-select').value;
        const sel = document.getElementById('wish-select');
        sel.innerHTML = '<option value="">-- Chọn câu chúc mẫu --</option>';
        if(wishesDB[cat]) {
            wishesDB[cat].forEach(w => {
                let opt = document.createElement('option');
                opt.value = w; opt.innerText = w;
                sel.appendChild(opt);
            });
        }
    }
    if(document.getElementById('cat-select')) window.loadWishes();

    window.applyWish = () => {
        const val = document.getElementById('wish-select').value;
        if(val) { document.getElementById('inp-message').value = val; updateCardLive(); }
    }

    window.updateCardLive = () => {
        const name = document.getElementById('inp-name').value;
        const msg = document.getElementById('inp-message').value;
        document.getElementById('live-name').innerText = name ? name.toUpperCase() : "TÊN NGƯỜI NHẬN";
        document.getElementById('live-msg').innerText = msg ? `"${msg}"` : '"Lời chúc sẽ hiện ở đây..."';
    }

    window.downloadImg = () => {
        const btn = document.querySelector('.btn-download-vip');
        const oldText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> XỬ LÝ...';
        html2canvas(document.getElementById('capture-target'), {scale:3, backgroundColor:null, useCORS:true}).then(c => {
            let a = document.createElement('a'); a.download = 'Thiep-Tet-2026.png';
            a.href = c.toDataURL(); a.click();
            btn.innerHTML = oldText;
        });
    }

    // 6. UTILS
    window.showPopup = (t, m) => {
        document.getElementById('pop-title').innerText = t;
        document.getElementById('pop-msg').innerText = m;
        document.getElementById('popup').classList.remove('hidden');
    }
    window.closePopup = () => document.getElementById('popup').classList.add('hidden');

    // Canvas
    const cvs = document.getElementById('bg-canvas');
    if(cvs) {
        const ctx = cvs.getContext('2d');
        const resize = () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight; }
        window.onresize = resize; resize();
        let parts = []; 
        for(let i=0; i<30; i++) parts.push({x:Math.random()*cvs.width, y:Math.random()*cvs.height, s:Math.random()*2, v:Math.random()*0.5+0.1});
        function anim() {
            ctx.clearRect(0,0,cvs.width,cvs.height); ctx.fillStyle='#ffd700';
            parts.forEach(p=>{
                p.y-=p.v; if(p.y<0) p.y=cvs.height;
                ctx.globalAlpha = Math.random()*0.5+0.2;
                ctx.beginPath(); ctx.arc(p.x,p.y,p.s,0,Math.PI*2); ctx.fill();
            }); requestAnimationFrame(anim);
        }
        anim();
    }
});