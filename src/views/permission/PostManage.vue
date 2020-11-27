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
    <Table :colsHead="colsHead" :tableDatas="tableDatas" @add="addPost" @update="updatePost" @postSelect="selectPostRow"
           @delete="deletePost" @dblclick="viewPost">
      <el-button size="small" class="update" @click="relatedPermission"><SvgIcon icon-name="permission"></SvgIcon>关联权限
      </el-button>
      <el-button size="small" class="update" @click="relatedUser"><SvgIcon icon-name="user"></SvgIcon>关联用户</el-button>
    </Table>
    <el-dialog title="添加岗位" :visible.sync="editDialogVisible" width="650px" :before-close="handleClose">
      <el-form label-position="right" label-width="80px" :inline="true" :model="postInfo" size="small" class="addForm" :disabled="editDialogDisabled">
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
          <el-select v-model="postInfo.type">
            <el-option label="激活" :value="true"></el-option>
            <el-option label="失效" :value="false"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmEdit" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除岗位" :visible.sync="deleteDialogVisible" width="650px" :before-close="handleClose">
      <DeleteRow @cancel="deleteDialogVisible = false" @confirm="confirmDelete"></DeleteRow>
    </el-dialog>
    <el-dialog :title="relatedTitle" :visible.sync="relatedDialogVisible" width="700px">
      <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入"
          v-model="value"
          :data="transformData">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="relatedDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmTransform">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/permission/Table'
import DeleteRow from '@/components/permission/DeleteRow'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'PostManage',
  components: {Table,DeleteRow,SvgIcon},
  data() {
    return {
      selectedRow: [],
      colsHead: [{prop: 'name', label: '岗位名称'}, {prop: 'coding', label: '岗位编码'}, {
        prop: 'order',
        label: '排序'
      }, {prop: 'type', label: '状态'}, {prop: 'date', label: '创建日期'}],
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
      editDialogVisible: false,
      deleteDialogVisible: false,
      editDialogDisabled:false,
      postInfo: {
        name: '',
        order: '',
        coding: '',
        type: false
      },
      transformData:[],
      value: [],
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      },
      relatedTitle:'',
      relatedDialogVisible: false,
      permissionVal:[],
      userVal:[],
      transformType:'',
    }
  },
  mounted() {

  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    selectPostRow(val) {
      this.selectedRow = []
      val.forEach(item => {
        this.selectedRow.push(item)
      })
      console.log(this.selectedRow)
    },
//表格增删改查
    addPost() {
      this.postInfo = {}
      this.editDialogDisabled = false
      this.editDialogVisible = true
    },
    updatePost() {
      this.editDialogDisabled = false
      if (this.selectedRow.length === 1) {
        this.postInfo = this.selectedRow[0]
        this.editDialogVisible = true
      } else {
        this.$message.error('请选择一行数据')
      }
    },
    confirmEdit(){
      this.editDialogVisible = false
    },
    viewPost(row){
      this.postInfo = row
      this.editDialogVisible = true
      this.editDialogDisabled = true
    },
    deletePost() {
      if (this.selectedRow.length > 0) {
        this.deleteDialogVisible = true
      } else {
        this.$message.error('请选择至少一行数据')
      }
    },
    confirmDelete(){
      this.deleteDialogVisible = false
    },
//关联权限，范围
    relatedPermission() {
      this.transformType = 'permission'
      this.value = this.permissionVal
      this.relatedTitle = '关联权限'
      this.relatedDialogVisible = true
      this.transformData =  [{label: '上海00', key: 0},{label: '北京', key: 1}, {label: '广州', key: 2},
        {label: '深圳', key: 3}, {label: '南京', key: 4}, {label: '西安', key: 5}, {label: '成都', key: 6}]
    },
    relatedUser(){
      this.value = this.userVal
      this.transformType = 'user'
      this.relatedTitle = '关联用户'
      this.relatedDialogVisible = true
      this.transformData =  [{label: '小组1', key:'小组1',},{label: '小组2', key: '小组2'}, {label: '小组3', key: '小组3'},
        {label: '小组4', key: '小组4'}]
    },
    confirmTransform(){
      this.relatedDialogVisible = false
      if (this.transformType === 'permission'){
        this.permissionVal = this.value
      }else if (this.transformType === 'user'){
        this.userVal= this.value
      }
      console.log(this.value)
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

      &:nth-child(3) {
        margin-bottom: 0;
      }

      &:nth-child(4) {
        margin-bottom: 0;
      }
    }

  }
}

</style>