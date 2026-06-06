class CodeBox extends HTMLElement {
    constructor() {
        super();
        // Tạo một vùng Shadow DOM biệt lập để CSS của thẻ không làm ảnh hưởng bên ngoài
        const shadow = this.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
            <style>
    /* Chiếc hộp màu trắng nhẹ nhàng, thơ mộng */
    .code-container {
        position: relative;
        background: #ffffff; /* Đổi thành màu trắng tinh khôi */
        border: 1px solid rgba(184, 161, 135, 0.25); /* Viền màu be siêu mảnh và mờ */
        border-radius: 12px; /* Bo góc nhiều hơn cho cute và mềm mại */
        padding: 18px;
        margin: 20px 0;
        
        /* Hiệu ứng bóng đổ mờ ảo như mây, không bị gắt */
        box-shadow: 
            0 4px 15px rgba(184, 161, 135, 0.1),
            0 1px 3px rgba(0, 0, 0, 0.02);
    }
    
    .code-container pre { 
        margin: 0; 
        overflow-x: auto; 
    }
    
    /* Định dạng đoạn chữ bên trong */
    .code-container code {
        font-family: 'Courier New', Courier, monospace;
        color: #4a5568; /* Màu xám than dịu mắt, không dùng màu đen đặc để tránh bị thô */
        font-size: 14px;
        line-height: 1.6;
        white-space: pre-wrap;
    }
    
    /* Nút bấm Copy phong cách tối giản, nhẹ nhàng */
    .copy-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #fcfbfa; /* Màu trắng kem nhẹ */
        color: #b8a187; /* Màu be thơ mộng của bạn */
        border: 1px solid rgba(184, 161, 135, 0.3);
        border-radius: 6px;
        padding: 4px 10px;
        font-size: 12px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.25s ease;
    }
    
    /* Khi rê chuột vào nút Copy */
    .copy-btn:hover { 
        background: #b8a187; 
        color: #ffffff; /* Đổi chữ thành trắng */
        box-shadow: 0 2px 8px rgba(184, 161, 135, 0.3);
    }
    
    /* Khi đã copy thành công */
    .copy-btn.copied { 
        background: #5c715e; /* Màu xanh lá bọc rêu pastel rất dịu */
        color: white; 
        border-color: transparent; 
    }
</style>

            <div class="code-container">
                <button class="copy-btn">Copy</button>
                <pre><code><slot></slot></code></pre> 
            </div>
        `;

        // Xử lý sự kiện nút Copy bấm vào
        const button = shadow.querySelector('.copy-btn');
        button.addEventListener('click', () => {
            // Lấy toàn bộ chữ nằm trong slot ra để copy
            const textToCopy = shadow.querySelector('slot').assignedNodes()
                                     .map(node => node.textContent).join('');

            navigator.clipboard.writeText(textToCopy).then(() => {
                button.innerText = "✓ Copied!";
                button.classList.add("copied");
                setTimeout(() => {
                    button.innerText = "Copy";
                    button.classList.remove("copied");
                }, 2000);
            });
        });
    }
}

// Đăng ký cái tên thẻ với trình duyệt (Bắt buộc tên thẻ phải có dấu gạch ngang)
customElements.define('code-box', CodeBox);




class NoteBox extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        // Lấy thuộc tính "type" mà người dùng gõ ở ngoài HTML (mặc định là info nếu không gõ)
        const type = this.getAttribute('type') || 'info';

        // Bản đồ cấu hình màu sắc và icon cho từng loại thẻ
        const config = {
            info: {
                icon: '💡',
                bg: '#f0f7ff',       /* Xanh dương mây dịu nhẹ */
                border: '#cce3ff',
                text: '#1e40af'
            },
            warn: {
                icon: '⚠️',
                bg: '#fffbeb',       /* Vàng nắng nhạt */
                border: '#fef3c7',
                text: '#92400e'
            },
            success: {
                icon: '✨',
                bg: '#f0fdf4',       /* Xanh lá bọc rêu pastel */
                border: '#bbf7d0',
                text: '#166534'
            },
            danger: {
                icon: '🛑',
                bg: '#fef2f2',       /* Hồng cam nhạt */
                border: '#fee2e2',
                text: '#991b1b'
            }
        };

        // Lấy cấu hình tương ứng, nếu người dùng nhập bậy thì tự động lấy 'info'
        const current = config[type] || config['info'];

        shadow.innerHTML = `
            <style>
                .note-container {
                    display: flex;
                    align-items: flex-start; /* Căn đỉnh để nếu chữ dài nhìn vẫn đẹp */
                    background: ${current.bg};
                    border: 1px solid ${current.border};
                    border-radius: 12px;
                    padding: 15px 18px;
                    margin: 20px 0;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
                }
                
                .note-icon {
                    font-size: 18px;
                    margin-right: 12px;
                    line-height: 1.5;
                    user-select: none; /* Không cho người dùng bôi đen copy cái icon này */
                }
                
                .note-content {
                    flex: 1;
                    margin: 0;
                    color: ${current.text};
                    font-size: 14px;
                    line-height: 1.6;
                }
                
                /* Định dạng nếu người dùng có viết các thẻ p, strong bên trong note-box */
                ::slotted(p) {
                    margin: 0 0 8px 0;
                }
                ::slotted(p:last-child) {
                    margin-bottom: 0;
                }
            </style>

            <div class="note-container">
                <div class="note-icon">${current.icon}</div>
                <div class="note-content">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

// Đăng ký tên thẻ riêng là note-box
customElements.define('note-box', NoteBox);


class PdfViewer extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        
        // Lấy đường link file PDF từ thuộc tính "src" ở ngoài HTML
        const pdfSrc = this.getAttribute('src') || '';

        shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin: 24px 0;
                }
                
                /* Chiếc hộp bọc ngoài phong cách thơ mộng màu trắng */
                .pdf-container {
                    background: #ffffff;
                    border: 1px solid rgba(184, 161, 135, 0.25);
                    border-radius: 12px;
                    padding: 16px;
                    box-shadow: 0 4px 15px rgba(184, 161, 135, 0.1);
                    overflow: hidden;
                }
                
                /* Thanh công cụ phía trên */
                .pdf-toolbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid rgba(184, 161, 135, 0.15);
                }
                
                .pdf-title {
                    font-size: 14px;
                    color: #4a5568;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                
                /* Nút tải xuống xinh xắn màu be */
                .download-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: #fcfbfa;
                    color: #b8a187;
                    border: 1px solid rgba(184, 161, 135, 0.3);
                    border-radius: 6px;
                    padding: 6px 12px;
                    font-size: 13px;
                    font-weight: 500;
                    text-decoration: none; /* Bỏ gạch chân */
                    cursor: pointer;
                    transition: all 0.25s ease;
                }
                
                .download-btn:hover {
                    background: #b8a187;
                    color: #ffffff;
                    box-shadow: 0 2px 8px rgba(184, 161, 135, 0.3);
                }
                
                /* Khung hiển thị PDF */
                .pdf-frame {
                    width: 100%;
                    height: 500px; /* Độ cao vùng hiển thị PDF */
                    border: none;
                    border-radius: 8px;
                    background: #fcfbfa;
                }
                
                /* Thông báo nếu quên không nhập link PDF */
                .error-msg {
                    color: #991b1b;
                    padding: 20px;
                    text-align: center;
                    font-size: 14px;
                }
            </style>

            <div class="pdf-container">
                ${pdfSrc ? `
                    <div class="pdf-toolbar">
                        <div class="pdf-title">📄 Tài liệu PDF</div>
                        <!-- Nút bấm tải xuống, thuộc tính download ép trình duyệt phải tải về -->
                        <a href="${pdfSrc}" download class="download-btn">
                            📥 Tải xuống
                        </a>
                    </div>
                    <!-- Trình chiếu PDF bằng bộ đọc mặc định cực xịn của trình duyệt -->
                    <iframe class="pdf-frame" src="${pdfSrc}#toolbar=1"></iframe>
                ` : `
                    <div class="error-msg">⚠️ Bạn ơi, bạn chưa chèn đường link file PDF vào thuộc tính 'src' rồi!</div>
                `}
            </div>
        `;
    }
}

// Đăng ký thẻ tự chế là <pdf-viewer>
customElements.define('pdf-viewer', PdfViewer);