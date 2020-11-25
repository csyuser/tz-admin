<template>
  <div class="staff-wrap">
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
    <Table :colsHead="colsHead" :tableDatas="tableDatas"></Table>
    <el-dialog title="添加岗位" :visible.sync="editDialogVisible" width="970px" :before-close="handleClose">
      <el-form label-position="right" label-width="85px" :inline="true" :model="postInfo" size="small" class="addForm"
               :disabled="editDialogDisabled">
        <el-form-item label="人员名称">
          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="人员编码">
          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="入职时间">
          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="离职时间">
          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱">
          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="职务">
          <el-select v-model="staffInfo.type">
            <el-option label="激活" :value="true"></el-option>
            <el-option label="失效" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="staffInfo.type">
            <el-option label="男" :value="0"></el-option>
            <el-option label="女" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号码">
          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="所属部门id">
          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="职级">
          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/Table'

export default {
  name: 'Staff',
  components: {Table},
  data() {
    return {
      formInline: {
        user: '',
        region: ''
      },
      colsHead: [{prop: 'NAME', label: '人员名称'}, {prop: 'CODE', label: '人员编码'}, {prop: 'ENTRY_TIME', label: '入职时间'},
        {prop: 'OUT_TIME', label: '离职时间'}, {prop: 'PHONE', label: '联系电话'}, {prop: 'EMAIL', label: '联系邮箱'},
        {prop: 'POST', label: '职务'}, {prop: 'SEX', label: '性别'}, {prop: 'ID_CARD', label: '身份证号码'},
        {prop: 'DEPARTMENT_ID', label: '所属部门id'}, {prop: 'VALID', label: '有效标志'}, {prop: 'RANK', label: '职级'}],
      tableDatas: {
        count: 30,
        tableData: [{
          id: 1,
          NAME: '韩梅梅',
          CODE: '333',
          ENTRY_TIME: '2016-05-02',
          OUT_TIME: '2016-05-02',
          PHONE: '11111111111',
          EMAIL: '11111111111@11.com',
          POST: 'JAVA',
          SEX: '女',
          ID_CARD: '210125413812314158',
          DEPARTMENT_ID: '22222',
          VALID: 'yes',
          RANK: 'L7',
        }, {
          id: 2,
          NAME: '韩梅梅',
          CODE: '333',
          ENTRY_TIME: '2016-05-02',
          OUT_TIME: '2016-05-02',
          PHONE: '11111111111',
          EMAIL: '11111111111@11.com',
          POST: 'JAVA',
          SEX: '女',
          ID_CARD: '210125413812314158',
          DEPARTMENT_ID: '22222',
          VALID: 'no',
          RANK: 'L7',
        }],
      },
      editDialogVisible: 'false',
      editDialogDisabled: false,
      staffInfo: {},
    }
  },
  methods: {
    onSubmit() {console.log(this.formInline)},
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
.staff-wrap {
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