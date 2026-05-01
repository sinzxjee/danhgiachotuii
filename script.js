const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzlcWb7LonMbd0hjqVVNZKbdXgKrMUBQczFeDexZQDjPWDCBrkDYA7JhhbM7xjlyf5EIA/exec";

document.addEventListener('DOMContentLoaded', () => {
    let rating = 0;
    const mascot = document.getElementById('cat-mascot');
    const bubble = document.getElementById('chat-bubble');
    const follower = document.getElementById('cursor-follower');

    // 1. Mèo chạy theo chuột (Chỉ hoạt động trên Desktop)
    document.addEventListener('mousemove', (e) => {
        if (follower) {
            follower.style.left = e.clientX + 5 + 'px';
            follower.style.top = e.clientY + 5 + 'px';
        }
    });

    // 2. Chấm sao & Đổi Mascot theo mức độ cảm xúc
    const stars = document.querySelectorAll('.stars span');
    
    // Định nghĩa các trạng thái cho mèo
    const catEmotions = {
        1: {
            img: "https://cataas.com/cat/angry", // Mèo giận
            msg: "Tệ quá không zay 😿",
            color: "#ff4d4d"
        },
        2: {
            img: "https://cataas.com/cat/sad",   // Mèo buồn
            msg: "Cố gắng lên 1 xíu nữa xemm 😿",
            color: "#ff944d"
        },
        3: {
            img: "https://cataas.com/cat/cute",  // Mèo bình thường
            msg: "Chắc là cũng ổn thui 😸",
            color: "#ffd11a"
        },
        4: {
            img: "https://cataas.com/cat/says/Great", // Mèo vui
            msg: "Thật sự đỉnh 😻",
            color: "#54a0ff"
        },
        5: {
            img: "https://cataas.com/cat/says/Perfect", // Mèo cực phê
            msg: "Quá là tuyệt với lun ròii 👑",
            color: "#ff80ab"
        }
    };

    stars.forEach(s => {
        s.addEventListener('click', () => {
            rating = parseInt(s.dataset.v);
            
            // Active sao
            stars.forEach(star => star.classList.toggle('active', star.dataset.v <= rating));
            
            // Lấy dữ liệu cảm xúc tương ứng
            const emotion = catEmotions[rating];

            // Cập nhật Mascot (Thêm timestamp để ảnh luôn mới)
            mascot.src = `${emotion.img}?t=${Date.now()}`;
            
            // Cập nhật lời thoại và màu sắc tương phản
            bubble.innerText = emotion.msg;
            bubble.style.borderColor = emotion.color;
            bubble.style.boxShadow = `6px 6px 0px ${emotion.color}`;
            
            // Hiệu ứng Mascot phản hồi (phóng to nhẹ + rung)
            mascot.style.transform = `scale(${1 + rating * 0.03}) rotate(${rating % 2 === 0 ? 5 : -5}deg)`;
            mascot.style.borderColor = emotion.color;
            
            setTimeout(() => {
                mascot.style.transform = `scale(${1 + rating * 0.03}) rotate(0deg)`;
            }, 200);
        });
    });

    // 3. Gửi dữ liệu ngầm
    document.getElementById('send-btn').addEventListener('click', async function() {
        const service = document.getElementById('service').value;
        const comment = document.getElementById('comment').value;

        if(!service || !comment || rating === 0) {
            alert("Điền đủ thông tin và chấm sao đã bạn ơii! 🐾");
            return;
        }

        this.disabled = true;
        const originalText = this.innerText;
        this.innerText = "Đang gửi, đợi xíuuu... 🐾";

        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ service, stars: rating, comment })
            });

            // Hiệu ứng mưa mèo ăn mừng
            makeItRain();
            alert("Gửi thành công rồi nè! Anh xin tiếp thu ý kiến của Em nhé");
            
            // Reset form về trạng thái ban đầu
            document.getElementById('service').value = '';
            document.getElementById('comment').value = '';
            rating = 0;
            stars.forEach(star => star.classList.remove('active'));
            bubble.innerText = "Tiếp tục phục vụ trẫm nhé! 🐾";
            bubble.style.borderColor = "#ffcccc";
            bubble.style.boxShadow = "6px 6px 0px #ffcccc";
            mascot.src = "https://cataas.com/cat/says/Hello"; // Reset ảnh mèo
            mascot.style.transform = "scale(1)";

        } catch (e) {
            alert("Có lỗi rồi, kiểm tra lại URL Script nha!");
        } finally {
            this.disabled = false;
            this.innerText = originalText;
        }
    });

    function makeItRain() {
        const icons = ['🐱', '🐈', '🐾', '🐟', '👑', '❤️'];
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const drop = document.createElement('div');
                drop.className = 'cat-drop';
                drop.innerText = icons[Math.floor(Math.random() * icons.length)];
                drop.style.left = Math.random() * 100 + 'vw';
                drop.style.animationDuration = (Math.random() * 1.5 + 1) + 's';
                document.body.appendChild(drop);
                setTimeout(() => drop.remove(), 2500);
            }, i * 80);
        }
    }
});
