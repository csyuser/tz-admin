<template>
  <div class="message-wrap">
    <h1>通知
      <el-input class="search" size="small" :value="keyWords" placeholder="搜索通知">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </h1>
    <ul>
      <li v-for="message in messages" :key="message.id" @click="markRead(message.id)">
        <span><SvgIcon :icon-name="message.readTime?'message':''"></SvgIcon>{{ message.content }}</span>
        <span>{{ message.creatTime }}</span>
      </li>
    </ul>
    <el-pagination class="pagination" layout="prev, pager, next" :total="1000" @current-change="currentChange"
                   :current-page="currentPage">
    </el-pagination>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'Message',
  components:{SvgIcon},
  data() {
    return {
      currentPage: 1,
      keyWords: '',
      messages:[{content:'消息1',id:'1',readTime:'2020-1-1',creatTime:'2019-12-1'},{content:'消息2',id:'2',readTime:'',creatTime:'2019-12-1'},{content:'消息3',id:'3',readTime:'2020-1-1',creatTime:'2019-12-1'}
        ,{content:'消息4',id:'4',readTime:'2020-1-1',creatTime:'2019-12-1'},{content:'消息5',id:'5',readTime:'2020-1-1',creatTime:'2019-12-1'},{content:'消息6',id:'6',readTime:'2020-1-1',creatTime:'2019-12-1'}]
    }
  },
  methods: {
    currentChange(current) {
      this.currentPage = current
    },
    markRead(messageId){
      console.log(messageId)
    }
  }
}
</script>

<style scoped lang='scss'>
.message-wrap {
  margin: 20px 40px 0;

  > h1 {
    display: flex;
    font-size: 24px;
    justify-content: space-between;

    > .search {
      width: 200px;
      margin-left: 15px;
    }
  }

  > ul {
    margin-top: 25px;

    > li {
      svg{
        margin-right: 0.3em;
        margin-left: -1em;
      }
      padding: 8px 20px;
      border-bottom: 1px solid #f3f3f3;
      display: flex;
      justify-content: space-between;
    }
  }

  > .pagination {
    margin: 32px 0;
  }
}
</style>