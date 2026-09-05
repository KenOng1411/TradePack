---
title: "Phí giao dịch Fomo: Spot vs Perpetuals, và cách tiết kiệm với mã giới thiệu"
description: "Bảng phân tích rõ ràng, cập nhật về phí giao dịch thực tế trên Fomo cho spot và perpetuals, kèm ví dụ tính toán mức tiết kiệm khi dùng mã giới thiệu."
locale: "vi"
publishDate: 2026-11-15
tags: ["phí", "hướng-dẫn"]
author: "TradePack Team"
---

Phí của Fomo không hẳn là bị giấu, nhưng cũng không hiển thị ở một chỗ cố định — nên đây là bức tranh đầy đủ trong một bài viết.

## Phí giao dịch spot

Giao dịch spot (memecoin, altcoin, stablecoin) tốn khoảng 0,5%/lệnh trước khi áp mã giảm giá. Áp mã giới thiệu hợp lệ lúc đăng ký giúp giảm thêm 10%, đưa mức phí thực tế xuống còn khoảng 0,45%. Với lệnh giá trị rất nhỏ, chi phí thực tế có thể cảm giác cao hơn tỷ lệ phần trăm niêm yết, đơn giản vì thường có mức phí tối thiểu cho mỗi lệnh — đáng cân nhắc nếu bạn có xu hướng giao dịch nhiều lệnh nhỏ thay vì ít lệnh lớn hơn.

## Phí perpetuals

Perpetuals chạy qua tích hợp với Hyperliquid thay vì là sản phẩm độc lập của Fomo. Fomo cộng thêm khoảng 0,05%/bên trên phí gốc của Hyperliquid cho mỗi lệnh — trên thực tế khiến chi phí trực tiếp khi giao dịch perps qua Fomo gần như gấp đôi so với giao dịch spot. Perpetuals hiện chưa khả dụng cho người dùng tại Mỹ.

## Mã giới thiệu thực sự giúp tiết kiệm bao nhiêu

Đây là phép tính đơn giản, dùng mức phí spot 0,5% làm chuẩn:

| Giá trị lệnh | Phí không dùng mã (0,5%) | Phí dùng mã (giảm 10% → 0,45%) | Tiết kiệm được |
|---|---|---|---|
| $100 | $0,50 | $0,45 | $0,05 |
| $1.000 | $5,00 | $4,50 | $0,50 |
| $10.000 | $50,00 | $45,00 | $5,00 |

Mức tiết kiệm tăng tuyến tính theo giá trị lệnh — đơn giản là giảm 10% trên mức phí đáng lẽ phải trả, áp dụng tự động cho mọi lệnh một khi mã đã gắn với tài khoản từ lúc đăng ký. Dùng [máy tính phí](/vi/phi-giao-dich) để xem con số chi tiết cho lệnh của bạn.

## Những khoản mã giới thiệu không tác động tới

Hai khoản mã giảm giá không ảnh hưởng: phí mạng blockchain (gas), thay đổi theo từng chain — Solana, Base, BNB Chain, Monad — và theo tình trạng mạng tại thời điểm giao dịch; và với perpetuals, phí gốc của Hyperliquid, vì mức giảm của Fomo chỉ áp dụng cho lớp phí của Fomo, không phải phí của sàn nằm bên dưới.

## Tóm lại

Với giao dịch spot, mã giới thiệu là mức giảm 10% đơn giản, không có mặt trái, không cần thêm bước nào ngoài nhập mã lúc đăng ký. Với perpetuals, yếu tố ảnh hưởng lớn hơn tới tổng chi phí là mức cộng thêm khoảng 0,05%/bên của Fomo trên phí gốc Hyperliquid — điều đáng biết dù có dùng mã giới thiệu hay không, đặc biệt nếu bạn giao dịch perps thường xuyên hoặc khối lượng lớn.

Nếu chưa có mã, có sẵn trên [trang mã giới thiệu](/vi/ma-gioi-thieu) — đây là mức giảm giá tiêu chuẩn của Fomo, không phải ưu đãi riêng của TradePack.
