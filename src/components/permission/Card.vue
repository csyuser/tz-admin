<template>
  <el-checkbox-group v-model="checkList" class="checkCard" ref="checkCard">
    <el-card class="box-card" v-for="list in cardList" :key="list.id" ref="boxCard">
      <div class="avatar">
        <el-avatar :size="80" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        <el-checkbox :label="list.id" class="checkCards"></el-checkbox>
      </div>
      <el-form label-position="right" label-width="70px" :model="list" size="small" class="content">
        <el-form-item :label="title.label" v-for="title in titleList" :key="title.prop" class="contentList">
          <el-input v-model="list[title.prop]" class="input-wrap" readonly></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </el-checkbox-group>
</template>

<script>
export default {
  name: 'Card',
  data() {
    return {
      checkList: [],
    }
  },
  props: {
    titleList: {type: Array},
    cardList: {
      type: Array,
      required: true
    }
  },
}
</script>

<style scoped lang='scss'>
.checkCard {
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  font-size: inherit;
  margin-top: 20px;

  .box-card {
    margin-bottom: 10px;

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

      > .checkCards {
        font-size: 0;
        position: absolute;
        right: 0px;
        top: -5px;

        ::v-deep {
          .el-checkbox__label {
            font-size: 0;
          }
        }
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
  }
}

@media (min-width: 1200px) {
  .checkCard {
    margin-right: -1%;

    .box-card {
      width: 24%;
      margin-right: 1%;
    }
  }
}

@media (max-width: 1199px) {
  .checkCard {
    margin-right: -1.34%;

    .box-card {
      width: 32%;
      margin-right: 1.33%;
    }
  }
}

@media (min-width: 1920px) {
  .checkCard {
    margin-right: -0.7%;

    .box-card {
      width: 16%;
      margin-right: 0.66%;
    }
  }
}

</style>