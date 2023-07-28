## 固件存储的位置在/src/bin下
### 写入文件顺序和写入地址
- 0x8000 partitions.bin 
- 0x90000 spiffs.bin 
- 0x10000 firmware.bin 

## 本地测试
npm run dev
## 打包
npm run build
