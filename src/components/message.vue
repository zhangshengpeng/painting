<template>
  <div>
    <!-- 如果消息为自己发送 -->
    <div v-if="msg.say==user.id">
      <div style="text-align: center;font-size: 0.8em;color: rgb(109,110,106)">
        {{ msg.time }}
      </div>
      <div style="display:inline-block;">
        <div style=" float: left; ">
          <img
          v-if="user.url"
            style="width: 40px;height: 40px;border-radius: 50%;"
            :src="'https://www.bixiaohe.fun'+user.url">
        </div>
        <div style="padding-left: 50px">
          <p style="margin: 0;padding-bottom:8px">
            {{ user.name }}
          </p>
          <div style="background-color: rgb(0,163,120);padding: 10px;border-radius: 8px;color: white">
            <img v-if="msg.url" class="img" :src="'https://www.bixiaohe.fun'+msg.url">
            <img v-if="msg.src" style="width:50px;height:50px" class="img" :src="msg.src">
            {{ msg.message }}
          </div>
        </div>
      </div>
    </div>
    <!-- 消息为好友发送 -->
    <div v-else>
      <div>
        <div style="text-align: center;font-size: 0.8em;color: rgb(109,110,106)">
          {{ msg.time }}
        </div>
        <div style="display:block;overflow:hidden">
          <div style="display:inline-block;float: right;">
            <div style="float: right;">
              <img
                v-if="friend.url"
                style="width: 40px;height: 40px;border-radius: 50%;"
                :src="'https://www.bixiaohe.fun'+friend.url">
            </div>
            <div style="float: right;padding-right: 10px">
              <div style="overflow:hidden">
                <p style="margin: 0;float:right;padding-bottom:8px">
                  {{ friend.name }}
                </p>
              </div>
              <div style="background-color: rgb(51,73,94);padding: 10px;border-radius: 8px;color: white">
                <img v-if="msg.url" class="img" :src="'https://www.bixiaohe.fun'+msg.url">
                <img v-if="msg.src" style="width:50px;height:50px" class="img" :src="msg.src">
                {{ msg.message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:'Message',
  props:{
    msg: {
      type: Object,
      default() {
        return{}
      }
    },
    user: {
      type: Object,
      default() {
        return{}
      }
    },
    friend: {
      type: Object,
      default() {
        return{}
      }
    }
  }
}
</script>
<style>
.img{
  max-width: 200px;
}
div,p,span{
  font-weight: 300;
}
</style>
