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

- `/newoffer` (ADMIN) Tạo kèo.
- `/bet` Cược trên một kèo.
- `/lock` (ADMIN) Khóa kèo khi bắt đầu trận.
- `/announce` (ADMIN) Thông báo kết quả.

## Tác giả

👤 **Tôi**

## Nếu mà bạn thấy hay thì

Cho tôi và tác giả 1 ⭐️ nha :3

---
