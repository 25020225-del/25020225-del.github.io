// Thẻ ẩn phụ trách chuyển đổi (Giữ nguyên từ code của bạn)
function textToHtmlNode(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString.trim(), 'text/html');
    const templateInFile = doc.querySelector('template');
    
    if (templateInFile) {
        return templateInFile.content;
    } else {
        const fallbackTemplate = document.createElement('template');
        fallbackTemplate.innerHTML = htmlString.trim();
        return fallbackTemplate.content;
    }
}

async function loadComponent(fileUrl, containerId) {
    try {
        // 1. Tải file HTML từ địa chỉ được đưa vào
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(`Không thể tải được file tại: ${fileUrl}`);
        }
        
        // 2. Chuyển kết quả phản hồi thành chuỗi văn bản (text)
        const htmlString = await response.text();
        
        // 3. Tìm vùng chứa trên giao diện dựa vào containerId
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Lỗi: Không tìm thấy thẻ có id="${containerId}" trên trang.`);
            return;
        }
        
        // 4. Chuyển text thành Node và bắn thẳng vào vùng chứa
        const htmlNode = textToHtmlNode(htmlString);
        container.replaceChildren();
        container.appendChild(htmlNode);
        
        console.log(`Đã tải thành công ${fileUrl} vào #${containerId}`);

    } catch (error) {
        console.error("Quá trình tự động tải giao diện bị lỗi:", error);
    }
}

loadComponent("hello.html","main-view-controller");

const returnToMain = () => loadComponent("hello.html", "main-view-controller");

const toWeek1 = () => loadComponent("week/week-1.html", "main-view-controller");
const toWeek2 = () => loadComponent("week/week-2.html", "main-view-controller");
const toWeek3 = () => loadComponent("week/week-3.html", "main-view-controller");
const toWeek4 = () => loadComponent("week/week-4.html", "main-view-controller");
const toWeek5 = () => loadComponent("week/week-5.html", "main-view-controller");
const toWeek6 = () => loadComponent("week/week-6.html", "main-view-controller");
const returnToEnd = () => loadComponent("end.html", "main-view-controller");




class MyPortfolioBox extends HTMLElement {
    constructor() {
        super();
        
        // Tạo Shadow DOM (vùng không gian biệt lập cho thẻ)
        const shadow = this.attachShadow({ mode: 'open' });

        // Định nghĩa cấu trúc HTML và CSS (bao gồm cả Animation) riêng cho thẻ này
        shadow.innerHTML = `
            <style>
                /* CSS biệt lập bên trong thẻ */
                .box-container {
                    border: 3px solid rgb(39, 49, 51);
                    border-radius: 15px;
                    padding: 20px;
                    background: #ffffff;
                    
                    /* Hiệu ứng Animation khi thẻ xuất hiện */
                    animation: slideUp 0.6s ease-out forwards;
                    opacity: 0;
                    transform: translateY(20px);
                }

                header {
                    border-bottom: 2px dashed #ccc;
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                }

                main {
                    min-height: 100px;
                    line-height: 1.6;
                }

                footer {
                    border-top: 2px dashed #ccc;
                    padding-top: 10px;
                    margin-top: 15px;
                    font-size: 12px;
                    color: gray;
                }

                /* Khai báo Animation */
                @keyframes slideUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            </style>

            <div class="box-container">
                <header>
                    <slot name="title"><h2>Tiêu đề mặc định</h2></slot>
                </header>
                
                <main>
                    <slot name="content">Nội dung mặc định nếu bạn không điền gì...</slot>
                </main>
                
                <footer>
                    <slot name="end">© 2026 - My Custom Portfolio Component</slot>
                </footer>
            </div>
        `;
    }
}

// Đăng ký thẻ này với trình duyệt dưới cái tên: <my-portfolio-box>
// Lưu ý: Tên thẻ tự chế BẮT BUỘC phải có ít nhất một dấu gạch ngang (-)
customElements.define('my-portfolio-box', MyPortfolioBox);






let currentScale = 1; // Biến lưu tỷ lệ phóng to hiện tại của ảnh

// 1. Hàm mở Lightbox và kích hoạt tính năng zoom
function zoomImage(event) {
    if (event.target.tagName === 'IMG') {
        const lightbox = document.getElementById('image-lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        
        lightbox.style.display = 'flex';
        lightboxImg.src = event.target.src;
        
        // Reset lại tỷ lệ ảnh về kích thước gốc ban đầu mỗi khi mở ảnh mới
        currentScale = 1;
        lightboxImg.style.transform = `scale(${currentScale})`;
    }
}

// 2. Hàm xử lý LĂN CHUỘT để phóng to/thu nhỏ ảnh đang phóng đại
function handleWheelZoom(event) {
    event.preventDefault(); // Ngăn hành vi cuộn trang web mặc định khi đang xem ảnh

    const lightboxImg = document.getElementById('lightbox-img');
    
    // Tốc độ phóng to/thu nhỏ (số càng nhỏ zoom càng mượt)
    const zoomSpeed = 0.1; 

    if (event.deltaY < 0) {
        // Lăn chuột lên -> Phóng to (Tối đa phóng to gấp 5 lần ảnh gốc)
        if (currentScale < 5) currentScale += zoomSpeed;
    } else {
        // Lăn chuột xuống -> Thu nhỏ (Tối thiểu không nhỏ hơn 0.5 lần)
        if (currentScale > 0.5) currentScale -= zoomSpeed;
    }

    // Áp dụng tỷ lệ zoom mới lên bức ảnh một cách mượt mà
    lightboxImg.style.transform = `scale(${currentScale})`;
}

// 3. Hàm đóng Lightbox
function closeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    lightbox.style.display = 'none';
}

// 4. Đăng ký sự kiện lăn chuột vào khung Lightbox sau khi trang web tải xong
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox) {
        // Bắt sự kiện lăn chuột 'wheel' để thực hiện hàm Zoom
        lightbox.addEventListener('wheel', handleWheelZoom);
    }
    
    // Giữ nguyên logic click cho vùng ngoài (nếu bạn không dùng onclick trực tiếp)
    const mainContent = document.querySelector('.grid-item');
    if (mainContent) {
        mainContent.addEventListener('click', zoomImage);
    }
});