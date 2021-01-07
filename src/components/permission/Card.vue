<template>
  <el-checkbox-group v-model="checkList" class="checkCard" ref="checkCard">
    <el-card class="box-card" v-for="list in cardList" :key="list.id" ref="boxCard">
      <div class="avatar">
        <el-avatar :size="80" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        <el-checkbox :label="list.id" class="checkCards"></el-checkbox>
      </div>
      <el-form label-position="right" label-width="70px" :model="list" size="small" class="content">
        <el-form-item :label="title.label" v-for="title in titleList" :key="title.prop" class="contentList">
<!--          <span>{{ list[title.prop] }}</span>-->
                    <el-input v-model="list[title.prop]" class="input-wrap" readonly></el-input>
        </el-form-item>
      </el-form>
      <!--      <ul class="">-->
      <!--        <li class=""  v-for="title in titleList" :key="title.prop">-->
      <!--            <span>{{ title.label }}</span>-->
      <!--            <span>{{list[title.prop]}}</span>-->
      <!--        </li>-->
      <!--      </ul>-->
    </el-card>
  </el-checkbox-group>
</template>

<script>
export default {
  name: 'Card',
  data() {
    return {
      checkList: [],
      cardList: [{name: '用户1', id: 1, departmentName: '开发部', phone: '1220101201', email: '12014520136@163.com'},
        {name: '用户2', id: 2, code: '001', departmentName: '开发部', phone: '1220101201', email: '1251000000000456@163.com'},
        {name: '用户3', id: 3, code: '001', departmentName: '开发部', phone: '1220101201', email: '1251456@163.com'},
        {name: '用户4', id: 4, code: '004', departmentName: '开发部', phone: '1220101201', email: '1251456@163.com'},
        {name: '用户5', id: 5, code: '005', departmentName: '开发部',phone: '1220101201', email: '1251456@163.com',},
        {name: '用户5', id: 6, code: '005', departmentName: '开发部',phone: '1220101201', email: '1251456@163.com',},
        {name: '用户5', id:7, code: '005', departmentName: '开发部',phone: '1220101201', email: '1251456@163.com',},
        {name: '用户5', id: 8, code: '005', departmentName: '开发部',phone: '1220101201', email: '1251456@163.com',},
      ],
      // cardStyle:{},
      // checkCardStyle:{}
    }
  },
  props: {
    titleList: {type: Array},
  },
  mounted() {
    // this.$nextTick(()=>{
    //   console.log('执行了')
    //   const checkCardWidth = this.$refs.checkCard.$el['offsetWidth']
    //   const cardNumber =  parseInt(checkCardWidth / 250)
    //   this.cardStyle = {marginRight:(checkCardWidth - cardNumber*250)/cardNumber + 'px'}
    //   this.checkCardStyle = {marginRight:-(checkCardWidth - cardNumber*250)/cardNumber + 'px'}
    // })
  }
}
</script>

<style scoped lang='scss'>
.checkCard {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-right:-10px;
  font-size: inherit;

  .box-card {
    width: 250px;
    margin-bottom: 10px;
    margin-right: 10px;

    & ::v-deep {
      .el-card__body {
        padding: 15px 0;
      }
    }

    .avatar {
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
      position: relative;
      > .checkCards{
      color: #ffffff;
      position: absolute;
      right: -5px;
      top: -5px;
    }
    }

    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      .contentList {
        margin: 0;
        .input-wrap ::v-deep {
          > input {
            border: none;
            border-radius: 0;
            padding: 0;
            width: 150px;
          }
        }
      }
    }

    //ul {
    //  display: flex;
    //  flex-direction: column;
    //  align-items: center;
    //
    //  > li {
    //    padding: 5px 0;
    //    background-color: #fff;
    //    display: inline-block;
    //    //width: 230px;
    //    > span {
    //      //display: inline-block;
    //      &:first-child {
    //        margin-right: 1em;
    //        text-align: right;
    //        width: 50%;
    //      }
    //    }
    //  }
    //}
  }
}

</style>