<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" /> -->
          <span>{{ userInfo.name }} </span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="onDealerSetting" v-if="isShow">
            <span style="display: block">经销商设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="经销商费用设置"
      :visible="dealerSettingShow"
      width="500px"
      :close-on-click-modal="false"
      @close="dealerSettingShow = false"
    >
      <el-form label-width="135px" :model="form" :rules="rules" ref="form">
        <el-form-item label="CE店铺注册费" prop="ceShop">
          <el-input-number v-model="form.ceShop" />
        </el-form-item>
        <el-form-item label="CE产品注册费" prop="ceProduct">
          <el-input-number v-model="form.ceProduct" />
        </el-form-item>
        <el-form-item label="CE发货费" prop="ceSendGood">
          <el-input-number v-model="form.ceSendGood" />
        </el-form-item>

        <el-form-item label="中德店铺注册费" prop="zdShop">
          <el-input-number v-model="form.zdShop" />
        </el-form-item>
        <el-form-item label="中德产品注册费" prop="zdProduct">
          <el-input-number v-model="form.zdProduct" />
        </el-form-item>
        <el-form-item label="中德发货费" prop="zdSendGood">
          <el-input-number v-model="form.zdSendGood" />
        </el-form-item>

        <el-form-item label="华之星店铺注册费" prop="hzxShop">
          <el-input-number v-model="form.hzxShop" />
        </el-form-item>
        <el-form-item label="华之星产品注册费" prop="hzxProduct">
          <el-input-number v-model="form.hzxProduct" />
        </el-form-item>
        <el-form-item label="华之星发货费" prop="hzxSendGood">
          <el-input-number v-model="form.hzxSendGood" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dealerSettingShow = false">取消</el-button>
        <el-button type="primary" @click="dealerSetting">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { removeToken } from "@/utils/auth";
export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      dealerSettingShow: false,
      rules: {
        ceShop: [
          {
            required: true,
            message: "输入CE店铺注册费",
          },
        ],
        ceProduct: [
          {
            required: true,
            message: "输入CE产品注册费",
          },
        ],
        ceSendGood: [
          {
            required: true,
            message: "输入CE发货费",
          },
        ],

        zdShop: [
          {
            required: true,
            message: "输入中德店铺注册费",
          },
        ],
        zdProduct: [
          {
            required: true,
            message: "输入中德产品注册费",
          },
        ],
        zdSendGood: [
          {
            required: true,
            message: "输入中德发货费",
          },
        ],

        hzxShop: [
          {
            required: true,
            message: "输入华之星店铺注册费",
          },
        ],
        hzxProduct: [
          {
            required: true,
            message: "输入华之星产品注册费",
          },
        ],
        hzxSendGood: [
          {
            required: true,
            message: "输入华之星发货费",
          },
        ],
      },
      form: {
        ceShop: null,
        ceProduct: null,
        ceSendGood: null,
        zdShop: null,
        zdProduct: null,
        zdSendGood: null,
        hzxShop: null,
        hzxProduct: null,
        hzxSendGood: null,
      },
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    isShow () {
      return ["ce_admin", "ce_leader"].includes(this.$store.state.user.userInfo.type)
    }
  },
  async created() {},
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async onDealerSetting() {
      const result = await this.$fetchGet("/admin/cost");
      const {
        ceShop,
        ceProduct,
        ceSendGood,
        zdShop,
        zdProduct,
        zdSendGood,
        hzxShop,
        hzxProduct,
        hzxSendGood,
      } = result;
      this.form = {
        ceShop,
        ceProduct,
        ceSendGood,
        zdShop,
        zdProduct,
        zdSendGood,
        hzxShop,
        hzxProduct,
        hzxSendGood,
      };
      this.dealerSettingShow = true;
    },
    dealerSetting() {
      this.$refs["form"].validate(async (valid) => {
        if (!valid) return;
        const result = await this.$fetchPost("/admin/cost", this.form, {
          allData: true,
        });
        if (!result.success) return;
        this.$message.success("设置成功");
        this.dealerSettingShow = false;
      });
    },
    async logout() {
      this.$confirm("确定退出系统?", "退出", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          removeToken();
          this.$router.push(`/login?redirect=${this.$route.fullPath}`);
          this.$message({
            type: "success",
            message: "退出成功!",
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
