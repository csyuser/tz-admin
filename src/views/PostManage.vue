<template>
  <div class="post-manage-wrap">
    <el-form :inline="true" :model="formInline" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="formInline.user" placeholder="输入名称或邮箱搜索" size="small"></el-input>
      </el-form-item>
      <el-form-item class="selectInput">
        <el-select v-model="formInline.region" placeholder="状态" size="small">
          <el-option label="激活" value="active"></el-option>
          <el-option label="失效" value="disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" @add="addPost"></Table>
    <el-dialog title="添加岗位" :visible.sync="dialogVisible" width="650px" :before-close="handleClose">
      <el-form label-position="right" label-width="80px" :inline="true" :model="postInfo" size="small" class="addForm">
        <el-form-item label="岗位名称">
          <el-input v-model="postInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="序号">
          <el-input v-model="postInfo.order" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="岗位编码">
          <el-input v-model="postInfo.coding" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="postInfo.type" placeholder="状态">
            <el-option label="激活" value="active"></el-option>
            <el-option label="失效" value="disabled"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/Table'

export default {
  name: 'PostManage',
  components: {Table},
  data() {
    return {
      colsHead: [{prop: 'name', label: '岗位名称'}, {prop: 'coding', label: '岗位编码'},{prop: 'order', label: '排序'}, {prop: 'type', label: '状态'}, {prop: 'date', label: '创建日期'}],
      tableDatas: {
        count: 30,
        tableData: [{
          id: 1,
          name: '开发',
          coding: '333',
          order: '2',
          type: true,
          date: '2016-05-02',
        }, {
          id: 2,
          name: '测试',
          coding: '333',
          order: '3',
          type: false,
          date: '2016-05-02',
        }, {
          id: 3,
          name: 'java',
          coding: '333',
          order: '4',
          type: true,
          date: '2016-05-02',
        }, {
          id: 4,
          name: '前端',
          coding: '333',
          order: '5',
          type: true,
          date: '2016-05-02',
        }],
      },
      formInline: {
        user: '',
        region: ''
      },
      dialogVisible: false,
      postInfo:{},
    }
  },
  mounted() {

  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    addPost() {
      console.log('点击了')
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(() => {
            done()
          })
          .catch(() => {})
    },

  }
}
</script>

<style scoped lang='scss'>
.post-manage-wrap {
  padding: 20px;
  > .searchForm {
    > .selectInput {
      width: 100px;
    }
  }

  .addForm {
    > .el-form-item {
      margin-bottom: 18px;
      &:nth-child(3){
        margin-bottom: 0;
      }
      &:nth-child(4){
        margin-bottom: 0;
      }
    }

  }
}

</style>