<template>
  <div class="reply-wrap">
    <div class="tree-wrap">
      <h3>选择收件人</h3>
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small">
      </el-input>
      <el-tree :data="treeData" :props="defaultProps" show-checkbox class="tree" ref="tree" node-key="id"
               :filter-node-method="filterNode" :default-expanded-keys="[defaultChecked]"
               :default-checked-keys="[defaultChecked]" @check="checkClick"></el-tree>
    </div>
    <el-form ref="form" :model="replyInfo" label-width="80px" size="small" class="form">
      <el-form-item label="收件人" class="noBorder">
        <el-input v-model="replyInfo.toName" readonly></el-input>
      </el-form-item>
      <el-form-item label="标题" class="noBorder">
        <el-input v-model="replyInfo.title"></el-input>
      </el-form-item>
      <el-form-item label="正文" class="texArea">
        <el-input type="textarea" v-model="replyInfo.content" :rows="30"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSend" size="small">立即发送</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {helper} from '@/views/method'

export default {
  name: 'NewsReply',
  data() {
    return {
      replyInfo: {
        toName: '',
        title: '',
        content: '',
        toUserIds: []
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      checked: [],
      contentId: '',
      defaultChecked: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    checked: {
      handler(newVal) {
        let names = []
        let ids = []
        newVal.forEach(item => {
          if (item['treeType'] === 'user') {
            names.push(item.label)
            ids.push(item.id)
          }
        })
        this.replyInfo.toName = names.join(',')
        this.replyInfo.toUserIds = ids
      },
      immediate: true,
      deep: true
    },
  },
  mounted() {
    this.getTreeData(this.contentId)
    this.contentId = this.$route.params.contentId
    this.getNewsContent(this.contentId)
  },
  methods: {
    getTreeData() {
      this.axios.get('/messages/selectDepartmentUserTree')
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.treeData = res.data.data
            } else {this.$message.error(res.data.msg)}
          })
          .catch()
    },
    onSend() {
      this.sendNews()
    },
    checkClick() {
      this.checked = this.$refs.tree.getCheckedNodes()
      this.defaultChecked = ''
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    sendNews() {
      this.axios.post('/messages/sendMsgToUser', {...this.replyInfo})
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.$message.success('发送成功')
              this.$router.back()
            } else {this.$message.error('发送失败')}
          })
          .catch()
    },
    getNewsContent(id) {
      this.axios.get('/messages/selectMessageById', {params: {id: id}})
          .then(res => {
            if (res.data.code.toString() === '200') {
              let oldData = res.data.data
              let oldNews = `\n\n\n\n————————————————————————\n原始消息内容:\n发件人：${oldData['fromUserName']}\n发件时间：${this.formatTime(oldData['createTime'])}\n正文：`
              this.replyInfo.content = oldNews + res.data.data.content
              this.replyInfo.title = oldData.title
              this.replyInfo.toUserIds = oldData.fromUserId
              this.defaultChecked = oldData.fromUserId
              this.checked = [{label: oldData['fromUserName'], id: oldData.fromUserId,treeType:'user'}]
            } else {this.$message.error(res.data.msg)}
          })
          .catch()
    },
    formatTime(val) {
      return helper.formatTime(val)
    },
  }
}
</script>

<style scoped lang='scss'>
.reply-wrap {
  padding-right: 20px;
  display: flex;
  height: 100%;

  > .tree-wrap {
    padding: 20px 10px 20px 20px;
    border-right: 1px solid #DCDFE6;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

    > h3 {
      padding-bottom: 10px;
    }

    > .tree {
      padding: 10px 10px 0 0;
    }
  }

  > .form {
    width: 100%;
    padding-top: 20px;

    > .noBorder {
      &::v-deep {
        .el-input__inner {
          border: none;
          border-radius: 0;
          border-bottom: 1px solid #DCDFE6;
        }
      }
    }

    > .texArea::v-deep {
      .el-textarea__inner {
        padding: 20px;
      }
    }
  }
}

</style>