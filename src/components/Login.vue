<template>
  <div class="bg">
    <div class="main">
      <div class="login">
        <h1>多人在线协同作画系统</h1>
        <div class="form">
          <p>账号</p>
          <input class="ipt" v-model="loginForm.id" type="text" autocomplete="off">
          <p style="margin-top:40px">密码</p>
          <input class="ipt" v-model="loginForm.password" type="password">
          <div class="submit">
            <button 
              class="signIn" 
              @click="login"
              style="background: rgb(94,160,246);box-shadow: 0 0 10px rgb(94,160,246);">
              登 录
            </button>
            <button 
              @click="dialogForm = true"
              class="register" 
              style="background: rgb(141,81,117);box-shadow: 0 0 10px rgb(141,81,117);">
              注 册 
            </button>
            <el-dialog 
              title="注册" 
              :visible.sync="dialogForm"
              :modal = true
              width="500px">
              <div class="sign-form">
                <p>账号</p>
                <input class="ipt" type="text" v-model="signForm.id">
                <p>昵称</p>
                <input class="ipt" type="text" v-model="signForm.name">
                <p>确认密码</p>
                <input class="ipt" type="password" v-model="signForm.password">
                <div class="sign-submit">
                  <button
                    style="background: rgb(94,160,246)" @click="register">确定</button>
                  <button @click="dialogForm = false">取消</button>
                </div>
              </div>
            </el-dialog>
          </div>
        </div>
      </div>
      <div class="img">
        <img src="../assets/img/login_bg.jpg">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogForm: false,
      loginForm: {
        id: '',
        password: ''
      },
      signForm: {
        id: '',
        name: '',
        password: ''
      }
    }
  },
  methods: {
    register() {
      this.$axios.post('https://www.zsp.cool/insert', {
        id: this.signForm.id,
        password: this.signForm.password
      })
      .then((res)=>{
        console.log('注册结果：',res)
        if(res.data.status==='0'){
          this.$message.error('账号已存在');
        } else if(res.data.status==='1'){
          this.$message({
            message: '注册成功',
            type: 'success'
          })
          this.dialogForm = false
        }

      })
      .catch((err)=>{
        console.log(err)
      })
    },
    login() {
      this.$axios.post('https://www.zsp.cool/login', {
        id: this.loginForm.id,
        password: this.loginForm.password
      })
      .then((res)=>{
        console.log('登录结果：',res)
        if(res.data.status==='0'){
          this.$message.error('登录失败')
        } else if(res.data.status==='1') {
          document.cookie = 'token='+`${res.data.token}`+';path=/'
          //触发socket登录纪录
          this.$socket.emit('online',this.$store.state.user.id)

          this.$router.push('/hall')
        }
      })
      .catch((err)=>{
        console.log(err)
      })
    }
  },
  mounted() {
    document.cookie = "token=''"
  }
}
</script>
<style lang="less" scoped>
input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
	-webkit-box-shadow: 0 0 0 1000px white inset; // 背景设为白色
	-webkit-text-fill-color: rgb(4,66,149); // 字体颜色
}
input[type=text]:focus, input[type=password]:focus, textarea:focus {
	-webkit-box-shadow: 0 0 0 1000px white inset; // 获得焦点时背景设为白色
	-webkit-text-fill-color: rgb(4,66,149); // 字体颜色
}
  .bg{
    padding-top: 100px;
    display: flex;
    justify-content: center;
    height: 100vh;
    min-width: 1300px;
    background: linear-gradient(to bottom right, rgb(94,160,246), rgb(141,81,117));
  }
  .main{
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    width: 900px;
    height: 600px;
    border-radius: 4px;
  }
  .login{
    width: 560px;
    padding-left: 100px;
    padding-top: 60px;
    text-align: left;
    h1{
      color: rgb(50, 74, 146)
    }
    .form{
      margin-top: 100px;
      p{
        color: #aaaaaa;
        font-size: 14px;
        margin-bottom: 10px;
      }
      .ipt{
        border: 0;
        background: none;
        width: 320px;
        padding: 0 0 4px 0;
        color: rgb(4,66,149);
        border-bottom: 1px solid #dddddd;
      }
      .ipt:focus{
        outline: none;
      }
      .submit{
        width: 320px;
        margin-top: 40px;
        display: flex;
        justify-content: space-between;
        button{
          border: none;
          color: #ffffff;
          width: 120px;
          height: 40px;
          border-radius: 20px;
          font-size: 16px;
          cursor: pointer;
          transition: all .5s;
        }
        button:active{
          transform:scale(1.1)
        }
        button:focus{
          outline: none;
        }
      }
    }
  }
  .img{
    max-width: none;
    img{
      height: 600px;
      width: 337px;
      border-radius: 0 4px 4px 0;
    }
  }
  .sign-form{
    padding-left: 60px;
    width: 320px;
  }
  .sign-submit{
    padding-top: 40px;
    display: flex;
    justify-content: space-between;
  }
</style>
