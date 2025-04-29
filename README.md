<h1 align="center">Mem Sách 2.0 - Bot Cá Độ Trên Discord</h1>
<p>
  <a href="https://github.com/jakjus/ocean-bet/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/jakjus/ocean-bet" />
  </a>
</p>

> Tự tạo kèo, xong rồi cược, thông báo kết quả rồi ăn tiền.

### 🚀 [Discord](https://discord.gg/BYKJmqCH4R)

## Yêu cầu

- NPM
- NodeJS

## Cài đặt

```sh
git clone git@github.com:ngobaoviet97/mem-sach-2.0
cd mem-sach-2.0/
npm install
```

## Setup

### Discord App

Đăng ký app trên [Discord Develepers Portal](https://discord.com/developers/applications). Mã đặc quyền bắt buộc là: `2147485696`. Thêm client_id của bạn vào link dưới.

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2147485696&scope=bot%20applications.commands
```

Vào [Discord Develepers Portal](https://discord.com/developers/applications) --> Your App --> Installation --> Install Link --> Paste the URL --> Save. Bạn sẽ thấy link URL của bot.

Vào [Discord Develepers Portal](https://discord.com/developers/applications) --> Your App --> Bot --> copy TOKEN. Bạn sẽ dùng TOKEN này cho `.env`. _(Bot TOKEN khác với OAuth TOKEN!)_

### Chỉnh sửa file config

Đổi tên `.env.example` thành `.env`. Điền TOKEN và CLIENT_ID của bạn vào file. `TOPGG_AUTH` không bắt buộc nếu bạn không có ý định dùng Top.gg.

### Đăng ký lệnh

```sh
node register.js
```

Có thể mất tới 10 phút để có thể load hết thao tác hiện tại của bot.

Nếu bạn muốn đăng ký lệnh để test trên một server Discord
(Guild), thì dùng:

```sh
GUILD_ID=your_guild_id node register.js
```

### Chạy bot

```sh
npm start
```

### Một số lệnh cơ bản

- `/newoffer` (ADMIN) Create offer.
- `/bet` Bet on an offer.
- `/lock` (ADMIN) Lock the offer when event starts.
- `/announce` (ADMIN) Announce event winner.

## Tác giả

👤 **Jakub Juszko** ( Check him out )

👤 **Tôi** ( Thằng dịch ra tiếng Việt cho các bạn )

- Bài gốc: https://github.com/jakjus/ocean-bet
- Website: https://jakjus.com
- Github: [@jakjus](https://github.com/jakjus)
- LinkedIn: [@jakubjuszko](https://linkedin.com/in/jakubjuszko)

## 🤝 Ý kiến đóng góp

jakjus:
`This package is not published on NPM, because the script is self-contained and I do not expect anyone to
plug it into a bigger script.`

Dịch thì nôm na ra là anh ấy thấy project này có code hoạt động khá riêng lẻ và anh ấy cũng không nghĩ ai có thể
nhét vào một dữ liệu lớn hơn ( chắc ý là con bot to hơn ).

Những đóng góp, báo lỗi và yêu cầu tính năng đều được chào đón!<br />Cứ check [issues page](https://github.com/jakjus/ocean-bet/issues) tự nhiên nhé.

## Nếu mà bạn thấy hay thì

Cho tôi và tác giả 1 ⭐️ nha :3

## 📝 Giấy phép

Copyright © 2024 [Jakub Juszko](https://github.com/jakjus).<br />
This project is [MIT](https://github.com/jakjus/ocean-bet/blob/master/LICENSE) licensed.

---
