<template>
  <div id="main-container">
    <div class="no-room" v-if="!roomList.length"> 暂无房间 </div>
    <div v-for="(item, index) in roomList" :key="index" class="room-container">
      <el-card :body-style="{ padding: '10px' }">
        <div class="image">
          <img class="room-img" :src="`https://www.zsp.cool/img/${item.type==='1'?'battle.jpg':'paint.jpg'}`" />
        </div>

        <div style="padding: 14px;" class="text">
          <div>
            <p>房间号: {{ item.houseId }}</p>
            <!-- <p>类型：{{ item.type | type }}</p> -->
            <p>玩家：{{ item.user | users }}</p>
          </div>
        </div>
        <div class="bottom clearfix">
          <el-button type="primary" class="button" round @click="goRoom(item)">进入画室</el-button>
        </div>
      </el-card>
    </div>

    <!-- 创建房间 -->
    <div class="createRoom">
      <el-button style="transform: translate(-100%, 0);" @click="createRoom" round>创建画室</el-button>
    </div>

    <!-- 弹出框 -->
    <!-- <el-dialog title="创建房间" :visible.sync="dialogVisible" width="30%">
      <span>类型：</span>
      <el-select v-model="type" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createRoom">确 定</el-button>
      </span>
    </el-dialog> -->
    <el-dialog
      title="提示"
      :visible.sync="showJoin"
      width="30%">
      <span>你有正在进行中的游戏，是否进入该房间</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="quit">取 消</el-button>
        <el-button type="primary" @click="backHouse">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  filters: {
    type(val) {
      switch (val) {
        case '1': 
          return '猜拳';
        case '2':
          return '画室';
      }
    },
    users(val) {
      let str = val.map((item)=>{
        return item.name;
      })
      return str.join(' | ')
    }
  },
  data() {
    return {
      roomList: [],
      type: "",
      showJoin: false,
      houseId: ''
    };
  },
  sockets: {
    houseList(res) {
      this.roomList = res
      res.forEach((house)=>{
        house.user.forEach((u)=>{
          if(u.id==this.$store.state.user.id) {
            this.houseId = house.houseId
            this.type = house.type
            window.console.log('房间号：',this.houseId)
            this.showJoin = true
          }
        })
      })
      window.console.log("房间列表")
      window.console.log(this.roomList)
    },
    createHouse(houseList) {
      window.console.log('接收参数', houseList)
      houseList.forEach(item => {
        if(item.user[0].id==this.$store.state.user.id){
          this.$store.commit('setInfo',item.user[0])
          if(this.type=='2'){
            this.$router.push(`/paint?houseId=${item.houseId}`)
          }
        }
      });
    },
    leave(id) {
      window.console.log(id)
    }
  },
  methods:{
    test() {
      this.$socket.emit('action', [{x:1, y:2}])
    },
    createRoom() {
      let params = {
        type: '2',
        userId: this.$store.state.user.id,
        userName: this.$store.state.user.name,
        userUrl: this.$store.state.user.url,
      }
      this.$socket.emit('createHouse', params)
    },
    goRoom(house){
      this.$socket.emit('addUser',{
        houseId: house.houseId,
        userId: this.$store.state.user.id,
        userName: this.$store.state.user.name,
        userUrl: this.$store.state.user.url
      })
      if(house.type==='1'){
        this.$router.push(`/battle?houseId=${house.houseId}`)
      } else if(house.type==='2') {
        this.$router.push(`/paint?houseId=${house.houseId}`)
      }else if(house.type==='3') {
        this.$router.push(`/click?houseId=${house.houseId}`)
      }else if(house.type==='4') {
        this.$router.push(`/mali?houseId=${house.houseId}`)
      }
    },
    backHouse() {
      if(this.type=='1'){
        this.$router.push(`/battle?houseId=${this.houseId}`)
      } else if(this.type=='2'){
        this.$router.push(`/paint?houseId=${this.houseId}`)
      }else if(this.type=='3'){
        this.$router.push(`/click?houseId=${this.houseId}`)
      }
    },
    quit(){
      this.showJoin = false
      this.$socket.emit('userLeave',{
        houseId: this.houseId,
        userId: this.$store.state.user.id
      })
    },
  },
  mounted() {
    window.console.log('初始化')
    this.$socket.emit('houseList')
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scope>
#main-container{
  width: 100%;
}

.el-card__body {
  display: flex;
}
.image,
.text,
.bottom {
  font-weight: 300;  
  display: inline-block;
}
.image {
  flex-grow: 0;
  display: flex;
  align-items: center
}
.text {
  flex-grow: 1;
  display: flex;
  align-items: center;
}
.bottom {
  flex-grow: 1;
  display: flex;
  align-items: center;
  button {
    margin: 0 auto;
  }
}
.room-container {
  margin-bottom: 10px;
}
.room-img{
  width: 200px;
  height: 120px;
}
.no-room{
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #aaaaaa;
  font-weight: 300;
}
.createRoom {
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  bottom: 30px;
}
</style>
