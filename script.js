const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzlcWb7LonMbd0hjqVVNZKbdXgKrMUBQczFeDexZQDjPWDCBrkDYA7JhhbM7xjlyf5EIA/exec";

document.addEventListener('DOMContentLoaded', () => {
    let rating = 0;
    const mascot = document.getElementById('cat-mascot');
    const bubble = document.getElementById('chat-bubble');
    const follower = document.getElementById('cursor-follower');

    // 1. Mèo chạy theo chuột
    document.addEventListener('mousemove', (e) => {
        follower.style.left = e.clientX + 5 + 'px';
        follower.style.top = e.clientY + 5 + 'px';
    });

    // 2. Chấm sao & Đổi Mascot
    const stars = document.querySelectorAll('.stars span');
    stars.forEach(s => {
        s.addEventListener('click', () => {
            rating = s.dataset.v;
            stars.forEach(star => star.classList.toggle('active', star.dataset.v <= rating));
            
            const msgs = ["Tệ quá, trẫm buồn! 😿", "Cố gắng lên nhé Sen 😿", "Cũng ổn meow 😸", "Tốt lắm Sen ơi! 😻", "Tuyệt đỉnh hoàng gia! 👑"];
            bubble.innerText = msgs[rating - 1];
            mascot.style.transform = `scale(${1 + rating*0.05})`;
        });
    });

    // 3. Gửi dữ liệu ngầm
    document.getElementById('send-btn').addEventListener('click', async function() {
        const service = document.getElementById('service').value;
        const comment = document.getElementById('comment').value;

        if(!service || !comment || rating === 0) {
            alert("Điền đủ thông tin và chấm sao đã Sen ơi! 🐾");
            return;
        }

        this.disabled = true;
        this.innerText = "Đang gửi ngầm về Excel... 🐾";

        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({ service, stars: rating, comment })
            });

            // Hiệu ứng mưa mèo ăn mừng
            makeItRain();
            alert("Gửi thành công! Trẫm đã ghi lại vào file Excel rồi nhé! 🐱");
            
            // Reset form
            document.getElementById('service').value = '';
            document.getElementById('comment').value = '';
            rating = 0;
            stars.forEach(star => star.classList.remove('active'));
            bubble.innerText = "Tiếp tục phục vụ trẫm nhé! 🐾";

        } catch (e) {
            alert("Có lỗi rồi, kiểm tra lại URL Script nha!");
        } finally {
            this.disabled = false;
            this.innerText = "Gửi Phản Hồi Ngầm 🐾";
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