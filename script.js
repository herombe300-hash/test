document.addEventListener('DOMContentLoaded', () => {
    // 1. Lấy các trường input
    const inputs = {
        weight: document.getElementById('weight'),
        currentGoldPrice: document.getElementById('currentGoldPrice'),
        rateGoldPrice: document.getElementById('rateGoldPrice'),
        karatInput: document.getElementById('karatInput'),
        Spread: document.getElementById('Spread'),
        Spread2: document.getElementById('Spread2')
    };

    // 2. Lấy các phần tử hiển thị kết quả
    const results = {
        result1: document.getElementById('result1'),
        result2: document.getElementById('result2'),
        result3: document.getElementById('result3'),
        result4: document.getElementById('result4'),
        result5: document.getElementById('result5')
    };

    // Hàm định dạng số tiền (ví dụ: 7,000,000)
    function formatCurrency(number) {
        return number.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    // Hàm tính toán chính
    function calculateGold() {
        // Lấy và chuyển đổi giá trị đầu vào 
        const W = parseFloat(inputs.weight.value) || 0;         // Khối lượng (Chỉ)
        const cGP = parseFloat(inputs.currentGoldPrice.value) || 0; // Giá 9999 mua vào (VND/Chỉ)
        const rGP = parseFloat(inputs.rateGoldPrice.value) || 0; // Tỉ lệ bù hội vàng (Phần trăm?)
        const K_input = parseFloat(inputs.karatInput.value) || 0; // % Vàng Hiện tại
        const Spread = parseFloat(inputs.Spread.value) || 0;     // Tỉ lệ lệch giá 24K (P_Spread)
        const Spread2 = parseFloat(inputs.Spread2.value) || 0;   // Tỉ lệ lệch giá 17K (F_Spread)
        
        // Chuẩn hóa Tỷ lệ đầu vào (giả định bạn nhập % cần chia cho 100)
        const R_input_decimal = K_input / 100;

        // --- 1. Tỷ lệ Vàng Nguyên chất ---
        results.result1.textContent = `${(K_input).toFixed(2)} %`;

        // --- 2. Giá trị Thực tế (VND) ---
        // Giả định công thức là W * Giá Mua * Tỷ lệ. Bỏ *10 nếu nó không phải là hệ số quy đổi
        const actualValue = W * cGP * R_input_decimal * 1000; 
        results.result2.textContent = `${formatCurrency(actualValue)} VND`;

        // --- 3. Khối lượng Vàng 9999 Tương đương ---
        const equivalentWeight = W * R_input_decimal; 
        results.result3.textContent = `${equivalentWeight.toFixed(4)} Chỉ`; // Bỏ /100 không cần thiết

        // --- 4 & 5. Tính toán lệch tuổi (Đã SỬA LỖI TRÌNH TỰ) ---

        // BƯỚC 1: Tính toán reInput (Chi phí ròng) trước (thay thế P_Spread bằng Spread và F_Spread bằng Spread2)
        // Giả định rGP/100 là hệ số chi phí.
        const reInput = (((cGP + Spread) * (rGP / 100)) - Spread2) *1000; 
        results.result5.textContent = `${formatCurrency(reInput)} VND`;
        
        // BƯỚC 2: Tính finalWeight sau khi có reInput
        let finalWeight = 0;
        if (reInput !== 0) {
            finalWeight = actualValue / reInput;
        }

        results.result4.textContent = `${finalWeight.toFixed(4)} Chỉ`; // Bỏ /10000 không cần thiết
    }

    // Gán sự kiện 'input' để tính toán tự động
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', calculateGold);
    });

    // Chạy lần đầu để hiển thị giá trị mặc định
    calculateGold();
});