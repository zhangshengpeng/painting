<template>
  <div>
    <div class="flex-box">
      <!-- 好友列表 -->
      <div class="contact">
        <ul>
          <li v-if="!contactors.length" style="background: none; color:#aaaaaa; justify-content: center">暂无好友</li>
          <li v-for="(contactor, index) in contactors" :key="index" :class="index === isActive ? 'active':''" @click="handelclick(contactor,index)">
            <img class="head-img" :src="'https://www.bixiaohe.fun'+contactor.url">
            <span style="width:60px">{{ contactor.name }}</span>
            <span :class=" contactor.isNew ? 'new-msg' : ''" />
            <el-dropdown v-show="index === isActive" class="operation" size="small" @command="operation">
              <span><i class="el-icon-more" /></span>
              <el-dropdown-menu>
                <el-dropdown-item style="background: #fff" command="check">查看</el-dropdown-item>
                <el-dropdown-item style="background: #fff" :command="contactor.id">删除好友</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>
        <ul>
          <li class="add" @click="add">
            <img class="head-img" src="../assets/img/add3.png">
            <span style="padding-top:10px">添加好友</span>
          </li>
        </ul>
      </div>
      <!-- 显示消息 -->
      <div v-show="page === 0" class="message">
        <window :info="friend" :messages="messages" :userinfo="user" @newMsg="ding" />
      </div>
      <!-- 添加好友 -->
      <div v-show="page === 1">
        <el-form label-width="80px" style="margin:40px 0 0 40px;text-align:left">
          <el-form-item label="id">
            <el-input v-model="addId" size="small" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="addSubmit">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import window from "./window.vue"

export default {

  components: {
    window
  },
  props: {

  },
  data() {
    return {
      user: this.$store.state.user,
      friend: {
        id: '',
        name: '',
        url: '',
      },
      contactors:[],
      isActive: '0',
      page: 0,
      addId: '',
      isNew: [],
    }
  },
  computed: {
    messages() {
      return this.contactors[this.isActive] ? this.contactors[this.isActive].messages : []
    },
  },
  mounted() {
    this.getFriend()
  },
  methods: {
    getFriend() {
      this.$axios.post('https://www.bixiaohe.fun/friend-info')
      .then((res)=>{
        this.contactors = res.data
        this.contactors.forEach((item, index) => {
          this.$set( this.contactors[index], 'isNew', false)
          });
      })
      .catch((err)=>{
        console.log(err)
      })
    },
    add() {
      this.page = 1
      console.log(this.page)
    },
    handelclick(item,i) {
      this.isActive = i;
      this.friend = item;
      this.page = 0
      this.contactors[i].isNew = false
      this.$axios.post('https://www.bixiaohe.fun/history',
      {
        userId: this.user.id,
        friendId: item.id
      })
        .then(res => {
          //在对象中插入响应属性
          console.log(res)
          this.$set(this.contactors[i], 'messages', res.data)
        })
        .catch(function (error) {
        console.log(error);
      });
    },
    ding(i) {
      if(this.isActive !== i){
          this.contactors.forEach((item,index) => {
          if(item.id === i) {
            this.contactors[index].isNew = true
          }
        })
      }
      // if(this.user.id == 17764541552 && i == 1){
      //   let audio1 = document.querySelector('#lp');
      //   audio1.play();
      // }else{
      //   let audio = document.querySelector('#ding');
      //   audio.play();
      // }
    },
    operation(id) {
      if(id==='check'){
        console.log(id)
      } else{
          this.$axios.post('https://www.bixiaohe.fun/friend',{
          friend_id:id,
          user_id:this.user.id,
          operation: 'delete'
        })
        .then((res) =>{
          console.log(res)
        })
      }
    },
    addSubmit() {
      if(this.addId == this.user.id){
        this.$message({
            showClose: true,
            message: '不能添加自己为好友',
            type: 'error'
          });
      } else{
          this.$axios.post('https://www.bixiaohe.fun/friend',{
          operation: 'add',
          friend_id: this.addId,
          user_id: this.user.id
        })
        .then((res) => {
          if(res.data.status == 1){
            this.$message({
            showClose: true,
            message: '该用户不存在！',
            type: 'error'
          });
          } else if (res.data.status == 2) {
            this.$message({
              showClose: true,
              message: '你们已经是好友',
              type: 'warning'
            });
          } else if (res.data.status == 0){
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              });
          } else {
            this.$message({
              showClose: true,
              message: '添加失败',
              type: 'warning'
            });
          }
        })
      }
    },
  }
}
</script>

<style lang="less">
  ul{
    padding: 0;
  }
  li{
    display: flex;
    text-align: left;
    padding: 6px;
    list-style-type: none;
    margin: 0;
    background: rgb(230, 230, 230);
    cursor:pointer;
    &:hover{
      background: rgb(220, 220, 220)
    }
    span{
      padding-left: 8px;
      font-size: 14px;
    }
  }
  .flex-box{
    background: white;
    display: flex;
    width: 700px;
    height: 100vh;
    margin: 0 auto;
    margin-top: 0px;
  }
  .new-msg{
    height: 0px;
    display: inline-block;
    padding: 4px;
    border-radius: 4px;
    background-color: rgb(192, 56, 56);
  }
  .active{
    &:hover{
    background: rgb(200, 200, 200)
    }
    background: rgb(200, 200, 200)
  }
  .head-img{
      width: 40px;
      height: 40px;
      border-radius: 20px;
      cursor: pointer;
    }
  .contact{
    min-height: 100vh;
    width: 220px;
    background: rgb(236,236,236);
  }
  .message{
    height: 600px;
    width: 540px;
  }
  .operation{
    margin-left:40px;
    height:14px;
    line-height: 40px;
  }
</style>