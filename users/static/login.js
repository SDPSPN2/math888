window.onload = function() {
    const canvas = document.getElementById("canvas");
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["purple", "orange", "blue", "red", "green"]; // กำหนดสีแต่ละวงกลม
    const navbar = document.querySelector(".navbar"); // ดึง Navbar
    const navbarHeight = navbar ? navbar.offsetHeight : 0; // คำนวณความสูงของ Navbar

    class Circle {
        constructor(x, y, vx, vy, color) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.radius = 10;
            this.color = color;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
                this.vx *= -1; // เด้งกลับในแนวนอน
            }
            if (this.y - this.radius < navbarHeight || this.y + this.radius > canvas.height) {
                this.vy *= -1; // เด้งกลับในแนวตั้ง โดยกันชน Navbar
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }

    const circles = [];
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * (canvas.width - 20) + 10;
        const y = Math.random() * (canvas.height - 20) + navbarHeight + 10; // เริ่มจากใต้ Navbar
        const vx = (Math.random() - 0.5) * 8;
        const vy = (Math.random() - 0.5) * 8;
        const color = colors[i%5]; // ใช้สีที่แตกต่างกันสำหรับแต่ละวงกลม
        circles.push(new Circle(x, y, vx, vy, color));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        circles.forEach(circle => {
            circle.update();
            circle.draw();
        });
        requestAnimationFrame(animate);
    }

    animate(); // เรียก animate() หลังจาก DOM โหลดเสร็จ
};
