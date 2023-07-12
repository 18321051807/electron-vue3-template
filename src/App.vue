<script setup lang="ts">
import { onMounted, ref } from "vue";
import DemoSocket from "./views/DemoSocket.vue";
const interval = ref<any>(null); // 计时器
const initialPosition = ref<Number[]>([]); // 初始位置
const remoteSensArr = ref<Number[]>([]);

// const coord = 0.0000152587890625;
const coord = 0;

const init = () => {
  // 监听游戏手柄
  window.addEventListener("gamepadconnected", function (e) {
    console.log(e, "监听游戏手柄");
    var gp = navigator.getGamepads()[e.gamepad.index];
    console.log(gp);
    startgamepad(); // 启动手柄
  });
  // 监听游戏手柄拔出
  window.addEventListener("gamepaddisconnected", function (e) {
    clearInterval(interval.value); // 停止获取手柄数据
    console.log(e, "监听游戏手柄拔出");
  });
};

// 启动手柄
const startgamepad = () => {
  var gamepad1: any = navigator.getGamepads()[0];
  initialPosition.value = gamepad1.axes;
  interval.value = setInterval(function () {
    var gamepad: any = navigator.getGamepads()[0];
    remoteSensing(gamepad.axes);
    pressKey(gamepad.buttons);
  }, 200);
};

// 手柄遥感
const remoteSensing = (arr: any) => {
  // console.log(arr, "手柄摇杆");
  remoteSensArr.value = arr;
  compareRemoteScene(arr);
  // conpareReoteScene(initialPosition.value, arr);
  // arr[0] -1 ~ 1 : 左手边 左 ~ 右
  // arr[1] -1 ~ 1 : 左手边 上 ~ 下
  // arr[2] -1 ~ 1 : 右手边 左 ~ 右
  // arr[3] -1 ~ 1 : 右手边 上 ~ 下
};

const compareRemoteScene = (arr: any[]) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].toFixed(1) != coord) {
      switch (i) {
        case 0:
          if (arr[0].toFixed(1) > coord) {
            console.log("左 ～～ 右", arr[0].toFixed(1));
          } else {
            console.log("左 ～～ 左", arr[0].toFixed(1));
          }
          break;
        case 1:
          if (arr[1].toFixed(1) > coord) {
            console.log("左 ～～ 下", arr[1].toFixed(1));
          } else {
            console.log("左 ～～ 上", arr[1].toFixed(1));
          }
          break;

        case 2:
          if (arr[2].toFixed(1) > coord) {
            console.log("右 ～～ 右", arr[2].toFixed(1));
          } else {
            console.log("右 ～～ 左", arr[2].toFixed(1));
          }
          break;

        case 3:
          if (arr[3].toFixed(1) > coord) {
            console.log("右 ～～ 下", arr[3].toFixed(1));
          } else {
            console.log("右 ～～ 上", arr[3].toFixed(1));
          }
          break;
        default:
          break;
      }
    }
  }
};

// 手柄按键
const pressKey = (arr: any) => {
  // console.log(arr, "手柄按键");
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].value == 1) {
      // console.log(i);
      // 根据个人情况判断；不同手柄值不同。
      if (i == 0) {
        console.log("A");
      }
      if (i == 1) {
        console.log("B");
      }
      if (i == 2) {
        console.log("X");
      }
      if (i == 3) {
        console.log("Y");
      }

      if (i == 4) {
        console.log("左手1");
      }
      if (i == 5) {
        console.log("右手1");
      }
      if (i == 6) {
        console.log("左手2");
      }
      if (i == 7) {
        console.log("右手2");
      }

      if (i == 8) {
        console.log("BACK");
      }
      if (i == 9) {
        console.log("START");
      }

      if (i == 10) {
        console.log("左遥感按下");
      }
      if (i == 11) {
        console.log("右遥感按下");
      }

      if (i == 12) {
        console.log("上");
      }
      if (i == 13) {
        console.log("下");
      }
      if (i == 14) {
        console.log("左");
      }
      if (i == 15) {
        console.log("右");
      }
    }
  }
};

onMounted(() => {
  init();
});
</script>

<template>
  <div>
    <div class="home">主页</div>
    <demo-socket></demo-socket>
  </div>
</template>

<style scoped></style>
