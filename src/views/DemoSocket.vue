<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ipcRenderer } from 'electron'

import Ws from "../utils/websocket";
// import { ipcRenderer } from "electron/renderer";

const ws = ref<any>(null);
const initSocket = () => {
  // ws.value = new Ws({
  //   url: "ws://localhost:8001",
  //   webSocketType: "",
  //   onMessageCallBack,
  // });
};

// const onMessageCallBack = (data: any) => {
//   console.log(data, "返回消息");
// };

const handleEvent = () => {
  // ws.value.doSend("1111");
};

onMounted(() => {
  initSocket();
});

const openServer = ()=>{
  console.log(ipcRenderer);
  
  ipcRenderer.send('server-command', 'start');
  // ipcRenderer.send('')
  // ipcRenderer.on()
}
const closeServer = ()=>{

}
</script>

<template>
  <div>111</div>
  <button @click="handleEvent">发送</button>

  <button @click="openServer">开启</button>
  <button @click="closeServer">关闭</button>
</template>

<style lang="less" scoped></style>
