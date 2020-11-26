<template>
  <div class="department-wrap">
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
        <el-button type="primary" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" @add="addDepartment" @update="updateDepartment"
           @postSelect="selectRow" @delete="deleteDepartment" @dblclick="viewDepartment">
      <el-button size="small" class="update" @click="relatedUser"><i class="el-icon-edit icon"></i>关联用户</el-button>
    </Table>
    <el-dialog title="添加部门" :visible.sync="editDialogVisible" width="970px" :before-close="handleClose">
      <el-form label-position="right" label-width="85px" :inline="true" :model="departmentInfo" size="small"
               class="addForm"
               :disabled="editDialogDisabled">
        <el-form-item label="部门分类">
          <el-select v-model="departmentInfo.className">
            <el-option label="激活" :value="true"></el-option>
            <el-option label="失效" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input v-model="departmentInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="部门编号">
          <el-input v-model="departmentInfo.code" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="部门级别">
          <el-input v-model="departmentInfo.level" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="上级部门">
          <el-select v-model="departmentInfo.parentName">
            <el-option label="选用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行政区划">
          <el-input v-model="departmentInfo.regionName" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="选用标志">
          <el-select v-model="departmentInfo.selection">
            <el-option label="选用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="departmentInfo.describe" suffix-icon="xxx"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加部门" :visible.sync="deleteDialogVisible" width="650px" :before-close="handleClose">
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

export default {
  name: 'Department',
  components: {Table, DeleteRow},
  data() {
    return {
      url: '/department/page',
      formInline: {
        user: '',
        region: ''
      },
      colsHead: [{prop: 'className', label: '部门分类'}, {prop: 'name', label: '部门名称'}, {prop: 'code', label: '部门编号'},
        {prop: 'level', label: '部门级别'}, {prop: 'parentName', label: '上级部门'}, {prop: 'regionName', label: '行政区划'},
        {prop: 'selection', label: '选用标志'}, {prop: 'describe', label: '描述'}],
      tableDatas: {},
      editDialogVisible: false,
      deleteDialogVisible: false,
      editDialogDisabled: false,
      selectedRow: [],
      departmentInfo: {},
      transformData: [],
      value: [],
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      },
      relatedTitle: '',
      relatedDialogVisible: false,
      userVal: [],
      transformType: '',
    }
  },
  mounted() {
    this.axios.get(this.prefixAddr + '/department/page', {
      params: {}
    }).then(res => {
      console.log(res)
    })
        .catch()

    // const tableDatas = {
    //   count: 30,
    //   tableData: [{
    //     id: 1,
    //     className: '韩梅梅',
    //     code: '333',
    //     describe: '2016-05-02',
    //     level: '2016-05-02',
    //     name: '11111111111',
    //     parentName: '11111111111@11.com',
    //     regionName: 'JAVA',
    //     selection: '女',
    //   }, {
    //     id: 2,
    //     className: '韩梅梅',
    //     code: '333',
    //     describe: '2016-05-02',
    //     level: '2016-05-02',
    //     name: '11111111111',
    //     parentName: '11111111111@11.com',
    //     regionName: 'JAVA',
    //     selection: '女',
    //   }],
    // }
    // this.tableDatas = tableDatas
  },
  methods: {
    selectRow(val) {
      this.selectedRow = []
      val.forEach(item => {
        this.selectedRow.push(item)
      })
      console.log(this.selectedRow)
    },
//部门的增删改查
    addDepartment() {
      this.departmentInfo = {}
      this.editDialogDisabled = false
      this.editDialogVisible = true
    },
    updateDepartment() {
      this.editDialogDisabled = false
      if (this.selectedRow.length === 1) {
        this.departmentInfo = this.selectedRow[0]
        this.editDialogVisible = true
      } else {
        this.$message.error('请选择一行数据')
      }
    },
    confirmEdit() {
      this.editDialogVisible = false
    },
    viewDepartment(row) {
      this.departmentInfo = row
      this.editDialogVisible = true
      this.editDialogDisabled = true
    },
    deleteDepartment() {
      if (this.selectedRow.length > 0) {
        this.deleteDialogVisible = true
      } else {
        this.$message.error('请选择至少一行数据')
      }
    },
    confirmDelete() {
      this.deleteDialogVisible = false
    },
//关联用户
    relatedUser() {
      this.value = this.userVal
      this.transformType = 'user'
      this.relatedTitle = '关联用户'
      this.relatedDialogVisible = true
      this.transformData = [{label: '小组1', key: '小组1',}, {label: '小组2', key: '小组2'}, {label: '小组3', key: '小组3'},
        {label: '小组4', key: '小组4'}]
    },
    confirmTransform() {
      this.relatedDialogVisible = false
      if (this.transformType === 'user') {
        this.userVal = this.value
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
.department-wrap {
  padding: 20px;

  > .searchForm {
    > .selectInput {
      width: 100px;
    }
  }

  .addForm {
    > .el-form-item {
      margin-bottom: 18px;
    }

  }
}
</style>