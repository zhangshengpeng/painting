<template>
  <div>
    <div class="table">
      <!-- <a-table
        bordered
        :columns="columns"
        :pagination="false"
        :dataSource="tableData"
        :showHeader="false"
      >
      </a-table> -->
      <table style="width:100%">
        <tr class="row">
          <td class="title">申请人姓名</td>
          <td style="text-align: left">{{ tableData.name }}</td>
          <td class="title" style="width: 27%">
            身份证件（
            <a-radio-group name="radioGroup" :defaultValue="1">
              <a-radio :value="1">身份证</a-radio>
              <a-radio :value="2">其他</a-radio>
            </a-radio-group>
            ）
          </td>
          <td colspan="2" style="width:36%">4</td>
        </tr>
        <tr>
          <td>1</td>
          <td>2</td>
          <td>3</td>
          <td>4</td>
          <td>5</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  created () {
  },
  data () {
    return {
      tableData: {
        name: '张声鹏',
        cardType: '',
        cardId: '533240374023840293840',
        client: '1',
        isMarry: '',
        phone: '13887508442',
        reason: '',
        money: '2000元',
        way: '1',
        bank: {
          name:'',
          cardId: '',
          conpany: ''
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .table{
    width: 100%;
    padding: 20px;
    background: #ffffff;
  }
  table, td{
    color:#333333;
    padding: 16px 20px;
    border: solid 1px #dddddd;
    border-collapse: collapse;
  }
  .row{
    width: 100%;
    td{
      text-align: center;
      width: 18%;
      // height: 60px;
    }
  }
  .title{
    background: #efefef;
  }
</style>
