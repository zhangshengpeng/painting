<template>
  <div>
      <div class="users">
        <div class="user" v-for="(item, index) in list" :key="index">
          <div class="head"><img :src="item.url==null ? `https://www.bixiaohe.fun/img/default.jpg`: `https://www.bixiaohe.fun/${item.url}`"></div>
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
      <div style="display: flex;border: 1px solid #999999; font-size: 14px; color: #dddddd">
        <div class="tools">
          <canvas id="color" width="200" height="200"></canvas>
          <div class="color-number">
            <input v-model="pen.color"/>
            <!-- <el-button class="add">添加</el-button> -->
          </div>
          <div>
            色板
            <div class="color-block">
              <div class="blk1" @click="colorBlock('#d83741')"></div>
              <div class="blk2" @click="colorBlock('#af26b9')"></div>
              <div class="blk3" @click="colorBlock('#413bda')"></div>
              <div class="blk4" @click="colorBlock('#12c0db')"></div>
              <div class="blk5" @click="colorBlock('#22db2a')"></div>
              <div class="blk6" @click="colorBlock('#c5d229')"></div>
              <div class="blk7" @click="colorBlock('#d1540f')"></div>
              <div class="blk8" @click="colorBlock('#ffffff')"></div>
            </div>
          </div>
          <div class="pen">
            画笔
            <div class="pen-list">
              <div v-for="(pen, index) in pens" :key = index @click="changeSize(index)" :style="{ background: pen.bg }">
                <div class="pen-size" :style="{ background: bg, width: pen.size, height: pen.size }" ></div>
              </div>
            </div>
            <el-slider v-model="pen.size" @change="changeSize(pen.size)" max="50"></el-slider>
          </div>
          <div>
            透明度
            <el-slider v-model="pen.pellucidity" @change="changePellucidity(pen.pellucidity)" max="10"></el-slider>
          </div>
          <div>
            <el-button :disabled="this.$route.query.houseId==-1" @click="save">
              保存画板
            </el-button>
          </div>
        </div>
        <canvas id="canv" width="1000" height="800" ref="canvas"></canvas>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return{
      user: this.$store.state.user,
      paintingId: -1,
      draw: false,
      list: [ this.$store.state.user ],
      pen: {
        color: '#6b2d96',
        size: 1,
        pellucidity: 10
      },
      initPoint: {
        offsetX: 1,
        offsetY: 1
      },
      pens: [{size:'1px', bg:''}, {size:'2px', bg:''}, {size:'4px', bg:''}, {size:'6px', bg:''}, {size:'8px', bg:''}, {size:'10px', bg:''}, {size:'12px', bg:''}, {size:'14px', bg:''}, {size:'16px', bg:''}],
      bg: '#dddddd'
    }
  },
  sockets: {
    ac(data) {
      window.console.log(data)
      let canvas = document.getElementById('canv');
      let ctx = canvas.getContext('2d');

      ctx.strokeStyle = data.pen.color
      ctx.fillStyle = data.pen.color
      ctx.lineWidth = data.pen.size
      if(data.arr.length===1){
        ctx.beginPath()
        ctx.moveTo(data.arr[0].x, data.arr[0].y)
        ctx.arc(data.arr[0].x, data.arr[0].y,data.pen.size/2, 0, 2*Math.PI, true)
        ctx.fill();
      }else { 
        data.arr.forEach((item)=>{
          ctx.lineTo(item.x, item.y);
          ctx.stroke()
        })
      }
      ctx.beginPath()
      ctx.fillStyle = this.pen.color
      ctx.lineWidth = this.pen.size
    },
    RoomInit(data){
      console.log('initdata',data)
      if(data.house.paintingId) {
        this.paintingId = data.house.paintingId
        console.log(this.paintingId)
      }
      let canvas = document.getElementById('canv');
      let ctx = canvas.getContext('2d');
      let img = new Image()
      img.src = data.base64
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 1000, 800); 
      }
    },
    addUser(res) {
      window.console.log("addUser",res)
      this.list = res.user
    },
    houseList(houseList){
      houseList.forEach((item)=>{
        if(item.houseId==this.$route.query.houseId){
          this.list = item.user
        }
      })
    },
    saveSuccess(res) {
      if(res.paintingId) {
        this.paintingId = res.paintingId
      }
      this.$message({
        message: '保存成功',
        type: 'success'
      });
    }
  },
  methods: {
    canvInit() {
      const that = this
      let arr = []
      let color = document.getElementById('color');
      let colorCtx = color.getContext('2d')
      colorCtx.beginPath();
      //取色条渐变
      let gradientBar = colorCtx.createLinearGradient(0, 0, 0, 160);
      gradientBar.addColorStop(0, '#f00')
      gradientBar.addColorStop(1 / 6, '#f0f')
      gradientBar.addColorStop(2 / 6, '#00f')
      gradientBar.addColorStop(3 / 6, '#0ff')
      gradientBar.addColorStop(4 / 6, '#0f0')
      gradientBar.addColorStop(5 / 6, '#ff0')
      gradientBar.addColorStop(1, '#f00')
      colorCtx.fillStyle = gradientBar
      colorCtx.fillRect(0,0,20,160)
      if(that.$route.query.houseId>-1) { 
        color.addEventListener("mousedown", getColor, false);
       }
      

      let canvas = document.getElementById('canv');
      let ctx = canvas.getContext('2d');
      ctx.lineCap = 'round'
      ctx.fillStyle = '#fff';
      ctx.fillRect(0,0,1000,800)
      if(that.$route.query.houseId>-1) { 
        canvas.addEventListener("mousedown",doMouseDown,false);
        canvas.addEventListener("mouseup",doMouseUp,false);
        canvas.addEventListener("mousemove",doMouseMove,false);
        canvas.addEventListener("mouseout",doMouseOut,false);
       }

      getColor(this.initPoint)
      //鼠标按下响应事件
      function doMouseDown(event) {
        let x = event.offsetX;
        let y = event.offsetY;
        this.draw = true;
        ctx.fillStyle = that.pen.color
        ctx.strokeStyle = that.pen.color
        ctx.lineWidth = that.pen.size
        window.console.log('鼠标按下：',that.pen)
        ctx.arc(x, y, that.pen.size/2, 0, 2*Math.PI, true)
        ctx.fill();
        ctx.beginPath()
        ctx.moveTo(x,y)
        // ctx.stroke(x, y)
        arr.push({ x,  y })
      }
      //鼠标抬起
      function doMouseUp() {
        this.draw = false
        ctx.beginPath()
        that.$socket.emit('action', {
          houseId: that.$route.query.houseId,
          arr,
          pen: that.pen
        })
        arr = []
      }
      //鼠标移动
      function doMouseMove(event) {
        let x = event.offsetX;
        let y = event.offsetY;
        if(this.draw===true) {
          arr.push({
            x,
            y
          })
          ctx.fillStyle = that.pen.color
          ctx.lineWidth = that.pen.size
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }
      //鼠标离开
      function doMouseOut() {
        this.draw = false;
      }
      //获取彩条颜色
      function getColor(e) {
        let color = colorCtx.getImageData(e.offsetX, e.offsetY, 1, 1)
        that.pen.color = that.rgb(color.data)
        if(e.offsetX<20) {
          //饱和度
          let saturation = colorCtx.createLinearGradient(30,0,170,0)
          saturation.addColorStop(1, that.pen.color)
          saturation.addColorStop(0, 'white')
          colorCtx.fillStyle = saturation
          colorCtx.fillRect(30,0,190,160)

          let black = colorCtx.createLinearGradient(30, 0, 30, 140)
          black.addColorStop(0,'rgba(0,0,0,0)')
          black.addColorStop(1,'rgba(0,0,0,1)')
          colorCtx.fillStyle = black;
          colorCtx.fillRect(30,0,190,160)
        }
        if(e.offsetX>20||e.offsetX===1){
          colorCtx.fillStyle = that.pen.color
          colorCtx.fillRect(0, 170, 20,20)
          ctx.strokeStyle = that.pen.color
        }
      }
    },
    rgb(arr) {
      let value = (1 << 24) + arr[0] * (1 << 16) + arr[1] * (1 << 8) + arr[2];
      value = value.toString(16);
      return '#' + value.slice(1);
    },
    colorBlock(e) {
      this.pen.color = e
      let color = document.getElementById('color');
      let colorCtx = color.getContext('2d')
      let canvas = document.getElementById('canv');
      let ctx = canvas.getContext('2d');
      colorCtx.fillStyle = e
      colorCtx.fillRect(0, 170, 20,20)
      ctx.strokeStyle = this.pen.color
    },
    changeSize(index) {
      this.pen.size = index+1
      let canvas = document.getElementById('canv');
      let ctx = canvas.getContext('2d');
      ctx.lineWidth = index+1
      this.pens.forEach((element,i) => {
        if(i===index) {
          this.pens[i].bg = '#aaaaaa'
        } else {
          this.pens[i].bg = ''
        }
      })
      ctx.globalAlpha = this.pen.pellucidity*0.1
    },
    save() {
      let time = new Date().valueOf()
      console.log(this.list)
      this.$socket.emit('saveCanv', {
        houseId: this.$route.query.houseId,
        paintingId: this.paintingId,
        users: this.list,
        time: time
      })
    }
  },
  mounted() {
    if(this.$route.query.paintingId) {
      this.paintingId = this.$route.query.paintingId
    }
    console.log(this.$route.query)
    this.canvInit()
    this.$nextTick(() => {
        this.$socket.emit('RoomInit', {
        houseId: this.$route.query.houseId,
        userId: this.$store.state.user.id,
        paintingId: this.paintingId
        })
    })
  }
}
</script>

 <style lang="less" scoped>
  #color{
    cursor:crosshair
  }
  #canv{
    cursor: crosshair;
  }
  .users{
    display: flex;
    .head{
      font-size:0;
      img{
        width: 60px;
        height: 60px;
        border-radius: 30px;
        background: #999999;
      }
    }
    .user{
        margin-right: 10px;
      }
    .name{
      height: 20px;
      width: 60px;
      font-size: 14px;
      font-weight: 300px;
      text-align: center;
      line-height: 20px;
    }
  }
  .tools{
    padding: 10px;
    height: 780px;
    flex-shrink: 0;
    background: rgb(83, 83, 83);
    .color-number{
      top: 320px;
      left: 250px;
      position: absolute;
      input{
        background: none;
        border: none;
        width: 130px;
        color: white;
        &:focus{
          outline: none;
        }
      }
      .add{
        padding: 4px;
        background: #999999;
        border: none;
        color: #dddddd
      }
    }
    .color-block{
      display: flex;
      div{
        margin-top: 10px;
        margin-left: 8px;
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
      .blk1{
        background: #d83741
      }
      .blk2{
        background: #af26b9
      }
      .blk3{
        background: #413bda
      }
      .blk4{
        background: #12c0db
      }
      .blk5{
        background: #22db2a
      }
      .blk6{
        background: #c5d229
      }
      .blk7{
        background: #d1540f
      }
      .blk8{
        background: #ffffff
      }
    }
    .pen{
      margin-top: 20px;
      .pen-list{
        margin-top: 10px;
        display: flex;
        div{
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          &:hover{
            background: #aaaaaa
          }
        }
      }
    }
  }
 </style>