<template>
    <div class="console">
        <a-button @click="onRestart" type="primary" html-type="submit">{{ t('console.restart') }}</a-button>
        <div id="terminal" style="position: relative;height: 500px; margin-top: 20px;">
        </div>
        <div style="width: 100%;display: flex;justify-content: flex-start;margin-top: -16px;">
            <div style="border: 0;background-color: #000;z-index: 1000;flex: 1">
                <span style="color: #fff"> Folotoy $:</span>
                <input type="text"
                    style="background-color: #000;color: #fff;width: 50%; border:none; text-indent: 10px;outline: none;z-index: 1000;"
                    autofocus @keydown="handleKeyDown">
            </div>
            <div style="width: 15px;"></div>
        </div>

    </div>
</template>
  
<script setup>
import { Button as AButton } from 'ant-design-vue';
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = defineProps({
    deviceconsole: {
        required: true
    }
})
const onRestart = () => {
    props.deviceconsole.resetDevice()
}
const commands = []
let currentIndex = 0
const handleKeyDown = (event) => {
    if (event.key === "Enter") {
        // 处理回车事件
        commands.push(event.target.value)
        currentIndex = commands.length - 1
        console.log("回车键已按下！");
        props.deviceconsole.term.writeTermDebouce('Folotoy $: ' + event.target.value + '\r\n')
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(event.target.value);

        props.deviceconsole.write(uint8Array)
        console.log(uint8Array)
        event.target.value = ''
    } else if (event.key === 'ArrowUp') {
        if (commands.length === 0) return
        if (currentIndex !== 0) {
            event.target.value = commands[currentIndex--]
        } else {
            event.target.value = commands[0]
        }

    } else if (event.key === 'ArrowDown') {
        if (commands.length === 0) return
        if (currentIndex !== commands.length - 1) {
            event.target.value = commands[currentIndex++]
        } else {
            event.target.value = commands[commands.length - 1]
        }
        console.log(currentIndex)
    }
}
</script>
  
<style>
.console {}

.consoleContent {
    background-color: #eee;
    padding: 16px;
    margin-top: 16px;
    text-align: center;
}

/* .xterm {
    padding-bottom: 40px;
}



.xterm-viewport {
    display: none;
} */
.xterm-helper-textarea,
.xterm-cursor,
.xterm-cursor-outline {
    display: none !important
}
</style>
  