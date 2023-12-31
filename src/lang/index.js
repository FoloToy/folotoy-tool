import { createI18n } from 'vue-i18n'
const getLang = (lang) => {
    if (lang === 'zh-TW' || lang === 'zh-HK') {
        return 'zh-TW'
    } else if (lang === 'zh-CN') {
        return 'zh-CN'
    } else if (lang === 'ja-JP') {
      return 'ja-JP'
    } else {
        return 'en-US'
    }
}
export default createI18n({ 
  legacy: false, // 让 setup 函数可以通过 t 访问
  globalInjection: true, // 让 template 可以像 vue2 那样使用 $t 来访问
  locale: localStorage.getItem('preferLang') ? localStorage.getItem('preferLang')  : getLang(window.navigator.language),
  messages: {
    'zh-CN': {
      index: {
        disconnect: '断开',
        program: '刷机',
        console: '日志',
        mqtt: '对话'
      },
      console: {
        restart: '重启'
      },
      program: {
        backToIndex: '返回',
        connect: '连接',
        baulrate: '波特率',
        selectBaulrate: '请选择波特率',
        inputAddress: '请输入地址',
        address: '地址',
        selectFile: '选择文件',
        write: '写入',
        success:'成功！请重启设备',
        inProcessTip: '正在写入中，是否要断开连接？',
        confirm: '确定',
        cancle: '取消',
        stepConnect: '连接设备',
        inProcess: '写入中',
        done: '完成',
        pleaseSelectFile: '请选择文件',
        disconnectError: '设备断开，请重新连接再试',
        erase: '抹除',
        eraseSuccess: '设备已被成功抹除',
        eraseError: '抹除设备失败',
        confirmErase: '确定抹除设备'
      },
      mqtt: {
        connectMqtt: '对话',
        name: '名称',
        inputName: '请输入名称',
        clientId: 'Client ID',
        inputClientId: '请输入 Client ID',
        host: '地址',
        inputHost: '请输入地址',
        port: '端口',
        inputPort: '请输入端口',
        username: '用户名',
        password: '密码',
        useSSL: 'SSL/TLS',
        topic: '主题',
        inputTopic: '请输入主题',
        inputUsername: '请输入用户名',
        inputPassword: '请输入密码',
        inputDeviceKey: '请输入 SN',
        deviceKey: 'SN',
        activate: '激活'
      }
    },
    'zh-TW': {
        index: {
            disconnect: '斷開',
            program: '刷機',
            console: '日誌',
            mqtt: '對話'
          },
          console: {
            restart: '重啟'
          },
          program: {
            backToIndex: '返回',
            connect: '連接',
            baulrate: '波特率',
            selectBaulrate: '請選擇波特率',
            inputAddress: '請輸入地址',
            address: '地址',
            selectFile: '選擇文件',
            write: '寫入',
            success:'成功！請重啟設備',
            inProcessTip: '正在寫入中，是否要斷開設備？',
            confirm: '確定',
            cancle: '取消',
            stepConnect: '連接設備',
            inProcess: '寫入中',
            done: '完成',
            pleaseSelectFile: '請選擇文件',
            disconnectError: '設備斷開，請重新連後重試',
            erase: '抹除',
            eraseSuccess: '設備已被成功抹除',
            eraseError: '抹除設備失敗',
            confirmErase: '確定抹除設備'
          },
          mqtt: {
            connectMqtt: '對話',
            name: '名稱',
            inputName: '請輸入名稱',
            clientId: 'Client ID',
            inputClientId: '請輸入 Client ID',
            host: '地址',
            inputHost: '請輸入地址',
            port: '端口',
            inputPort: '請輸入端口',
            username: '用戶名',
            password: '密碼',
            useSSL: 'SSL/TLS',
            topic: '主題',
            inputTopic: '請輸入主題',
            inputUsername: '請輸入用戶名',
            inputPassword: '請輸入密碼',
            inputDeviceKey: '請輸入 SN',
            deviceKey: 'SN',
            activate: '激活'
          }
    },
    'en-US': {
      index: {
        disconnect: 'Disconnect',
        program: 'Program',
        console: 'Console',
        mqtt: 'Dialogue'
      },
      console: {
        restart: 'Restart'
      },
      program: {
        backToIndex: 'Back',
        connect: 'Connect',
        baulrate: 'Baulrate',
        selectBaulrate: 'Please select baulrate',
        inputAddress: 'Please input address',
        address: 'Address',
        selectFile: 'Select File',
        write: 'Write',
        success: 'Great, Please Restart Your Device!',
        inProcessTip: 'Programming is in process, are you sure to leave?',
        confirm: 'Confirm',
        cancle: 'Cancle',
        stepConnect: 'Connect Device',
        inProcess: 'In Process',
        done: 'Done',
        pleaseSelectFile: 'Please Select File',
        disconnectError: 'Device disconnected, please reconnect and try again',
        erase: 'Erase',
        eraseSuccess: 'Device has been erased successfully',
        eraseError: 'Something wrong with the device, please reconnect and try again',
        confirmErase: 'Are you sure to erase device?'
      },
      mqtt: {
        connectMqtt: 'Dialogue',
        name: 'Name',
        inputName: 'Please Input Name',
        clientId: 'Client ID',
        inputClientId: 'Please Input Client ID',
        host: 'Host',
        inputHost: 'Please Input Host',
        port: 'Port',
        inputPort: 'Please Input Port',
        username: 'Username',
        password: 'Password',
        useSSL: 'SSL/TLS',
        topic: 'Topic',
        inputTopic: 'Please Input Topic',
        inputUsername: 'Please Input Username',
        inputPassword: 'Please Input Password',
        inputDeviceKey: 'Please Input SN',
        deviceKey: 'SN',
        activate: 'Activate'
      }
    },
    'ja-JP': {
      index: {
        disconnect: '切断',
        program: 'プログラム',
        console: 'コンソール',
        mqtt: '対話'
      },
      console: {
        restart: '再起動'
      },
      program: {
        backToIndex: '戻る',
        connect: '接続',
        baulrate: 'ボーレート',
        selectBaulrate: 'ボーレートを選択してください',
        inputAddress: 'アドレスを入力してください',
        address: 'アドレス',
        selectFile: 'ファイルを選択',
        write: '書き込む',
        success: '成功しました！デバイスを再起動してください',
        inProcessTip: '書き込み中です。接続を切断しますか？',
        confirm: '確認',
        cancle: 'キャンセル',
        stepConnect: 'デバイスに接続',
        inProcess: '書き込み中',
        done: '完了',
        pleaseSelectFile: 'ファイルを選択してください',
        disconnectError: 'デバイスが切断されました。再接続してください',
        erase: '消去',
        eraseSuccess: 'デバイスが正常に消去されました',
        eraseError: 'デバイスの消去に失敗しました',
        confirmErase: 'デバイスの消去を確認'
      },
      mqtt: {
        connectMqtt: '対話接続',
        name: '名前',
        inputName: '名前を入力してください',
        clientId: 'クライアントID',
        inputClientId: 'クライアントIDを入力してください',
        host: 'ホスト',
        inputHost: 'ホストを入力してください',
        port: 'ポート',
        inputPort: 'ポートを入力してください',
        username: 'ユーザー名',
        password: 'パスワード',
        useSSL: 'SSL/TLS',
        topic: 'トピック',
        inputTopic: 'トピックを入力してください',
        inputUsername: 'ユーザー名を入力してください',
        inputPassword: 'パスワードを入力してください',
        inputDeviceKey: 'SNを入力してください',
        deviceKey: 'SN',
        activate: 'アクティブにする'
      }
    }
  }
})