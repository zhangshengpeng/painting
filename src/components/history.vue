<template>
  <div>
    <el-table
      :data='tableData'>
      <el-table-column 
        label="保存时间" 
        align="center"
        width="350">
        <template slot-scope="scope">
          {{ scope.row.time | time}}
        </template>
      </el-table-column>
      <el-table-column
        label="画板ID"
        align="center"
        width="240"
        prop="paintingId">
      </el-table-column>
      <el-table-column
        label="编辑人员"
        align="center"
        width="500">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.editors" :key="index">
              {{ item.name }}
            </span>
          </template>
      </el-table-column>
      <el-table-column
      label="操作"
      align="center">
        <template slot-scope="scope">
          <el-button
          size="mini" @click="createRoom(scope.row)">查看</el-button>
        <el-button
          size="mini"
          type="danger" @click="deletePaint(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  filters: {
    time(value) {
      let date = new Date(value)
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      let D = date.getDate() + ' ';
      let h = date.getHours() + ':';
      let m = date.getMinutes() + ':';
      let s = date.getSeconds();
      return Y+M+D+h+m+s;
    }
  },
  data() {
    return {
      user: this.$store.state.user,
      tableData: [],
      paintingId: -1
    }
  },
  sockets: {
    createHouse(houseList) {
      window.console.log('房间列表', houseList)
      houseList.forEach(item => {
        if(item.user[0].id==this.$store.state.user.id){
          console.log('找到房间')
          this.$store.commit('setInfo',item.user[0])
          this.$router.push(`/paint?houseId=${item.houseId}&paintingId=${this.paintingId}`)
        }
      });
    }
  },
  methods: {
    async getList() {
      let res = await this.$axios.post('https://www.zsp.cool/paint-history',{
      id: this.user.id
    })
    this.tableData = res.data
    let r = await this.$axios.post('https://www.zsp.cool/editors', {
      paints: this.tableData.map((item)=>{
        return item.paintingId
      })
    })
    this.tableData.forEach((item, i)=> {
      this.tableData[i].editors = r.data[i]
      this.$set(this.tableData, 'editors', r.data[i])
    })
    console.log('tableData',this.tableData)
    },
    createRoom(row) {
      // this.paintingId = row.paintingId
      // let params = {
      //   paintingId: this.paintingId,
      //   type: '2',
      //   userId: this.$store.state.user.id,
      //   userName: this.$store.state.user.name,
      //   userUrl: this.$store.state.user.url,
      // }
      // this.$socket.emit('createHouse', params)
      this.$router.push(`/paint?houseId=-1&paintingId=${row.paintingId}`)
    },
    async deletePaint(index,row) {
      let res =  await this.$axios.post('https://www.zsp.cool/delete-paint',{
        paintingId: row.paintingId
      })
      if(res.data.status === 1){
        this.tableData.splice(index,1)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
<style lang="less" scoped>

</style>