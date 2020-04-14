<template>
  <div v-show="info.id!==''">
    <div class="head">
      {{ info.name }}
    </div>
    <!-- 显示消息 -->
    <div class="main">
      <div ref="chatContainer" class="message">
        <div v-for="(item,index) in messages" :key="index">
          <message :msg="item" :user="userinfo" :friend="info" />
        </div>
      </div>
    </div>
    <!-- 输入栏 -->
    <div class="foot">
      <el-upload class="upload" action="/img" name="img" :show-file-list="false" :on-success="sendImg">
        <img class="foot-img" src="../assets/img/img.png">
      </el-upload>
      <el-popover
        placement="top-start"
        trigger="hover"
        width="300">
        <div class="emoji-item">
          <img v-for="(item,index) in emojis" :key="index" :src="`https://www.zsp.cool/${item.src}`" @click="sendEmoji(index)">
        </div>
        <img slot="reference" class="emoji" src="../assets/img/emoji.png">
      </el-popover>
      <textarea v-model="textarea" @keyup.enter="handelSubmit" />
      <button @click="handelSubmit">发送</button>
    </div>
  </div>
</template>

<script>
import message from './message.vue'
export default {
  components: {
    message
  },
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    },
    messages: {
      type: Array,
      default() {
        return []
      }
    },
    userinfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      textarea:'',
      emojis: [
        { src:'/img/emoji/00.gif'},
        { src:'/img/emoji/01.gif'},
        { src:'/img/emoji/02.gif'},
        { src:'/img/emoji/03.gif'},
        { src:'/img/emoji/04.gif'},
        { src:'/img/emoji/05.gif'},
        { src:'/img/emoji/06.gif'},
        { src:'/img/emoji/07.gif'},
        { src:'/img/emoji/08.gif'},
        { src:'/img/emoji/09.gif'},
        { src:'/img/emoji/10.gif'},
        { src:'/img/emoji/11.gif'},
        { src:'/img/emoji/12.gif'},
        { src:'/img/emoji/13.gif'},
        { src:'/img/emoji/14.gif'},
        { src:'/img/emoji/15.gif'}
      ]
    }
  },
  updated() {
    this.$nextTick(() => {
      let container = this.$refs.chatContainer
      container.scrollTop = container.scrollHeight
    })
  },
  methods: {
    handelSubmit() {
      if(this.textarea !== '\n' && this.textarea !== '') {
        let myDate = new Date();
        let time =  myDate.toLocaleString();
        let str = {
          to: this.info.id,
          time: time,
          message: this.textarea,
          say: this.userinfo.id
        }
        this.$socket.emit('message', str)
        this.textarea = ''
      }
    },
    sendImg(res) {
      let myDate = new Date();
      let time =  myDate.toLocaleString();
      let str = {
        to: this.info.id,
        time: time,
        url:res.imgUrl,
        say: this.userinfo.id
      }
      this.$socket.emit('message', str)
    },
    sendEmoji(i) {
      let myDate = new Date();
      let time =  myDate.toLocaleString();
      let str = {
        to: this.info.id,
        time: time,
        src: this.emojis[i].src,
        say: this.userinfo.id
      }
      this.$socket.emit('message', str)
    }
  },
  sockets:{
    message(res) {
      if(res.say === this.info.id || res.say === this.userinfo.id ){
        if(res.say === this.info.id) {
          this.$emit('newMsg', res.say)
        }
        this.messages.push(res)
      }
      else {
        this.$emit('newMsg', res.say)
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .head{
        height: 19px;
        padding:10px 0;
        background-color: rgb(240, 240, 240);
      border-bottom: solid 1px rgb(230, 230, 230)
  }
  .main{
      height: 600px;
      background-color: rgb(240, 240, 240);
      overflow: auto;
  }
  .foot{
    text-align: left;
    position: relative;
    &-img{
      position: absolute;
      margin-left: 10px;
      margin-top: 4px;
      width: 24px;
      height: 20px;
      cursor: pointer;
    }
    textarea{
      padding:30px 10px 10px 10px;
      width: 510px;
      height: 140px;
      border: none;
      outline: none;
      resize : none;
    }
  button{
    margin-left: 430px;
    padding: 6px 20px;
    line-height: 14px;
    font-size: 14px;
    border: none;
    padding: none;
    color: white;
    cursor: pointer;
    &:focus{
      outline: none;
    }
    &:hover{
      background: rgb(0, 163, 120)
    }
  }
  }
  .bt{
      float:right;

  }
  .message{
      height: 580px;
      width: 510px;
      padding: 10px;
      text-align: left;
      overflow:auto
  }
  .time{
      text-align: center;
      font-size: 0.8em;
      color: rgb(109,110,106)
  }
  .upload{
    margin-top: -10px;
    width: 24px;
    height: 20px;
  }
  .emoji{
    position: absolute;
    margin-left: 46px;
    width: 22px;
    height: 22px;
    cursor: pointer;
    &-item{
      img{
        width: 50px;
        height: 50px;
        cursor: pointer;
      }
    }
  }
</style>
