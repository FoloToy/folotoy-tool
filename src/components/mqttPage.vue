<template>
    <div class="program">
        <div style="display: flex; justify-content: space-between;margin-bottom: 8px;">
            <a-button @click="handlePushToFrontPage" :icon="h(LeftOutlined)">{{ t('program.backToIndex') }}</a-button>
            <a-radio-group v-model:value="logType" v-if="mqttConnected">
                <a-radio-button value="chat">{{ t('index.mqtt') }}</a-radio-button>
                <a-radio-button value="log">{{ t('index.console') }}</a-radio-button>
            </a-radio-group>
            <a-button v-if="mqttConnected" type="primary" @click="disconnectMqtt" danger html-type="submit">{{
                t('index.disconnect')
            }}</a-button>
        </div>

        <h2 style="text-align: center;" v-if="!mqttConnected">{{ t('mqtt.connectMqtt') }}</h2>
        <a-form :model="form" @finish="handleSubmit" v-bind="formItemLayout" v-if="!mqttConnected">
            <!-- <a-form-item :label="t('mqtt.name')" name="name" :rules="[{ required: true, message: t('mqtt.inputName') }]">
                <a-input :placeholder="t('mqtt.inputName')" v-model:value="form.name" />
            </a-form-item> -->
            <a-form-item :label="t('mqtt.clientId')" name="clientId"
                :rules="[{ required: true, message: t('mqtt.inputClientId') }]">
                <a-input :placeholder="t('mqtt.inputClientId')" v-model:value="form.clientId" />
            </a-form-item>

            <a-form-item :label="t('mqtt.host')" name="host" :rules="[{ required: true, message: t('mqtt.inputHost') }]">
                <div style="display: flex;justify-content: space-between;">
                    <a-input style="border-top-right-radius: 0; border-bottom-right-radius: 0;"
                        :placeholder="t('mqtt.inputHost')" v-model:value="form.host" />
                    <a-button style="border-top-left-radius: 0; border-bottom-left-radius: 0;" type="primary"
                        :disabled="!form.host || !form.port" @click="navigateToActivateMqttServer">{{ t('mqtt.activate')
                        }}</a-button>
                </div>
            </a-form-item>

            <a-form-item :label="t('mqtt.port')" name="port" :rules="[{ required: true, message: t('mqtt.inputPort') }]">
                <a-input-number :placeholder="t('mqtt.inputPort')" style="width: 100%;" v-model:value="form.port" />
            </a-form-item>
            <a-form-item :label="t('mqtt.deviceKey')" name="deviceKey"
                :rules="[{ required: true, message: t('mqtt.inputDeviceKey') }]">
                <a-input :placeholder="t('mqtt.inputDeviceKey')" v-model:value="form.deviceKey" />
            </a-form-item>
            <a-form-item :label="t('mqtt.username')" name="username"
                :rules="[{ required: true, message: t('mqtt.inputUsername') }]">
                <a-input :placeholder="t('mqtt.inputUsername')" v-model:value="form.username" />
            </a-form-item>

            <a-form-item :label="t('mqtt.password')" name="password"
                :rules="[{ required: true, message: t('mqtt.inputPassword') }]">
                <a-input-password :placeholder="t('mqtt.inputPassword')" v-model:value="form.password" />
            </a-form-item>
            <a-form-item :label="t('mqtt.useSSL')" name="useSSL">
                <a-switch v-model:checked="form.useSSL" />
            </a-form-item>
            <a-form-item style="text-align: center; width: 100%;">
                <a-button type="primary" html-type="submit">{{ t('program.connect')
                }}</a-button>
            </a-form-item>
        </a-form>


        <div id="message" v-else style="height: 90%;border: 1px solid #000; border-radius: 10px;padding: 8px;overflow-y: hidden; overflow-x: hidden; display: flex;
  flex-direction: column;position: relative;box-sizing: border-box;">
            <log-component :messages="messages" v-if="logType === 'log'"></log-component>
            <chat-component @handleSendMqtt="handleSendMqtt" :messages="messages"
                v-if="logType === 'chat'"></chat-component>
        </div>

    </div>
</template>
  
<script setup>
import { Form as AForm, FormItem as AFormItem, Button as AButton, Input as AInput, InputNumber as AInputNumber, InputPassword as AInputPassword, Switch as ASwitch, RadioGroup as ARadioGroup, RadioButton as ARadioButton } from 'ant-design-vue';
import { onMounted, ref, h, nextTick } from 'vue';
import logComponent from './logPage'
import chatComponent from './chatPage'

// import chatComponent from './chat.vue'
import {
    LeftOutlined,
} from '@ant-design/icons-vue';
import moment from 'moment'
import Mqtt from './mqtt'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const router = useRouter()
// const getContainer = () => {
//     return document.querySelector(".app")
// }
const handleSendMqtt = (msg) => {
    mqttServer.value && mqttServer.value.send(`/sys/folotoy/${form.value.deviceKey}/thing/command/call`, msg, 0, false)
    nextTick(() => {
        scrollToBottom(element);
    });
}
const mqttConnected = ref(false)
const logType = ref('chat')
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};
const form = ref({
    name: '',
    clientId: '',
    host: '',
    port: 8083,
    username: '',
    password: '',
    useSSL: false,
    deviceKey: '',
    path: '/mqtt'
});
const messages = ref([])
onMounted(() => {
    if (localStorage.getItem('folotoyWS')) {
        form.value = JSON.parse(localStorage.getItem('folotoyWS'))
    }
})
const mqttServer = ref(null)
let autoScroll = true;
const navigateToActivateMqttServer = () => {
    window.open(`https://${form.value.host}:${form.value.port}/mqtt`, '_blank')
}
// 检查是否滚动到元素底部
const isScrolledToBottom = (el) => {
    return el.scrollTop + el.clientHeight >= el.scrollHeight;
}

// 滚动到元素底部
const scrollToBottom = (el) => {
    el.scrollTop = el.scrollHeight;
}
let element;
// 处理滚动事件
const handleScroll = () => {
    // 如果用户已经滚动到元素底部
    if (isScrolledToBottom(element)) {
        autoScroll = true
    } else {
        // 用户主动滚动，取消自动滚动功能
        autoScroll = false;
    }
};

// 提交表单的处理函数
const handleSubmit = () => {
    form.value.topic = `/sys/folotoy/${form.value.deviceKey}/thing/event/post`;
    mqttServer.value = new Mqtt(form.value, (e) => {
        messages.value.push({ ts: moment().format('YYYY-MM-DD HH:mm:ss'), data: JSON.parse(e.payloadString) });
        if (autoScroll) {
            nextTick(() => {
                scrollToBottom(element);
            });
        }
    });
    mqttServer.value.connectMqtt(() => {
        mqttConnected.value = true;
        autoScroll = true;
        nextTick(() => {
            element = document.getElementById('message').children[0];
            element.addEventListener('scroll', handleScroll);
        })
    });
};
const handlePushToFrontPage = () => {
    mqttServer.value && disconnectMqtt()
    router.push('/')
}
// const messagePush = (messages, message) =>  {

// }
const disconnectMqtt = () => {
    mqttServer.value.disconnectMqtt()
    messages.value = []
    mqttConnected.value = false
}
</script>
  
<style>
.program {
    padding: 16px;
    height: 80%;
    overflow-y: auto;
    /* position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    height: 80%;
    transform: translate(-50%, -50%);
     */
}

.content {
    background-color: #eee;
    padding: 16px;
    margin-top: 16px;
}
</style>
  