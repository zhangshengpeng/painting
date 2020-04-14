<template>
  <div id="app">
    <!-- top -->
    <header class="top-container">
      <p style="display:inline-block;width: 200px;padding:0;margin:0;height:50px;background: #333333"></p>
      <span
        style="padding: 16px 36px;"
        @click="$router.push('/hall')">
        <i style="height:18px;padding-right:4px" class="el-icon-s-home" />
        大厅
      </span>
      <span @click="$router.push('/history')">
        <i style="height:18px;padding-right:4px" class="el-icon-date" />
        绘画记录
      </span>
      <span @click="toChat()">
        好友
      </span>
      <el-input
          class="input">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </header>
    <div class="center-container">
      <!-- left -->
      <aside class="left-container">
        <div style="width:60px;height:60px;padding-left:70px">
          <img 
            :src=" user.url==null ?  `https://www.zsp.cool/img/default.jpg` : `https://www.zsp.cool${user.url}`"
            @click="changeInfo"
            class="head-img"
            style="width:60px"
            alt="点击修改个人信息">
        </div>
          <p>昵称 :{{user.name}}</p>
          <p>id :{{user.id}}</p>
          <p>地址 :{{user.address}}</p>
      </aside>
      <!-- main -->
      <div class="main-card">
        <router-view></router-view>
      </div>
    </div>
    <!-- 修改信息 -->
    <el-dialog
    style="width: 1500px;"
    :visible.sync="showDialog">
      <el-form :model="upload" :rules="uploadRule" ref="upload" label-width="80px" style="margin:40px 0 0 40px;text-align:left;width:300px;">
          <el-form-item label="头像" prop="url">
            <el-upload class="upload" action="https://www.zsp.cool/upload-img" method="post" name="user" :on-success="headUpload">
              <img v-if="upload.url" :src="'https://www.zsp.cool'+upload.url" class="upload-img">
              <i v-else class="el-icon-plus" />
            </el-upload>
          </el-form-item>
          <el-form-item label="昵称" prop="name">
            <el-input v-model="upload.name" size="small" />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="upload.address" size="small" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="uploadSubmit">
              修改
            </el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
    <el-drawer
      title="好友列表"
      :with-header="false"
      size="700px"
      :visible.sync="showChat">
      <div>
        <chat />
      </div>
    </el-drawer>
  </div>
</template>
<script>
import chat from "./chat.vue"

export default {
  components: {
    chat
  },

  data() {
    return {
      user: {
        url: ''
      },
      houseList: {},
      showDialog: false,
      showChat: false,
      upload: {
        url: '',
        name: '',
        address: ''
      },
      uploadRule: {
        url: [
          { required: true, message: '请选择图片', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '昵称不能为空', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '地址不能为空', trigger: 'blur' },
        ]
      }
    };
  },
  methods: {
    getInfo() {
      this.$store.dispatch('getInfo')
      .then((response)=>{
        if(response.status == 1) {
          window.location.href = 'https://www.zsp.cool';
        } else {
          this.user = this.$store.state.user
          if(this.user.url == null) {
              this.$notify({
                title: '提示',
                message: '点击头像可修改个人信息',
                duration: 5000
              });
          }
          window.console.log(this.user)
          for(let i in this.upload) {
            this.upload[i] = this.user[i]
          }
          //对象解构为upload复制
          // let { id,password, ...upload } = this.user
          // this.upload = upload
          window.console.log('upload:',this.upload)
          //触发socket登录纪录
          this.$socket.emit('online',this.$store.state.user.id)
        }
      })
      .catch(function (error) {
        window.console.log(error);
      });
    },
    changeInfo() {
      this.showDialog = true
    },
    headUpload(res) {
      this.upload.url = res.url
    },
    uploadSubmit() {
      this.$refs.upload.validate((valid)=>{
        if(valid) {
          this.$axios.post('https://www.zsp.cool/upload-info',this.upload)
            .then((res) => {
              this.user.name = res.data.name
              this.user.address = res.data.address
              this.user.url = res.data.url
              this.showDialog = false
            })
        } else {
          return false;
        }
      })
    },
    toChat() {
      // window.open('https://www.zsp.cool/chat')
      this.showChat = true
    }
  },
  mounted() {
    this.getInfo()
  }
};
</script>
<style lang="less" scoped>
  body {
    margin: 0;
    padding: 0;
  }
  .top-container {
    text-align: left;
    height: 50px;
    min-width: 1200px;
    background-color: #999999;
    span{
      font-size: 18px;
      line-height: 18px;
      vertical-align: top;
      color: #ffffff;
      display: inline-block;
      padding: 16px;
      transition:background-color 0.5s;
      cursor: pointer;
      &:hover{
        font-size: 18px;
        line-height: 18px;
        background: #666666;
      }

    }
  }
  .center-container{
    display: flex;
  }
  .left-container {
    height: 100vh;
    min-height: 800px;
    width: 200px;
    flex-shrink: 0;
    background-color: #333333;
    padding-top:20px;
    text-align: center;
    p{
      font-size: 14px;
      color: white;
      font-weight: 300;
    }
  }
  .main-card{
    padding: 10px;
    width: 100%;
  }
  .head-img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #999999;
    border: none;
    cursor: pointer;
  }
  .input{
    float: right;
    width: 300px;
    margin-top: 4px;
    margin-right: 60px;
  }
  .upload{
    width: 80px;
    height: 80px;
     border: 1px dashed #d9d9d9;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    text-align: center;
    i{
      font-size: 28px;
      color: #d9d9d9;
      line-height: 80px;
    }
  }
  .upload-img{
    width: 80px;
    height: 80px;
  }
</style>