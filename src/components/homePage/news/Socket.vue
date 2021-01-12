<template>
  <div class="socket-wrap">
    <el-popover
        placement="bottom"
        trigger="click">
      <section class="message-wrap">
        <div class="title">{{queryType === '1'? '私信' : '系统消息'}}</div>
        <ul class="contentList">
          <li @click="goMessage" v-for="list in newsList" :key="list.id">{{list.content}}</li>
        </ul>
        <a class="dropDown" @click="goMessage">查看全部通知</a>
      </section>
      <el-badge slot="reference" :value="newsCount=== 0?'':newsCount" :max="max" class="item">
        <i :class="iconName"></i>
      </el-badge>
    </el-popover>
  </div>
</template>

<script>

export default {
  name: 'Socket',
  props: {
    iconName: {
      type: String,
      required: true,
    },
    queryType: {
      type: String,
      required: true
    },
    newsCount:{
      type: [Number,String],
    },
    newsList:{
      type:Array
    },
  },
  data() {
    return {
      max: 99,
      userId: '1'
    }
  },
  mounted() {
    this.$store.commit('getUserInfo')
  },
  methods: {
    goMessage() {
      if (this.$route.path !== `/newsList/${this.queryType}`) this.$router.push(`/newsList/${this.queryType}`)
      this.$emit('update:pageHeader', {name: '消息中心'})
    },
  }
}
</script>

<style scoped lang='scss'>
.socket-wrap {
  i {
    font-size: 1.3em;
    color: rgb(165, 165, 165);
  }

  &:hover {
    cursor: pointer;
  }

}

.message-wrap {
  width: 340px;
  margin: -12px;

  > .title {
    padding: 10px 16px;
    background: #f9f9f9;
    border-bottom: 1px solid #ddd;
  }

  > ul {
    margin: 0 5px;
    max-height: 350px;
    overflow: auto;

    > li {
      padding: 15px;
      border-bottom: 1px solid #ebebeb;
      line-height: 1.5em;
      cursor: pointer;

      &:hover {
        background: #f9f9f9;
      }
    }
  }

  > .dropDown {
    cursor: pointer;
    width: 100%;
    display: inline-block;
    background: #f9f9f9;
    padding: 10px 16px;
    text-align: center;
  }
}
</style>